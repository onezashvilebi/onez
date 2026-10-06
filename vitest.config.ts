import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Только чистая логика: заявка, контакты, карта страниц и сборка сообщения в
// Telegram (ONEZ-49). Компоненты и воркер целиком здесь не поднимаются.
export default defineConfig({
  resolve: { alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) } },
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
});
