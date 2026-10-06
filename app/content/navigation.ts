import { PROJECTS } from "./projects";
import { LANDING_SLUGS } from "./pages/landings/slugs";
import { MONOLITH, SERVICES } from "./services";

export const NAV: [string, string][] = [
  ["uslugi", "Услуги"],
  ["obekty", "Объекты"],
  ["process", "Процесс"],
  ["o-kompanii", "О компании"],
  ["kontakty", "Контакты"],
];

export const FOOTER_SERVICES: [string, string][] = [
  ["investoru-v-tbilisi", "Инвестору"],
  ["biznesu-sklad-i-ceh", "Бизнесу"],
  ["dom-pod-otdelku", "Дом под отделку"],
  ["podryad-na-monolit", "Подряд на монолит"],
  ["uchastok-na-sklone", "Участок на склоне"],
  ["zhilye-korpusa", "Жилые корпуса"],
  ["proizvodstvo-i-sklady", "Производство и склады"],
  ["chastnye-doma", "Частные дома"],
  ["podpornye-steny", "Подпорные стены"],
  ["fundamenty", "Фундаменты"],
  ["proverka-uchastka", "Проверка участка"],
  ["obekty", "Объекты"],
];

export const FOOTER_COMPANY: [string, string][] = [
  ["o-kompanii", "О компании"],
  ["komanda", "Команда"],
  ["process", "Процесс"],
  ["cena", "Цена фиксирована"],
  ["stati", "Статьи"],
  ["kontakty", "Контакты"],
  ["build-in-georgia", "Строительство для нерезидентов"],
];

const UNDER_SERVICES = new Set([...SERVICES, ...MONOLITH].map((s) => s.slug).concat("proverka-uchastka", ...LANDING_SLUGS));
const UNDER_PROJECTS = new Set(PROJECTS.map((p) => p.slug));

/** Какой пункт меню подсвечен на странице. */
export function activeNav(slug: string): string {
  if (UNDER_SERVICES.has(slug)) return "uslugi";
  if (UNDER_PROJECTS.has(slug)) return "obekty";
  return slug;
}
