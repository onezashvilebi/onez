import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Переменные сборки: Workers Builds сообщает ветку (WORKERS_CI_BRANCH), сборка тестового воркера задаёт CF_CONFIG=wrangler.test.jsonc.
const buildEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

// Защита от захвата боевых доменов: воркер с «test» в имени, собранный по боевому конфигу (без CF_CONFIG),
// получил бы домены onez.ge из wrangler.jsonc. Такая сборка останавливается, деплоя не будет.
const ciName = buildEnv.WRANGLER_CI_OVERRIDE_NAME ?? "";
if (/test/i.test(ciName) && !buildEnv.CF_CONFIG) {
  throw new Error(`Сборка остановлена: воркер «${ciName}» собирается по боевому конфигу и забрал бы домены onez.ge. Добавьте CF_CONFIG=wrangler.test.jsonc в команду сборки или удалите тестовый воркер.`);
}

// Пререндер поднимает воркер локально. Удалённые биндинги (Workers AI) требуют
// сессии к API Cloudflare — без токена и сети сборка падала, а CI и коллега без
// доступа не могли ни собрать сайт, ни увидеть счётчик переводов (ONEZ-48).
// Чат с ИИ работает на задеплоенном воркере; в сборке биндинг AI не нужен.
export default defineConfig({
  // Ветка, из которой собран сайт: админка пишет правки текстов в неё же (workers/texts.ts).
  define: { __BUILD_BRANCH__: JSON.stringify(buildEnv.WORKERS_CI_BRANCH ?? "") },
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" }, remoteBindings: false, ...(buildEnv.CF_CONFIG ? { configPath: buildEnv.CF_CONFIG } : {}) }), tailwindcss(), reactRouter()],
  resolve: { alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) } },
});
