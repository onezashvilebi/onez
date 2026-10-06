import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { FaqSection, RelatedArticles, RelatedServices } from "~/components/blocks/sections";
import { Checklist, CompareTable, PainAnswer, SpecList, Timeline } from "~/components/ui/lists";
import { TextLink } from "~/components/ui/primitives";
import { SplitSection, TitledSection } from "~/components/ui/section";
import { CHECK } from "~/content/company";
import { CHECK_FAQ, CHECK_FOREIGN, CHECK_HOW, CHECK_LEAD, CHECK_MORE, CHECK_PAIN, CHECK_TERMS, CHECK_TERMS_HEAD } from "~/content/pages/misc";
import { PAGE_META } from "~/content/pages/meta";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  // faq — тот же список, что на странице: он же уходит в JSON-LD (ONEZ-51).
  // service — проверка участка тоже услуга ONEZA; howto — видимые три шага на странице (правило 6).
  seo(args, ...PAGE_META["proverka-uchastka"], {
    image: "site-check",
    crumbs: crumbs(["uslugi", "Услуги"], "Проверка участка"),
    faq: CHECK_FAQ,
    service: PAGE_META["proverka-uchastka"]![0],
    howto: { name: "Как проходит проверка<br><em>и сколько длится?</em>", steps: CHECK_HOW },
  });

export default function ProverkaUchastka() {
  return (
    <>
      <PageHero eyebrow="Бесплатно · 3 рабочих дня" title="Проверим участок<br><em>до покупки</em>" lead={CHECK_LEAD} more={CHECK_MORE} crumbs={crumbs(["uslugi", "Услуги"], "Проверка участка")} image="site-check">
        <UpdatedNote slug="proverka-uchastka" />
      </PageHero>
      <SplitSection eyebrow="Зачем" title="Зачем проверять участок<br><em>до покупки?</em>">
        <PainAnswer first={CHECK_PAIN.first} second={CHECK_PAIN.second} />
      </SplitSection>
      <TitledSection bg="dark" eyebrow="Чек-лист" title="Что проверяем<br><em>в участке?</em>" intro="Каждый пункт в заключении получает статус: в порядке, требует внимания или блокирует строительство.">
        <Checklist items={CHECK} />
      </TitledSection>
      <SplitSection eyebrow="Как проходит" title="Как проходит проверка<br><em>и сколько длится?</em>">
        <Timeline items={CHECK_HOW} />
      </SplitSection>
      <TitledSection bg="dark" eyebrow="Условия" title="Сколько стоит проверка<br><em>и что входит?</em>">
        {/* Условия — таблицей: её извлекают поиск и нейросети (правило 15). */}
        <CompareTable head={CHECK_TERMS_HEAD} rows={CHECK_TERMS.map(([k, v]) => [k, v])} />
      </TitledSection>
      <SplitSection eyebrow="Покупаете из-за рубежа" title="Можно ли купить участок,<br><em>не приезжая в Грузию?</em>" text="Большинство вопросов решается без поездки. Подробности для покупателей-нерезидентов — на отдельной странице.">
        <div>
          <SpecList items={CHECK_FOREIGN} />
          <TextLink to="build-in-georgia" align="start">Как это работает для нерезидента</TextLink>
        </div>
      </SplitSection>
      <FaqSection items={CHECK_FAQ} bg="panel" />
      <RelatedServices slug="proverka-uchastka" bg="dark" />
      <RelatedArticles slugs={["kategoriya-zemli", "koefficienty-zastrojki"]} />
      <ContactSection title="Отправьте<br><em>кадастровый номер</em>" text="Заключение по 15 пунктам за три рабочих дня. Бесплатно и без обязательств." variant="cadastral" />
    </>
  );
}
