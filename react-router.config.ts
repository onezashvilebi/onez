import type { Config } from "@react-router/dev/config";
import { allPaths } from "./app/site/pages";

export default {
  ssr: true,
  // Все страницы трёх языков — готовый HTML в Workers Assets. Worker отвечает
  // только на то, чего нет в сборке: 404, старые адреса *.html, будущий приём заявок.
  prerender: () => [...allPaths(), "/sitemap.xml", "/llms.txt", "/admin"],
} satisfies Config;
