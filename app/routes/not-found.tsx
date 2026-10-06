import { data, type MetaFunction } from "react-router";
import { ButtonLink, Eyebrow, T, TextLink } from "~/components/ui/primitives";
import { seo } from "~/lib/meta";

// Отдаётся Worker'ом с кодом 404 для любого адреса, которого нет в сборке.
export function loader() {
  return data(null, { status: 404 });
}

export const meta: MetaFunction = (args) => seo(args, "Страница не найдена", "Такой страницы нет. Возможно, адрес изменился после обновления сайта.", { noindex: true });

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-end bg-ink-hero">
      <div aria-hidden="true" className="hero-grid" />
      <div className="container-site relative pt-40 pb-20">
        <Eyebrow>Ошибка 404</Eyebrow>
        <T as="h1" className="text-[clamp(36px,6vw,88px)] leading-[.98]">{"Страница<br><em>не найдена</em>"}</T>
        <T as="p" className="mt-6 mb-8 max-w-[620px] text-paper-dim">Такой страницы нет. Возможно, адрес изменился после обновления сайта.</T>
        <ButtonLink to="" variant="outline">На главную</ButtonLink>
        {/* Полезные ссылки вместо тупика (свод v3, правило 43): хабы сайта. */}
        <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:gap-8">
          <TextLink to="uslugi" align="start" reveal={false}>Услуги</TextLink>
          <TextLink to="cena" align="start" reveal={false}>Стоимость строительства дома в Тбилиси за м²</TextLink>
          <TextLink to="proverka-uchastka" align="start" reveal={false}>Проверка участка перед покупкой</TextLink>
        </div>
      </div>
    </section>
  );
}
