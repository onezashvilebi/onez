import { useLocation, type MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { ProcessList } from "~/components/blocks/ProcessList";
import { ProjectsSection } from "~/components/blocks/Projects";
import { FaqSection, FixedPriceSection, RelatedArticles, RelatedServices } from "~/components/blocks/sections";
import { CompareTable, FeatureGrid, PainAnswer, SpecList } from "~/components/ui/lists";
import { TextLink } from "~/components/ui/primitives";
import { SplitSection, TitledSection } from "~/components/ui/section";
import { SERVICE_ARTICLES } from "~/content/articles-meta";
import { SERVICE_CRUMB, SERVICE_PAIN, SERVICE_PRICE, SERVICE_PROCESS, SERVICE_PROJECTS, SERVICE_SPEC_HEAD } from "~/content/pages/service";
import { CENA_STAGES } from "~/content/pages/cena";
import { CENA_PRICES, CENA_TABLE } from "~/content/pages/misc";
import { PROJECTS } from "~/content/projects";
import { MONOLITH, SERVICES } from "~/content/services";
import { seo, stripTags } from "~/lib/meta";
import { filterByCategory } from "~/logic/projects";
import { bySlugOr404, crumbs } from "~/logic/routing";
import { serviceView } from "~/logic/service";

/** Одна страница-шаблон на пять адресов: три направления и два вида монолитных работ. */
const PAGES = [...SERVICES, ...MONOLITH];

export const meta: MetaFunction = (args) => {
  const s = bySlugOr404(PAGES, args.location.pathname);
  const v = serviceView(s);
  // seoTitle — если услугу ищут не теми словами, что стоят в H1 (ONEZ-50).
  // offers ставятся только там, где таблица цен видна на странице (правила 6 и 40).
  return seo(args, s.seoTitle ?? stripTags(s.title), s.seoDescription, { image: v.hero, crumbs: crumbs(["uslugi", SERVICE_CRUMB], v.crumb), faq: s.faq, service: true, ...(s.prices ? { offers: CENA_PRICES } : {}) });
};

export default function Service() {
  const s = bySlugOr404(PAGES, useLocation().pathname);
  const v = serviceView(s);
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} more={s.more} crumbs={crumbs(["uslugi", SERVICE_CRUMB], v.crumb)} image={v.hero} titleSize={v.titleSize}>
        <UpdatedNote slug={s.slug} />
      </PageHero>
      <SplitSection eyebrow={SERVICE_PAIN.eyebrow} title={v.painTitle}>
        <PainAnswer first={[v.pain, s.pain]} second={[SERVICE_PAIN.answer, s.answer]} />
        {/* Второй вход без второй медной кнопки (закон 6): текстовая ссылка на проверку участка. */}
        {v.siteCheck && <TextLink to="proverka-uchastka" align="start">{SERVICE_PAIN.siteCheck}</TextLink>}
      </SplitSection>
      <SplitSection bg="dark" eyebrow={v.specEyebrow} title={v.specTitle}>
        {/* Характеристики — таблицей там, где на странице нет таблицы цен (правило 15). */}
        {s.prices ? <SpecList items={s.spec} /> : <CompareTable head={SERVICE_SPEC_HEAD} rows={s.spec.map(([k, val]) => [k, val])} />}
      </SplitSection>
      <TitledSection eyebrow={v.featuresEyebrow} title={v.featuresTitle}>
        <FeatureGrid items={s.features} />
      </TitledSection>
      {/* Цена по стадиям — таблицей из CENA_PRICES: те же цифры, что на /cena и в Offer. */}
      {s.prices && s.h2.price && (
        <TitledSection bg="panel" eyebrow={SERVICE_PRICE.eyebrow} title={s.h2.price} intro={CENA_STAGES.prices.text}>
          <CompareTable head={CENA_TABLE.head} rows={CENA_TABLE.rows} />
          <TextLink to="cena">{SERVICE_PRICE.link}</TextLink>
        </TitledSection>
      )}
      {v.direction ? (
        <>
          <TitledSection bg="dark" eyebrow={SERVICE_PROCESS.eyebrow} title={SERVICE_PROCESS.title} intro={SERVICE_PROCESS.intro}>
            <ProcessList />
          </TitledSection>
          <ProjectsSection bg="panel" eyebrow={SERVICE_PROJECTS.eyebrow} title={SERVICE_PROJECTS.title} items={filterByCategory(PROJECTS, s.cat!)} cta />
        </>
      ) : null}
      {/* FAQ есть у всех услуг: он же уходит в FAQPage, а разметка не должна
          обещать того, чего на странице не видно (CHECKLIST, правило 6). */}
      {s.faq?.length ? <FaqSection items={s.faq} /> : null}
      <RelatedServices slug={s.slug} />
      <FixedPriceSection />
      {/* Кластер (SEO §4): услуга → статьи по теме, обратные ссылки — ARTICLE_SERVICE. */}
      <RelatedArticles slugs={SERVICE_ARTICLES[s.slug] ?? []} />
      <ContactSection objtype={s.objtype} text="Назовите площадь, участок и желаемый срок — вернёмся с составом работ и вилкой стоимости по стадиям." />
    </>
  );
}
