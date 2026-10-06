import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { TitledSection } from "~/components/ui/section";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { CtaBand, FaqSection, PageLayout, Stage } from "~/components/blocks/sections";
import { CompareTable, SpecList } from "~/components/ui/lists";
import { ButtonLink, Disclaimer } from "~/components/ui/primitives";
import { PARTICIPATION, STEPS } from "~/content/company";
import { PAGE_META } from "~/content/pages/meta";
import { PROCESS_FAQ, PROCESS_HERO } from "~/content/pages/misc";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  // Шесть этапов видны на странице списком → HowTo (правило 6).
  seo(args, ...PAGE_META["process"], {
    image: "process",
    crumbs: crumbs("Процесс"),
    faq: PROCESS_FAQ,
    howto: { name: PAGE_META["process"]![0], steps: STEPS.map((s): [string, string] => [s.title, s.text]) },
  });

const NAV = STEPS.map((s): [string, string] => [`step-${s.n}`, `${s.n} ${s.title}`]);

export default function Process() {
  return (
    <>
      <PageHero eyebrow="Полный цикл" title="От участка<br><em>до ключей</em>" lead={PROCESS_HERO.lead} more={PROCESS_HERO.more} crumbs={crumbs("Процесс")} image="process">
        <UpdatedNote slug="process" />
      </PageHero>
      {/* Этапы, результаты и сроки — таблицей (правило 15): данные те же, что в карточках этапов. */}
      <TitledSection eyebrow={PROCESS_HERO.eyebrow} title={PROCESS_HERO.title}>
        <CompareTable head={PROCESS_HERO.head} rows={STEPS.map((s) => [`${s.n} ${s.title}`, s.result, s.term])} />
      </TitledSection>
      <PageLayout navTitle="Этапы" nav={NAV}>
        {STEPS.map((s, i) => (
          <Stage key={s.n} id={`step-${s.n}`} n={s.n} title={s.title} text={s.text}>
            <SpecList compact reveal={false} items={[["Результат", s.result], ["Срок", s.term], ["Ваше участие", PARTICIPATION[i]!]]} />
            {s.cta && <ButtonLink to={s.cta[0]} variant="outline" className="mt-[30px]">{s.cta[1]}</ButtonLink>}
          </Stage>
        ))}
        <Disclaimer>Отделочный ремонт не выполняем — сдаём объект под отделку.</Disclaimer>
      </PageLayout>
      <FaqSection title="Что спрашивают<br><em>о порядке работ?</em>" items={PROCESS_FAQ} />
      <CtaBand title="Готовы начать<br><em>с первого этапа?</em>" to="kontakty#form" label="Обсудить проект" variant="outline" />
      <ContactSection text="Скажите, на каком этапе вы сейчас, — подскажем, что делать следующим шагом и сколько это займёт." />
    </>
  );
}
