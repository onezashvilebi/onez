// Карточки статей. Тексты самих статей — app/content/article-bodies.tsx.
/** published/modified — даты публикации и последней правки текста (Article в JSON-LD). */
export type ArticleMeta = { slug: string; tag: string; name: string; title: string; hero: string; text: string; published: string; modified: string };

export const ARTICLES: ArticleMeta[] = [
  { slug: "kategoriya-zemli", tag: "Участок", name: "Категория земли", title: "Категория земли:<br><em>можно ли строить</em>", hero: "site-check", text: "Сельхоз или несельхоз: можно ли строить, кто может владеть участком и как меняют категорию.", published: "2026-09-10", modified: "2026-09-11" },
  { slug: "koefficienty-zastrojki", tag: "Участок", name: "Коэффициенты застройки", title: "К-1, К-2, К-3:<br><em>сколько можно построить</em>", hero: "residential", text: "Три числа из градостроительных условий, которые решают площадь и этажность здания. С условным расчётом.", published: "2026-09-10", modified: "2026-09-11" },
  { slug: "smeta-bez-syurprizov", tag: "Цена", name: "Смета без сюрпризов", title: "Почему смета растёт<br><em>и как это остановить</em>", hero: "fixed-price", text: "Пять причин, по которым смета растёт во время стройки, и что зафиксировать в договоре до старта.", published: "2026-09-10", modified: "2026-09-11" },
  { slug: "stroitelstvo-dlya-nerezidenta", tag: "Иностранцам", name: "Стройка для нерезидента", title: "Нерезидент строит в Грузии:<br><em>что нужно знать</em>", hero: "site-check", text: "Какую землю можно купить иностранцу, нужен ли приезд, как устроена доверенность и что проверить до сделки.", published: "2026-09-23", modified: "2026-09-23" },
  { slug: "oplata-stroitelstva-iz-za-rubezha", tag: "Иностранцам", name: "Оплата из-за рубежа", title: "Оплата стройки<br><em>из другой страны</em>", hero: "fixed-price", text: "Как деньги доходят до площадки: переводы и комплаенс банка, оплата по актам этапов и приёмка без приезда.", published: "2026-09-23", modified: "2026-09-23" },
  { slug: "monolitnyj-karkas", tag: "Технология", name: "Монолитный каркас", title: "Монолитный каркас:<br><em>почему строим так</em>", hero: "process", text: "Что даёт монолит заказчику и на каких операциях площадки решается прочность здания.", published: "2026-09-10", modified: "2026-09-11" },
];

/**
 * Кластеры (docs/SEO.md, §4): статьи на странице услуги — блок «Разобрать подробнее».
 * Связь двусторонняя: каждая статья отсюда ссылается на услугу из ARTICLE_SERVICE —
 * это проверяет tests/links.test.ts.
 */
export const SERVICE_ARTICLES: Record<string, string[]> = {
  "zhilye-korpusa": ["koefficienty-zastrojki", "monolitnyj-karkas", "kategoriya-zemli"],
  "proizvodstvo-i-sklady": ["kategoriya-zemli", "monolitnyj-karkas"],
  "chastnye-doma": ["kategoriya-zemli", "koefficienty-zastrojki", "smeta-bez-syurprizov"],
  "podpornye-steny": ["smeta-bez-syurprizov", "monolitnyj-karkas"],
  "fundamenty": ["monolitnyj-karkas", "smeta-bez-syurprizov"],
};

/**
 * Статья → услуги и цена в блоке «Читать дальше» (ONEZ-53, SEO §4): анкор — запрос, по
 * которому ищут страницу (seoTitle, title из PAGE_META), а не короткое имя раздела.
 */
export const ARTICLE_SERVICE: Record<string, [string, string][]> = {
  "stroitelstvo-dlya-nerezidenta": [["build-in-georgia", "Строительство в Грузии для нерезидента"], ["proverka-uchastka", "Проверка участка перед покупкой"], ["cena", "Стоимость строительства дома в Тбилиси за м²"]],
  "oplata-stroitelstva-iz-za-rubezha": [["build-in-georgia", "Строительство в Грузии для нерезидента"], ["cena", "Стоимость строительства дома в Тбилиси за м²"], ["investoru-v-tbilisi", "Инвестиции в строительство жилья в Тбилиси"]],
  "kategoriya-zemli": [["proverka-uchastka", "Проверка участка перед покупкой"], ["chastnye-doma", "Строительство дома в Тбилиси"], ["zhilye-korpusa", "Строительство жилого корпуса в Тбилиси"], ["proizvodstvo-i-sklady", "Строительство склада и цеха в Грузии"]],
  "koefficienty-zastrojki": [["proverka-uchastka", "Проверка участка перед покупкой"], ["zhilye-korpusa", "Строительство жилого корпуса в Тбилиси"], ["chastnye-doma", "Строительство дома в Тбилиси"]],
  "monolitnyj-karkas": [["zhilye-korpusa", "Строительство жилого корпуса в Тбилиси"], ["proizvodstvo-i-sklady", "Строительство склада и цеха в Грузии"], ["fundamenty", "Фундаменты и монолитные работы в Тбилиси"], ["podpornye-steny", "Подпорная стена на склоне в Тбилиси"]],
  "smeta-bez-syurprizov": [["cena", "Стоимость строительства дома в Тбилиси за м²"], ["chastnye-doma", "Строительство дома в Тбилиси"], ["fundamenty", "Фундаменты и монолитные работы в Тбилиси"], ["podpornye-steny", "Подпорная стена на склоне в Тбилиси"]],
};
