import { useEffect, useState } from "react";
import { CONSENT_KEY } from "~/lib/metrika";
import { METRIKA_ID } from "~/site/contacts";

/**
 * Выбор посетителя по аналитике (ONEZ-45). Пока выбора нет — показываем баннер.
 * Отказ сохраняется в браузере: METRIKA_SNIPPET читает его до запуска счётчика.
 */
export function useConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(CONSENT_KEY));
    } catch {
      // хранилище закрыто — выбор негде запомнить, баннер не мучает на каждой странице
    }
  }, []);

  function choose(value: "yes" | "no") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // выбор не сохранится, но на этой странице применится
    }
    if (value === "no") (window as unknown as Record<string, unknown>)[`disableYaCounter${METRIKA_ID}`] = true;
    setVisible(false);
  }

  return { visible, accept: () => choose("yes"), decline: () => choose("no") };
}
