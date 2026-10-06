import type { MetaDescriptor } from "react-router";
import { translate, type Dict } from "~/i18n/context";
import { modifiedFor } from "~/logic/modified";
import type { Crumb } from "~/logic/routing";
import { ADDRESS_EN, COORDS, EMAIL, FACEBOOK, FACEBOOK_RU, LEGAL_NAME_KA, MAP_LINK, OPENING_HOURS, PHONE, SITE_URL, TAX_ID } from "~/site/contacts";
import { LANGS, pageOf, pathFor, slugFromPath, type Lang } from "~/site/pages";

type Match = { id: string; loaderData?: unknown } | undefined;
type MetaArgs = { location: { pathname: string }; matches: ReadonlyArray<Match> };

export type LocaleData = { lang: Lang; dict: Dict };

const BRAND = "ONEZA Construction";
const ORG_ID = `${SITE_URL}/#org`;
const SITE_ID = `${SITE_URL}/#website`;
const OG_LOCALE: Record<Lang, string> = { ka: "ka_GE", ru: "ru_RU", en: "en_US" };

/** Ключ картинки героя (как в PageHero и app.css) → файл в public/assets. */
const HERO_FILE: Record<string, string> = {
  residential: "hero-residential.jpg",
  industrial: "hero-industrial.jpg",
  private: "hero-private.jpg",
  process: "process-quality-control.jpg",
  "site-check": "hero-site-check.jpg",
  "fixed-price": "hero-fixed-price.jpg",
  "img-a": "project-saburtalo.jpg",
  "img-b": "project-rustavi.jpg",
  "img-c": "project-tskhneti.jpg",
  "img-d": "project-vake.jpg",
  "img-e": "project-gldani.jpg",
  "img-f": "project-lisi.jpg",
  "img-g": "project-digomi.jpg",
  "img-h": "project-marneuli.jpg",
  "img-i": "project-betania.jpg",
};
const DEFAULT_IMAGE = "onez-construction-hero.jpg";

export function localeFromMatches(matches: ReadonlyArray<Match>): LocaleData {
  const m = matches.find((x) => x?.id.startsWith("lang-"));
  return (m?.loaderData as LocaleData | undefined) ?? { lang: "ka", dict: {} };
}

export const stripTags = (html: string) => html.replace(/<.*?>/g, " ").trim();

export type SeoOptions = {
  /** Текст уже на языке страницы (build-in-georgia): мимо словаря. */
  raw?: boolean;
  /** Ключ героя страницы — картинка для og:image и JSON-LD. */
  image?: string;
  /** Крошки как в PageHero; без них — «Главная → title». */
  crumbs?: Crumb[];
  /** Вопросы, видимые на странице (FaqSection) → FAQPage. */
  faq?: [string, string][];
  /** Статья: даты публикации и правки содержимого (YYYY-MM-DD). */
  article?: { published: string; modified: string };
  /** Страница услуги → Service от имени компании. Строка — имя услуги, если оно не совпадает с последней крошкой. */
  service?: boolean | string;
  /**
   * Цены «от», видимые на этой странице → Offer внутри Service. Источник один —
   * `CENA_PRICES`/`PRICE_RANGES` (свод v3, правило 40): числа в разметке не набираются руками.
   */
  offers?: [name: string, price: string][];
  /** Видимая пошаговая инструкция на странице → HowTo (свод v3, правило 6). */
  howto?: { name: string; steps: [string, string][] };
  noindex?: boolean;
};

/** «от $140 / м²» → 180. Валюта на сайте одна — доллар США за квадратный метр. */
const priceValue = (price: string) => Number(price.replace(/[^\d]/g, ""));

/**
 * title, description, canonical, hreflang, og:* и JSON-LD для страницы (строки —
 * русский пивот). К title добавляется « — ONEZA Construction», если бренда в нём
 * ещё нет; перевод берётся по полной строке, как она лежит в словаре.
 * Цифры компании (стаж, м², объекты) в разметку не идут до ONEZ-03.
 */
export function seo(args: MetaArgs, title: string, description: string, opts: SeoOptions = {}): MetaDescriptor[] {
  const locale = localeFromMatches(args.matches);
  const { lang } = locale;
  const t = (s: string) => stripTags(translate({ ...locale, raw: opts.raw }, s)).replace(/\s+/g, " ");
  const slug = slugFromPath(args.location.pathname);
  const url = SITE_URL + pathFor(lang, slug);
  const fullTitle = t(title.includes(BRAND) ? title : `${title} — ${BRAND}`);
  const desc = t(description);
  const image = `${SITE_URL}/assets/${HERO_FILE[opts.image ?? ""] ?? DEFAULT_IMAGE}`;
  const only = pageOf(slug)?.only;
  const modified = modifiedFor(slug);
  const alternates: MetaDescriptor[] = only
    ? []
    : [
        ...LANGS.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l, href: SITE_URL + pathFor(l, slug) })),
        { tagName: "link", rel: "alternate", hrefLang: "x-default", href: SITE_URL + pathFor("ka", slug) },
      ];

  const trail = slug ? (opts.crumbs ?? [["", "Главная"], [null, title.replace(` — ${BRAND}`, "")]]) : [];
  const graph: Record<string, unknown>[] = [
    organization(t),
    { "@type": "WebSite", "@id": SITE_ID, url: SITE_URL + pathFor(lang, ""), name: BRAND, inLanguage: lang, publisher: { "@id": ORG_ID } },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: fullTitle,
      description: desc,
      inLanguage: lang,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      // Дата правки текста страницы — та же, что видна на странице и стоит в sitemap (правило 22).
      ...(modified ? { dateModified: modified } : {}),
      // Голосовой ответ (правило 24): прямой ответ под h1 и ответы видимого FAQ.
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".bluf", ...(opts.faq?.length ? [".faq-answer"] : [])] },
      ...(trail.length ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    },
  ];
  if (trail.length)
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map(([s, label], i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t(label),
        item: s === null ? url : SITE_URL + pathFor(lang, s),
      })),
    });
  if (opts.faq?.length)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#webpage` },
      inLanguage: lang,
      mainEntity: opts.faq.map(([q, a]) => ({ "@type": "Question", name: t(q), acceptedAnswer: { "@type": "Answer", text: t(a) } })),
    });
  if (opts.service || opts.offers)
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: t(typeof opts.service === "string" ? opts.service : (trail.at(-1)?.[1] ?? title)),
      description: desc,
      url,
      image,
      inLanguage: lang,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "City", name: "Tbilisi" },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      // Цена — та же, что в таблице на странице: минимальная за квадратный метр (unitCode MTK).
      ...(opts.offers?.length
        ? {
            offers: opts.offers.map(([name, price]) => ({
              "@type": "Offer",
              name: t(name),
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                priceCurrency: "USD",
                minPrice: priceValue(price),
                unitCode: "MTK",
              },
              availability: "https://schema.org/InStock",
              areaServed: { "@type": "City", name: "Tbilisi" },
            })),
          }
        : {}),
    });
  if (opts.howto?.steps.length)
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: t(opts.howto.name),
      inLanguage: lang,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      step: opts.howto.steps.map(([name, text], i) => ({ "@type": "HowToStep", position: i + 1, name: t(name), text: t(text) })),
    });
  if (opts.article)
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: t(trail.at(-1)?.[1] ?? title),
      description: desc,
      image,
      inLanguage: lang,
      datePublished: opts.article.published,
      dateModified: opts.article.modified,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@id": `${url}#webpage` },
    });

  return [
    { title: fullTitle },
    { name: "description", content: desc },
    { name: "robots", content: opts.noindex ? "noindex" : "max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    { tagName: "link", rel: "canonical", href: url },
    ...alternates,
    { property: "og:type", content: opts.article ? "article" : "website" },
    { property: "og:site_name", content: BRAND },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:locale", content: OG_LOCALE[lang] },
    ...(only ? [] : LANGS.filter((l) => l !== lang).map((l) => ({ property: "og:locale:alternate", content: OG_LOCALE[l] }))),
    { name: "twitter:card", content: "summary_large_image" },
    { "script:ld+json": { "@context": "https://schema.org", "@graph": graph } },
  ];
}

/**
 * Сущность компании — одна на всех страницах и языках (совпадает с профилями и
 * site/contacts.ts). sameAs — профили компании в соцсетях (ONEZ-05, ONEZ-35).
 */
function organization(t: (s: string) => string) {
  return {
    "@type": "GeneralContractor",
    "@id": ORG_ID,
    name: BRAND,
    alternateName: "ONEZA",
    // Юрлицо и код — подтверждены владельцем (ONEZ-78). legalName официальный,
    // грузинский: он один и тот же во всех локалях, RU и EN — транслитерация.
    legalName: LEGAL_NAME_KA,
    taxID: TAX_ID,
    url: SITE_URL,
    description: t("ONEZA Construction — монолитное строительство полного цикла в Тбилиси. Цена, сроки и состав работ фиксируются в договоре."),
    telephone: PHONE.replace(/\s/g, ""),
    email: EMAIL,
    image: `${SITE_URL}/assets/${DEFAULT_IMAGE}`,
    // Знак из логотипа сайта — он же фавикон (components/layout/Logo.tsx, public/favicon.svg).
    logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: PHONE.replace(/\s/g, ""),
        email: EMAIL,
        areaServed: "GE",
        availableLanguage: ["ka", "ru", "en"],
      },
    ],
    address: { "@type": "PostalAddress", streetAddress: ADDRESS_EN, addressLocality: "Tbilisi", addressCountry: "GE" },
    geo: { "@type": "GeoCoordinates", latitude: COORDS.lat, longitude: COORDS.lng },
    hasMap: MAP_LINK,
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: OPENING_HOURS.days, opens: OPENING_HOURS.opens, closes: OPENING_HOURS.closes }],
    areaServed: [
      { "@type": "City", name: "Tbilisi" },
      { "@type": "Country", name: "Georgia" },
    ],
    sameAs: [FACEBOOK, FACEBOOK_RU, MAP_LINK],
    knowsLanguage: ["ka", "ru", "en"],
    knowsAbout: ["Monolithic reinforced concrete construction", "General contracting", "Residential buildings", "Warehouses and industrial buildings", "Private houses", "Retaining walls", "Foundations", "Land plot due diligence in Georgia"],
  };
}
