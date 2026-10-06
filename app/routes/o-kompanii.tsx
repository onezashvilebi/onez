import type { MetaFunction } from "react-router";
import { ContactSection } from "~/components/blocks/ContactSection";
import { PageHero, UpdatedNote } from "~/components/blocks/PageHero";
import { AboutBlock, ControlSection, FaqSection, SiteNowSection } from "~/components/blocks/sections";
import { Checklist, FeatureGrid, SpecList, TeamGrid } from "~/components/ui/lists";
import { TextLink } from "~/components/ui/primitives";
import { TitledSection } from "~/components/ui/section";
import { RESPONSIBILITIES } from "~/content/company";
import { TEAM } from "~/content/team";
import { COMPANY_FAQ, COMPANY_LEAD, COMPANY_MORE, COMPANY_PHILOSOPHY, COMPANY_RESOURCES, COMPANY_TEAM } from "~/content/pages/misc";
import { PAGE_META } from "~/content/pages/meta";
import { seo } from "~/lib/meta";
import { crumbs } from "~/logic/routing";
import { ADDRESS, LEGAL_NAME_RU, TAX_ID } from "~/site/contacts";

export const meta: MetaFunction = (args) =>
  seo(args, ...PAGE_META["o-kompanii"], { faq: COMPANY_FAQ });

export default function OKompanii() {
  return (
    <>
      <PageHero eyebrow="О компании" title="Строим своим<br><em>составом</em>" lead={COMPANY_LEAD} more={COMPANY_MORE} crumbs={crumbs("О компании")}>
        <UpdatedNote slug="o-kompanii" />
      </PageHero>
      <AboutBlock
        bg="panel"
        eyebrow="История"
        title="С 2014 года<br><em>в монолите</em>"
        lead="Начинали с частных домов, сегодня строим жилые корпуса и производственные комплексы по всей Грузии."
        text="Мы не собираем команду заново под каждый объект. Штат монолитчиков, инженеров и снабженцев работает вместе годами, поэтому мы точно знаем свою производительность и себестоимость."
        caption="Основатель Георгий Онезашвили на площадке в Крцаниси · 15.09.2026"
        photoLabel="Основатель ONEZA Construction Георгий Онезашвили (справа, в чёрном) на армированной плите перекрытия, площадка в Крцаниси, Тбилиси"
      />
      <SiteNowSection />
      <TitledSection eyebrow="Философия" title="Как и для чего<br><em>строит ONEZA</em>" intro={COMPANY_PHILOSOPHY.intro}>
        <Checklist items={COMPANY_PHILOSOPHY.items} />
      </TitledSection>
      <TitledSection bg="dark" eyebrow="Ресурсы" title="Что у нас<br><em>своё</em>" intro="Собственные ресурсы — причина, по которой мы можем фиксировать цену и срок.">
        <FeatureGrid items={COMPANY_RESOURCES} />
      </TitledSection>
      <TitledSection eyebrow="Ответственность" title="Зоны ответственности<br><em>на каждом объекте</em>" intro="Роли разделены так, чтобы проект, площадка, сроки и поставки оставались под отдельным контролем.">
        <FeatureGrid items={RESPONSIBILITIES} />
      </TitledSection>
      {/* Шесть руководителей; полный состав — на /komanda. Люди в content/team.ts пока типовые (ONEZ-78). */}
      <TitledSection bg="dark" eyebrow={COMPANY_TEAM.eyebrow} title={COMPANY_TEAM.title} intro={COMPANY_TEAM.intro}>
        <TeamGrid items={TEAM.slice(0, 6)} />
        <TextLink to="komanda">Вся команда</TextLink>
      </TitledSection>
      {/* Реквизиты видимы на странице, а не только в JSON-LD: договор подписывает юрлицо, и заказчик должен видеть, какое (ONEZ-78, правило 48 свода). */}
      <TitledSection eyebrow="Реквизиты" title="Кто отвечает<br><em>по договору?</em>" intro="Договор, гарантия и акты приёмки подписываются от лица зарегистрированной в Грузии компании.">
        <SpecList items={[["Юридическое лицо", LEGAL_NAME_RU], ["Идентификационный код", TAX_ID], ["Офис", ADDRESS], ["Гарантия на конструктив", "10 лет, условие в договоре"]]} />
      </TitledSection>
      <ControlSection bg="dark" />
      <FaqSection items={COMPANY_FAQ} eyebrow="Вопросы о компании" title="Что спрашивают<br><em>о подрядчике?</em>" bg="panel" />
      <ContactSection title="Познакомимся<br><em>на вашем участке</em>" />
    </>
  );
}
