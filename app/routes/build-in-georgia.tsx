import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { HeroStats, PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { FaqSection } from "~/components/blocks/sections";
import { CompareTable, FeatureGrid, PainAnswer, PromiseGrid, SpecList, Timeline } from "~/components/ui/lists";
import { ButtonLink, CardIndex } from "~/components/ui/primitives";
import { SplitSection, TitledSection } from "~/components/ui/section";
import { FOREIGN } from "~/content/pages/build-in-georgia";
import { I18nProvider, useI18n } from "~/i18n/context";
import { localeFromMatches, seo } from "~/lib/meta";

// Три авторские версии текста вместо перевода словарём (закон 3): страница
// рендерится в режиме raw, поэтому строки выводятся так, как написаны.
export const meta: MetaFunction = (args) => {
  const c = FOREIGN[localeFromMatches(args.matches).lang];
  // offers — первые три строки таблицы цен, видимой на странице (правила 6 и 40).
  return seo(args, c.metaTitle, c.metaDescription, {
    raw: true,
    image: "residential",
    crumbs: [["", c.crumbs[0]], [null, c.crumbs[1]]],
    faq: c.faq.items,
    service: c.serviceName,
    offers: c.prices.ranges.slice(0, 3),
    howto: { name: c.process.name, steps: c.process.items.map((p): [string, string] => [p[1], p[2]]) },
  });
};

export default function BuildInGeorgia() {
  const { state } = useI18n();
  const c = FOREIGN[state.lang];
  return (
    <I18nProvider value={{ ...state, raw: true }}>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} lead={c.heroLead} more={c.heroMore} crumbs={[["", c.crumbs[0]], [null, c.crumbs[1]]]} image="residential">
        <UpdatedNote slug="build-in-georgia" />
        <div className="reveal mt-[30px] flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="#contact" arrow="up">{c.ctaPrimary}</ButtonLink>
          <ButtonLink to="#case" variant="ghost">{c.ctaSecondary}</ButtonLink>
        </div>
        <HeroStats className="mt-11" items={c.heroStats} />
      </PageHero>

      <TitledSection id="why" eyebrow={c.why.eyebrow} title={c.why.title} intro={c.why.intro}>
        <FeatureGrid items={c.why.items} />
        <PainAnswer className="reveal mt-8" first={c.restriction.first} second={c.restriction.second} />
      </TitledSection>

      <TitledSection bg="dark" id="who" eyebrow={c.who.eyebrow} title={c.who.title}>
        <PromiseGrid items={c.who.items.map(([title, who, answer]) => ({ title, text: (<><p><b>{who}</b></p><p>{answer}</p></>) }))} />
      </TitledSection>

      {/* Страновой блок: что меняется от того, из какой страны заходит заказчик. */}
      <SplitSection id="countries" eyebrow={c.countries.eyebrow} title={c.countries.title} text={c.countries.text}>
        <Timeline items={c.countries.items} />
      </SplitSection>

      {/* Что инвестор получает сверх здания: ВНЖ, налоговые режимы, выход. */}
      <TitledSection bg="dark" id="bonus" eyebrow={c.bonus.eyebrow} title={c.bonus.title} intro={c.bonus.intro}>
        <FeatureGrid items={c.bonus.items} />
        <p className="reveal mt-8 max-w-[720px] text-[13px] text-muted">{c.bonus.note}</p>
      </TitledSection>

      <SplitSection id="remote" eyebrow={c.remote.eyebrow} title={c.remote.title} text={c.remote.text}>
        <SpecList items={c.remote.items} />
      </SplitSection>

      <TitledSection id="price" eyebrow={c.prices.eyebrow} title={c.prices.title} intro={c.prices.intro}>
        <PromiseGrid items={c.prices.promise} />
        {/* Цены таблицей: поиск и языковые модели разбирают таблицу, а не сетку (правило 15). */}
        <CompareTable head={c.prices.head} rows={c.prices.ranges.map(([k, v]) => [k, v])} />
        <p className="reveal mt-3.5 max-w-[720px] text-[13px] text-muted">{c.prices.note}</p>
      </TitledSection>

      <SplitSection bg="dark" id="legal" eyebrow={c.legal.eyebrow} title={c.legal.title}>
        <Timeline items={c.legal.items} />
      </SplitSection>

      <TitledSection id="case" eyebrow={c.example.eyebrow} title={c.example.title} intro={c.example.intro}>
        <div className="reveal mt-12 grid items-start gap-10 lg:grid-cols-[7fr_4fr] lg:gap-[8.333%]">
          <SpecList reveal={false} items={c.example.items} />
          <aside className="border border-line bg-panel-soft p-7">
            <CardIndex>{c.example.noteTitle}</CardIndex>
            <p className="mt-3.5 text-[15px] leading-[1.6]">{c.example.note}</p>
          </aside>
        </div>
      </TitledSection>

      <TitledSection bg="dark" id="process" eyebrow={c.process.eyebrow} title={c.process.title}>
        <FeatureGrid cols={5} items={c.process.items} />
      </TitledSection>

      <FaqSection id="faq" eyebrow={c.faq.eyebrow} title={c.faq.title} items={c.faq.items} />

      <ContactSection eyebrow={c.contact.eyebrow} title={c.contact.title} text={c.contact.text} steps={c.contact.steps} languages={c.contact.languages} variant="foreign" />
    </I18nProvider>
  );
}
