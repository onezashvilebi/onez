import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero } from "~/components/blocks/PageHero";
import { Checklist, SpecList, Timeline } from "~/components/ui/lists";
import { Icon } from "~/components/ui/icons";
import { ContactLink, Eyebrow, buttonClass } from "~/components/ui/primitives";
import { Section, SplitSection, TitledSection } from "~/components/ui/section";
import { useI18n } from "~/i18n/context";
import { PAGE_META } from "~/content/pages/meta";
import { KONTAKTY_NEXT } from "~/content/pages/misc";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";
import { ADDRESS, COORDS, MAP_LINK } from "~/site/contacts";

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META["kontakty"]);

const MESSENGER = buttonClass("outline", "sm", "min-h-[46px] gap-2.5 text-xs");

export default function Kontakty() {
  const { t, lang } = useI18n();
  return (
    <>
      <PageHero eyebrow="Контакты" title="Обсудим<br><em>ваш объект</em>" lead="Позвоните, напишите в мессенджер или оставьте заявку. Ответим в течение рабочего часа." crumbs={crumbs("Контакты")} />
      <Section containerClassName="grid items-stretch gap-10 lg:grid-cols-[5fr_7fr] lg:gap-[6%]">
        <div className="reveal">
          <Eyebrow>Связаться</Eyebrow>
          <address className="not-italic">
            <p>
              <ContactLink channel="phone" className="font-display text-[clamp(26px,2.6vw,40px)] leading-[1.1] font-semibold tracking-[-.04em] hover:text-teal" />
            </p>
            <p className="mt-[26px] flex flex-wrap gap-2.5">
              <ContactLink channel="whatsapp" className={MESSENGER}><Icon name="whatsapp" />WhatsApp</ContactLink>
              <ContactLink channel="telegram" className={MESSENGER}><Icon name="telegram" />Telegram</ContactLink>
              <ContactLink channel="facebook" className={MESSENGER}><Icon name="facebook" />Facebook</ContactLink>
            </p>
            <SpecList compact reveal={false} items={[["Офис", <a href={MAP_LINK} target="_blank" rel="noopener" className="hover:text-teal">{t(ADDRESS)}</a>], ["Встречи", "На участке или по предварительной договорённости"], ["Почта", <ContactLink channel="email" />], ["Режим работы", "Круглосуточно: заявки принимаем в любое время"], ["Выезд на участок", "По всей Грузии, база — Тбилиси"]]} />
          </address>
        </div>
        {/* Живая карта вместо декоративной сетки: адрес и точка берутся из site/contacts.ts (закон 14).
            loading="lazy" — карта грузится только при прокрутке до неё и не трогает LCP (закон 10). */}
        <div className="reveal flex min-h-[420px] flex-col border border-line">
          <iframe
            src={`https://maps.google.com/maps?q=${COORDS.lat},${COORDS.lng}&z=16&hl=${lang}&output=embed`}
            title={t("Офис ONEZA на карте")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[360px] w-full flex-1 border-0"
          />
          <a href={MAP_LINK} target="_blank" rel="noopener" className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 text-xs text-muted transition-colors hover:text-teal">
            <span className="normal-case">{t(ADDRESS)}</span>
            <span className="flex-none font-bold tracking-[.1em] uppercase">{t("Маршрут ↗")}</span>
          </a>
        </div>
      </Section>
      <SplitSection bg="dark" eyebrow={KONTAKTY_NEXT.eyebrow} title={KONTAKTY_NEXT.title}>
        <Timeline items={KONTAKTY_NEXT.steps} />
      </SplitSection>
      <TitledSection eyebrow="Для расчёта" title={KONTAKTY_NEXT.prepTitle}>
        <Checklist items={KONTAKTY_NEXT.prep} />
      </TitledSection>
      <ContactSection title="Заявка<br><em>на расчёт</em>" text="Заполните форму, и мы свяжемся с вами, чтобы уточнить вводные и назначить встречу." />
    </>
  );
}
