#!/usr/bin/env python3
"""Переносит словари старого генератора (scripts/i18n-source/{ka,en}.json) в app/i18n/.

Ключ старого словаря — innerHTML листового тега, иногда вместе с обёртками:
«<span></span> Тема», «<span>01</span><strong>Этап</strong><i></i>»,
«<a href="index.html">Главная</a>». Компоненты React переводят атомарные строки,
поэтому составной ключ дополнительно раскладывается на текстовые куски по
структурным тегам (<br>, <em>, <b> остаются внутри строки). Пара добавляется,
только если число кусков в оригинале и переводе совпало. Исходные ключи
сохраняются: их используют строки со ссылкой внутри (политика в форме).

Ключи, которых нет ни в исходниках app/, ни на собранных русских страницах,
отбрасываются: словарь целиком уезжает в HTML каждой страницы (ONEZ-54).
Русские страницы нужны потому, что часть строк собирается на лету («01» +
заголовок этапа, «Следующий: » + объект) — в исходниках такой строки нет, а на
странице она есть. Русский рендер от словарей не зависит (для `ru` словарь
пустой), так что порядок «собрать → почистить» не зацикливается.

Запуск: npm run build (один раз, чтобы появились русские страницы) и npm run i18n.
Нет `build/client/ru` — чистка пропускается, словарь пишется целиком.
"""
import glob, json, os, re

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(WEB, "scripts", "i18n-source")
OUT = os.path.join(WEB, "app", "i18n")
RU_BUILD = os.path.join(WEB, "build", "client", "ru")
STRUCT = re.compile(r"</?(?:span|a|i|strong|small|h3|p|div)\b[^>]*>")


def chunks(s):
    return [c.strip() for c in STRUCT.split(s) if c.strip()]


def normalize(table):
    out = {}
    for ru, tr in table.items():
        if tr and STRUCT.search(ru):
            a, b = chunks(ru), chunks(tr)
            if len(a) == len(b):
                for x, y in zip(a, b):
                    out.setdefault(x, y)
    for ru, tr in table.items():  # прямые ключи важнее выведенных из кусков
        if tr:
            out[ru] = tr
    return out


def read_all(paths):
    text = []
    for path in paths:
        with open(path, encoding="utf-8", errors="ignore") as f:
            text.append(f.read())
    return "\n".join(text)


def app_sources():
    """Исходники приложения: строки, которые живут только в коде (ошибки формы, aria)."""
    paths = [
        p
        for p in glob.glob(os.path.join(WEB, "app", "**", "*.*"), recursive=True)
        if os.sep + "i18n" + os.sep not in p and p.endswith((".ts", ".tsx", ".json", ".css"))
    ]
    return read_all(paths)


def ru_pages():
    """Собранные русские страницы: строки в том виде, в каком их видит переводчик."""
    paths = glob.glob(os.path.join(RU_BUILD, "**", "*.html"), recursive=True)
    paths += glob.glob(os.path.join(RU_BUILD, "**", "*.txt"), recursive=True)
    return read_all(paths) if paths else ""


# Сравниваем по «подписи» — только буквы и цифры. Так ключ находится, даже если внутри
# строки стоят <br>, <em> или лишние пробелы, а к заголовку на лету приписывается
# « — ONEZA Construction». Сравнение нарочно грубое: лишний ключ стоит байтов,
# недостающий — ломает сборку.
SIGN = re.compile(r"[^0-9A-Za-zЀ-ӿႠ-ჿ]+")
TAGS = re.compile(r"<[^>]+>")
PAGES = ru_pages()
PRUNE = bool(PAGES)
# Две подписи страниц: с тегами (ключи со ссылкой внутри) и без (обычный текст,
# который на странице разрезан вёрсткой).
CORPUS = SIGN.sub("", app_sources() + "\n" + PAGES) + "\x00" + SIGN.sub("", TAGS.sub(" ", PAGES))


# /llms.txt переводит заголовок вместе с « — ONEZA Construction», а печатает без него:
# такой ключ нужен, если нужен заголовок без бренда.
BRAND_TAIL = " — ONEZA Construction"


def needed(key):
    sign = SIGN.sub("", key.removesuffix(BRAND_TAIL))
    return bool(sign) and sign in CORPUS


for lang in ("ka", "en"):
    with open(os.path.join(SRC, f"{lang}.json"), encoding="utf-8") as f:
        table = json.load(f)
    full = normalize(table)
    result = {k: v for k, v in full.items() if needed(k)} if PRUNE else full
    with open(os.path.join(OUT, f"{lang}.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1, sort_keys=True)
    print(f"{lang}: {len(table)} -> {len(full)} -> {len(result)} keys")

if not PRUNE:
    print(f"нет {RU_BUILD} — словарь записан целиком; сделайте npm run build и повторите npm run i18n")
