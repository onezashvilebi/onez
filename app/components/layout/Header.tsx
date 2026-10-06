import { Link, useLocation } from "react-router";
import { Icon, type IconName } from "~/components/ui/icons";
import { ButtonLink, ContactLink } from "~/components/ui/primitives";
import { NAV, activeNav } from "~/content/navigation";
import { useMobileMenu, useScrolled } from "~/hooks/layout";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import { LANGS, slugFromPath, switchPath } from "~/site/pages";
import { Logo } from "./Logo";

/**
 * Ссылки на ту же страницу на других языках. Обычный `<a>`, не `Link`: ka и ru/en
 * лежат в разных корневых маршрутах (`lang-ka`/`lang-ru`/`lang-en`), и клиентский
 * переход между ними у React Router иногда не долетает — URL меняется, а разметка
 * остаётся на старом языке до перезагрузки. Полная загрузка страницы — надёжно.
 */
function LangSwitch({ separators = false, className }: { separators?: boolean; className?: string }) {
  const { lang, t } = useI18n();
  const slug = slugFromPath(useLocation().pathname);
  return (
    // nav, а не div: aria-label на элементе без роли скринридер не озвучивает.
    <nav data-lang-switch className={cn("flex items-center gap-1", className)} aria-label={t("Выбор языка")}>
      {LANGS.map((l, i) => (
        <span key={l} className="contents">
          {separators && i > 0 && <span aria-hidden="true" className="text-[10px] text-faint">/</span>}
          <a href={switchPath(l, slug)} hrefLang={l} aria-current={l === lang ? "true" : undefined} className="p-1 text-[10px] font-bold text-faint uppercase transition-colors hover:text-paper aria-[current]:text-paper">
            {l}
          </a>
        </span>
      ))}
    </nav>
  );
}

const CHANNEL_ICON: Record<"whatsapp" | "telegram" | "phone", [IconName, string]> = {
  whatsapp: ["whatsapp", "Написать в WhatsApp"],
  telegram: ["telegram", "Написать в Telegram"],
  phone: ["phone", "Позвонить"],
};

/** Круглые иконки каналов связи в шапке; размер задаёт className родителя. */
function ChannelIcons({ channels, className }: { channels: (keyof typeof CHANNEL_ICON)[]; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("flex items-center", className)}>
      {channels.map((c) => (
        <ContactLink key={c} channel={c} ariaLabel={t(CHANNEL_ICON[c][1])} className="grid place-items-center rounded-full border border-line text-paper/85 transition-colors hover:border-teal hover:text-teal">
          <Icon name={CHANNEL_ICON[c][0]} />
        </ContactLink>
      ))}
    </div>
  );
}

const NAV_LINK = {
  desktop: "relative text-[13px] font-semibold text-paper/85 after:absolute after:inset-x-0 after:-bottom-[9px] after:h-0.5 after:origin-right after:scale-x-0 after:bg-teal after:transition-transform after:duration-250 hover:after:origin-left hover:after:scale-x-100 aria-[current=page]:text-paper aria-[current=page]:after:scale-x-100",
  mobile: "border-b border-line py-2.5 font-display text-2xl leading-[1.4] font-medium tracking-[-.04em] uppercase aria-[current=page]:text-teal",
};

/** Пункты главного меню; текущий раздел помечен aria-current. */
function NavLinks({ variant }: { variant: keyof typeof NAV_LINK }) {
  const { t, href } = useI18n();
  const active = activeNav(slugFromPath(useLocation().pathname));
  return NAV.map(([slug, label]) => (
    <Link key={slug} to={href(slug)} aria-current={active === slug ? "page" : undefined} className={NAV_LINK[variant]}>
      {t(label)}
    </Link>
  ));
}

const BURGER_LINE = "my-[5px] block h-px w-full bg-current transition-transform duration-250";

/**
 * С какой ширины показывать полное меню. Грузинские пункты длиннее: с 900 до
 * 1180 px они не помещаются в строку, поэтому у ka бургер держится до 1180 px.
 * Классы записаны целиком — Tailwind собирает только литеральные строки.
 */
const DESKTOP = {
  tab: { show: "tab:flex", hide: "tab:hidden" },
  wide: { show: "wide:flex", hide: "wide:hidden" },
};

export function Header() {
  const { t, lang } = useI18n();
  const bp = DESKTOP[lang === "ka" ? "wide" : "tab"];
  const scrolled = useScrolled(32);
  const menu = useMobileMenu();

  return (
    <header
      id="top"
      className={cn(
        "fixed inset-x-0 top-0 z-100 h-16 border-b border-transparent transition-[height,background-color,border-color] duration-350",
        scrolled ? "tab:h-[68px]" : "tab:h-[88px]",
        // backdrop-filter делает шапку контейнером для fixed-потомков: открытое меню
        // (fixed inset-0) сжималось бы до высоты шапки и просвечивало страницей.
        scrolled && !menu.open && "border-line bg-ink/88 backdrop-blur-[18px]",
      )}
    >
      <div className="container-site flex h-full items-center gap-3 tab:gap-9">
        <Logo />
        <nav aria-label={t("Основная навигация")} className={cn("ml-auto hidden items-center gap-[18px] wide:gap-[clamp(18px,2vw,34px)]", bp.show)}>
          <NavLinks variant="desktop" />
        </nav>
        <div className={cn("hidden items-center gap-6", bp.show)}>
          <LangSwitch separators className="hidden wide:flex" />
          <ContactLink channel="phone" className="hidden text-xs font-semibold whitespace-nowrap wide:inline" />
          <ChannelIcons channels={["whatsapp", "telegram"]} className="gap-2 [&_a]:size-9 [&_svg]:size-4" />
          {/* outline: шапка видна поверх hero с медной кнопкой — на экране должна остаться одна (закон 6). */}
          <ButtonLink to="kontakty#form" variant="outline" size="sm">Обсудить проект</ButtonLink>
        </div>
        <div className={cn("ml-auto flex shrink-0 items-center gap-2", bp.hide)}>
          <LangSwitch className="gap-0 [&_a]:px-1 [&_a]:py-1.5 [&_a]:text-[11px]" />
          <ChannelIcons channels={["whatsapp", "telegram", "phone"]} className="gap-1 [&_a]:size-8 [&_svg]:size-3.5" />
        </div>
        <button type="button" onClick={menu.toggle} aria-expanded={menu.open} aria-controls="mobile-menu" aria-label={t("Открыть меню")} className={cn("block size-[34px] shrink-0 cursor-pointer px-[7px] py-[9px]", bp.hide)}>
          <span className={cn(BURGER_LINE, menu.open && "translate-y-[3px] rotate-45")} />
          <span className={cn(BURGER_LINE, menu.open && "-translate-y-[3px] -rotate-45")} />
        </button>
      </div>

      <div
        id="mobile-menu"
        inert={!menu.open}
        aria-hidden={!menu.open}
        className={cn(
          "fixed inset-0 -z-1 flex flex-col justify-between bg-ink-deep px-(--pad) pt-[105px] pb-[86px] transition-[opacity,visibility] duration-300",
          bp.hide,
          menu.open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label={t("Мобильная навигация")} className="flex flex-col"><NavLinks variant="mobile" /></nav>
        <ButtonLink to="kontakty#form" className="w-full">Обсудить проект</ButtonLink>
      </div>
    </header>
  );
}
