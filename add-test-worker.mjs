#!/usr/bin/env node
// add-test-worker.mjs - adds wrangler.test.jsonc (test Worker config without production domains) and lets vite.config.ts use it.
//
// What it does (all or nothing):
//   1. checks the project folder and every anchor in every file it will change;
//   2. builds the result on a COPY in the temp folder and checks it
//      (JSON parses, TypeScript syntax is valid when node_modules exists);
//   3. only then writes the real files, each through a temp file + rename;
//      if anything fails, every file is restored from a backup.
// It never overwrites an existing file that differs from what it expects:
// it stops and tells you which one.
//
// Usage (PowerShell, from the project folder C:\Users\...\onez):
//   node apply-texts.mjs --check     only check, write nothing
//   node apply-texts.mjs             apply
// The file is ASCII-only on purpose; Russian text inside is written as \u escapes.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";


function stripJsonc(s) {
  let out = "";
  let inStr = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const n = s[i + 1];
    if (inStr) {
      out += c;
      if (c === "\\") out += s[++i];
      else if (c === '"') inStr = false;
    } else if (c === '"') {
      inStr = true;
      out += c;
    } else if (c === "/" && n === "/") {
      while (i < s.length && s[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && n === "*") {
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
      i++;
    } else out += c;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");
}
function makeTestConfig() {
  try {
    const cfg = JSON.parse(stripJsonc(fs.readFileSync(path.join(process.cwd(), "wrangler.jsonc"), "utf8")));
    cfg.name = "onez-test";
    cfg.workers_dev = true;
    delete cfg.routes;
    delete cfg.route;
    if (!cfg.main || !cfg.assets) throw new Error("unexpected wrangler.jsonc");
    return "// \u0422\u0435\u0441\u0442\u043e\u0432\u044b\u0439 \u0432\u043e\u0440\u043a\u0435\u0440 onez-test: \u0442\u0430 \u0436\u0435 \u0441\u0431\u043e\u0440\u043a\u0430, \u043d\u043e \u0411\u0415\u0417 \u0431\u043e\u0435\u0432\u044b\u0445 \u0434\u043e\u043c\u0435\u043d\u043e\u0432 (routes) \u0438 \u0441\u043e \u0441\u0432\u043e\u0438\u043c \u0430\u0434\u0440\u0435\u0441\u043e\u043c workers.dev.\n// \u0421\u043e\u0431\u0438\u0440\u0430\u0435\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u043a\u043e\u0433\u0434\u0430 \u0432 \u043a\u043e\u043c\u0430\u043d\u0434\u0435 \u0441\u0431\u043e\u0440\u043a\u0438 \u0441\u0442\u043e\u0438\u0442 CF_CONFIG=wrangler.test.jsonc (\u0441\u043c. vite.config.ts);\n// \u0431\u043e\u0435\u0432\u043e\u0439 \u0432\u043e\u0440\u043a\u0435\u0440 onez \u044d\u0442\u043e\u0442 \u0444\u0430\u0439\u043b \u043d\u0435 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442. \u0421\u043e\u0437\u0434\u0430\u043d \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u043c add-test-worker.mjs \u0438\u0437 wrangler.jsonc.\n" + JSON.stringify(cfg, null, 2) + "\n";
  } catch {
    return "{}\n"; // not the project folder: the preflight check below stops the script
  }
}
const FILES = [{ path: "wrangler.test.jsonc", text: makeTestConfig() }];

const EDITS = [
  {
    path: "vite.config.ts",
    pairs: [
      [
        "import { defineConfig } from \"vite\";",
        "import { defineConfig } from \"vite\";\n\n// \u0421\u0431\u043e\u0440\u043a\u0430 \u0442\u0435\u0441\u0442\u043e\u0432\u043e\u0433\u043e \u0432\u043e\u0440\u043a\u0435\u0440\u0430 \u0437\u0430\u0434\u0430\u0451\u0442 CF_CONFIG=wrangler.test.jsonc; \u0443 \u0431\u043e\u0435\u0432\u043e\u0433\u043e \u0432\u043e\u0440\u043a\u0435\u0440\u0430 \u043f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439 \u043d\u0435\u0442.\nconst testConfig = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.CF_CONFIG;",
      ],
      [
        "remoteBindings: false })",
        "remoteBindings: false, ...(testConfig ? { configPath: testConfig } : {}) })",
      ],
    ],
  },
];


const CHECK_ONLY = process.argv.includes("--check");
const ROOT = process.cwd();
const say = (m) => console.log(m);
const die = (m) => {
  console.error("\nSTOP: " + m + "\nNothing was changed.");
  process.exit(1);
};
const abs = (rel, base = ROOT) => path.join(base, ...rel.split("/"));
const ascii = (s) => JSON.stringify(s).replace(/[\u0080-\uffff]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
const lf = (s) => s.replace(/\r\n/g, "\n");

// ---- 1. Preflight ----
try {
  const pkg = JSON.parse(fs.readFileSync(abs("package.json"), "utf8"));
  if (pkg.name !== "onez-web" || !fs.existsSync(abs("app/i18n/context.tsx"))) throw new Error("not the project");
} catch {
  die("run this from the project root folder (the one with package.json and app/), e.g. C:\\Users\\lukam\\Documents\\GitHub\\onez");
}

const plan = new Map(); // rel -> { before, after, eol, isNew }
const notes = [];

for (const f of FILES) {
  const target = abs(f.path);
  if (fs.existsSync(target)) {
    if (lf(fs.readFileSync(target, "utf8")) === f.text) notes.push("already in place: " + f.path);
    else die("file already exists and is different: " + f.path + "\nMove or rename it, then run again (I do not overwrite your files).");
  } else plan.set(f.path, { before: null, after: f.text, eol: "\n", isNew: true });
}

for (const e of EDITS) {
  const target = abs(e.path);
  if (!fs.existsSync(target)) die("file not found: " + e.path + " (is this the right branch / folder?)");
  const raw = fs.readFileSync(target, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  let text = lf(raw);
  const before = text;
  for (const [oldS, newS] of e.pairs) {
    const count = text.split(oldS).length - 1;
    // The new text usually contains the old one, so "already applied" must be checked first.
    if (text.includes(newS)) notes.push("already applied in " + e.path);
    else if (count === 1) text = text.replace(oldS, () => newS);
    else die("cannot place a change in " + e.path + ": expected text found " + count + " time(s).\nLooks like the file was changed after this patch was made. Start of the text I look for: " + ascii(oldS.slice(0, 70)));
  }
  if (text !== before) plan.set(e.path, { before: raw, after: text, eol, isNew: false });
}

if (plan.size === 0) {
  say("Everything is already applied. Nothing to do.");
  process.exit(0);
}

// ---- 2. Check on a copy ----
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const copyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "onez-texts-copy-"));
for (const [rel, p] of plan) {
  const target = abs(rel, copyRoot);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, p.after.replace(/\n/g, p.eol));
}
let ts = null;
try {
  ts = createRequire(abs("package.json"))("typescript");
} catch {
  notes.push("typescript not installed here: syntax check skipped (run npm install, then npm test and npm run typecheck)");
}
for (const [rel, p] of plan) {
  const copy = fs.readFileSync(abs(rel, copyRoot), "utf8");
  if (lf(copy) !== p.after) die("self-check failed: the copy of " + rel + " differs from the plan");
  if (rel.endsWith(".json")) {
    try {
      JSON.parse(copy);
    } catch {
      die("self-check failed: invalid JSON in " + rel);
    }
  }
  if (ts && /\.(ts|tsx)$/.test(rel)) {
    const res = ts.transpileModule(copy, { fileName: rel, reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022 } });
    const bad = (res.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
    if (bad.length) die("self-check failed: syntax error in " + rel + ": " + ts.flattenDiagnosticMessageText(bad[0].messageText, " "));
  }
}
fs.rmSync(copyRoot, { recursive: true, force: true });

say("Check passed. Files in the plan:");
for (const [rel, p] of plan) say("  " + (p.isNew ? "new      " : "changed  ") + rel);
for (const n of notes) say("  note: " + n);
if (CHECK_ONLY) {
  say("\n--check: nothing was written.");
  process.exit(0);
}

// ---- 3. Apply, atomically ----
const backup = path.join(os.tmpdir(), "onez-texts-backup-" + stamp);
const written = [];
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 8);
try {
  for (const [rel, p] of plan) {
    if (p.before !== null) {
      const b = abs(rel, backup);
      fs.mkdirSync(path.dirname(b), { recursive: true });
      fs.writeFileSync(b, p.before);
    }
  }
  let n = 0;
  for (const [rel, p] of plan) {
    const target = abs(rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const tmp = target + ".onez-tmp";
    fs.writeFileSync(tmp, p.after.replace(/\n/g, p.eol));
    fs.renameSync(tmp, target);
    written.push(rel);
    if (process.env.ONEZ_FAIL_AFTER && ++n === Number(process.env.ONEZ_FAIL_AFTER)) throw new Error("test failure injected");
  }
} catch (err) {
  console.error("\nERROR while writing: " + (err && err.message ? err.message : err) + "\nRolling back...");
  for (const rel of written) {
    const p = plan.get(rel);
    try {
      if (p.isNew) fs.rmSync(abs(rel), { force: true });
      else fs.copyFileSync(abs(rel, backup), abs(rel));
    } catch (e2) {
      console.error("could not restore " + rel + ": " + e2.message + " (original is in " + backup + ")");
    }
  }
  for (const rel of plan.keys()) fs.rmSync(abs(rel) + ".onez-tmp", { force: true });
  die("write failed, files restored.");
}

say("\nDone. " + plan.size + " file(s) written. Backup of the old versions: " + backup);
for (const [rel, p] of plan) say("  " + rel + "  " + hash(p.after));
say("\nNext: commit in GitHub Desktop on the admin-panel branch, push, then create the onez-test Worker in Cloudflare.");
