import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero } from "~/components/blocks/PageHero";
import { TeamGrid } from "~/components/ui/lists";
import { TitledSection } from "~/components/ui/section";
import { KOMANDA_CONTACT_TITLE, KOMANDA_HERO, KOMANDA_LEADS } from "~/content/pages/komanda";
import { TEAM } from "~/content/team";
import { PAGE_META } from "~/content/pages/meta";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META["komanda"]);

export default function Komanda() {
  return (
    <>
      <PageHero eyebrow={KOMANDA_HERO.eyebrow} title={KOMANDA_HERO.title} lead={KOMANDA_HERO.lead} crumbs={crumbs("Команда")} />
      <TitledSection bg="panel" eyebrow={KOMANDA_LEADS.eyebrow} title={KOMANDA_LEADS.title} intro={KOMANDA_LEADS.intro}>
        <TeamGrid items={TEAM} />
      </TitledSection>
      <ContactSection title={KOMANDA_CONTACT_TITLE} />
    </>
  );
}
