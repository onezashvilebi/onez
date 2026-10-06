import type { Lang } from "~/site/pages";
import { BIZNESU } from "./biznesu";
import { DOM_POD_OTDELKU } from "./dom-pod-otdelku";
import { INVESTORU } from "./investoru";
import { PODRYAD_NA_MONOLIT } from "./podryad-na-monolit";
import { UCHASTOK_NA_SKLONE } from "./uchastok-na-sklone";
import type { LandingPage } from "./types";

export type { LandingPage } from "./types";

/** Посадочные под направления: slug → три языковые версии. Порядок — как в футере. */
export const LANDINGS: Record<string, Record<Lang, LandingPage>> = {
  "investoru-v-tbilisi": INVESTORU,
  "biznesu-sklad-i-ceh": BIZNESU,
  "dom-pod-otdelku": DOM_POD_OTDELKU,
  "podryad-na-monolit": PODRYAD_NA_MONOLIT,
  "uchastok-na-sklone": UCHASTOK_NA_SKLONE,
};

export { LANDING_SLUGS } from "./slugs";

export const landingFor = (slug: string, lang: Lang): LandingPage | undefined => LANDINGS[slug]?.[lang];
