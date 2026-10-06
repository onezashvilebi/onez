// Юридические факты и каналы связи. Меняются только здесь (закон 14).
export const PHONE = "+995 599 538 277";
export const TEL = "tel:+995599538277";
export const WHATSAPP = "https://wa.me/995599538277";
export const TELEGRAM = "https://t.me/+995599538277";
export const EMAIL = "info@onez.ge";
/** Страницы компании в Facebook (ONEZ-05): грузинская — для KA и EN, русская — для RU; обе в sameAs JSON-LD. */
export const FACEBOOK = "https://www.facebook.com/61583334088458";
export const FACEBOOK_RU = "https://www.facebook.com/profile.php?id=61594375529944";
export const SITE_URL = "https://onez.ge";
/**
 * Юридическое лицо (закон 14). Официальное название — грузинское, как в
 * реестре предпринимателей: RU и EN — его транслитерация для читателя, в
 * документах и договоре действует грузинское. Источник — подтверждение
 * владельца 23.09.2026; выписка из реестра к делу не приложена (ONEZ-78).
 */
export const LEGAL_NAME_KA = "შპს ონეზა ქონსთრაქშენი";
export const LEGAL_NAME_RU = "ООО «Онеза Констракшени»";
export const LEGAL_NAME_EN = "LLC Oneza Constructioni";
/** Идентификационный код в реестре предпринимателей Грузии. */
export const TAX_ID = "400418525";
/**
 * Офис компании (закон 14): адрес и координаты меняются только здесь.
 * Официальное название улицы — Григола Волски (то же место, что «2-й переулок
 * Крцаниси, 35»); подтверждение владельца 23.09.2026, единый NAP для сайта,
 * Google Business и Яндекс Бизнеса.
 */
export const ADDRESS = "улица Григола Волски, 4, Тбилиси";
export const ADDRESS_EN = "4 Grigol Volski St, Tbilisi 0114";
export const COORDS = { lat: 41.67213, lng: 44.807149 };
/** Карточка компании в Google Картах (ONEZ-13): ссылка «Офис» и hasMap в JSON-LD. */
export const MAP_LINK = "https://maps.google.com/?cid=9667708027843689739";
/** Часы работы офиса — как в Google Business Profile; суббота по договорённости не входит. */
/** Круглосуточно, как в карточке Google (подтверждение владельца 23.09.2026): единый NAP. */
export const OPENING_HOURS = { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" };
export const METRIKA_ID = 112457250;

/** Каналы связи для ContactLink: адрес и подпись по умолчанию. */
export const CHANNELS = {
  phone: { href: TEL, label: PHONE },
  whatsapp: { href: WHATSAPP, label: "WhatsApp" },
  telegram: { href: TELEGRAM, label: "Telegram" },
  email: { href: `mailto:${EMAIL}`, label: EMAIL },
  facebook: { href: FACEBOOK, label: "Facebook" },
} as const;

export type Channel = keyof typeof CHANNELS;
