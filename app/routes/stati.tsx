import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero } from "~/components/blocks/PageHero";
import { ArticleGrid } from "~/components/blocks/sections";
import { TitledSection } from "~/components/ui/section";
import { PAGE_META } from "~/content/pages/meta";
import { STATI_HERO, STATI_TOPICS } from "~/content/pages/stati";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META["stati"], { image: "process" });

export default function Stati() {
  return (
    <>
      <PageHero eyebrow={STATI_HERO.eyebrow} title={STATI_HERO.title} lead={STATI_HERO.lead} crumbs={crumbs("Статьи")} image="process" />
      <TitledSection eyebrow={STATI_TOPICS.eyebrow} title={STATI_TOPICS.title} intro={STATI_TOPICS.intro}>
        <ArticleGrid />
      </TitledSection>
      <ContactSection text="Остались вопросы после статьи? Разберём их на вашем объекте и покажем, как цифры из текста выглядят в смете." />
    </>
  );
}
