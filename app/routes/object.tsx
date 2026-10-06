import { useLocation, type MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { HeroStats, PageHero } from "~/components/blocks/PageHero";
import { ProjectPhoto, ProjectsSection } from "~/components/blocks/Projects";
import { SpecList, Timeline } from "~/components/ui/lists";
import { T, TextLink } from "~/components/ui/primitives";
import { SplitSection, TitledSection } from "~/components/ui/section";
import { CATEGORY_OBJTYPE, PROJECTS } from "~/content/projects";
import { useI18n } from "~/i18n/context";
import { cn } from "~/lib/cn";
import { seo } from "~/lib/meta";
import { nextProject, projectSpec, projectStats, similarProjects } from "~/logic/projects";
import { bySlugOr404, crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) => {
  const p = bySlugOr404(PROJECTS, args.location.pathname);
  return seo(args, `${p.type} ${p.name} — объект ONEZA Construction`, p.desc, { image: p.img, crumbs: crumbs(["obekty", "Объекты"], p.name), noindex: true });
};

export default function ObjectPage() {
  const { t } = useI18n();
  const p = bySlugOr404(PROJECTS, useLocation().pathname);
  const next = nextProject(p);
  return (
    <>
      <PageHero eyebrow={`${p.type} · ${p.year}`} title={p.name} crumbs={crumbs(["obekty", "Объекты"], p.name)} image={p.img}>
        {/* Маркировка обязательна до замены концепта на фото объекта (DESIGN_SYSTEM.md). */}
        <p className="reveal mt-[18px] w-fit max-w-full border border-white/20 bg-ink-deep/45 px-2.5 py-2 text-[9px] leading-[1.45] font-bold tracking-[.08em] text-paper-dim uppercase sm:tracking-[.12em]">
          {t("Концепт-визуализация · требуется замена на фото объекта")}
        </p>
        <HeroStats className="mt-11" items={projectStats(p)} />
      </PageHero>
      <SplitSection eyebrow="Об объекте" title="Характеристики" text={p.desc}>
        <SpecList items={projectSpec(p)} />
      </SplitSection>
      <TitledSection bg="dark" eyebrow="Визуальное направление" title="Образ объекта" intro="Это концепт-визуализация для макета страницы, а не фотография реализованного объекта.">
        <div className="reveal mt-[54px]">
          <div role="img" aria-label={t(`Концепт-визуализация объекта ${p.name}`)} className={cn("project-image aspect-[4/3] sm:aspect-[16/8]", p.img)}>
            <ProjectPhoto project={p} sizes="(min-width: 1280px) 1200px, 100vw" />
            <span className="absolute top-[15px] right-4 z-2 font-display text-[10px] font-semibold text-white/75"><T>Концепт</T></span>
          </div>
        </div>
      </TitledSection>
      <SplitSection eyebrow="Ход работ" title="Этапы<br><em>и сроки</em>">
        <Timeline items={p.stages} />
      </SplitSection>
      <ProjectsSection bg="panel" eyebrow="Ещё" title="Похожие объекты" items={similarProjects(p)} aside={<TextLink to={next.slug} reveal={false} className="m-0">{`Следующий: ${next.name}`}</TextLink>} />
      <ContactSection title="Обсудить<br><em>похожий объект</em>" objtype={CATEGORY_OBJTYPE[p.cat]} text="Расскажите, что хотите построить, — подберём близкий по типу и площади объект и посчитаем ваш." />
    </>
  );
}
