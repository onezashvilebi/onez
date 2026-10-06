import { useLocation, type MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { FaqSection, FixedPriceSection } from "~/components/blocks/sections";
import { CompareTable, FeatureGrid, Timeline } from "~/components/ui/lists";
import { ButtonLink, TextLink } from "~/components/ui/primitives";
import { SplitSection, TitledSection } from "~/components/ui/section";
import { SERVICE_CRUMB } from "~/content/pages/service";
import { landingFor } from "~/content/pages/landings";
import { I18nProvider, useI18n } from "~/i18n/context";
import { localeFromMatches, seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";
import { slugFromPath } from "~/site/pages";

/** Одна страница-шаблон на все посадочные под направления. */
function pageFor(pathname: string, lang: Parameters<typeof landingFor>[1]) {
  const slug = slugFromPath(pathname);
  const c = landingFor(slug, lang);
  if (!c) throw new Response(null, { status: 404 });
  return c;
}

export const meta: MetaFunction = (args) => {
  const c = pageFor(args.location.pathname, localeFromMatches(args.matches).lang);
  return seo(args, c.metaTitle, c.metaDescription, {
    raw: true,
    image: "residential",
    crumbs: crumbs(["uslugi", SERVICE_CRUMB], c.crumb),
    faq: c.faq.items,
    service: c.serviceName,
  });
};

export default function Landing() {
  const { state } = useI18n();
  const pathname = useLocation().pathname;
  const c = pageFor(pathname, state.lang);
  return (
    <I18nProvider value={{ ...state, raw: true }}>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} lead={c.heroLead} more={c.heroMore} crumbs={crumbs(["uslugi", SERVICE_CRUMB], c.crumb)} image="residential">
        <UpdatedNote slug={slugFromPath(pathname)} />
        <div className="reveal mt-[30px] flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="#contact" arrow="up">{c.ctaPrimary}</ButtonLink>
          <ButtonLink to="cena" variant="ghost">{c.ctaSecondary}</ButtonLink>
        </div>
      </PageHero>

      <TitledSection id="advantages" eyebrow={c.advantages.eyebrow} title={c.advantages.title} intro={c.advantages.intro}>
        <FeatureGrid items={c.advantages.items} />
      </TitledSection>

      {/* Снятие барьеров: возражение → что с ним делаем. */}
      <SplitSection bg="dark" id="barriers" eyebrow={c.barriers.eyebrow} title={c.barriers.title} text={c.barriers.intro}>
        <Timeline items={c.barriers.items} />
      </SplitSection>

      <TitledSection id="spec" eyebrow={c.spec.eyebrow} title={c.spec.title}>
        <CompareTable head={c.spec.head} rows={c.spec.rows.map(([k, v]) => [k, v])} />
        {/* Второй вход без второй медной кнопки (закон 6): текстовая ссылка на страницу услуги. */}
        <TextLink to={c.serviceLink} align="start">{c.serviceName}</TextLink>
      </TitledSection>

      <FaqSection id="faq" eyebrow={c.faq.eyebrow} title={c.faq.title} items={c.faq.items} />
      <FixedPriceSection />
      <ContactSection eyebrow={c.contact.eyebrow} title={c.contact.title} text={c.contact.text} objtype={c.contact.objtype} />
    </I18nProvider>
  );
}
