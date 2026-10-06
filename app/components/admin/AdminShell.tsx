import { useState, type ReactNode } from "react";
import { Icon } from "~/components/ui/icons";
import { cn } from "~/lib/cn";
import type { AdminPage } from "~/hooks/useAdmin";

// Оболочка кабинета: раскладка кабинета «Стройдома» (тёмный сайдбар и шапка
// одной поверхностью, контент со скруглённым верхним левым углом), но цвета —
// сайта ONEZA (закон 5: только токены темы). Медь — главное действие, бирюза —
// состояние: активный пункт меню, непрочитанные, ручной режим. Классы
// `admin-*` — в app.css.

/** Карточка кабинета — единица разметки всех страниц. */
export const CARD = "admin-card";
/** Подпись над полем или колонкой таблицы. */
export const LABEL = "text-[10px] font-bold tracking-[.12em] text-muted uppercase";
export const FIELD = "rounded-[2px] border border-field bg-ink px-4 py-3 text-sm text-paper outline-none placeholder:text-faint focus:border-teal";
export const BUTTON = "inline-flex items-center justify-center gap-2 rounded-[2px] bg-copper px-5 py-2.5 text-[11px] font-bold tracking-[.08em] text-paper uppercase transition-colors hover:bg-copper-light disabled:opacity-40";
export const GHOST = "inline-flex items-center justify-center gap-2 rounded-[2px] border border-line px-4 py-2 text-[11px] font-bold tracking-[.08em] text-paper-dim uppercase transition-colors hover:border-teal hover:text-teal";

/** Дата и время по Тбилиси; сегодня — только время. */
export function fmtTime(ms: number): string {
  const d = new Date(ms);
  const tz = { timeZone: "Asia/Tbilisi" } as const;
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", ...tz });
  const today = new Date().toLocaleDateString("ru-RU", tz) === d.toLocaleDateString("ru-RU", tz);
  return today ? time : `${d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", ...tz })} ${time}`;
}

/** Знак сайта без ссылки и словаря: кабинет живёт вне I18nProvider. */
function Brand() {
  return (
    <span className="flex items-center gap-3">
      <span className="logo-mark flex-none" aria-hidden="true"><i /><i /><i /></span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[13px] font-semibold tracking-[.02em] text-paper uppercase">ONEZA</span>
        <span className="mt-1.5 text-[9px] font-bold tracking-[.14em] text-muted uppercase">Кабинет</span>
      </span>
    </span>
  );
}

export function Login({ password, setPassword, error, onSubmit }: { password: string; setPassword: (v: string) => void; error: string; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="admin-shell flex min-h-svh items-center justify-center p-6">
      <div className={cn(CARD, "w-full max-w-sm p-8")}>
        <div className="mb-7">
          <Brand />
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className={LABEL}>Пароль</span>
            <input type="password" autoComplete="current-password" autoFocus required value={password} onChange={(e) => setPassword(e.target.value)} className={FIELD} placeholder="••••••••" />
          </label>
          {error && <p className="text-sm text-error">{error}</p>}
          <button type="submit" className={cn(BUTTON, "mt-2 w-full py-3.5")}>Войти в кабинет</button>
        </form>
      </div>
    </div>
  );
}

const NAV: { id: AdminPage; name: string; icon: "chat" | "document" }[] = [
  { id: "chats", name: "Чат", icon: "chat" },
  { id: "leads", name: "Заявки", icon: "document" },
];

export function Shell({ page, setPage, badges, title, onLogout, children }: { page: AdminPage; setPage: (p: AdminPage) => void; badges: Record<AdminPage, number>; title: string; onLogout: () => void; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (p: AdminPage) => {
    setPage(p);
    setMobileOpen(false);
  };
  return (
    <div className="admin-shell flex h-svh overflow-hidden text-paper">
      {mobileOpen && <div className="fixed inset-0 z-90 bg-ink-deep/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <aside className={cn("admin-aside fixed inset-y-0 left-0 z-100 flex h-svh w-72 shrink-0 flex-col p-4 text-sm transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="mb-8 flex items-center gap-2 px-1 pt-2">
          <a href="/" className="min-w-0 flex-1">
            <Brand />
          </a>
          <button type="button" onClick={() => setMobileOpen(false)} className="shrink-0 p-2 text-muted transition-colors hover:text-paper lg:hidden" aria-label="Закрыть меню">
            <Icon name="close" className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = page === item.id;
            return (
              <button key={item.id} type="button" onClick={() => go(item.id)} className={cn("group flex h-12 w-full items-center gap-3 rounded-[2px] px-2.5 text-[12px] font-bold tracking-[.06em] uppercase transition-colors", active ? "bg-panel text-paper" : "text-muted hover:bg-panel/60 hover:text-paper")}>
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-[1px] transition-colors", active ? "bg-teal text-ink" : "bg-panel-soft text-muted group-hover:text-paper")}>
                  <Icon name={item.icon} className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-left">{item.name}</span>
                {badges[item.id] > 0 && <span className="rounded-[1px] bg-copper px-2 py-0.5 text-[11px] font-bold text-paper">{badges[item.id]}</span>}
              </button>
            );
          })}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className="mt-4 flex h-12 items-center gap-3 px-2.5 text-[12px] font-bold tracking-[.06em] text-muted uppercase transition-colors hover:text-teal">
          <span className="grid size-9 shrink-0 place-items-center rounded-[1px] bg-panel-soft">
            <Icon name="arrow-up-right" className="size-4" />
          </span>
          <span>Открыть сайт</span>
        </a>
      </aside>

      <div className="flex h-svh min-w-0 flex-1 flex-col overflow-hidden">
        <header className="admin-topbar flex h-16 shrink-0 items-center justify-between gap-4 px-4 sm:px-6">
          <button type="button" onClick={() => setMobileOpen(true)} className="text-[11px] font-bold tracking-[.08em] text-muted uppercase transition-colors hover:text-paper lg:hidden">
            Меню
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[1px] bg-panel-soft text-[11px] font-bold text-teal">М</span>
            <span className="hidden text-left sm:block">
              <span className="block text-[12px] leading-none font-bold text-paper">Менеджер</span>
              <span className={cn(LABEL, "mt-1 block")}>ONEZA Construction</span>
            </span>
            <button type="button" onClick={onLogout} className="ml-2 text-[11px] font-bold tracking-[.08em] text-muted uppercase transition-colors hover:text-error">
              Выйти
            </button>
          </div>
        </header>

        <div className="admin-content flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-[1600px]">
            <header className="mb-6 flex items-center justify-between gap-4">
              <h1 className="truncate">{title}</h1>
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Пустое состояние карточки. */
export function Empty({ text, icon = "document" }: { text: string; icon?: "document" | "chat" }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-[2px] border border-line bg-panel-soft text-faint">
        <Icon name={icon} className="size-6" />
      </span>
      <div className={LABEL}>{text}</div>
    </div>
  );
}
