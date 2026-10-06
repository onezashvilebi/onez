import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ConsentBanner } from "~/components/blocks/ConsentBanner";
import { LiveChat } from "~/components/blocks/LiveChat";
import { Footer, MobileCta } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { I18nProvider } from "~/i18n/context";
import { dictFor } from "~/i18n/dict.server";
import { useReveal } from "~/hooks/reveal";
import { langFromPath, slugFromPath } from "~/site/pages";

/** Раскладка языка: словарь, шапка, подвал, мобильный CTA. */
export function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  // Словарь сужается до строк этой страницы (app/i18n/pages.json): целиком он
  // весит 293 КБ и уезжает в HTML каждого адреса ka и en (ONEZ-54).
  return { lang: langFromPath(pathname), dict: dictFor(langFromPath(pathname), slugFromPath(pathname)) };
}

export default function LocaleLayout() {
  const { lang, dict } = useLoaderData<typeof loader>();
  useReveal();
  return (
    <I18nProvider value={{ lang, dict }}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* Кнопка внизу экрана — теперь чат (закон 6: WhatsApp и телефон уже в шапке). */}
      <LiveChat />
      <ConsentBanner />
      <MobileCta />
    </I18nProvider>
  );
}
