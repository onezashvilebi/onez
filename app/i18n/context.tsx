import { createContext, useContext, useMemo } from "react";
import { pathFor, type Lang } from "~/site/pages";

export type Dict = Record<string, string>;
/** raw — текст уже на языке страницы (англоязычный лендинг): чего нет в словаре, выводится как есть. */
export type I18nState = { lang: Lang; dict: Dict; raw?: boolean };

const I18nContext = createContext<I18nState>({ lang: "ka", dict: {} });
export const I18nProvider = I18nContext.Provider;

const warned = new Set<string>();

/** Русская строка-пивот → строка на языке страницы (может содержать <br>, <em>, <b>). */
export function translate({ lang, dict, raw }: I18nState, ru: string): string {
  if (!ru || lang === "ru") return ru;
  const hit = dict[ru];
  if (hit === undefined && raw) return ru;
  if (hit === undefined && import.meta.env.DEV && !warned.has(ru)) {
    warned.add(ru);
    console.warn(`[i18n:${lang}] нет перевода: ${ru}`);
  }
  // Единица площади и метки коэффициентов словарём не ловятся.
  return (hit ?? ru).replaceAll("м²", lang === "ka" ? "მ²" : "m²").replace(/К-(\d)/g, `${lang === "ka" ? "კ" : "K"}-$1`);
}

/** Переводчик и ссылки текущего языка; объект стабилен, пока не сменился словарь. */
export function useI18n() {
  const state = useContext(I18nContext);
  return useMemo(
    () => ({
      lang: state.lang,
      state,
      t: (ru: string) => translate(state, ru),
      href: (slug: string) => pathFor(state.lang, slug),
    }),
    [state],
  );
}
