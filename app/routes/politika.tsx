import type { MetaFunction } from "react-router";
import { PageHero } from "~/components/blocks/PageHero";
import { Stage } from "~/components/blocks/sections";
import { FactNote } from "~/components/ui/primitives";
import { Section } from "~/components/ui/section";
import { PAGE_META } from "~/content/pages/meta";
import { POLITIKA_HERO, POLITIKA_STAGES, POLITIKA_STATUS } from "~/content/pages/politika";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";
import { ADDRESS, EMAIL, LEGAL_NAME_RU, TAX_ID } from "~/site/contacts";

export const meta: MetaFunction = (args) => seo(args, ...PAGE_META["politika"]);

// Текст — в content/pages/politika.ts: он описывает то, что делает код
// (workers/lead.ts, workers/chat.ts, lib/attribution.ts, lib/metrika.ts).
export default function Politika() {
  return (
    <>
      <PageHero eyebrow={POLITIKA_HERO.eyebrow} title={POLITIKA_HERO.title} lead={POLITIKA_HERO.lead} crumbs={crumbs("Политика конфиденциальности")} titleSize="legal" />
      <Section containerClassName="max-w-[820px] lg:ml-[max(var(--pad),calc((100%-1320px)/2))]">
        <Stage n="01" title={POLITIKA_STAGES.operator.title} text={POLITIKA_STAGES.operator.text(LEGAL_NAME_RU, TAX_ID, ADDRESS)} />
        <Stage n="02" title={POLITIKA_STAGES.data.title} text={POLITIKA_STAGES.data.text} />
        <Stage n="03" title={POLITIKA_STAGES.lead.title} text={POLITIKA_STAGES.lead.text} />
        <Stage n="04" title={POLITIKA_STAGES.chat.title} text={POLITIKA_STAGES.chat.text} />
        <Stage n="05" title={POLITIKA_STAGES.analytics.title} text={POLITIKA_STAGES.analytics.text} />
        <Stage n="06" title={POLITIKA_STAGES.storage.title} text={POLITIKA_STAGES.storage.text(EMAIL)} />
        <FactNote label={POLITIKA_STATUS.label}>{POLITIKA_STATUS.text}</FactNote>
      </Section>
    </>
  );
}
