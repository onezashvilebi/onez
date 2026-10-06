// Источник заявки (ONEZ-27): первый вход посетителя — посадочная, внешний
// реферер, utm_* и yclid/gclid. Живёт 30 дней и уходит вместе с заявкой и
// сводкой чата — менеджер видит, какая кампания или страница привела клиента.
const KEY = "onez_attr";
const TTL_MS = 30 * 24 * 3600 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "yclid", "gclid"] as const;

export type Attribution = { landing: string; referrer: string; at: number; clientId?: string } & Partial<Record<(typeof PARAMS)[number], string>>;

export function readAttribution(): Attribution | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Attribution | null;
    return saved && Date.now() - saved.at < TTL_MS ? saved : null;
  } catch {
    return null;
  }
}

/** Запоминает первый вход; новый вход с метками рекламы перезаписывает старый. */
export function captureAttribution(): void {
  try {
    const url = new URL(location.href);
    const tagged = PARAMS.some((p) => url.searchParams.has(p));
    if (readAttribution() && !tagged) return;
    const referrer = document.referrer && new URL(document.referrer).host !== location.host ? document.referrer : "";
    const attr: Attribution = { landing: url.pathname + url.search, referrer, at: Date.now() };
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) attr[p] = v.slice(0, 200);
    }
    localStorage.setItem(KEY, JSON.stringify(attr));
  } catch {
    // хранилище закрыто — заявка уйдёт без источника
  }
}

/**
 * Источник для заявки и чата: сохранённый первый вход плюс ClientID Метрики
 * (cookie `_ym_uid`, её ставит счётчик; при отказе от аналитики её нет). По
 * ClientID или yclid договор потом выгружается в Метрику офлайн-конверсией
 * (ONEZ-41) — без него сделку не к чему привязать.
 */
export function leadAttribution(): Attribution | null {
  const attr = readAttribution();
  let clientId = "";
  try {
    clientId = document.cookie.match(/(?:^|;\s*)_ym_uid=(\d{6,30})/)?.[1] ?? "";
  } catch {
    // cookie недоступны — заявка уйдёт без ClientID
  }
  if (!clientId) return attr;
  return { ...(attr ?? { landing: location.pathname, referrer: "", at: Date.now() }), clientId };
}
