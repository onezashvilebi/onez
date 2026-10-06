// Запуск из web/: node scripts/direct-prepare.mjs (проверка) и node scripts/direct-prepare.mjs apply (запись).
// Дополняет черновик кампании Директа 714328501 (остаётся остановленной, на модерацию не отправляется).
import fs from 'node:fs';
const env = {}; for (const l of fs.readFileSync(new URL('../../.env', import.meta.url), 'utf8').split('\n')) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, ''); }
const call = async (svc, method, params) => {
  // ID объявлений длиннее Number.MAX_SAFE_INTEGER: JSON.parse их округляет, и запись
  // бьёт мимо («Объявление не найдено»). Ответ разбираем текстом, ID держим строками,
  // а на отправке возвращаем в числа.
  const body = JSON.stringify({ method, params }).replace(/"Id":"(\d{16,})"/g, '"Id":$1');
  const r = await fetch('https://api.direct.yandex.com/json/v5/' + svc, { method: 'POST', headers: { authorization: 'Bearer ' + env.YANDEX_DIRECT_TOKEN, 'Client-Login': env.YANDEX_DIRECT_CLIENT_LOGIN, 'Accept-Language': 'ru', 'content-type': 'application/json' }, body });
  const b = JSON.parse((await r.text()).replace(/"Id":(\d{16,})/g, '"Id":"$1"'));
  if (b.error) throw new Error(`${svc}.${method}: ${JSON.stringify(b.error)}`); return b.result;
};
const errs = (res, key) => (res[key] || []).filter(x => x.Errors).map(x => JSON.stringify(x.Errors));
const C = 714328501;
// «Параметры URL» кампании: Директ сам дописывает их к каждой ссылке, поэтому
// в Href объявлений и быстрых ссылок меток нет — иначе метки задвоятся.
const TRACKING = 'utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}';
const METRIKA_ID = 112457250;
// Цель, по которой считается конверсия: отправленная заявка (lead_sent в metrika.ts).
const PRIORITY_GOAL = 'lead_sent';
const S = 'https://onez.ge';
const DRY = process.argv[2] !== 'apply';

// `node scripts/direct-prepare.mjs start` — включить кампанию, но только если
// модерация пройдена. Деньги тратятся с первого показа, поэтому при отклонённых
// объявлениях команда ничего не делает и печатает, что мешает.
if (process.argv[2] === 'start') {
  const c = (await call('campaigns', 'get', { SelectionCriteria: { Ids: [C] }, FieldNames: ['Id', 'Name', 'State', 'Status', 'StatusPayment'] })).Campaigns[0];
  const aa = (await call('ads', 'get', { SelectionCriteria: { CampaignIds: [C] }, FieldNames: ['Id', 'State', 'Status', 'StatusClarification'] })).Ads || [];
  const rejected = aa.filter(a => a.Status === 'REJECTED');
  const pending = aa.filter(a => a.Status === 'MODERATION' || a.Status === 'PREACCEPTED' || a.Status === 'DRAFT');
  const live = aa.filter(a => a.Status === 'ACCEPTED');
  console.log(`Кампания ${c.Id}: ${c.State} / ${c.Status} / оплата ${c.StatusPayment}`);
  console.log(`Объявлений: принято ${live.length}, на модерации ${pending.length}, отклонено ${rejected.length}`);
  for (const a of rejected) console.log(`  отклонено ${a.Id}: ${a.StatusClarification || 'причина не указана'}`);
  if (rejected.length || pending.length || !live.length) { console.log('Кампания не включена: модерация не завершена.'); process.exit(0); }
  if (c.StatusPayment !== 'ALLOWED') { console.log('Кампания не включена: на счёте нет средств.'); process.exit(0); }
  await call('campaigns', 'resume', { SelectionCriteria: { Ids: [C] } });
  const after = (await call('campaigns', 'get', { SelectionCriteria: { Ids: [C] }, FieldNames: ['State', 'Status'] })).Campaigns[0];
  console.log('Кампания включена:', after.State, '/', after.Status);
  process.exit(0);
}

// `node scripts/direct-prepare.mjs status` — почему группы остановлены и за что
// отклонены объявления. Директ пишет причину в StatusClarification, в интерфейсе
// она видна не всегда.
if (process.argv[2] === 'status') {
  const c = (await call('campaigns', 'get', { SelectionCriteria: { Ids: [C] }, FieldNames: ['Id', 'Name', 'State', 'Status', 'StatusClarification', 'StatusPayment'] })).Campaigns[0];
  console.log(`Кампания ${c.Id} «${c.Name}»: ${c.State} / ${c.Status} / оплата ${c.StatusPayment}`);
  if (c.StatusClarification) console.log('  причина:', c.StatusClarification);

  const gg = (await call('adgroups', 'get', { SelectionCriteria: { CampaignIds: [C] }, FieldNames: ['Id', 'Name', 'Status', 'ServingStatus', 'Type'] })).AdGroups || [];
  const aa = (await call('ads', 'get', { SelectionCriteria: { CampaignIds: [C] }, FieldNames: ['Id', 'AdGroupId', 'State', 'Status', 'StatusClarification'], TextAdFieldNames: ['Title', 'Href'] })).Ads || [];
  const kk = (await call('keywords', 'get', { SelectionCriteria: { CampaignIds: [C] }, FieldNames: ['Id', 'AdGroupId', 'Keyword', 'State', 'Status', 'ServingStatus'] })).Keywords || [];

  for (const g of gg) {
    console.log(`\nГруппа ${g.Id} «${g.Name}»: ${g.Status} / показы ${g.ServingStatus}`);
    for (const a of aa.filter(x => x.AdGroupId === g.Id)) {
      console.log(`  Объявление ${a.Id} «${a.TextAd?.Title || ''}»: ${a.State} / ${a.Status}`);
      console.log(`    ссылка: ${a.TextAd?.Href || '—'}`);
      if (a.StatusClarification) console.log(`    причина: ${a.StatusClarification}`);
    }
    const stopped = kk.filter(x => x.AdGroupId === g.Id && x.Status !== 'ACCEPTED' || x.ServingStatus !== 'ELIGIBLE');
    for (const k of stopped) console.log(`  Фраза «${k.Keyword}»: ${k.Status} / показы ${k.ServingStatus}`);
  }

  // Ссылки объявлений проверяются тем же запросом, что шлёт робот Директа:
  // так видно, отдаёт ли сайт 200 на посадочную страницу.
  console.log('\nОтвет сайта по посадочным страницам:');
  for (const href of [...new Set(aa.map(a => a.TextAd?.Href).filter(Boolean))]) {
    const url = href.split('?')[0];
    try {
      const r = await fetch(url, { redirect: 'manual' });
      console.log(`  ${r.status} ${url}${r.headers.get('location') ? ' → ' + r.headers.get('location') : ''}`);
    } catch (e) { console.log(`  ОШИБКА ${url}: ${e.message}`); }
  }
  process.exit(0);
}

const ads = {
  'Строительство дома в Грузии': {
    href: '/ru/chastnye-doma',
    keywords: ['построить дом в грузии', 'сколько стоит построить дом в грузии', 'строительство домов в грузии', 'строительство в тбилиси', 'строительство дома в тбилиси под ключ'],
    ads: [
      { Title: 'Строительство дома в Грузии', Title2: 'Цена в договоре', Text: 'Монолитные дома от 160 м² в Тбилиси. Смета до начала работ, гарантия 10 лет.' },
      { Title: 'Построим дом в Тбилиси', Title2: 'Каркас от $180 за м²', Text: 'Своя техника и бригады. Цена и сроки фиксируются в договоре. Получите расчёт.' },
    ],
  },
  'Участок в Грузии под строительство': {
    href: '/ru/proverka-uchastka',
    keywords: ['купить участок в грузии', 'купить землю в грузии', 'купить земельный участок в грузии', 'участок в тбилиси купить'],
    ads: [
      { Title: 'Проверка участка в Тбилиси бесплатно', Title2: 'За 3 рабочих дня', Text: 'Юридическая и техническая проверка по 15 пунктам до покупки. Без обязательств.' },
      { Title: 'Покупаете участок в Грузии?', Title2: 'Проверим бесплатно', Text: 'Категория земли, коэффициенты застройки, сети и риски. Заключение за 3 дня.' },
    ],
  },
};
const negatives = ['снять', 'квартира', 'квартиры', 'новостройки', 'новостройка', 'батуми', 'мечи', 'юстиции', 'достопримечательность', 'посуточно', 'продажа квартир'];
const sitelinks = [
  { Title: 'Цены за м²', Href: S + '/ru/cena', Description: 'Каркас от $180 за м², оплата 4 этапа по 25%' },
  { Title: 'Объекты', Href: S + '/ru/obekty', Description: 'Жилые корпуса, склады и частные дома' },
  { Title: 'Проверка участка', Href: S + '/ru/proverka-uchastka', Description: 'Бесплатно, 15 пунктов, 3 рабочих дня' },
  { Title: 'Контакты', Href: S + '/ru/kontakty', Description: 'Офис в Тбилиси, пн–пт 10:00–19:00' },
];
const callouts = ['Цена в договоре', 'Гарантия 10 лет', 'Своя техника', 'Оплата по этапам'];

// Проверка лимитов Директа
const bad = [];
for (const g of Object.values(ads)) for (const a of g.ads) { if (a.Title.length > 56) bad.push('Title ' + a.Title); if (a.Title2.length > 30) bad.push('Title2 ' + a.Title2); if (a.Text.length > 81) bad.push(`Text ${a.Text.length} ${a.Text}`); }
for (const s of sitelinks) { if (s.Title.length > 30) bad.push('SL ' + s.Title); if (s.Description.length > 60) bad.push('SLD ' + s.Description); }
for (const c of callouts) if (c.length > 25) bad.push('Callout ' + c);
if (bad.length) { console.log('Превышены лимиты:\n' + bad.join('\n')); process.exit(1); }

const camp = (await call('campaigns', 'get', { SelectionCriteria: { Ids: [C] }, FieldNames: ['Id', 'State', 'NegativeKeywords'] })).Campaigns[0];
const groups = (await call('adgroups', 'get', { SelectionCriteria: { CampaignIds: [C] }, FieldNames: ['Id', 'Name'] })).AdGroups;
const newNeg = [...new Set([...(camp.NegativeKeywords?.Items || []), ...negatives])].sort();
console.log('Кампания:', camp.State, '| минус-слов было', camp.NegativeKeywords?.Items?.length, '→ станет', newNeg.length);
console.log('Новые группы:', Object.keys(ads).filter(n => !groups.some(g => g.Name === n)).join('; '));
if (DRY) { console.log('DRY RUN — изменений нет. Запуск с аргументом apply.'); process.exit(0); }

// Номер цели Метрики берётся по имени: руками ID не вписываем.
async function goalId(name) {
  const r = await fetch(`https://api-metrika.yandex.net/management/v1/counter/${METRIKA_ID}/goals`, { headers: { authorization: 'OAuth ' + env.YANDEX_METRIKA_TOKEN } });
  const b = await r.json();
  return (b.goals || []).find(g => g.name === name || g.conditions?.some(c => c.value === name))?.id;
}

const gid_ = await goalId(PRIORITY_GOAL);
const settings = { Id: C, NegativeKeywords: { Items: newNeg } };
settings.TextCampaign = { CounterIds: { Items: [METRIKA_ID] }, TrackingParams: TRACKING };
if (gid_) settings.TextCampaign.PriorityGoals = { Items: [{ GoalId: gid_, Value: 0 }] };
else console.log(`Цель ${PRIORITY_GOAL} в Метрике не найдена — приоритетная цель не задана.`);
await call('campaigns', 'update', { Campaigns: [settings] });
console.log('Кампания: параметры URL, счётчик', METRIKA_ID, gid_ ? `, цель ${PRIORITY_GOAL} (${gid_})` : '');

// Повторный запуск не создаёт дубли: набор ссылок и уточнения ищутся по содержимому.
const allSl = (await call('sitelinks', 'get', { FieldNames: ['Id'], SitelinkFieldNames: ['Title', 'Href'] })).SitelinksSets || [];
const mine = allSl.find(x => x.Sitelinks.length === sitelinks.length && x.Sitelinks.every((y, i) => y.Title === sitelinks[i].Title && y.Href === sitelinks[i].Href));
const slId = mine ? mine.Id : (await call('sitelinks', 'add', { SitelinksSets: [{ Sitelinks: sitelinks }] })).AddResults[0].Id;
if (!slId) throw new Error('sitelinks: набор не создан');
const allExt = (await call('adextensions', 'get', { SelectionCriteria: { Types: ['CALLOUT'] }, FieldNames: ['Id'], CalloutFieldNames: ['CalloutText'] })).AdExtensions || [];
const have = new Map(allExt.map(e => [e.Callout?.CalloutText, e.Id]));
const missing = callouts.filter(c => !have.has(c));
if (missing.length) {
  const added = await call('adextensions', 'add', { AdExtensions: missing.map(c => ({ Callout: { CalloutText: c } })) });
  missing.forEach((c, i) => have.set(c, added.AddResults[i]?.Id));
}
const extIds = callouts.map(c => have.get(c)).filter(Boolean);
console.log('Быстрые ссылки', slId, mine ? '(существующий набор)' : '(создан)', '| уточнения', extIds.join(', '));

// Уже созданные объявления: быстрые ссылки, уточнения и чистая ссылка без меток.
// Модерация открывает Href как есть, с нераскрытыми {keyword} и {campaign_id} —
// отсюда отказ «Страница перехода не отображается». Метки теперь в параметрах URL.
const oldAds = (await call('ads', 'get', { SelectionCriteria: { CampaignIds: [C] }, FieldNames: ['Id'], TextAdFieldNames: ['Href'] })).Ads || [];
if (oldAds.length) {
  const up = await call('ads', 'update', {
    Ads: oldAds.map(a => {
      const TextAd = { SitelinkSetId: slId, CalloutSetting: { AdExtensions: extIds.map(AdExtensionId => ({ AdExtensionId, Operation: 'SET' })) } };
      const clean = a.TextAd?.Href?.split('?')[0];
      if (clean && clean !== a.TextAd.Href) TextAd.Href = clean;
      return { Id: a.Id, TextAd };
    }),
  });
  console.log('Объявлений дополнено:', oldAds.length, errs(up, 'UpdateResults').join(' '));
  const dirty = oldAds.filter(a => a.TextAd?.Href?.includes('?')).length;
  if (dirty) console.log(`Ссылок очищено от меток: ${dirty} — объявления уйдут на повторную модерацию.`);
}
for (const [name, g] of Object.entries(ads)) {
  if (groups.some(x => x.Name === name)) { console.log('Группа уже есть, пропускаю:', name); continue; }
  const ag = await call('adgroups', 'add', { AdGroups: [{ Name: name, CampaignId: C, RegionIds: [169] }] });
  const gid = ag.AddResults[0].Id; if (!gid) throw new Error('adgroup: ' + JSON.stringify(ag));
  const kw = await call('keywords', 'add', { Keywords: g.keywords.map(k => ({ AdGroupId: gid, Keyword: k })) });
  const ad = await call('ads', 'add', { Ads: g.ads.map(a => ({ AdGroupId: gid, TextAd: { ...a, Href: S + g.href, Mobile: 'NO', SitelinkSetId: slId, AdExtensionIds: extIds } })) });
  console.log(name, '→ группа', gid, '| фраз', g.keywords.length, errs(kw, 'AddResults'), '| объявлений', g.ads.length, errs(ad, 'AddResults'));
}
const after = (await call('campaigns', 'get', { SelectionCriteria: { Ids: [C] }, FieldNames: ['State', 'Status'] })).Campaigns[0];
console.log('Кампания после изменений:', after.State, after.Status);
