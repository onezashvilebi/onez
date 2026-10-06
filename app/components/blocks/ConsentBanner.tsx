import { Link } from "react-router";
import { buttonClass } from "~/components/ui/primitives";
import { useConsent } from "~/hooks/useConsent";
import { useI18n } from "~/i18n/context";

/**
 * Баннер согласия на аналитику: на телефоне — внизу, над панелью CTA; на
 * десктопе — слева внизу (справа кнопка чата). Сверху он закрывал h1 и первый
 * экран: посетитель начинал знакомство с сайтом с окна про аналитику.
 */
export function ConsentBanner() {
  const { t, href } = useI18n();
  const consent = useConsent();
  if (!consent.visible) return null;
  return (
    <section aria-label={t("Аналитика на сайте")} className="fixed inset-x-3 bottom-[74px] z-95 border border-line bg-panel p-4 text-paper shadow-panel tab:inset-x-auto tab:bottom-7 tab:left-7 tab:max-w-[380px]">
      <p className="text-[12px] leading-relaxed text-paper-dim">
        {t("Мы используем Яндекс.Метрику с записью сессий, чтобы понимать, что на сайте неудобно.")}{" "}
        <Link to={href("politika")} className="underline underline-offset-3 hover:text-teal">{t("Подробнее")}</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={consent.accept} className={buttonClass("ghost", "sm", "min-h-10 flex-1 px-4")}>{t("Хорошо")}</button>
        {/* Обе кнопки одного вида: раньше согласие было outline (тонкая бирюзовая рамка), отказ — ghost (белая), и «Отказаться» читалось как главное действие экрана. Выбор по аналитике не подталкивается ни в одну сторону. */}
        <button type="button" onClick={consent.decline} className={buttonClass("ghost", "sm", "min-h-10 flex-1 px-4")}>{t("Отказаться")}</button>
      </div>
    </section>
  );
}
