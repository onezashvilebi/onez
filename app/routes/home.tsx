import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { HeroStats, UpdatedNote } from "~/components/blocks/PageHero";
import { ProcessList } from "~/components/blocks/ProcessList";
import { ProjectsSection } from "~/components/blocks/Projects";
import { AboutBlock, ControlSection, CtaBand, DirectionGrid, FaqSection, FixedPriceSection, MonolithGrid, SiteNowSection } from "~/components/blocks/sections";
import { ButtonLink, Disclaimer, Eyebrow, T, TextLink } from "~/components/ui/primitives";
import { H2, STAGE_TEXT, Section, SectionHead, TitledSection } from "~/components/ui/section";
import { useI18n } from "~/i18n/context";
import { PAGE_META } from "~/content/pages/meta";
import { HOME_ABOUT, HOME_FAQ, HOME_FIXED_PRICE_TITLE, HOME_FOREIGN, HOME_HERO, HOME_PROCESS, HOME_SERVICES } from "~/content/pages/home";
import { HOME_DIRECTION_DETAILS, HOME_STATS } from "~/content/pages/misc";
import { seo } from "~/lib/meta";

// Фон героя — самый крупный элемент первого экрана (LCP): грузим его сразу, до CSS (ONEZ-22).
export const links = () => [
  { rel: "preload", as: "image", type: "image/webp", href: "/assets/onez-construction-hero-m.webp", media: "(max-width: 640px)", fetchPriority: "high" as const },
  { rel: "preload", as: "image", type: "image/webp", href: "/assets/onez-construction-hero.webp", media: "(min-width: 641px)", fetchPriority: "high" as const },
];

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META[""], { faq: HOME_FAQ });

function HomeHero() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="hero-title" className="relative min-h-[760px] overflow-hidden bg-ink-hero tab:min-h-[max(760px,100svh)]">
      <div aria-hidden="true" className="hero-image" />
      <div aria-hidden="true" className="hero-grid" />
      {/* Минимальная, а не фиксированная высота: длинный заголовок (грузинский) растит блок вниз, а не уходит под шапку. */}
      <div className="container-site relative z-1 flex min-h-[940px] flex-col justify-end pt-[120px] pb-[35px] xs:min-h-[760px] tab:min-h-[max(760px,100svh)] tab:pt-40 tab:pb-11">
        {/* Без .reveal: первый экран виден сразу, не ждёт загрузки JS — иначе h1 (LCP) рисуется на ~3 с позже (ONEZ-22). */}
        <div className="mb-8 w-full xs:mb-12 tab:mb-[clamp(45px,7vh,78px)] tab:w-[84%] wide:w-[min(880px,75%)]">
          <Eyebrow>{HOME_HERO.eyebrow}</Eyebrow>
          <T as="h1" id="hero-title" className="max-w-[980px] text-[clamp(36px,11.2vw,52px)] leading-[1.03] sm:text-[clamp(42px,8.2vw,68px)] sm:leading-[.98] tab:text-[clamp(48px,6.1vw,96px)]">
            {HOME_HERO.title}
          </T>
          {/* BLUF (свод v3, правило 12): в первом абзаце — кто, что и почём, во втором — условия. */}
          <T as="p" className="bluf mt-6 w-full max-w-[620px] text-[15px] leading-[1.55] text-paper-dim sm:mt-[30px] sm:text-[clamp(16px,1.35vw,20px)]">
            {HOME_HERO.lead}
          </T>
          <T as="p" className="bluf mt-4 mb-6 w-full max-w-[620px] text-[14px] leading-[1.6] text-muted sm:mb-8 sm:text-[15px]">
            {HOME_HERO.more}
          </T>
          <UpdatedNote slug="" />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="kontakty#form" arrow="up" className="max-sm:w-full">Получить расчёт</ButtonLink>
            <ButtonLink to="obekty" variant="ghost" className="max-sm:w-full">Смотреть объекты</ButtonLink>
          </div>
        </div>
        <HeroStats
          items={HOME_STATS}
          note={
            <div aria-hidden="true" className="hero-note hidden items-end justify-end gap-[15px] text-[9px] leading-none font-semibold tracking-[.08em] text-muted tab:flex">
              <span>41°43′N</span>
              <span>44°47′E</span>
              <i />
            </div>
          }
        />
      </div>
      <a href="#fixed-price" className="scroll-cue absolute right-[26px] bottom-[42px] z-2 hidden items-center gap-3 text-[9px] tracking-[.12em] text-muted uppercase tab:flex">
        <span className="relative h-px w-[52px] bg-faint" />
        {t("Листайте")}
      </a>
    </section>
  );
}

/** Крупная цифра «06 этапов» справа от заголовка. */
function StepsCount() {
  return (
    <p className="flex items-end font-display text-[60px] leading-[.8] font-medium tracking-[-.09em] text-teal sm:text-[clamp(80px,10vw,144px)]">
      06
      <T as="small" className="ml-[18px] hidden font-body text-[9px] leading-none font-bold tracking-[.14em] text-muted uppercase sm:inline">этапов</T>
    </p>
  );
}

export default function Home() {
  return (
    <>
      <HomeHero />
      <FixedPriceSection title={HOME_FIXED_PRICE_TITLE} bg="panel" size="lg" id="fixed-price" rule prices />
      <TitledSection bg="dark" id="services" eyebrow={HOME_SERVICES.eyebrow} title={HOME_SERVICES.title} intro={HOME_SERVICES.intro} size="lg">
        <DirectionGrid details={HOME_DIRECTION_DETAILS} />
        <MonolithGrid />
      </TitledSection>
      <Section bg="panel" id="process">
        <SectionHead eyebrow={HOME_PROCESS.eyebrow} title={HOME_PROCESS.title} size="lg" className="items-start sm:items-end" aside={<StepsCount />} />
        <ProcessList />
        <Disclaimer>{HOME_PROCESS.disclaimer}</Disclaimer>
        <TextLink to="process">{HOME_PROCESS.link}</TextLink>
      </Section>
      <ProjectsSection id="projects" eyebrow="Форматы объектов" title="Объекты" filters cta limitMobile />
      <SiteNowSection id="site-now" bg="panel" />
      <ControlSection bg="dark" size="lg" />
      <AboutBlock
        bg="panel"
        eyebrow={HOME_ABOUT.eyebrow}
        title={HOME_ABOUT.title}
        lead={HOME_ABOUT.lead}
        text={HOME_ABOUT.text}
        caption={HOME_ABOUT.caption}
        photoLabel={HOME_ABOUT.photoLabel}
        link={["komanda", HOME_ABOUT.link]}
      />
      <FaqSection id="faq" title="Что спрашивают<br><em>до договора?</em>" items={HOME_FAQ} />
      <CtaBand id="foreign" to="build-in-georgia" label={HOME_FOREIGN.label} variant="outline">
        <div>
          <Eyebrow>{HOME_FOREIGN.eyebrow}</Eyebrow>
          <H2 size="band">{HOME_FOREIGN.title}</H2>
          <T as="p" className={`${STAGE_TEXT} mt-3.5`}>{HOME_FOREIGN.text}</T>
        </div>
      </CtaBand>
      <ContactSection />
    </>
  );
}
