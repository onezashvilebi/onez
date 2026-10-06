import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { ProcessList } from "~/components/blocks/ProcessList";
import { AudienceSection, DirectionGrid, FaqSection, MonolithSection } from "~/components/blocks/sections";
import { CompareTable } from "~/components/ui/lists";
import { TitledSection } from "~/components/ui/section";
import { USLUGI_DIRECTION_DETAILS } from "~/content/pages/misc";
import { PAGE_META } from "~/content/pages/meta";
import { USLUGI_COMPARE, USLUGI_CYCLE, USLUGI_DIRECTIONS, USLUGI_FAQ, USLUGI_HERO } from "~/content/pages/uslugi";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META["uslugi"], { image: "process", faq: USLUGI_FAQ });

export default function Uslugi() {
  return (
    <>
      <PageHero eyebrow={USLUGI_HERO.eyebrow} title={USLUGI_HERO.title} lead={USLUGI_HERO.lead} more={USLUGI_HERO.more} crumbs={crumbs("Услуги")} image="process">
        <UpdatedNote slug="uslugi" />
      </PageHero>
      <TitledSection bg="dark" eyebrow={USLUGI_DIRECTIONS.eyebrow} title={USLUGI_DIRECTIONS.title}>
        <DirectionGrid details={USLUGI_DIRECTION_DETAILS} />
      </TitledSection>
      {/* Сравнение направлений таблицей: её извлекают поиск и нейросети (правило 15). */}
      <TitledSection eyebrow={USLUGI_COMPARE.eyebrow} title={USLUGI_COMPARE.title}>
        <CompareTable head={USLUGI_COMPARE.head} rows={USLUGI_COMPARE.rows} />
      </TitledSection>
      <AudienceSection />
      <MonolithSection />
      <TitledSection bg="dark" eyebrow={USLUGI_CYCLE.eyebrow} title={USLUGI_CYCLE.title} intro={USLUGI_CYCLE.intro}>
        <ProcessList detailed />
      </TitledSection>
      <FaqSection bg="panel" title="Какое направление<br><em>подходит вам?</em>" items={USLUGI_FAQ} />
      <ContactSection text="Не уверены, какое направление ваше? Опишите объект — скажем, что подходит, и посчитаем." />
    </>
  );
}
