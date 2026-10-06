import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { FaqSection, PageLayout, RelatedArticles, RelatedServices, Stage } from "~/components/blocks/sections";
import { CalcSteps, CompareTable, FeatureGrid, PainAnswer, SpecList } from "~/components/ui/lists";
import { PAGE_META } from "~/content/pages/meta";
import { CENA_CALC_STEPS, CENA_CONTACT_TITLE, CENA_HERO, CENA_STAGES } from "~/content/pages/cena";
import { CENA_CONTRACT, CENA_EXAMPLES, CENA_FAQ, CENA_NAV, CENA_PAYMENT, CENA_PRICES, CENA_TABLE, CENA_WHY } from "~/content/pages/misc";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  // faq — тот же список, что на странице: он же уходит в JSON-LD (ONEZ-51).
  // Крошка — короткое имя раздела, title — поисковый интент «стоимость дома за м²» (ONEZ-20).
  // offers — те же цены, что в таблице на странице: один источник CENA_PRICES (правила 6 и 40).
  seo(args, ...PAGE_META["cena"], { image: "fixed-price", faq: CENA_FAQ, crumbs: [["", "Главная"], [null, "Цена фиксирована"]], service: PAGE_META["cena"]![0], offers: CENA_PRICES });

export default function Cena() {
  return (
    <>
      <PageHero eyebrow={CENA_HERO.eyebrow} title={CENA_HERO.title} lead={CENA_HERO.lead} more={CENA_HERO.more} crumbs={crumbs("Цена фиксирована")} image="fixed-price">
        <UpdatedNote slug="cena" />
      </PageHero>
      <PageLayout navTitle="Содержание" nav={CENA_NAV}>
        <Stage id="how" n="01" title={CENA_STAGES.how.title} text={CENA_STAGES.how.text}>
          <CalcSteps tone="dark" items={CENA_CALC_STEPS} />
        </Stage>
        <Stage id="prices" n="02" title={CENA_STAGES.prices.title} text={CENA_STAGES.prices.text}>
          <CompareTable head={CENA_TABLE.head} rows={CENA_TABLE.rows} />
        </Stage>
        <Stage id="contract" n="03" title={CENA_STAGES.contract.title}>
          <SpecList compact reveal={false} items={CENA_CONTRACT} />
        </Stage>
        <Stage id="payment" n="04" title={CENA_STAGES.payment.title} text={CENA_STAGES.payment.text}>
          <CalcSteps tone="dark" items={CENA_PAYMENT} />
        </Stage>
        <Stage id="warranty" n="05" title={CENA_STAGES.warranty.title} text={CENA_STAGES.warranty.text} />
        <Stage id="why" n="06" title={CENA_STAGES.why.title} text={CENA_STAGES.why.text}>
          <FeatureGrid items={CENA_WHY} />
        </Stage>
        <Stage id="changes" n="07" title={CENA_STAGES.changes.title} text={CENA_STAGES.changes.text} />
        <Stage id="examples" n="08" title={CENA_STAGES.examples.title}>
          <PainAnswer className="mt-[30px]" first={CENA_EXAMPLES.first} second={CENA_EXAMPLES.second} />
        </Stage>
      </PageLayout>
      <FaqSection items={CENA_FAQ} />
      <RelatedServices slug="cena" />
      <RelatedArticles slugs={["smeta-bez-syurprizov", "monolitnyj-karkas"]} bg="dark" />
      <ContactSection title={CENA_CONTACT_TITLE} />
    </>
  );
}
