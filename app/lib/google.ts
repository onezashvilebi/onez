import { GA_ID, GADS_ID, GADS_LEAD_LABEL } from "~/site/contacts";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Ключ выбора посетителя — тот же, что CONSENT_KEY в lib/metrika.ts.
const CONSENT = "onez_consent";

/** Заявка для рекламы: отправленная форма и телефон или ник, оставленный в чате. */
const LEAD_GOALS = ["lead_sent", "chat_phone"];

/** Те же события, что в Метрике: GA4 получает все, Google Ads — только заявки. Без тега или после отказа ничего не делает. */
export function googleGoal(name: string, params?: Record<string, string>) {
  const gtag = window.gtag;
  if (!gtag) return;
  try {
    if (localStorage.getItem(CONSENT) === "no") return;
  } catch {
    // хранилище закрыто — отказ негде было сохранить
  }
  const lead = LEAD_GOALS.includes(name);
  if (GA_ID) gtag("event", lead ? "generate_lead" : name, { ...params, goal: name });
  if (GADS_ID && GADS_LEAD_LABEL && lead) gtag("event", "conversion", { send_to: `${GADS_ID}/${GADS_LEAD_LABEL}` });
}

/** Отказ в баннере: останавливаем отправку на этой же странице, до перезагрузки. */
export function disableGoogle() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
  window.gtag = undefined;
}

// Как METRIKA_SNIPPET: только боевой домен, не Lighthouse, не после отказа; тег грузится после load.
export const GOOGLE_SNIPPET = `(function(){var G="${GA_ID}",A="${GADS_ID}";if(!G&&!A)return;
if(location.hostname!=="onez.ge"||/Chrome-Lighthouse|HeadlessChrome/.test(navigator.userAgent)||navigator.webdriver)return;
var c=null;try{c=localStorage.getItem("${CONSENT}")}catch(e){}
if(c==="no")return;
window.dataLayer=window.dataLayer||[];
window.gtag=function(){window.dataLayer.push(arguments)};
function start(){if(!window.gtag)return;var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+(G||A);document.head.appendChild(s);
gtag("js",new Date());if(G)gtag("config",G);if(A)gtag("config",A)}
function defer(){"requestIdleCallback"in window?requestIdleCallback(start,{timeout:4000}):setTimeout(start,1500)}
document.readyState==="complete"?defer():addEventListener("load",defer)})();`;