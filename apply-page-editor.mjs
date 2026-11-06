#!/usr/bin/env node
// apply-page-editor.mjs - adds the visual "Pages" editor section to the onez admin panel (and keeps Worker variables on the test Worker).
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

const FILES = [
  {
    path: "app/lib/page-editor-dom.ts",
    text: [
      "// DOM-\u0447\u0430\u0441\u0442\u044c \u0440\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446 (\u0440\u0430\u0437\u0434\u0435\u043b \u00ab\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b\u00bb \u0430\u0434\u043c\u0438\u043d\u043a\u0438). \u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0432",
      "// iframe \u0431\u0435\u0437 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432 (sandbox=\"allow-same-origin\"): \u044d\u0442\u043e \u0433\u043e\u0442\u043e\u0432\u044b\u0439 \u043f\u0440\u0435\u0440\u0435\u043d\u0434\u0435\u0440, \u0431\u0435\u0437",
      "// \u0433\u0438\u0434\u0440\u0430\u0446\u0438\u0438, \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0438 \u0438 \u0447\u0430\u0442\u0430, \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u0435\u0433\u043e \u043c\u043e\u0436\u043d\u043e \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u0442\u044c \u00ab\u0441\u043d\u0430\u0440\u0443\u0436\u0438\u00bb.",
      "// \u0410\u0434\u043c\u0438\u043d\u043a\u0430 \u043d\u0430\u0445\u043e\u0434\u0438\u0442 \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435 \u0442\u0435\u043a\u0441\u0442\u044b \u0438\u0437 \u0441\u043b\u043e\u0432\u0430\u0440\u044f \u2014 \u043f\u043e \u0441\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u044e \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0438 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430",
      "// \u0441 \u0442\u0435\u043a\u0441\u0442\u043e\u043c \u0441\u0442\u0440\u043e\u043a\u0438 \u2014 \u0438 \u043f\u043e\u043c\u0435\u0447\u0430\u0435\u0442 \u0438\u0445 \u0430\u0442\u0440\u0438\u0431\u0443\u0442\u043e\u043c data-onez-edit. \u041a\u043b\u0438\u043a \u043f\u043e \u043f\u043e\u043c\u0435\u0447\u0435\u043d\u043d\u043e\u043c\u0443",
      "// \u0442\u0435\u043a\u0441\u0442\u0443 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u0442\u0440\u0438 \u044f\u0437\u044b\u043a\u0430 \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u043e\u043a\u0438 \u0432 \u043f\u0430\u043d\u0435\u043b\u0438 \u0441\u043f\u0440\u0430\u0432\u0430. \u0424\u0430\u0439\u043b \u043d\u0435 \u0437\u043d\u0430\u0435\u0442 \u043f\u0440\u043e React:",
      "// \u0442\u043e\u043b\u044c\u043a\u043e \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442 \u0438 \u0444\u0443\u043d\u043a\u0446\u0438\u0438.",
      "",
      "export type Flag = { el: HTMLElement; keys: string[] };",
      "export type Block = { el: HTMLElement; label: string };",
      "",
      "/** \u0422\u0435\u0433\u0438, \u0432\u043d\u0443\u0442\u0440\u0438 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u043c\u043e\u0436\u0435\u0442 \u043b\u0435\u0436\u0430\u0442\u044c \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0430 \u0441\u0442\u0440\u043e\u043a\u0438 (<br>, <em>, \u0441\u0441\u044b\u043b\u043a\u0430 \u0438 \u0442. \u043f.). */",
      "const INLINE = new Set([\"br\", \"em\", \"b\", \"strong\", \"i\", \"a\", \"span\", \"small\", \"sup\", \"sub\", \"wbr\"]);",
      "const SKIP = new Set([\"script\", \"style\", \"noscript\", \"template\", \"textarea\", \"input\", \"select\", \"option\", \"iframe\", \"canvas\", \"video\", \"picture\", \"img\", \"svg\"]);",
      "",
      "/** \u041f\u0440\u0438\u0432\u043e\u0434\u0438\u0442 \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0443 \u043a \u0432\u0438\u0434\u0443 \u0434\u043b\u044f \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f: \u0431\u0435\u0437 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432 React, \u043f\u0440\u043e\u0431\u0435\u043b\u044b \u0441\u0445\u043b\u043e\u043f\u043d\u0443\u0442\u044b. */",
      "export const normalize = (html: string) => html.replace(/<!--[\\s\\S]*?-->/g, \"\").replace(/\\s+/g, \" \").trim();",
      "",
      "/** \u0420\u0430\u0437\u043c\u0435\u0442\u043a\u0430 \u0432 \u0442\u043e\u043c \u0432\u0438\u0434\u0435, \u043a\u0430\u043a \u0435\u0451 \u043e\u0442\u0434\u0430\u0451\u0442 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 (`&` \u2192 `&amp;`, `<br/>` \u2192 `<br>`): \u0442\u0430\u043a \u0441\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0442\u044c \u0447\u0435\u0441\u0442\u043d\u043e. */",
      "export function canonical(doc: Document, html: string): string {",
      "  const tpl = doc.createElement(\"template\");",
      "  tpl.innerHTML = html;",
      "  return normalize(tpl.innerHTML);",
      "}",
      "",
      "function isCandidate(el: Element): boolean {",
      "  if (SKIP.has(el.localName) || el.closest(\"svg, script, style, noscript, template\")) return false;",
      "  for (const child of Array.from(el.children)) if (!INLINE.has(child.localName)) return false;",
      "  return Boolean(el.textContent?.trim());",
      "}",
      "",
      "/**",
      " * \u041f\u043e\u043c\u0435\u0447\u0430\u0435\u0442 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b, \u0447\u044c\u0451 \u0441\u043e\u0434\u0435\u0440\u0436\u0438\u043c\u043e\u0435 \u0441\u043e\u0432\u043f\u0430\u043b\u043e \u0441 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u043c\u044b\u043c \u0442\u0435\u043a\u0441\u0442\u043e\u043c \u043a\u0430\u043a\u043e\u0439-\u0442\u043e \u0441\u0442\u0440\u043e\u043a\u0438.",
      " * `index`: \u043d\u043e\u0440\u043c\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043d\u0430\u044f \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0430 \u2192 \u0440\u0443\u0441\u0441\u043a\u0438\u0435 \u043a\u043b\u044e\u0447\u0438 \u0441\u0442\u0440\u043e\u043a (\u043a\u043b\u044e\u0447\u0435\u0439 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e, \u0435\u0441\u043b\u0438",
      " * \u0434\u0432\u0430 \u0440\u0443\u0441\u0441\u043a\u0438\u0445 \u0442\u0435\u043a\u0441\u0442\u0430 \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u044f\u0442\u0441\u044f \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e). \u0418\u0434\u0451\u043c \u0441 \u043a\u043e\u043d\u0446\u0430: \u0432\u043b\u043e\u0436\u0435\u043d\u043d\u044b\u0439 \u044d\u043b\u0435\u043c\u0435\u043d\u0442",
      " * \u043f\u043e\u043c\u0435\u0447\u0430\u0435\u0442\u0441\u044f \u0440\u0430\u043d\u044c\u0448\u0435 \u0440\u043e\u0434\u0438\u0442\u0435\u043b\u044f, \u0430 \u0440\u043e\u0434\u0438\u0442\u0435\u043b\u044c \u0441 \u0443\u0436\u0435 \u043f\u043e\u043c\u0435\u0447\u0435\u043d\u043d\u044b\u043c \u043f\u043e\u0442\u043e\u043c\u043a\u043e\u043c \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430\u0435\u0442\u0441\u044f.",
      " */",
      "export function scanEditable(doc: Document, index: Map<string, string[]>): Flag[] {",
      "  const flags: Flag[] = [];",
      "  const all = Array.from(doc.body.querySelectorAll<HTMLElement>(\"*\"));",
      "  for (let i = all.length - 1; i >= 0; i--) {",
      "    const el = all[i]!;",
      "    if (!isCandidate(el) || el.querySelector(\"[data-onez-edit]\")) continue;",
      "    const keys = index.get(normalize(el.innerHTML));",
      "    if (!keys) continue;",
      "    el.setAttribute(\"data-onez-edit\", \"\");",
      "    flags.push({ el, keys });",
      "  }",
      "  return flags.reverse();",
      "}",
      "",
      "const STYLE_ID = \"onez-edit-style\";",
      "const CSS = `",
      "[data-onez-edit]{cursor:pointer!important}",
      "html.onez-show [data-onez-edit]{outline:1px dashed rgba(84,201,184,.75);outline-offset:3px}",
      "[data-onez-edit]:hover{outline:2px solid #54c9b8!important;outline-offset:3px}",
      "[data-onez-active]{outline:2px solid #e07a3c!important;outline-offset:3px;background-color:rgba(224,122,60,.14)!important}",
      "[data-onez-flash]{outline:3px solid #54c9b8!important;outline-offset:-3px}",
      "`;",
      "",
      "/** \u0420\u0435\u0436\u0438\u043c \u043f\u0440\u0430\u0432\u043a\u0438: \u043f\u043e\u0434\u0441\u0432\u0435\u0442\u043a\u0430, \u043a\u043b\u0438\u043a \u0432\u044b\u0431\u0438\u0440\u0430\u0435\u0442 \u0442\u0435\u043a\u0441\u0442, \u0430 \u043b\u044e\u0431\u044b\u0435 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u044b \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438 \u0444\u043e\u0440\u043c \u0433\u0430\u0441\u044f\u0442\u0441\u044f. */",
      "export function installEditUi(doc: Document, onPick: (el: HTMLElement) => void): () => void {",
      "  doc.getElementById(STYLE_ID)?.remove();",
      "  const style = doc.createElement(\"style\");",
      "  style.id = STYLE_ID;",
      "  style.textContent = CSS;",
      "  doc.head.appendChild(style);",
      "  const click = (ev: Event) => {",
      "    ev.preventDefault();",
      "    ev.stopPropagation();",
      "    const el = (ev.target as Element | null)?.closest<HTMLElement>(\"[data-onez-edit]\");",
      "    if (el) onPick(el);",
      "  };",
      "  const block = (ev: Event) => ev.preventDefault();",
      "  doc.addEventListener(\"click\", click, true);",
      "  doc.addEventListener(\"auxclick\", block, true);",
      "  doc.addEventListener(\"submit\", block, true);",
      "  return () => {",
      "    doc.removeEventListener(\"click\", click, true);",
      "    doc.removeEventListener(\"auxclick\", block, true);",
      "    doc.removeEventListener(\"submit\", block, true);",
      "    style.remove();",
      "  };",
      "}",
      "",
      "export function setActive(doc: Document, el: HTMLElement | null) {",
      "  for (const old of Array.from(doc.querySelectorAll(\"[data-onez-active]\"))) old.removeAttribute(\"data-onez-active\");",
      "  el?.setAttribute(\"data-onez-active\", \"\");",
      "}",
      "",
      "export function showAll(doc: Document, on: boolean) {",
      "  doc.documentElement.classList.toggle(\"onez-show\", on);",
      "}",
      "",
      "/** \u0412\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0443 \u0432 \u044d\u043b\u0435\u043c\u0435\u043d\u0442, \u0442\u043e\u043b\u044c\u043a\u043e \u0435\u0441\u043b\u0438 \u043e\u043d\u0430 \u0438\u0437\u043c\u0435\u043d\u0438\u043b\u0430\u0441\u044c (\u0438\u043d\u0430\u0447\u0435 \u043f\u0435\u0440\u0435\u0441\u0431\u043e\u0440\u043a\u0430 DOM \u043d\u0430 \u043a\u0430\u0436\u0434\u044b\u0439 \u0441\u0438\u043c\u0432\u043e\u043b). */",
      "const applied = new WeakMap<HTMLElement, string>();",
      "export function applyHtml(el: HTMLElement, html: string) {",
      "  if (!applied.has(el)) applied.set(el, el.innerHTML);",
      "  if (applied.get(el) === html) return;",
      "  el.innerHTML = html;",
      "  applied.set(el, html);",
      "}",
      "/** \u0418\u0441\u0445\u043e\u0434\u043d\u0430\u044f \u0440\u0430\u0437\u043c\u0435\u0442\u043a\u0430 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430, \u043a\u0430\u043a\u043e\u0439 \u0435\u0451 \u043e\u0442\u0434\u0430\u043b \u0441\u0435\u0440\u0432\u0435\u0440. */",
      "const originals = new WeakMap<HTMLElement, string>();",
      "export function rememberOriginal(el: HTMLElement) {",
      "  if (!originals.has(el)) originals.set(el, el.innerHTML);",
      "}",
      "export const originalHtml = (el: HTMLElement) => originals.get(el) ?? el.innerHTML;",
      "",
      "/** \u041a\u0440\u0443\u043f\u043d\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b (\u0432\u0435\u0440\u0445\u043d\u0438\u0435 <section> \u0432 <main>): \u043e\u0441\u043d\u043e\u0432\u0430 \u0434\u043b\u044f \u0431\u0443\u0434\u0443\u0449\u0435\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0431\u043b\u043e\u043a\u0430\u043c\u0438. */",
      "export function listBlocks(doc: Document): Block[] {",
      "  const root = doc.querySelector(\"main\") ?? doc.body;",
      "  const out: Block[] = [];",
      "  for (const section of Array.from(root.querySelectorAll<HTMLElement>(\"section\"))) {",
      "    if (section.parentElement?.closest(\"section\")) continue;",
      "    // <br> \u0432 \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043a\u0435 \u043d\u0435 \u0434\u043e\u043b\u0436\u0435\u043d \u0441\u043a\u043b\u0435\u0438\u0432\u0430\u0442\u044c \u0441\u043b\u043e\u0432\u0430: \u00ab\u0434\u043e\u043c\u0430<br>\u0440\u0430\u0441\u0442\u0451\u0442\u00bb \u2192 \u00ab\u0434\u043e\u043c\u0430 \u0440\u0430\u0441\u0442\u0451\u0442\u00bb.",
      "    const heading = section.querySelector(\"h1, h2, h3\")?.cloneNode(true) as HTMLElement | undefined;",
      "    for (const br of Array.from(heading?.querySelectorAll(\"br\") ?? [])) br.replaceWith(\" \");",
      "    const label = (heading?.textContent ?? section.getAttribute(\"aria-label\") ?? section.id ?? \"\").replace(/\\s+/g, \" \").trim().slice(0, 60);",
      "    out.push({ el: section, label: label || `\u0411\u043b\u043e\u043a ${out.length + 1}` });",
      "  }",
      "  return out;",
      "}",
      "",
      "export function flashBlock(el: HTMLElement) {",
      "  el.scrollIntoView({ behavior: \"smooth\", block: \"start\" });",
      "  el.setAttribute(\"data-onez-flash\", \"\");",
      "  setTimeout(() => el.removeAttribute(\"data-onez-flash\"), 1200);",
      "}",
    ].join("\n") + "\n",
  },
  {
    path: "app/hooks/useTextsStore.ts",
    text: [
      "import { useCallback, useEffect, useMemo, useState } from \"react\";",
      "import { TEXT_LANGS, checkText, type Changes, type Overrides, type TextCheck, type TextLang } from \"~/lib/texts-check\";",
      "",
      "// \u0414\u0430\u043d\u043d\u044b\u0435 \u0438 \u043f\u0440\u0430\u0432\u043a\u0438 \u0434\u043b\u044f \u0440\u0430\u0437\u0434\u0435\u043b\u0430 \u00ab\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b\u00bb: \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0441\u0442\u0440\u043e\u043a \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 (workers/texts.ts),",
      "// \u043d\u0435\u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u043a\u0438, \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0438 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f \u043e\u0434\u043d\u0438\u043c \u043a\u043e\u043c\u043c\u0438\u0442\u043e\u043c. \u0420\u0430\u0437\u0434\u0435\u043b \u00ab\u0422\u0435\u043a\u0441\u0442\u044b\u00bb \u0434\u0435\u0440\u0436\u0438\u0442",
      "// \u0441\u0432\u043e\u044e \u043a\u043e\u043f\u0438\u044e \u044d\u0442\u043e\u0439 \u043b\u043e\u0433\u0438\u043a\u0438, \u0447\u0442\u043e\u0431\u044b \u043e\u0431\u0430 \u0440\u0430\u0437\u0434\u0435\u043b\u0430 \u043c\u043e\u0436\u043d\u043e \u0431\u044b\u043b\u043e \u043c\u0435\u043d\u044f\u0442\u044c \u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e.",
      "",
      "export type Item = readonly [key: string, ka: string, en: string, pages: number];",
      "export type Group = { id: string; name: string; sub: string; ids: number[] };",
      "export type Github = { ok: boolean; error?: string; message?: string; repo: string; branch: string };",
      "export type Data = { configured: boolean; github: Github; groups: Group[]; items: Item[]; overrides: Overrides; sha: string | null; pending: boolean };",
      "export type Issue = { lang: TextLang; key: string; message: string };",
      "/** \u041d\u0435\u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u044b\u0435 \u043f\u0440\u0430\u0432\u043a\u0438: \u00ab\u044f\u0437\u044b\u043a:\u043d\u043e\u043c\u0435\u0440 \u0441\u0442\u0440\u043e\u043a\u0438\u00bb \u2192 \u043d\u043e\u0432\u044b\u0439 \u0442\u0435\u043a\u0441\u0442 (null \u2014 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0439). */",
      "export type Edits = Record<string, string | null>;",
      "export type Notice = { kind: \"ok\" | \"error\"; text: string } | null;",
      "export type FieldState = { value: string; base: string; changed: boolean; published: boolean; missing: boolean; errors: string[]; warnings: string[] };",
      "",
      "export const NET_ERROR = \"\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u044f\u0437\u044c \u0438 \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443.\";",
      "export const editKey = (lang: TextLang, idx: number) => `${lang}:${idx}`;",
      "export const baseOf = (item: Item, lang: TextLang) => (lang === \"ru\" ? item[0] : lang === \"ka\" ? item[1] : item[2]);",
      "export const messageOf = (e: unknown) => (e instanceof Error && /[\u0410-\u042f\u0430-\u044f\u0401\u0451]/.test(e.message) ? e.message : NET_ERROR);",
      "",
      "export async function call<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T & { error?: string; message?: string } }> {",
      "  const resp = await fetch(`/api/admin/texts${path}`, { ...init, headers: { \"content-type\": \"application/json\", ...init?.headers } });",
      "  if (resp.status === 401) throw new Error(\"\u0421\u0435\u0441\u0441\u0438\u044f \u0437\u0430\u043a\u043e\u043d\u0447\u0438\u043b\u0430\u0441\u044c. \u041e\u0431\u043d\u043e\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0438 \u0432\u043e\u0439\u0434\u0438\u0442\u0435 \u0437\u0430\u043d\u043e\u0432\u043e.\");",
      "  const body = (await resp.json().catch(() => ({}))) as T & { error?: string; message?: string };",
      "  return { status: resp.status, body };",
      "}",
      "",
      "export function useTextsStore() {",
      "  const [data, setData] = useState<Data | null>(null);",
      "  const [loadError, setLoadError] = useState(\"\");",
      "  const [edits, setEdits] = useState<Edits>({});",
      "  const [busy, setBusy] = useState(false);",
      "  const [notice, setNotice] = useState<Notice>(null);",
      "  const [issues, setIssues] = useState<Issue[]>([]);",
      "",
      "  const load = useCallback(async () => {",
      "    try {",
      "      const r = await call<Data>(\"\");",
      "      if (r.status !== 200) throw new Error(NET_ERROR);",
      "      setData(r.body);",
      "      setLoadError(\"\");",
      "    } catch (e) {",
      "      setLoadError(messageOf(e));",
      "    }",
      "  }, []);",
      "  useEffect(() => {",
      "    void load();",
      "  }, [load]);",
      "",
      "  const hasEdits = Object.keys(edits).length > 0;",
      "  useEffect(() => {",
      "    if (!hasEdits) return;",
      "    const warn = (e: BeforeUnloadEvent) => e.preventDefault();",
      "    window.addEventListener(\"beforeunload\", warn);",
      "    return () => window.removeEventListener(\"beforeunload\", warn);",
      "  }, [hasEdits]);",
      "",
      "  const onEdit = useCallback((idx: number, lang: TextLang, text: string) => setEdits((cur) => ({ ...cur, [editKey(lang, idx)]: text })), []);",
      "  const onReset = useCallback((idx: number, lang: TextLang) => setEdits((cur) => ({ ...cur, [editKey(lang, idx)]: null })), []);",
      "  const onUndo = useCallback((idx: number, lang: TextLang) => {",
      "    setEdits((cur) => {",
      "      const next = { ...cur };",
      "      delete next[editKey(lang, idx)];",
      "      return next;",
      "    });",
      "  }, []);",
      "",
      "  const checks = useMemo(() => {",
      "    const out: Record<string, TextCheck> = {};",
      "    if (!data) return out;",
      "    for (const [ek, value] of Object.entries(edits)) {",
      "      if (value === null) continue;",
      "      const [lang, idx] = ek.split(\":\") as [TextLang, string];",
      "      const item = data.items[Number(idx)];",
      "      if (item) out[ek] = checkText(lang, item[0], value);",
      "    }",
      "    return out;",
      "  }, [edits, data]);",
      "",
      "  /** \u0427\u0442\u043e \u0441\u0435\u0439\u0447\u0430\u0441 \u0432 \u043f\u043e\u043b\u0435: \u043d\u0435\u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u0430\u044f \u043f\u0440\u0430\u0432\u043a\u0430, \u0438\u043d\u0430\u0447\u0435 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043d\u0430\u044f \u0432 GitHub, \u0438\u043d\u0430\u0447\u0435 \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442. */",
      "  const field = useCallback(",
      "    (idx: number, lang: TextLang): FieldState => {",
      "      const item = data!.items[idx]!;",
      "      const base = baseOf(item, lang);",
      "      const live = data!.overrides[lang][item[0]];",
      "      const ek = editKey(lang, idx);",
      "      const edited = ek in edits;",
      "      const edit = edits[ek];",
      "      const value = edited ? (edit === null ? base : (edit ?? \"\")) : (live ?? base);",
      "      const check = edited && edit !== null ? checks[ek] : undefined;",
      "      return {",
      "        value,",
      "        base,",
      "        changed: edited && value.trim() !== (live ?? base),",
      "        published: live !== undefined,",
      "        missing: lang !== \"ru\" && !base && live === undefined && !(edited && value.trim()),",
      "        errors: check?.errors ?? [],",
      "        warnings: check?.warnings ?? [],",
      "      };",
      "    },",
      "    [data, edits, checks],",
      "  );",
      "",
      "  const changedCount = useMemo(() => {",
      "    if (!data) return 0;",
      "    return Object.keys(edits).filter((ek) => {",
      "      const [lang, idx] = ek.split(\":\") as [TextLang, string];",
      "      const item = data.items[Number(idx)];",
      "      if (!item) return false;",
      "      const edit = edits[ek];",
      "      const value = edit === null ? baseOf(item, lang) : (edit ?? \"\").trim();",
      "      return value !== (data.overrides[lang][item[0]] ?? baseOf(item, lang));",
      "    }).length;",
      "  }, [edits, data]);",
      "  const errorCount = Object.values(checks).filter((c) => c.errors.length).length;",
      "",
      "  const publish = useCallback(async () => {",
      "    if (!data || busy || !changedCount || errorCount) return;",
      "    if (!window.confirm(`\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c \u043f\u0440\u0430\u0432\u043e\u043a: ${changedCount}? \u041e\u043d\u0438 \u0443\u0439\u0434\u0443\u0442 \u0432 GitHub, \u0441\u0430\u0439\u0442 \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0435\u0441\u0431\u043e\u0440\u043a\u0438.`)) return;",
      "    const changes: Changes = {};",
      "    for (const [ek, value] of Object.entries(edits)) {",
      "      const [lang, idx] = ek.split(\":\") as [TextLang, string];",
      "      const item = data.items[Number(idx)];",
      "      if (item) (changes[lang] ??= {})[item[0]] = value;",
      "    }",
      "    setBusy(true);",
      "    setNotice(null);",
      "    setIssues([]);",
      "    try {",
      "      const r = await call<{ commit?: string; unchanged?: boolean; issues?: Issue[] }>(\"/publish\", { method: \"POST\", body: JSON.stringify({ baseSha: data.sha, changes }) });",
      "      if (r.status === 200) {",
      "        setEdits({});",
      "        setNotice({ kind: \"ok\", text: r.body.unchanged ? \"\u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0438\u0437\u043c\u0435\u043d\u0438\u043b\u043e\u0441\u044c: \u0432\u0441\u0435 \u0442\u0435\u043a\u0441\u0442\u044b \u0443\u0436\u0435 \u0442\u0430\u043a\u0438\u0435.\" : `\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043e (\u043a\u043e\u043c\u043c\u0438\u0442 ${r.body.commit?.slice(0, 7) ?? \"\"}). \u0421\u0430\u0439\u0442 \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 2\u20133 \u043c\u0438\u043d\u0443\u0442\u044b \u043f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0435\u0441\u0431\u043e\u0440\u043a\u0438; \u043f\u043e\u0442\u043e\u043c \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043c\u0430\u043a\u0435\u0442\u00bb.` });",
      "        await load();",
      "      } else {",
      "        setNotice({ kind: \"error\", text: r.body.message ?? NET_ERROR });",
      "        if (r.body.issues) setIssues(r.body.issues);",
      "        if (r.status === 409) await load();",
      "      }",
      "    } catch (e) {",
      "      setNotice({ kind: \"error\", text: messageOf(e) });",
      "    } finally {",
      "      setBusy(false);",
      "    }",
      "  }, [data, busy, changedCount, errorCount, edits, load]);",
      "",
      "  return { data, loadError, edits, setEdits, busy, notice, issues, hasEdits, changedCount, errorCount, field, onEdit, onReset, onUndo, publish, load, TEXT_LANGS };",
      "}",
    ].join("\n") + "\n",
  },
  {
    path: "app/components/admin/AdminPages.tsx",
    text: [
      "import { useCallback, useEffect, useMemo, useRef, useState } from \"react\";",
      "import { BUTTON, CARD, FIELD, GHOST, LABEL } from \"~/components/admin/AdminShell\";",
      "import { useTextsStore, type FieldState, type Group } from \"~/hooks/useTextsStore\";",
      "import { translate } from \"~/i18n/context\";",
      "import deployedOverrides from \"~/i18n/overrides.json\";",
      "import { cn } from \"~/lib/cn\";",
      "import { applyHtml, canonical, flashBlock, installEditUi, listBlocks, originalHtml, rememberOriginal, scanEditable, setActive, showAll, type Block, type Flag } from \"~/lib/page-editor-dom\";",
      "import { TEXT_LANGS, type TextLang } from \"~/lib/texts-check\";",
      "import { PAGES, pageOf, pathFor } from \"~/site/pages\";",
      "",
      "// \u0420\u0430\u0437\u0434\u0435\u043b \u00ab\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b\u00bb: \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0441\u0430\u0439\u0442\u0430 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043a\u0430\u043a \u0435\u0441\u0442\u044c (\u0433\u043e\u0442\u043e\u0432\u044b\u0439 \u043f\u0440\u0435\u0440\u0435\u043d\u0434\u0435\u0440 \u0432 iframe",
      "// \u0431\u0435\u0437 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432), \u0442\u0435\u043a\u0441\u0442 \u0432\u044b\u0431\u0438\u0440\u0430\u0435\u0442\u0441\u044f \u043a\u043b\u0438\u043a\u043e\u043c, \u0430 \u0442\u0440\u0438 \u044f\u0437\u044b\u043a\u0430 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0439 \u0441\u0442\u0440\u043e\u043a\u0438 \u043f\u0440\u0430\u0432\u044f\u0442\u0441\u044f \u0432",
      "// \u043f\u0430\u043d\u0435\u043b\u0438 \u0441\u043f\u0440\u0430\u0432\u0430; \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0441\u0440\u0430\u0437\u0443 \u0432\u0438\u0434\u043d\u044b \u0432 \u043c\u0430\u043a\u0435\u0442\u0435. \u041f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f \u2014 \u0442\u0435\u043c \u0436\u0435 \u043a\u043e\u043c\u043c\u0438\u0442\u043e\u043c \u0432",
      "// GitHub, \u0447\u0442\u043e \u0438 \u0432 \u0440\u0430\u0437\u0434\u0435\u043b\u0435 \u00ab\u0422\u0435\u043a\u0441\u0442\u044b\u00bb. \u0421\u0435\u0439\u0447\u0430\u0441 \u043f\u0440\u0430\u0432\u0438\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u0442\u0435\u043a\u0441\u0442; \u0431\u043b\u043e\u043a\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b",
      "// (\u0441\u043f\u0438\u0441\u043e\u043a \u043d\u0438\u0436\u0435) \u2014 \u0437\u0430\u0434\u0435\u043b \u043f\u043e\u0434 \u0431\u0443\u0434\u0443\u0449\u0435\u0435.",
      "",
      "const LANG_NAME: Record<TextLang, string> = { ru: \"\u0420\u0443\u0441\u0441\u043a\u0438\u0439\", ka: \"\u0413\u0440\u0443\u0437\u0438\u043d\u0441\u043a\u0438\u0439\", en: \"\u0410\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438\u0439\" };",
      "const LANG_SHORT: Record<TextLang, string> = { ru: \"RU\", ka: \"KA\", en: \"EN\" };",
      "/** \u0422\u0435\u043a\u0441\u0442\u044b \u0432 \u0442\u043e\u043c \u0432\u0438\u0434\u0435, \u0432 \u043a\u0430\u043a\u043e\u043c \u043e\u043d\u0438 \u0432\u0448\u0438\u0442\u044b \u0432 \u0442\u0435\u043a\u0443\u0449\u0443\u044e \u0441\u0431\u043e\u0440\u043a\u0443 \u0441\u0430\u0439\u0442\u0430: \u0438\u043c\u0435\u043d\u043d\u043e \u0438\u0445 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 iframe. */",
      "const DEPLOYED = deployedOverrides as unknown as Record<TextLang, Record<string, string>>;",
      "",
      "type Picked = { el: HTMLElement; keys: string[]; key: string | null };",
      "",
      "function FieldEditor({ lang, f, onChange, onUndo, onReset }: { lang: TextLang; f: FieldState; onChange: (text: string) => void; onUndo: () => void; onReset: () => void }) {",
      "  return (",
      "    <div className=\"flex flex-col gap-1.5\">",
      "      <div className=\"flex flex-wrap items-center gap-2\">",
      "        <span className={LABEL}>{LANG_NAME[lang]}</span>",
      "        {f.changed && <span className=\"rounded-[1px] bg-teal px-1.5 py-0.5 text-[10px] font-bold text-ink uppercase\">\u0438\u0437\u043c\u0435\u043d\u0435\u043d\u043e</span>}",
      "        {!f.changed && f.published && <span className=\"rounded-[1px] border border-line px-1.5 py-0.5 text-[10px] font-bold text-teal uppercase\">\u043f\u0440\u0430\u0432\u043a\u0430</span>}",
      "        {f.missing && <span className=\"rounded-[1px] bg-copper px-1.5 py-0.5 text-[10px] font-bold text-paper uppercase\">\u043d\u0435\u0442 \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u0430</span>}",
      "      </div>",
      "      <textarea",
      "        value={f.value}",
      "        rows={Math.min(10, Math.max(3, Math.ceil(f.value.length / 30)))}",
      "        onChange={(e) => onChange(e.target.value)}",
      "        lang={lang}",
      "        spellCheck={lang !== \"ka\"}",
      "        aria-label={LANG_NAME[lang]}",
      "        className={cn(FIELD, \"w-full resize-y leading-relaxed\", f.errors.length ? \"ring-1 ring-error\" : f.changed ? \"ring-1 ring-teal\" : \"\")}",
      "      />",
      "      {f.errors.map((m) => (",
      "        <p key={m} className=\"text-[12px] text-error\">{m}</p>",
      "      ))}",
      "      {f.warnings.map((m) => (",
      "        <p key={m} className=\"text-[12px] text-copper-light\">{m}</p>",
      "      ))}",
      "      {(f.changed || f.published) && (",
      "        <div className=\"flex gap-3 text-[11px] font-bold tracking-[.06em] uppercase\">",
      "          {f.changed && (",
      "            <button type=\"button\" onClick={onUndo} className=\"text-muted transition-colors hover:text-teal\">",
      "              \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
      "            </button>",
      "          )}",
      "          <button type=\"button\" onClick={onReset} className=\"text-muted transition-colors hover:text-teal\">",
      "            \u041a \u0438\u0441\u0445\u043e\u0434\u043d\u043e\u043c\u0443",
      "          </button>",
      "        </div>",
      "      )}",
      "    </div>",
      "  );",
      "}",
      "",
      "export function AdminPages() {",
      "  const store = useTextsStore();",
      "  const { data, field, edits } = store;",
      "  const [lang, setLang] = useState<TextLang>(\"ru\");",
      "  const [slug, setSlug] = useState(\"\");",
      "  const [phone, setPhone] = useState(false);",
      "  const [outline, setOutline] = useState(false);",
      "  const [filter, setFilter] = useState(\"\");",
      "  const [frameKey, setFrameKey] = useState(0);",
      "  const [frameVersion, setFrameVersion] = useState(0);",
      "  const [found, setFound] = useState<number | null>(null);",
      "  const [blocks, setBlocks] = useState<Block[]>([]);",
      "  const [pick, setPick] = useState<Picked | null>(null);",
      "  const frame = useRef<HTMLIFrameElement>(null);",
      "  const flags = useRef<Flag[]>([]);",
      "  const cleanup = useRef<(() => void) | null>(null);",
      "  const outlineRef = useRef(outline);",
      "  outlineRef.current = outline;",
      "",
      "  // \u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0441 \u043e\u0434\u043d\u0438\u043c \u044f\u0437\u044b\u043a\u043e\u043c (\u0430\u043d\u0433\u043b\u043e\u044f\u0437\u044b\u0447\u043d\u044b\u0439 \u043b\u0435\u043d\u0434\u0438\u043d\u0433) \u0432\u0441\u0435\u0433\u0434\u0430 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043d\u0430 \u043d\u0451\u043c.",
      "  const shownLang: TextLang = pageOf(slug)?.only ?? lang;",
      "  const src = pathFor(lang, slug);",
      "",
      "  const keyIndex = useMemo(() => new Map((data?.items ?? []).map((item, i) => [item[0], i] as const)), [data]);",
      "  const groupBySlug = useMemo(() => {",
      "    const map = new Map<string, Group>();",
      "    for (const g of data?.groups ?? []) map.set(g.id === \"__home\" ? \"\" : g.id, g);",
      "    return map;",
      "  }, [data]);",
      "  const pages = useMemo(() => {",
      "    const q = filter.trim().toLowerCase();",
      "    return PAGES.map((p) => ({ slug: p.slug, name: groupBySlug.get(p.slug)?.name ?? (p.slug ? `/${p.slug}` : \"\u0413\u043b\u0430\u0432\u043d\u0430\u044f\"), count: groupBySlug.get(p.slug)?.ids.length ?? 0 })).filter((p) => !q || `${p.name} ${p.slug}`.toLowerCase().includes(q));",
      "  }, [filter, groupBySlug]);",
      "",
      "  /** \u0427\u0442\u043e \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u0448\u0438\u0442\u043e \u0432 \u0441\u0430\u0439\u0442 \u0434\u043b\u044f \u0441\u0442\u0440\u043e\u043a\u0438: \u043f\u0440\u0430\u0432\u043a\u0430 \u0438\u0437 \u0441\u0431\u043e\u0440\u043a\u0438 \u0438\u043b\u0438 \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442. */",
      "  const deployedValue = useCallback(",
      "    (idx: number, l: TextLang) => {",
      "      const item = data!.items[idx]!;",
      "      const own = DEPLOYED[l]?.[item[0]];",
      "      if (own !== undefined) return own;",
      "      return l === \"ru\" ? item[0] : l === \"ka\" ? item[1] : item[2];",
      "    },",
      "    [data],",
      "  );",
      "  /** \u0422\u0435\u043a\u0441\u0442 \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435 \u043f\u043e\u0441\u043b\u0435 translate(): \u0441 \u0437\u0430\u043c\u0435\u043d\u043e\u0439 \u00ab\u043c\u00b2\u00bb \u0438 \u00ab\u041a-1\u00bb, \u043a\u0430\u043a \u043d\u0430 \u0441\u0430\u0439\u0442\u0435. */",
      "  const shown = useCallback((l: TextLang, key: string, value: string) => (value || l === \"ru\" ? translate({ lang: l, dict: { [key]: value } }, key) : key), []);",
      "",
      "  const onPickEl = useCallback((el: HTMLElement) => {",
      "    const flag = flags.current.find((f) => f.el === el);",
      "    if (!flag) return;",
      "    setPick({ el, keys: flag.keys, key: flag.keys.length === 1 ? (flag.keys[0] ?? null) : null });",
      "    setActive(el.ownerDocument, el);",
      "  }, []);",
      "",
      "  const onFrameLoad = useCallback(() => {",
      "    cleanup.current?.();",
      "    cleanup.current = null;",
      "    const doc = frame.current?.contentDocument;",
      "    if (!doc?.body || !data) return;",
      "    // \u0418\u0449\u0435\u043c \u0442\u043e\u043b\u044c\u043a\u043e \u0441\u0442\u0440\u043e\u043a\u0438 \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0438 \u043e\u0431\u0449\u0438\u0435: \u043c\u0435\u043d\u044c\u0448\u0435 \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0445 \u0441\u043e\u0432\u043f\u0430\u0434\u0435\u043d\u0438\u0439.",
      "    const common = data.groups.find((g) => g.id === \"__common\");",
      "    const own = groupBySlug.get(slug);",
      "    const allowed = own ? new Set([...(common?.ids ?? []), ...own.ids]) : null;",
      "    const index = new Map<string, string[]>();",
      "    data.items.forEach((item, idx) => {",
      "      if (allowed && !allowed.has(idx)) return;",
      "      const text = canonical(doc, shown(shownLang, item[0], deployedValue(idx, shownLang)));",
      "      if (!text) return;",
      "      const list = index.get(text);",
      "      if (list) list.push(item[0]);",
      "      else index.set(text, [item[0]]);",
      "    });",
      "    const list = scanEditable(doc, index);",
      "    for (const f of list) rememberOriginal(f.el);",
      "    flags.current = list;",
      "    setFound(list.length);",
      "    setBlocks(listBlocks(doc));",
      "    setPick(null);",
      "    showAll(doc, outlineRef.current);",
      "    cleanup.current = installEditUi(doc, onPickEl);",
      "    setFrameVersion((v) => v + 1);",
      "  }, [data, groupBySlug, slug, shownLang, deployedValue, shown, onPickEl]);",
      "",
      "  useEffect(() => () => cleanup.current?.(), []);",
      "  useEffect(() => {",
      "    const doc = frame.current?.contentDocument;",
      "    if (doc?.body) showAll(doc, outline);",
      "  }, [outline]);",
      "",
      "  // \u0416\u0438\u0432\u043e\u0439 \u043f\u0440\u0435\u0434\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440: \u0442\u0435\u043a\u0441\u0442\u044b \u0432 \u043c\u0430\u043a\u0435\u0442\u0435 \u043f\u043e\u0434\u043c\u0435\u043d\u044f\u044e\u0442\u0441\u044f \u043d\u0430 \u043f\u0440\u0430\u0432\u043a\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u0432 \u0441\u0431\u043e\u0440\u043a\u0435 \u0435\u0449\u0451 \u043d\u0435\u0442",
      "  // (\u043d\u0435\u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u044b\u0435 \u0438 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043d\u044b\u0435, \u043d\u043e \u0435\u0449\u0451 \u043d\u0435 \u043f\u0435\u0440\u0435\u0441\u043e\u0431\u0440\u0430\u043d\u043d\u044b\u0435); \u0441\u043e\u0432\u043f\u0430\u0432\u0448\u0438\u0435 \u0441\u043e \u0441\u0431\u043e\u0440\u043a\u043e\u0439 \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u044e\u0442\u0441\u044f \u043a\u0430\u043a \u0431\u044b\u043b\u0438.",
      "  useEffect(() => {",
      "    if (!data) return;",
      "    for (const f of flags.current) {",
      "      const key = f.keys.length === 1 ? (f.keys[0] ?? null) : pick?.el === f.el ? pick.key : null;",
      "      const idx = key === null ? undefined : keyIndex.get(key);",
      "      if (key === null || idx === undefined) {",
      "        applyHtml(f.el, originalHtml(f.el));",
      "        continue;",
      "      }",
      "      const current = field(idx, shownLang).value;",
      "      applyHtml(f.el, current === deployedValue(idx, shownLang) ? originalHtml(f.el) : shown(shownLang, key, current));",
      "    }",
      "  }, [data, edits, field, pick, shownLang, frameVersion, keyIndex, deployedValue, shown]);",
      "",
      "  if (store.loadError) return <p className=\"text-sm text-error\">{store.loadError}</p>;",
      "  if (!data) return <p className=\"text-sm text-muted\">\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b\u2026</p>;",
      "",
      "  const idx = pick?.key ? keyIndex.get(pick.key) : undefined;",
      "  const item = idx === undefined ? null : data.items[idx];",
      "  const canPublish = data.configured && data.github.ok;",
      "",
      "  return (",
      "    <div className=\"flex flex-col gap-3 pb-24\">",
      "      {!data.github.ok && <p className=\"rounded-[2px] border border-line p-3 text-sm text-copper-light\">{data.github.message}</p>}",
      "      {store.notice && <p className={cn(\"rounded-[2px] border p-3 text-sm\", store.notice.kind === \"ok\" ? \"border-teal text-teal\" : \"border-error text-error\")}>{store.notice.text}</p>}",
      "      {store.issues.length > 0 && (",
      "        <ul className=\"rounded-[2px] border border-error p-3 text-sm text-error\">",
      "          {store.issues.slice(0, 8).map((i) => (",
      "            <li key={`${i.lang}:${i.key}:${i.message}`}>",
      "              {LANG_NAME[i.lang]} \u00b7 \u00ab{i.key.slice(0, 50)}\u00bb: {i.message}",
      "            </li>",
      "          ))}",
      "        </ul>",
      "      )}",
      "",
      "      <div className=\"grid gap-3 lg:grid-cols-[14rem_minmax(0,1fr)_21rem]\">",
      "        <div className={cn(CARD, \"flex max-h-[78svh] flex-col gap-2 p-2\")}>",
      "          <input type=\"search\" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder=\"\u041d\u0430\u0439\u0442\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443\" className={cn(FIELD, \"w-full py-2\")} aria-label=\"\u041d\u0430\u0439\u0442\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443\" />",
      "          <nav className=\"flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto\" aria-label=\"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0441\u0430\u0439\u0442\u0430\">",
      "            {pages.map((p) => (",
      "              <button key={p.slug || \"home\"} type=\"button\" onClick={() => { setSlug(p.slug); setPick(null); }} className={cn(\"flex items-center gap-2 rounded-[2px] px-3 py-2 text-left text-sm transition-colors\", p.slug === slug ? \"bg-panel-soft text-paper\" : \"text-muted hover:text-paper\")}>",
      "                <span className=\"min-w-0 flex-1\">",
      "                  <span className=\"block truncate\">{p.name}</span>",
      "                  <span className=\"block truncate text-[11px] text-faint\">/{p.slug}</span>",
      "                </span>",
      "                <span className=\"text-[11px] text-faint\">{p.count}</span>",
      "              </button>",
      "            ))}",
      "          </nav>",
      "        </div>",
      "",
      "        <div className=\"flex min-w-0 flex-col gap-2\">",
      "          <div className=\"flex flex-wrap items-center gap-2\">",
      "            {TEXT_LANGS.map((l) => (",
      "              <button key={l} type=\"button\" onClick={() => setLang(l)} className={cn(GHOST, \"px-3 py-1.5\", shownLang === l && \"border-teal text-teal\")} aria-pressed={shownLang === l}>",
      "                {LANG_SHORT[l]}",
      "              </button>",
      "            ))}",
      "            <span className=\"w-2\" />",
      "            <button type=\"button\" onClick={() => setPhone((v) => !v)} className={cn(GHOST, \"px-3 py-1.5\", phone && \"border-teal text-teal\")} aria-pressed={phone}>",
      "              \u0422\u0435\u043b\u0435\u0444\u043e\u043d",
      "            </button>",
      "            <button type=\"button\" onClick={() => setOutline((v) => !v)} className={cn(GHOST, \"px-3 py-1.5\", outline && \"border-teal text-teal\")} aria-pressed={outline}>",
      "              \u041f\u043e\u0434\u0441\u0432\u0435\u0442\u0438\u0442\u044c \u0442\u0435\u043a\u0441\u0442\u044b",
      "            </button>",
      "            <button type=\"button\" onClick={() => setFrameKey((k) => k + 1)} className={cn(GHOST, \"px-3 py-1.5\")}>",
      "              \u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043c\u0430\u043a\u0435\u0442",
      "            </button>",
      "            <span className=\"text-[11px] text-faint\">{data.pending ? \"\u0421\u0431\u043e\u0440\u043a\u0430 \u0435\u0449\u0451 \u0438\u0434\u0451\u0442: \u043c\u0430\u043a\u0435\u0442 \u043f\u043e\u043a\u0430\u0436\u0435\u0442 \u043d\u043e\u0432\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u044b \u043f\u043e\u0437\u0436\u0435\" : found === null ? \"\" : `\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u0435\u043c\u044b\u0445 \u0442\u0435\u043a\u0441\u0442\u043e\u0432: ${found}`}</span>",
      "          </div>",
      "          <div className={cn(CARD, \"h-[78svh] overflow-hidden bg-ink p-0\")}>",
      "            <div className={cn(\"mx-auto h-full bg-white\", phone ? \"w-[390px] max-w-full\" : \"w-full\")}>",
      "              <iframe key={`${frameKey}:${src}`} ref={frame} src={src} title=\"\u041c\u0430\u043a\u0435\u0442 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b\" sandbox=\"allow-same-origin\" onLoad={onFrameLoad} className=\"h-full w-full border-0\" />",
      "            </div>",
      "          </div>",
      "        </div>",
      "",
      "        <div className=\"flex max-h-[78svh] min-w-0 flex-col gap-3 overflow-y-auto\">",
      "          {pick && pick.key === null && (",
      "            <div className={cn(CARD, \"flex flex-col gap-2 p-4\")}>",
      "              <div className={LABEL}>\u041a\u0430\u043a\u0443\u044e \u0441\u0442\u0440\u043e\u043a\u0443 \u043f\u0440\u0430\u0432\u0438\u0442\u0435?</div>",
      "              <p className=\"text-[12px] text-muted\">\u042d\u0442\u043e\u0442 \u0442\u0435\u043a\u0441\u0442 \u0432 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u043c \u044f\u0437\u044b\u043a\u0435 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u0435\u0442 \u0443 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u0438\u0445 \u0441\u0442\u0440\u043e\u043a. \u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0443\u0436\u043d\u0443\u044e \u043f\u043e \u0440\u0443\u0441\u0441\u043a\u043e\u043c\u0443 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u0443.</p>",
      "              {pick.keys.map((k) => (",
      "                <button key={k} type=\"button\" onClick={() => setPick({ ...pick, key: k })} className={cn(GHOST, \"justify-start text-left normal-case\")}>",
      "                  {k.slice(0, 90)}",
      "                </button>",
      "              ))}",
      "            </div>",
      "          )}",
      "          {item && idx !== undefined && (",
      "            <div className={cn(CARD, \"flex flex-col gap-4 p-4\")}>",
      "              <div className={LABEL}>\u0412\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442</div>",
      "              {item[3] > 1 && <p className=\"text-[11px] text-faint\">\u042d\u0442\u0430 \u0441\u0442\u0440\u043e\u043a\u0430 \u0435\u0441\u0442\u044c \u0435\u0449\u0451 \u043d\u0430 {item[3] - 1} \u0441\u0442\u0440.: \u043f\u0440\u0430\u0432\u043a\u0430 \u0438\u0437\u043c\u0435\u043d\u0438\u0442 \u0435\u0451 \u0432\u0435\u0437\u0434\u0435.</p>}",
      "              {TEXT_LANGS.map((l) => (",
      "                <FieldEditor key={l} lang={l} f={field(idx, l)} onChange={(text) => store.onEdit(idx, l, text)} onUndo={() => store.onUndo(idx, l)} onReset={() => store.onReset(idx, l)} />",
      "              ))}",
      "            </div>",
      "          )}",
      "          {!pick && (",
      "            <div className={cn(CARD, \"flex flex-col gap-2 p-4\")}>",
      "              <div className={LABEL}>\u041a\u0430\u043a \u043f\u0440\u0430\u0432\u0438\u0442\u044c</div>",
      "              <p className=\"text-sm text-muted\">\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u043b\u044e\u0431\u043e\u0439 \u0442\u0435\u043a\u0441\u0442 \u0432 \u043c\u0430\u043a\u0435\u0442\u0435: \u0441\u043f\u0440\u0430\u0432\u0430 \u043e\u0442\u043a\u0440\u043e\u044e\u0442\u0441\u044f \u0442\u0440\u0438 \u044f\u0437\u044b\u043a\u0430 \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u043e\u043a\u0438. \u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0432\u0438\u0434\u043d\u044b \u0432 \u043c\u0430\u043a\u0435\u0442\u0435 \u0441\u0440\u0430\u0437\u0443, \u043d\u0430 \u0441\u0430\u0439\u0442 \u043e\u043d\u0438 \u0443\u0445\u043e\u0434\u044f\u0442 \u043a\u043d\u043e\u043f\u043a\u043e\u0439 \u00ab\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u00bb.</p>",
      "              <p className=\"text-[12px] text-faint\">\u0422\u0435\u043a\u0441\u0442\u044b \u043c\u0435\u043d\u044e, \u043a\u043d\u043e\u043f\u043e\u043a \u0432\u043e \u0432\u0441\u043f\u043b\u044b\u0432\u0430\u044e\u0449\u0438\u0445 \u043e\u043a\u043d\u0430\u0445 \u0438 \u043f\u043e\u0434\u043f\u0438\u0441\u0438 \u043a \u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430\u043c \u0432 \u043c\u0430\u043a\u0435\u0442\u0435 \u043d\u0435 \u043a\u043b\u0438\u043a\u0430\u044e\u0442\u0441\u044f: \u0438\u0445 \u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0432 \u0440\u0430\u0437\u0434\u0435\u043b\u0435 \u00ab\u0422\u0435\u043a\u0441\u0442\u044b\u00bb.</p>",
      "            </div>",
      "          )}",
      "          {blocks.length > 0 && (",
      "            <div className={cn(CARD, \"flex flex-col gap-1 p-4\")}>",
      "              <div className={LABEL}>\u0411\u043b\u043e\u043a\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b</div>",
      "              {blocks.map((b, i) => (",
      "                <button key={`${i}:${b.label}`} type=\"button\" onClick={() => flashBlock(b.el)} className=\"truncate rounded-[2px] px-2 py-1.5 text-left text-sm text-muted transition-colors hover:bg-panel-soft hover:text-paper\">",
      "                  {i + 1}. {b.label}",
      "                </button>",
      "              ))}",
      "            </div>",
      "          )}",
      "        </div>",
      "      </div>",
      "",
      "      <div className={cn(CARD, \"sticky bottom-0 z-20 flex flex-wrap items-center gap-3 p-3\")}>",
      "        <span className=\"text-sm text-muted\">{store.changedCount ? `\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u043e \u0441\u0442\u0440\u043e\u043a: ${store.changedCount}${store.errorCount ? ` \u00b7 \u0441 \u043e\u0448\u0438\u0431\u043a\u0430\u043c\u0438: ${store.errorCount}` : \"\"}` : \"\u041f\u0440\u0430\u0432\u043e\u043a \u043f\u043e\u043a\u0430 \u043d\u0435\u0442.\"}</span>",
      "        <span className=\"text-[11px] text-faint\">{data.github.repo} \u00b7 \u0432\u0435\u0442\u043a\u0430 {data.github.branch}</span>",
      "        <span className=\"flex-1\" />",
      "        <button type=\"button\" disabled={!store.hasEdits || store.busy} onClick={() => store.setEdits({})} className={GHOST}>",
      "          \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0432\u0441\u0435",
      "        </button>",
      "        <button type=\"button\" disabled={!canPublish || store.busy || !store.changedCount || store.errorCount > 0} onClick={() => void store.publish()} className={BUTTON}>",
      "          {store.busy ? \"\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u044e\u2026\" : `\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c${store.changedCount ? ` (${store.changedCount})` : \"\"}`}",
      "        </button>",
      "      </div>",
      "    </div>",
      "  );",
      "}",
    ].join("\n") + "\n",
  },
];

const EDITS = [
  {
    path: "app/components/admin/AdminShell.tsx",
    pairs: [
      [
        "icon: \"chat\" | \"document\" | \"photo\" | \"layers\" }[] = [",
        "icon: \"chat\" | \"document\" | \"photo\" | \"layers\" | \"monitor\" }[] = [",
      ],
      [
        [
      "  { id: \"texts\", name: \"\u0422\u0435\u043a\u0441\u0442\u044b\", icon: \"layers\" },",
      "];",
    ].join("\n"),
        [
      "  { id: \"texts\", name: \"\u0422\u0435\u043a\u0441\u0442\u044b\", icon: \"layers\" },",
      "  { id: \"pages\", name: \"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b\", icon: \"monitor\" },",
      "];",
    ].join("\n"),
      ],
    ],
  },
  {
    path: "app/hooks/useAdmin.ts",
    pairs: [
      [
        "export type AdminPage = \"chats\" | \"leads\" | \"photos\" | \"texts\";",
        "export type AdminPage = \"chats\" | \"leads\" | \"photos\" | \"texts\" | \"pages\";",
      ],
    ],
  },
  {
    path: "app/routes/admin.tsx",
    pairs: [
      [
        "import { AdminTexts } from \"~/components/admin/AdminTexts\";",
        [
      "import { AdminPages } from \"~/components/admin/AdminPages\";",
      "import { AdminTexts } from \"~/components/admin/AdminTexts\";",
    ].join("\n"),
      ],
      [
        "  const [textsOpened, setTextsOpened] = useState(false);",
        [
      "  const [textsOpened, setTextsOpened] = useState(false);",
      "  const [pagesOpened, setPagesOpened] = useState(false);",
    ].join("\n"),
      ],
      [
        "    if (admin.page === \"texts\") setTextsOpened(true);",
        [
      "    if (admin.page === \"texts\") setTextsOpened(true);",
      "    if (admin.page === \"pages\") setPagesOpened(true);",
    ].join("\n"),
      ],
      [
        "photos: 0, texts: 0 }}",
        "photos: 0, texts: 0, pages: 0 }}",
      ],
      [
        "admin.page === \"texts\" ? \"\u0422\u0435\u043a\u0441\u0442\u044b \u0441\u0430\u0439\u0442\u0430\" : \"\u0417\u0430\u044f\u0432\u043a\u0438 \u0441 \u0441\u0430\u0439\u0442\u0430\"",
        "admin.page === \"texts\" ? \"\u0422\u0435\u043a\u0441\u0442\u044b \u0441\u0430\u0439\u0442\u0430\" : admin.page === \"pages\" ? \"\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0441\u0430\u0439\u0442\u0430\" : \"\u0417\u0430\u044f\u0432\u043a\u0438 \u0441 \u0441\u0430\u0439\u0442\u0430\"",
      ],
      [
        "      {admin.page === \"texts\" ? null : admin.page === \"photos\" ? (",
        [
      "      {pagesOpened && (",
      "        <div hidden={admin.page !== \"pages\"}>",
      "          <AdminPages />",
      "        </div>",
      "      )}",
      "      {admin.page === \"texts\" || admin.page === \"pages\" ? null : admin.page === \"photos\" ? (",
    ].join("\n"),
      ],
    ],
  },
  {
    path: "wrangler.test.jsonc",
    optional: true,
    pairs: [
      [
        "  \"workers_dev\": true,",
        [
      "  \"workers_dev\": true,",
      "  \"keep_vars\": true,",
      "  \"vars\": { \"GITHUB_BRANCH\": \"admin-panel\" },",
    ].join("\n"),
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
  if (!fs.existsSync(target)) {
    if (e.optional) {
      notes.push("skipped (file not found, optional): " + e.path);
      continue;
    }
    die("file not found: " + e.path + " (is this the right branch / folder?)");
  }
  const raw = fs.readFileSync(target, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  let text = lf(raw);
  const before = text;
  let skipFile = false;
  for (const [oldS, newS] of e.pairs) {
    const count = text.split(oldS).length - 1;
    // The new text usually contains the old one, so "already applied" must be checked first.
    if (text.includes(newS)) notes.push("already applied in " + e.path);
    else if (count === 1) text = text.replace(oldS, () => newS);
    else if (e.optional) {
      notes.push("skipped (text not found, optional): " + e.path);
      skipFile = true;
      break;
    } else die("cannot place a change in " + e.path + ": expected text found " + count + " time(s).\nLooks like the file was changed after this patch was made. Start of the text I look for: " + ascii(oldS.slice(0, 70)));
  }
  if (!skipFile && text !== before) plan.set(e.path, { before: raw, after: text, eol, isNew: false });
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
say("\nNext: commit in GitHub Desktop on the admin-panel branch and push. Then follow the Cloudflare steps from the chat.");
