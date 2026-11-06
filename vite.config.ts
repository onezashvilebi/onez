import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Сборка тестового воркера задаёт CF_CONFIG=wrangler.test.jsonc; у боевого воркера переменной нет.
const testConfig = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.CF_CONFIG;

// Пререндер поднимает воркер локально. Удалённые биндинги (Workers AI) требуют
// сессии к API Cloudflare — без токена и сети сборка падала, а CI и коллега без
// доступа не могли ни собрать сайт, ни увидеть счётчик переводов (ONEZ-48).
// Чат с ИИ работает на задеплоенном воркере; в сборке биндинг AI не нужен.
export default defineConfig({
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" }, remoteBindings: false, ...(testConfig ? { configPath: testConfig } : {}) }), tailwindcss(), reactRouter()],
  resolve: { alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) } },
});
