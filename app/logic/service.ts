import { MONOLITH, RELATED_SERVICES, SERVICES, type ServicePage } from "~/content/services";
import { stripTags } from "~/lib/meta";

/** Работы, которые начинаются с участка: здесь второй вход — «Проверить участок» (ONEZ-30). */
const SITE_CHECK = new Set(["chastnye-doma", "podpornye-steny", "fundamenty"]);

/**
 * Подписи шаблона страницы услуги: направление (service) говорит о «боли»,
 * монолитные работы (monolith) — о «риске» и составе работ.
 */
export function serviceView(s: ServicePage) {
  const direction = s.kind === "service";
  return {
    direction,
    siteCheck: SITE_CHECK.has(s.slug),
    crumb: direction ? stripTags(s.title).split("  ")[0]! : s.name!,
    hero: direction ? s.cat : s.hero,
    titleSize: s.cat === "industrial" ? ("long" as const) : ("md" as const),
    pain: direction ? "Боль" : "Риск",
    painTitle: s.h2.pain,
    specEyebrow: direction ? "Специфика" : "Что делаем",
    specTitle: s.h2.spec,
    featuresTitle: s.h2.features,
    featuresEyebrow: direction ? "Особенности направления" : "Как работаем",
  };
}

/** Карточки смежных услуг для страницы по её slug (единый источник — RELATED_SERVICES). */
export function relatedServices(slug: string): ServicePage[] {
  const all = [...SERVICES, ...MONOLITH];
  return (RELATED_SERVICES[slug] ?? []).map((s) => all.find((p) => p.slug === s)).filter((p): p is ServicePage => !!p && p.slug !== slug);
}
