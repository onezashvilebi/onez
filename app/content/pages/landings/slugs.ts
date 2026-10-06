// Адреса посадочных под направления. Отдельный модуль без импортов: его читает
// карта сайта (app/site/pages.ts), которой нельзя тянуть контент целиком.
export const LANDING_SLUGS = [
  "investoru-v-tbilisi",
  "biznesu-sklad-i-ceh",
  "dom-pod-otdelku",
  "podryad-na-monolit",
  "uchastok-na-sklone",
] as const;
