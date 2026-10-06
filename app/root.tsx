import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLocation, useRouteError } from "react-router";
import { useEffect } from "react";
import { Icon } from "./components/ui/icons";
// ?inline — весь CSS (~15 КБ gzip) встраивается в <head>: отдельный файл стилей даже первым
// в <head> качался 1,4 с, деля канал с 18 modulepreload-скриптами (~165 КБ), а без стилей
// браузер не рисует ничего — белый экран (ONEZ-22, трейс Lighthouse 12.09.2026).
// В клиентский бандл эта строка не нужна: `import.meta.env.SSR` — константа сборки,
// в браузерной ветке остаётся "" и rollup выбрасывает CSS из root-*.js (ONEZ-55).
import appCssInline from "./app.css?inline";
import { captureAttribution } from "./lib/attribution";
import { BOOT_SCRIPT, markHydrated } from "./lib/boot";
import { METRIKA_SNIPPET, useMetrika } from "./lib/metrika";
import { langFromPath } from "./site/pages";

// Шрифты — со своего домена (@font-face в app.css, файлы в public/fonts): без
// блокирующего стиля Google Fonts и лишних соединений на первом экране (ONEZ-22).
export const links = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  // Карта сайта для ИИ-ассистентов: файл берут, если на него сослаться из <head> (свод v3, правило 3).
  { rel: "alternate", type: "text/markdown", href: "/llms.txt" },
];

/**
 * Шрифт заголовка h1 (элемент LCP) на языке страницы: браузер узнаёт о нём из
 * <head>, а не после CSS — заголовок перестаёт ждать шрифт (ONEZ-22). Грузинский
 * h1 рисуется Noto Sans Georgian: в Unbounded нет грузинских букв.
 */
const H1_FONT = {
  ka: "/fonts/noto-sans-georgian-v48-georgian.woff2",
  ru: "/fonts/unbounded-v12-cyrillic.woff2",
  en: "/fonts/unbounded-v12-latin.woff2",
} as const;

const APP_CSS = import.meta.env.SSR ? appCssInline : "";

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  // Админка — внутренний инструмент: без счётчика Метрики.
  const admin = pathname.startsWith("/admin");
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* suppressHydrationWarning: в браузере __html пустой, React не трогает уже отрисованный CSS. */}
        <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: APP_CSS }} />
        <meta name="theme-color" content="#101416" />
        <meta name="yandex-verification" content="dd5e3b81fd97eb15" />
        <meta name="google-site-verification" content="ykm0pr9TjFbZkjQnJ6sm1Y4jRwP1g0vl2mqlxkQ93GI" />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <link rel="preload" href={H1_FONT[lang]} as="font" type="font/woff2" crossOrigin="anonymous" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {!admin && <script dangerouslySetInnerHTML={{ __html: METRIKA_SNIPPET }} />}
      </body>
    </html>
  );
}

export default function App() {
  useMetrika();
  useEffect(captureAttribution, []);
  useEffect(markHydrated, []);
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  if (import.meta.env.DEV) console.error(error);
  return (
    <main className="container-site grid min-h-svh place-content-center gap-4 text-center">
      <p className="font-display text-7xl text-teal">{status}</p>
      <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-teal">ONEZA Construction <Icon name="arrow-right" /></a>
    </main>
  );
}
