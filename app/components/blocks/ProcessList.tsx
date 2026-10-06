import { useId } from "react";
import { Icon } from "~/components/ui/icons";
import { ButtonLink, T } from "~/components/ui/primitives";
import { STEPS } from "~/content/company";
import { useToggleSet } from "~/hooks/useToggleSet";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";

/**
 * Шесть этапов аккордеоном, по умолчанию все закрыты и выглядят одинаково:
 * этап с cta раньше был подсвечен фоном и полосой и читался как выбранный,
 * хотя никто по нему не кликал. detailed — этапы открываются независимо
 * (страница «Услуги»); иначе открыт один. Действие этапа — кнопка внутри.
 */
export function ProcessList({ detailed = false }: { detailed?: boolean }) {
  const { t } = useI18n();
  const uid = useId();
  const { isOpen, toggle } = useToggleSet([], detailed);

  return (
    <div className="reveal-stagger mt-[42px] border-t border-line sm:mt-[68px]">
      {STEPS.map((s, i) => {
        const open = isOpen(i);
        return (
          <article key={s.n} data-step={s.n} className="process-step relative grid border-b border-line tab:grid-cols-[3fr_5fr]">
            <button type="button" aria-expanded={open} aria-controls={`${uid}-${i}`} onClick={() => toggle(i)} className="relative z-1 grid min-h-[86px] cursor-pointer grid-cols-[56px_1fr_auto] items-center py-[30px] pr-4 text-left sm:min-h-[98px] tab:grid-cols-[72px_1fr_auto] tab:pr-[30px]">
              <span className="pl-0 text-[10px] leading-none font-bold tracking-[.14em] text-teal">{s.n}</span>
              <strong className="font-display text-[clamp(19px,1.8vw,27px)] leading-[1.25] font-medium tracking-[-.04em] uppercase">{t(s.title)}</strong>
              <span aria-hidden="true" className="grid size-6 place-items-center rounded-[1px] border border-line text-teal"><Icon name={open ? "minus" : "plus"} className="size-3.5" /></span>
            </button>
            <div id={`${uid}-${i}`} className={cn("relative z-1 grid transition-[grid-template-rows,opacity] duration-500", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <div className="pt-[5px] pb-[30px] pl-14 tab:pt-7 tab:pr-[6%] tab:pl-0">
                  <p className="mb-2 text-[9px] font-bold tracking-[.14em] text-teal uppercase">{t("Что делаем")}</p>
                  <T as="p" className="mb-6 max-w-[590px] text-[15px] text-paper-dim">{s.text}</T>
                  <dl className="flex flex-col gap-6 sm:flex-row sm:gap-16">
                    {[["Результат", s.result], ["Срок", s.term]].map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <dt className="text-[9px] tracking-[.12em] text-muted uppercase">{t(k!)}</dt>
                        <dd className="mt-0.5 text-xs font-bold">{t(v!)}</dd>
                      </div>
                    ))}
                  </dl>
                  {s.cta && <ButtonLink to={s.cta[0]} variant="outline" className="mt-6 min-h-[42px] px-[18px] text-[10px]">{s.cta[1]}</ButtonLink>}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
