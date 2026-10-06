import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ButtonLink } from "~/components/ui/primitives";
import { Section, SectionHead, type SectionBg } from "~/components/ui/section";
import { CATEGORY_FILTERS, PROJECTS, type Project } from "~/content/projects";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import { filterByCategory, projectNumber, type CategoryFilter } from "~/logic/projects";

/**
 * Концепт-визуализация объекта — <img loading="lazy">, а не фон: фон CSS браузер
 * качает сразу, и /obekty тянул девять кадров по 60–200 КБ раньше героя (ONEZ-22).
 * Телефону — кадр 800 px. Декоративная: подпись и ссылка — в тексте карточки.
 */
export function ProjectPhoto({ project, sizes }: { project: Project; sizes: string }) {
  const src = `/assets/${project.photo}`;
  return (
    <>
      <img src={`${src}.webp`} srcSet={`${src}-m.webp 800w, ${src}.webp ${project.photoWidth}w`} sizes={sizes} alt="" aria-hidden="true" width={project.photoWidth} height={Math.round(project.photoWidth * 2 / 3)} loading="lazy" decoding="async" />
      <i className="project-shade" />
    </>
  );
}

export function ProjectCard({ project, limitMobile }: { project: Project; limitMobile?: boolean }) {
  const { t, href } = useI18n();
  return (
    <Link to={href(project.slug)} className={cn("group block min-w-0", limitMobile && "max-sm:nth-[n+5]:hidden")}>
      <div className={cn("project-image aspect-[3/2]", project.img)}>
        <ProjectPhoto project={project} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        <span className="absolute top-[15px] right-4 z-2 font-display text-[10px] leading-none font-semibold text-white/75">{projectNumber(project)}</span>
      </div>
      <div className="px-0.5 pt-[19px]">
        <p className="mb-[7px] text-[9px] font-bold tracking-[.12em] text-teal uppercase">{t(project.type)}</p>
        <h3 className="mb-3.5 font-display text-[22px] leading-[1.2] font-medium tracking-[-.04em] uppercase transition-colors group-hover:text-teal">{t(project.name)}</h3>
        <div className="flex gap-[9px] text-[10px] text-muted">
          {[project.area, project.place, project.year].map((v, i) => (
            <span key={v} className={cn(i > 0 && "before:mr-[9px] before:text-faint before:content-['·']")}>{t(v)}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProjectGrid({ items, limitMobile }: { items: Project[]; limitMobile?: boolean }) {
  return (
    <div className="reveal-stagger mt-[42px] grid grid-cols-1 gap-[38px] sm:mt-14 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-11 tab:grid-cols-3">
      {items.map((p) => <ProjectCard key={p.slug} project={p} limitMobile={limitMobile} />)}
    </div>
  );
}

function Filters({ value, onChange }: { value: CategoryFilter; onChange: (c: CategoryFilter) => void }) {
  const { t } = useI18n();
  return (
    <>
      <div role="group" aria-label={t("Фильтр проектов")} className="hidden gap-1.5 pb-2 sm:flex">
        {CATEGORY_FILTERS.map(([c, label]) => (
          <button key={c} type="button" aria-pressed={value === c} onClick={() => onChange(c)} className="min-h-[38px] cursor-pointer rounded-[30px] border border-line px-4 text-[10px] font-bold text-muted aria-pressed:border-teal aria-pressed:bg-teal aria-pressed:text-ink">
            {t(label)}
          </button>
        ))}
      </div>
      {/* Ниже 640 px длинные табы заменяются select (DESIGN_SYSTEM.md → «Адаптив»). */}
      <label className="block w-full sm:hidden">
        <span className="sr-only">{t("Фильтр проектов")}</span>
        <select value={value} onChange={(e) => onChange(e.target.value as CategoryFilter)} className="h-[42px] w-full max-w-full rounded-none border border-line bg-ink pr-8 pl-[13px] text-[11px] text-paper">
          {CATEGORY_FILTERS.map(([c, , long]) => <option key={c} value={c}>{t(long)}</option>)}
        </select>
      </label>
    </>
  );
}

/** Секция объектов: заголовок, фильтр по категориям, сетка, кнопка «Все объекты». */
export function ProjectsSection({ items = PROJECTS, eyebrow, title, bg = "dark", id, filters = false, cta = false, aside, limitMobile }: { items?: Project[]; eyebrow: string; title: string; bg?: SectionBg; id?: string; filters?: boolean; cta?: boolean; aside?: ReactNode; limitMobile?: boolean }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  return (
    <Section bg={bg} id={id}>
      <SectionHead eyebrow={eyebrow} title={title} size="lg" aside={<>{filters && <Filters value={category} onChange={setCategory} />}{aside}</>} />
      <ProjectGrid items={filterByCategory(items, category)} limitMobile={limitMobile} />
      {cta && <ButtonLink to="obekty" variant="outline" className="reveal mx-auto mt-[60px] flex w-fit">Все объекты</ButtonLink>}
    </Section>
  );
}
