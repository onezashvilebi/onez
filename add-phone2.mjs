// Adds a second phone number (own WhatsApp + Telegram) to every place where the
// first one is shown. Run once from the project root: node add-phone2.mjs
// The script only contains ASCII, so the file encoding does not matter.
import { readFileSync, writeFileSync } from "node:fs";

// ================= SETTINGS: edit these 4 lines =================
const PHONE_2 = "+995 511 330 091"; // second number, same format as the first
const TELEGRAM_2 = "https://t.me/onezconstruction"; // "" = link by number (t.me/+995...), or put https://t.me/username
const TAG_1 = "GEO"; // caption under/next to the FIRST number (existing one)
const TAG_2 = "RUS/EN"; // caption for the SECOND number
// ================================================================

const digits = PHONE_2.replace(/\D/g, "");
if (/X/i.test(PHONE_2) || digits.length < 9) {
  console.error("STOP: put your real second number into PHONE_2 at the top of this file.");
  process.exit(1);
}
const TEL_2 = `tel:+${digits}`;
const WHATSAPP_2 = `https://wa.me/${digits}`;
const TG_2 = TELEGRAM_2 || `https://t.me/+${digits}`;

const files = new Map(); // path -> { crlf, text }
function load(path) {
  if (!files.has(path)) {
    const raw = readFileSync(path, "utf8");
    files.set(path, { crlf: raw.includes("\r\n"), text: raw.replace(/\r\n/g, "\n") });
  }
  return files.get(path);
}
/** Replace exactly one match (string or regex); otherwise stop without writing anything. */
function swap(path, find, make, label) {
  const f = load(path);
  const re = typeof find === "string" ? new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g") : new RegExp(find.source, find.flags.includes("g") ? find.flags : find.flags + "g");
  const hits = f.text.match(re)?.length ?? 0;
  if (hits !== 1) {
    console.error(`STOP: ${path} (${label}): found ${hits} matches instead of 1. Nothing was changed.`);
    process.exit(1);
  }
  f.text = f.text.replace(re, (...m) => (typeof make === "function" ? make(...m) : make));
}

// ---------- 1. app/site/contacts.ts ----------
const C = "app/site/contacts.ts";
if (load(C).text.includes("PHONE_2")) {
  console.error("STOP: the second number is already added (PHONE_2 found in contacts.ts).");
  process.exit(1);
}
swap(
  C,
  /export const TELEGRAM = "[^"]*";\n/,
  (m) =>
    m +
    `/** Second number: own WhatsApp and Telegram. */\n` +
    `export const PHONE_2 = ${JSON.stringify(PHONE_2)};\n` +
    `export const TEL_2 = ${JSON.stringify(TEL_2)};\n` +
    `export const WHATSAPP_2 = ${JSON.stringify(WHATSAPP_2)};\n` +
    `export const TELEGRAM_2 = ${JSON.stringify(TG_2)};\n`,
  "constants",
);
swap(
  C,
  /  telegram: \{ href: TELEGRAM, label: "Telegram" \},\n/,
  (m) =>
    m +
    `  phone2: { href: TEL_2, label: PHONE_2 },\n` +
    `  whatsapp2: { href: WHATSAPP_2, label: "WhatsApp" },\n` +
    `  telegram2: { href: TELEGRAM_2, label: "Telegram" },\n`,
  "channels",
);
swap(
  C,
  /export type Channel = keyof typeof CHANNELS;\n/,
  (m) =>
    m +
    `\n/** Numbers for contact blocks: language caption and channels of each number. */\n` +
    `export const NUMBERS = [\n` +
    `  { tag: ${JSON.stringify(TAG_1)}, phone: "phone", whatsapp: "whatsapp", telegram: "telegram" },\n` +
    `  { tag: ${JSON.stringify(TAG_2)}, phone: "phone2", whatsapp: "whatsapp2", telegram: "telegram2" },\n` +
    `] as const;\n`,
  "numbers",
);

// ---------- 2. contact block (home and other pages) ----------
const CS = "app/components/blocks/ContactSection.tsx";
swap(CS, /import type \{ LeadRow \} from "~\/logic\/lead";\n/, (m) => m + `import { NUMBERS } from "~/site/contacts";\n`, "import");
swap(
  CS,
  /          <p className="mt-7 flex flex-col gap-1\.5">\n[\s\S]*?\n          <\/p>\n/,
  `          {NUMBERS.map((n, i) => (
            <p key={n.phone} className={i ? "mt-5 flex flex-col gap-1.5" : "mt-7 flex flex-col gap-1.5"}>
              <span className="flex flex-wrap items-baseline gap-x-3">
                <ContactLink channel={n.phone} className="text-[28px] font-semibold tracking-[-.01em]" />
                <span className="text-[12px] font-bold tracking-[.08em] uppercase opacity-60">{n.tag}</span>
              </span>
              <span className="text-[15px] opacity-75 [&_a]:underline [&_a]:underline-offset-3">
                <ContactLink channel={n.whatsapp} /> \u00b7 <ContactLink channel={n.telegram} />
                {i === 0 && languages && \` \u00b7 \${languages}\`}
              </span>
            </p>
          ))}
`,
  "contact block",
);

// ---------- 3. contacts page ----------
const K = "app/routes/kontakty.tsx";
swap(K, /import \{ ADDRESS, COORDS, MAP_LINK \} from "~\/site\/contacts";/, `import { ADDRESS, COORDS, MAP_LINK, NUMBERS } from "~/site/contacts";`, "import");
swap(
  K,
  /            <p>\n {14}<ContactLink channel="phone"[^\n]*\n            <\/p>\n            <p className="mt-\[26px\] flex flex-wrap gap-2\.5">\n[\s\S]*?\n            <\/p>\n/,
  `            {NUMBERS.map((n, i) => (
              <div key={n.phone} className={i ? "mt-9" : undefined}>
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <ContactLink channel={n.phone} className="font-display text-[clamp(26px,2.6vw,40px)] leading-[1.1] font-semibold tracking-[-.04em] hover:text-teal" />
                  <span className="text-[12px] font-bold tracking-[.08em] text-faint uppercase">{n.tag}</span>
                </p>
                <p className="mt-[26px] flex flex-wrap gap-2.5">
                  <ContactLink channel={n.whatsapp} className={MESSENGER}><Icon name="whatsapp" />WhatsApp</ContactLink>
                  <ContactLink channel={n.telegram} className={MESSENGER}><Icon name="telegram" />Telegram</ContactLink>
                  {i === NUMBERS.length - 1 && <ContactLink channel="facebook" className={MESSENGER}><Icon name="facebook" />Facebook</ContactLink>}
                </p>
              </div>
            ))}
`,
  "contacts block",
);

// ---------- 4. footer ----------
const F = "app/components/layout/Footer.tsx";
swap(F, /import \{ LEGAL_NAME_RU, TAX_ID \} from "~\/site\/contacts";/, `import { LEGAL_NAME_RU, NUMBERS, TAX_ID } from "~/site/contacts";`, "import");
swap(
  F,
  /            <ContactLink channel="phone" className=\{FOOTER_CONTACT\} \/>\n/,
  `            {NUMBERS.map((n) => (
              <p key={n.phone} className="flex items-baseline gap-2">
                <ContactLink channel={n.phone} className={FOOTER_CONTACT} />
                <span className="text-[10px] font-bold tracking-[.08em] text-muted uppercase">{n.tag}</span>
              </p>
            ))}
`,
  "phone",
);
swap(
  F,
  /            <ContactLink channel="whatsapp" className="mt-\[18px\][^\n]*\{(t\("[^"]*"\))\}[^\n]*<\/ContactLink>\n/,
  (m, label) => `            {NUMBERS.map((n, i) => (
              <ContactLink key={n.whatsapp} channel={n.whatsapp} className={i ? "mt-2.5 text-[11px] font-bold tracking-[.08em] text-teal uppercase" : "mt-[18px] text-[11px] font-bold tracking-[.08em] text-teal uppercase"}><span className="inline-flex items-center gap-1.5">{${label}} \u00b7 {n.tag}<Icon name="arrow-up-right" className="size-3.5" /></span></ContactLink>
            ))}
`,
  "whatsapp",
);

// ---------- 5. header (desktop + mobile menu) ----------
const H = "app/components/layout/Header.tsx";
swap(H, /import \{ ButtonLink, ContactLink \} from "~\/components\/ui\/primitives";\n/, (m) => m + `import { NUMBERS } from "~/site/contacts";\n`, "import");
swap(
  H,
  /          <ContactLink channel="phone" className="hidden text-xs font-semibold whitespace-nowrap wide:inline" \/>\n/,
  `          {NUMBERS.map((n, i) => (
            <span key={n.phone} className={i ? "hidden items-baseline gap-1.5 min-[1400px]:flex" : "hidden items-baseline gap-1.5 wide:flex"}>
              <ContactLink channel={n.phone} className="text-xs font-semibold whitespace-nowrap" />
              <span className="text-[9px] font-bold tracking-[.08em] text-faint uppercase">{n.tag}</span>
            </span>
          ))}
`,
  "desktop phone",
);
swap(
  H,
  /          "fixed inset-0 -z-1 flex flex-col justify-between bg-ink-deep px-\(--pad\) pt-\[105px\] pb-\[86px\] /,
  (m) => m.replace('"fixed inset-0', '"fixed inset-0 overflow-y-auto'),
  "menu scroll",
);
swap(
  H,
  /        <ButtonLink to="kontakty#form" className="w-full">[^<]*<\/ButtonLink>\n/,
  (m) => `        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {NUMBERS.map((n) => (
              <div key={n.phone} className="flex items-center justify-between gap-3 border-t border-line pt-3">
                <p className="flex items-baseline gap-2">
                  <ContactLink channel={n.phone} className="font-display text-xl font-medium tracking-[-.03em]" />
                  <span className="text-[10px] font-bold tracking-[.08em] text-faint uppercase">{n.tag}</span>
                </p>
                <div className="flex gap-2">
                  <ContactLink channel={n.whatsapp} ariaLabel={t(CHANNEL_ICON.whatsapp[1])} className="grid size-9 place-items-center rounded-full border border-line text-paper/85"><Icon name="whatsapp" className="size-4" /></ContactLink>
                  <ContactLink channel={n.telegram} ariaLabel={t(CHANNEL_ICON.telegram[1])} className="grid size-9 place-items-center rounded-full border border-line text-paper/85"><Icon name="telegram" className="size-4" /></ContactLink>
                </div>
              </div>
            ))}
          </div>
          ${m.trim()}
        </div>
`,
  "mobile menu",
);

// ---------- 6. search engines and the AI chat ----------
const M = "app/lib/meta.ts";
swap(M, /OPENING_HOURS, PHONE, SITE_URL, TAX_ID \} from "~\/site\/contacts"/, `OPENING_HOURS, PHONE, PHONE_2, SITE_URL, TAX_ID } from "~/site/contacts"`, "import");
swap(M, /    telephone: PHONE\.replace\(\/\\s\/g, ""\),\n    email: EMAIL,\n    image:/, (m) => m.replace('PHONE.replace(/\\s/g, "")', '[PHONE, PHONE_2].map((p) => p.replace(/\\s/g, ""))'), "json-ld");

const L = "app/routes/llms.ts";
swap(L, /OPENING_HOURS, PHONE, SITE_URL, WHATSAPP \} from "~\/site\/contacts"/, `OPENING_HOURS, PHONE, PHONE_2, SITE_URL, WHATSAPP, WHATSAPP_2 } from "~/site/contacts"`, "import");
swap(L, "${PHONE} (${WHATSAPP})", "${PHONE} (${WHATSAPP}), ${PHONE_2} (${WHATSAPP_2})", "contacts line");

const P = "workers/chat-prompt.ts";
swap(P, /import \{ EMAIL, PHONE \} from "~\/site\/contacts";/, `import { EMAIL, NUMBERS, PHONE, PHONE_2 } from "~/site/contacts";`, "import");
swap(P, "WhatsApp ${PHONE},", "WhatsApp ${PHONE} (${NUMBERS[0].tag}), ${PHONE_2} (${NUMBERS[1].tag}),", "prompt");

// ---------- write everything only if all edits succeeded ----------
for (const [path, f] of files) writeFileSync(path, f.crlf ? f.text.replace(/\n/g, "\r\n") : f.text);
console.log(`DONE. Changed ${files.size} files: ${[...files.keys()].join(", ")}`);
