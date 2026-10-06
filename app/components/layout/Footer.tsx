import { Link } from "react-router";
import { Icon } from "~/components/ui/icons";
import { ButtonLink, ContactLink, T } from "~/components/ui/primitives";
import { FOOTER_COMPANY, FOOTER_SERVICES } from "~/content/navigation";
import { useI18n } from "~/i18n/context";
import { LEGAL_NAME_RU, TAX_ID } from "~/site/contacts";
import { Logo } from "./Logo";

function Column({ title, links }: { title: string; links: [string, string][] }) {
  const { t, href } = useI18n();
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-[9px] tracking-[.13em] text-faint uppercase">{t(title)}</h3>
      {links.map(([slug, label]) => (
        <Link key={slug} to={href(slug)} className="w-max text-[11px] text-paper-dim transition-colors hover:text-teal">{t(label)}</Link>
      ))}
    </div>
  );
}

const FOOTER_CONTACT = "mb-1 font-display text-[15px] leading-normal font-medium tracking-[-.03em]";

export function Footer() {
  const { t, href } = useI18n();
  return (
    <footer className="bg-ink-deep pt-[74px] pb-[88px] tab:pb-[26px]">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 pb-[62px] sm:grid-cols-[2fr_1fr_1fr] sm:gap-[7%] tab:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <T as="p" className="mt-7 text-xs text-muted">{"Монолитное строительство<br>полного цикла в Тбилиси."}</T>
          </div>
          <Column title="Услуги" links={FOOTER_SERVICES} />
          <Column title="Компания" links={FOOTER_COMPANY} />
          <div className="col-span-2 flex flex-col items-start sm:col-span-3 tab:col-span-1">
            <p className="mb-4 text-[10px] text-muted">{t("Тбилиси, Грузия")}</p>
            <ContactLink channel="phone" className={FOOTER_CONTACT} />
            <ContactLink channel="email" className={FOOTER_CONTACT} />
            <ContactLink channel="whatsapp" className="mt-[18px] text-[11px] font-bold tracking-[.08em] text-teal uppercase"><span className="inline-flex items-center gap-1.5">{t("Написать в WhatsApp")}<Icon name="arrow-up-right" className="size-3.5" /></span></ContactLink>
            <ContactLink channel="facebook" className="mt-2.5 text-[11px] font-bold tracking-[.08em] text-teal uppercase"><span className="inline-flex items-center gap-1.5">Facebook<Icon name="arrow-up-right" className="size-3.5" /></span></ContactLink>
          </div>
        </div>
        <div className="flex flex-col gap-[9px] border-t border-line pt-[23px] text-[9px] text-faint sm:flex-row sm:justify-between">
          <span>© 2026 ONEZA Construction</span>
          {/* Юрлицо и код видимы на каждой странице: заказчик видит, кто подписывает договор (правило 48 свода). */}
          <span>{t(LEGAL_NAME_RU)} · ID {TAX_ID}</span>
          <span>{t("Тбилиси · Генеральный подряд")}</span>
          <Link to={href("politika")} className="hover:text-paper">{t("Политика конфиденциальности")}</Link>
        </div>
      </div>
    </footer>
  );
}

/**
 * На мобильном CTA дублируется нижней панелью (DESIGN_SYSTEM.md → «Адаптив»).
 * `outline`, не медная: на главной уже есть медная кнопка hero, на одном экране —
 * только одна (закон 6). Панель тут — второе действие, всегда под рукой.
 */
export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-80 border-t border-line bg-ink-deep/95 px-(--pad) py-2 backdrop-blur-[14px] tab:hidden">
      {/* Текст называет результат, а не действие (закон 6). */}
      <ButtonLink to="kontakty#form" variant="outline" className="min-h-12 w-full">Получить расчёт</ButtonLink>
    </div>
  );
}
