import { ARTICLES } from "~/content/articles-meta";
import { PAGE_META } from "~/content/pages/meta";
import { FOREIGN } from "~/content/pages/build-in-georgia";
import { landingFor } from "~/content/pages/landings";
import { STEPS } from "~/content/company";
import { MONOLITH, SERVICES } from "~/content/services";
import { translate } from "~/i18n/context";
import { dictFor } from "~/i18n/dict.server";
import { stripTags } from "~/lib/meta";
import { ADDRESS, ADDRESS_EN, EMAIL, OPENING_HOURS, PHONE, SITE_URL, WHATSAPP } from "~/site/contacts";
import { LANGS, PAGES, pathFor, type Lang } from "~/site/pages";

// /llms.txt по llmstxt.org: карта индексируемых страниц для ИИ-ассистентов.
// Собирается из тех же источников, что <meta> и sitemap.xml (docs/SEO.md), поэтому
// не расходится с сайтом. Страницы с noindex (объекты) не попадают.
const BRAND = "ONEZA Construction";
const SECTION: Record<Lang, string> = { ka: "ქართული (KA)", ru: "Русский (RU)", en: "English (EN)" };

/** [заголовок, описание] страницы на русском пивоте; raw — текст уже английский. */
function source(slug: string): { title: string; desc: string; raw?: boolean } {
  const s = [...SERVICES, ...MONOLITH].find((x) => x.slug === slug);
  if (s) return { title: stripTags(s.title), desc: s.lead };
  const a = ARTICLES.find((x) => x.slug === slug);
  if (a) return { title: `${a.name} — статьи ${BRAND}`, desc: a.text };
  const m = PAGE_META[slug];
  if (!m) throw new Error(`llms.txt: нет title/description для страницы «${slug}» — добавь в content/pages/meta.ts`);
  return { title: m[0], desc: m[1] };
}

function line(lang: Lang, slug: string): string {
  const dict = dictFor(lang);
  // Посадочные и лендинг для нерезидентов написаны отдельно на каждом языке (закон 3).
  const landing = landingFor(slug, lang);
  if (landing) return `- [${landing.metaTitle}](${SITE_URL}${pathFor(lang, slug)}): ${landing.metaDescription}`;
  if (slug === "build-in-georgia") {
    const c = FOREIGN[lang];
    const name = c.metaTitle.replace(/\s+—\s+ONEZA Construction$/, "");
    return `- [${name}](${SITE_URL}${pathFor(lang, slug)}): ${c.metaDescription}`;
  }
  const { title, desc, raw } = source(slug);
  const t = (ru: string) => {
    if (lang !== "ru" && !raw && dict[ru] === undefined) throw new Error(`llms.txt: нет перевода [${lang}] «${ru}»`);
    return stripTags(translate({ lang, dict, raw }, ru)).replace(/\s+/g, " ").trim();
  };
  const full = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
  const name = t(full).replace(/\s+—\s+ONEZA Construction$/, "");
  return `- [${name}](${SITE_URL}${pathFor(lang, slug)}): ${t(desc)}`;
}

export function loader() {
  const indexed = PAGES.filter((p) => !p.noindex);
  const sections = LANGS.map((lang) => {
    const lines = indexed.filter((p) => !p.only || p.only === lang).map((p) => line(lang, p.slug));
    return `## ${SECTION[lang]}\n\n${lines.join("\n")}`;
  });
  const en = dictFor("en");
  const lead = translate({ lang: "en", dict: en }, PAGE_META[""]![1]);
  const t = (ru: string) => stripTags(translate({ lang: "en", dict: en }, ru)).replace(/\s+/g, " ").trim();
  const days = `${OPENING_HOURS.days[0]}–${OPENING_HOURS.days.at(-1)}`;
  const body = [
    `# ${BRAND}`,
    `> ${lead}`,
    `Site languages: Georgian (main, ${SITE_URL}/), Russian (${SITE_URL}/ru/), English (${SITE_URL}/en/). The same pages exist in each language, including "Build in Georgia" for non-resident clients.`,
    `## Company\n\n- Full-cycle general contractor in Tbilisi, Georgia: monolithic reinforced concrete construction from the land check to handover ready for fit-out. Finishing works are not part of the scope.\n- Residential buildings and apart-complexes from 1 000 m², up to 20 floors, 12–20 months.\n- Warehouses, workshops and logistics centres from 1 000 m², up to 14 m clear height, 6–12 months.\n- Private houses from 160 m², 1–3 floors, 8–14 months.\n- Foundations (slab, strip, piled) and retaining walls can be ordered as a separate stage.\n- 15-point land due diligence anywhere in Georgia, written report in 3 business days; free for clients who sign a construction contract with us, charged separately otherwise.\n- Payment: 100% of materials and 15% of the work up front, the rest against stage acceptance acts. Structural warranty: 10 years. The contract price changes only if the client changes the brief.\n- Working languages: Georgian, Russian, English.`,
    `## Prices\n\n${FOREIGN.en.prices.ranges.map(([k, v]) => `- ${k}: ${v}`).join("\n")}\n\n${FOREIGN.en.prices.note}`,
    `## How a project goes\n\n${STEPS.map((s) => `${Number(s.n)}. ${t(s.title)} — ${t(s.term)}`).join("\n")}`,
    `## Contacts\n\n- Phone and WhatsApp: ${PHONE} (${WHATSAPP})\n- Email: ${EMAIL}\n- Office: ${ADDRESS_EN} (${ADDRESS}), ${days} ${OPENING_HOURS.opens}–${OPENING_HOURS.closes}\n- [Contact form](${SITE_URL}${pathFor("en", "kontakty")})`,
    ...sections,
  ].join("\n\n");
  return new Response(`${body}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
