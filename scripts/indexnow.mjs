#!/usr/bin/env node
// IndexNow — один POST, который слушают сразу Bing и Яндекс (Google протокол не
// поддерживает). Bing — источник веб-поиска ChatGPT и Copilot, поэтому новые и
// изменённые страницы быстрее попадают и в ответы ИИ.
//
// Владение подтверждает файл public/<ключ>.txt (INDEXNOW_KEY в .env; в файле
// тот же ключ). Ключ сгенерировать: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
//
//   node scripts/indexnow.mjs                       — все URL из https://onez.ge/sitemap.xml
//   node scripts/indexnow.mjs <url> [<url2> ...]    — только перечисленные
//
// Успех — 200 или 202 (IndexNow принимает пачку и проверяет ключ уже у себя).
// Запускается в конце `npm run deploy`; отдельный запуск не вредит: повторная
// отправка того же списка — норма протокола.
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HOST = 'onez.ge'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..')

async function loadKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim()
  try {
    const env = await readFile(join(rootDir, '.env'), 'utf8')
    const m = env.match(/^INDEXNOW_KEY=["']?([0-9a-f]{32})["']?/m)
    if (m) return m[1]
  } catch {}
  // .env нет на этой машине — ключ равен имени файла подтверждения в public/.
  const files = await readdir(join(rootDir, 'web/public')).catch(() => [])
  const found = files.find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  return found ? found.slice(0, 32) : ''
}

const key = await loadKey()
if (!key) {
  console.error('INDEXNOW_KEY не задан в .env и файла web/public/<ключ>.txt нет — см. шапку скрипта')
  process.exit(1)
}
const keyFile = await readFile(join(rootDir, 'web/public', `${key}.txt`), 'utf8').catch(() => null)
if (keyFile === null || keyFile.trim() !== key) {
  console.error(`web/public/${key}.txt отсутствует или содержит не ключ — IndexNow отклонит запрос`)
  process.exit(1)
}

let urlList = process.argv.slice(2)
if (urlList.length === 0) {
  const res = await fetch(`https://${HOST}/sitemap.xml`, { headers: { 'cache-control': 'no-cache' } })
  if (!res.ok) {
    console.error(`sitemap.xml: HTTP ${res.status}`)
    process.exit(1)
  }
  urlList = [...(await res.text()).matchAll(/<loc>\s*(.*?)\s*<\/loc>/g)].map((m) => m[1].trim())
}
const bad = urlList.filter((u) => { try { return new URL(u).hostname !== HOST } catch { return true } })
if (bad.length) {
  console.error(`URL не с домена ${HOST}: ${bad.join(', ')}`)
  process.exit(1)
}
if (urlList.length === 0) {
  console.error('нечего отправлять')
  process.exit(1)
}

let failed = false
for (let i = 0; i < urlList.length; i += 10000) {
  const chunk = urlList.slice(i, i + 10000)
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: chunk }),
  })
  const ok = res.status === 200 || res.status === 202
  console.log(`IndexNow: ${chunk.length} URL → ${res.status} ${res.statusText}${ok ? '' : ' — ' + (await res.text()).slice(0, 300)}`)
  if (!ok) failed = true
}
process.exit(failed ? 1 : 0)
