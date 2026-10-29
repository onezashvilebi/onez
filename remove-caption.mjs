// Removes the caption under the founder photo ("... on the site in Krtsanisi") everywhere.
// Run once from the project root:  node remove-caption.mjs
// ASCII-only on purpose: the file encoding does not matter.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const files = new Map();
const notes = [];
function load(path) {
  if (!files.has(path)) {
    const raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
    files.set(path, { crlf: raw.includes("\r\n"), text: raw.replace(/\r\n/g, "\n") });
  }
  return files.get(path);
}
function stop(msg) {
  console.error("STOP: " + msg + " Nothing was changed.");
  process.exit(1);
}
function swap(path, re, make, label) {
  const f = load(path);
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  const hits = f.text.match(g)?.length ?? 0;
  if (hits === 0) {
    notes.push("skipped (nothing found, maybe already done): " + path + " - " + label);
    return;
  }
  if (hits !== 1) stop(path + " (" + label + "): found " + hits + " matches instead of 1.");
  f.text = f.text.replace(g, (...m) => (typeof make === "function" ? make(...m) : make));
}

// the component: caption becomes optional and is drawn only when it is given
const SEC = "app/components/blocks/sections.tsx";
swap(SEC, /caption: string; photoLabel: string;/, "caption?: string; photoLabel: string;", "caption prop type");
swap(
  SEC,
  /(?<!caption && )<p className="mt-3 text-\[10px\] text-muted">\{t\(caption\)\}<\/p>/,
  '{caption && <p className="mt-3 text-[10px] text-muted">{t(caption)}</p>}',
  "caption output",
);

// home page: the text and the prop
swap("app/content/pages/home.ts", /(export const HOME_ABOUT = \{[^}]*?)  caption: "[^"\n]*",\n/, (m, head) => head, "home caption text");
swap("app/routes/home.tsx", /[ \t]*caption=\{HOME_ABOUT\.caption\}\n/, "", "home caption prop");

// "About company" page
swap("app/routes/o-kompanii.tsx", /[ \t]*caption="[^"\n]*"\n/, "", "about page caption");

for (const [path, f] of files) writeFileSync(path, f.crlf ? f.text.replace(/\n/g, "\r\n") : f.text);

// leftovers
const LEFT = /\u041e\u0441\u043d\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0413\u0435\u043e\u0440\u0433\u0438\u0439 \u041e\u043d\u0435\u0437\u0430\u0448\u0432\u0438\u043b\u0438 \u043d\u0430 \u043f\u043b\u043e\u0449\u0430\u0434\u043a\u0435/;
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = dir + "/" + e.name;
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name) && !p.startsWith("app/i18n/")) out.push(p);
  }
  return out;
}
const left = [];
for (const p of walk("app")) {
  readFileSync(p, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
    const m = line.match(LEFT);
    if (m) left.push(p + ":" + (i + 1) + ": ..." + line.slice(Math.max(0, m.index - 20), m.index + 110) + "...");
  });
}
console.log("DONE. Changed " + files.size + " files.");
for (const n of notes) console.log("NOTE: " + n);
if (left.length) {
  console.log("INFO: the founder is still named in these texts (photo description for screen readers, team card):");
  for (const l of left) console.log("  " + l);
}
