import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { METRIKA_ID } from "~/site/contacts";

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

/** Цель Яндекс.Метрики. Новая кнопка связи → новая цель (закон 8). */
export function goal(name: "phone_click" | "whatsapp_click" | "telegram_click" | "facebook_click" | "email_click" | "lead_form" | "lead_sent" | "chat_open" | "chat_message" | "chat_phone", params?: Record<string, string>) {
  window.ym?.(METRIKA_ID, "reachGoal", name, params);
}

/** Хиты при переходах внутри SPA и цели кликов по каналам связи (закон 8). */
export function useMetrika() {
  const { pathname, search } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false; // первый хит отправляет сам счётчик
      return;
    }
    window.ym?.(METRIKA_ID, "hit", pathname + search);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.href.startsWith("tel:")) goal("phone_click");
      else if (link.href.startsWith("mailto:")) goal("email_click");
      else if (link.hostname === "wa.me") goal("whatsapp_click");
      else if (link.hostname === "t.me") goal("telegram_click");
      else if (/(^|\.)facebook\.com$/.test(link.hostname)) goal("facebook_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

/** Выбор посетителя по аналитике (ONEZ-45): "no" — счётчик не запускается. */
export const CONSENT_KEY = "onez_consent";

// Только боевой домен и не замеры скорости: локальная сборка (127.0.0.1, localhost)
// попадала в Метрику как «переходы из кэша», Lighthouse — как прямые визиты (21.09.2026).
export const METRIKA_SNIPPET = `(function(){if(location.hostname!=="onez.ge"||/Chrome-Lighthouse|HeadlessChrome/.test(navigator.userAgent)||navigator.webdriver){window["disableYaCounter${METRIKA_ID}"]=true;return}
var c=null;try{c=localStorage.getItem("${CONSENT_KEY}")}catch(e){}
if(c==="no"){window["disableYaCounter${METRIKA_ID}"]=true;return}
function start(){for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src.indexOf("mc.yandex.ru/metrika/tag.js")>-1)return}
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${METRIKA_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:c==="yes"})}
function defer(){"requestIdleCallback"in window?requestIdleCallback(start,{timeout:4000}):setTimeout(start,1500)}
document.readyState==="complete"?defer():addEventListener("load",defer)})();`;
