import { createRequestHandler } from "react-router";
import { handleAdmin, type AdminEnv } from "./admin";
import { handleChat, type ChatEnv } from "./chat";
import { handleLead, type LeadEnv } from "./lead";

export { ChatStore } from "./chat";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

/** Дублирует заголовки безопасности из public/_headers — они на ответы Worker не действуют. */
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/lead") return handleLead(request, env);
    if (url.pathname.startsWith("/api/chat/")) return handleChat(request, env, ctx);
    if (url.pathname.startsWith("/api/admin/")) return handleAdmin(request, env);

    // www — тот же сайт под вторым адресом: Google видит дубль хоста, а ссылки
    // и показы делятся между двумя именами. Ведём на апекс 301-м (ONEZ-57).
    // Правилом зоны это не сделано, поэтому решает Worker: оба имени указывают
    // на него custom domain-маршрутами.
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    // Канонический адрес главных RU/EN — без слеша (ONEZ-46, run_worker_first в wrangler.jsonc).
    // Пререндер React Router запрашивает страницы как http://localhost/ru/ — ему отдаём
    // страницу, иначе в сборку вместо ru/index.html запишется заглушка редиректа.
    if ((url.pathname === "/ru/" || url.pathname === "/en/") && url.hostname !== "localhost") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // Адреса старого сайта: /uslugi.html, /ru/index.html → /uslugi, /ru. Ссылки из
    // поиска и мессенджеров не должны вести на 404.
    if (url.pathname.endsWith(".html")) {
      url.pathname = url.pathname.replace(/(?:\/index)?\.html$/, "") || "/";
      return Response.redirect(url.toString(), 301);
    }

    const response = await requestHandler(request);
    const headers = new Headers(response.headers);
    // Тот же набор, что у статики в public/_headers: 404 и редиректы отдаёт Worker (ONEZ-54).
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
} satisfies ExportedHandler<LeadEnv & ChatEnv & AdminEnv>;
