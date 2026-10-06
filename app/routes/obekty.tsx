import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero } from "~/components/blocks/PageHero";
import { ProjectsSection } from "~/components/blocks/Projects";
import { SiteNowSection } from "~/components/blocks/sections";
import { PAGE_META } from "~/content/pages/meta";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META["obekty"]);

export default function Obekty() {
  return (
    <>
      <PageHero eyebrow="Портфолио" title="Объекты<br><em>ONEZA</em>" lead="Жилые корпуса, производство и частные дома. Цена и срок каждого объекта зафиксированы в договоре до начала работ." crumbs={crumbs("Объекты")} />
      <SiteNowSection bg="panel" />
      <ProjectsSection bg="dark" eyebrow="Каталог" title="Все объекты" filters />
      <ContactSection title="Обсудить<br><em>похожий объект</em>" text="Расскажите, что хотите построить, — подберём близкий по типу и площади объект и посчитаем ваш." />
    </>
  );
}
