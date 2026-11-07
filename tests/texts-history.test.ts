import { afterAll, describe, expect, it } from "vitest";
import { handleTextsAdmin } from "../workers/texts";

// История публикаций раздела «Страницы»: подробности коммита и отмена одной публикации.
// GitHub подменён простой имитацией: коммиты с родителями и файл правок на каждом из них.
type Commit = { sha: string; parent: string | null; message: string; content: string | null };

const realFetch = globalThis.fetch;
afterAll(() => {
  globalThis.fetch = realFetch;
});

function fakeGitHub() {
  const commits: Commit[] = [];
  let seq = 0;
  const blob = (c: string | null) => (c === null ? null : `b${c.length}_${[...c].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7).toString(16)}`);
  const find = (ref: string) => commits.find((c) => c.sha === ref || c.sha.startsWith(ref)) ?? (ref === "main" ? commits[0] : undefined);
  globalThis.fetch = (async (url: string, init: { method?: string; body?: string } = {}) => {
    const u = new URL(url);
    const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
    if (u.pathname.endsWith("/contents/app/i18n/overrides.json")) {
      if (!init.method) {
        const c = find(u.searchParams.get("ref") ?? "");
        if (!c || c.content === null) return json({}, 404);
        return json({ sha: blob(c.content), encoding: "base64", content: Buffer.from(c.content).toString("base64") });
      }
      const body = JSON.parse(init.body ?? "{}") as { sha?: string; content: string; message: string };
      if ((blob(commits[0]?.content ?? null) ?? undefined) !== body.sha) return json({}, 409);
      const sha = (++seq).toString(16).padStart(40, "e");
      const content = Buffer.from(body.content, "base64").toString();
      commits.unshift({ sha, parent: commits[0]?.sha ?? null, message: body.message, content });
      return json({ content: { sha: blob(content) }, commit: { sha } });
    }
    const one = u.pathname.match(/\/commits\/([0-9a-f]+)$/);
    if (one) {
      const c = find(one[1] ?? "");
      return c ? json({ sha: c.sha, parents: c.parent ? [{ sha: c.parent }] : [], commit: { message: `${c.message}\nbody`, author: { name: "Admin", date: "2026-11-07T10:00:00Z" } } }) : json({}, 404);
    }
    if (u.pathname.endsWith("/commits")) return json(commits.map((c) => ({ sha: c.sha, commit: { message: c.message, author: { name: "Admin", date: "2026-11-07T10:00:00Z" } } })));
    if (u.pathname.includes("/branches/")) return json({});
    return json({}, 404);
  }) as typeof fetch;
  return commits;
}

const env = { GITHUB_TOKEN: "t" };
async function go(method: string, path: string, body?: unknown) {
  const req = new Request(`https://x.test/api/admin${path}`, { method, body: body === undefined ? undefined : JSON.stringify(body) });
  const resp = (await handleTextsAdmin(req, env, path.split("?")[0] ?? path))!;
  return { status: resp.status, body: (await resp.json()) as Record<string, any> };
}

describe("история и отмена публикации", () => {
  it("показывает, что изменил коммит, и отменяет только его строки", async () => {
    const commits = fakeGitHub();
    const state = async () => {
      const r = await go("GET", "/texts");
      return { sha: r.body.sha as string | null, items: r.body.items as [string, string, string, number][] };
    };
    const publish = async (changes: unknown) => {
      const s = await state();
      const r = await go("POST", "/texts/publish", { baseSha: s.sha, changes });
      expect(r.status).toBe(200);
      return r.body.commit as string;
    };
    const keys = (await state()).items.filter((i) => i[1] && i[2]).slice(0, 2).map((i) => i[0]) as [string, string];
    const [k1, k2] = keys;

    const a = await publish({ ka: { [k1]: "A-ka" } }); // создаёт файл
    const b = await publish({ en: { [k2]: "B-en" } });
    const c = await publish({ ka: { [k1]: "C-ka" } }); // меняет то, что поставил A

    // подробности: у первого коммита родителя без файла нет — «было» пусто
    let r = await go("GET", `/texts/commit?sha=${a}`);
    expect(r.body.changes).toEqual([{ lang: "ka", key: k1, before: null, after: "A-ka" }]);
    expect(r.body.message.includes("body")).toBe(false);
    r = await go("GET", `/texts/commit?sha=${c}`);
    expect(r.body.changes).toEqual([{ lang: "ka", key: k1, before: "A-ka", after: "C-ka" }]);
    expect((await go("GET", "/texts/commit?sha=zz")).status).toBe(400);

    // A: строку потом изменила C — пропускается, коммита нет
    let s = await state();
    const total = commits.length;
    r = await go("POST", "/texts/undo", { sha: a, baseSha: s.sha });
    expect(r.body.unchanged).toBe(true);
    expect(r.body.skipped).toBe(1);
    expect(commits.length).toBe(total);

    // устаревший baseSha — конфликт, ничего не пишется
    r = await go("POST", "/texts/undo", { sha: b, baseSha: "stale" });
    expect(r.status).toBe(409);
    expect(commits.length).toBe(total);

    // B: уходит только его строка, работа C остаётся
    r = await go("POST", "/texts/undo", { sha: b, baseSha: s.sha });
    expect(r.body.reverted).toBe(1);
    expect(JSON.parse(commits[0]!.content!)).toEqual({ ru: {}, ka: { [k1]: "C-ka" }, en: {} });
    expect(commits[0]!.message.includes("отмена правки")).toBe(true);

    // C: возвращается значение A (до этого строка уже была с правкой)
    s = await state();
    r = await go("POST", "/texts/undo", { sha: c, baseSha: s.sha });
    expect(r.body.reverted).toBe(1);
    expect(JSON.parse(commits[0]!.content!).ka).toEqual({ [k1]: "A-ka" });

    // отмену отмены можно отменить: C возвращается
    const undoC = commits[0]!.sha;
    s = await state();
    r = await go("POST", "/texts/undo", { sha: undoC, baseSha: s.sha });
    expect(r.body.reverted).toBe(1);
    expect(JSON.parse(commits[0]!.content!).ka).toEqual({ [k1]: "C-ka" });

    // кривой хеш отклоняется
    expect((await go("POST", "/texts/undo", { sha: "nothex!", baseSha: s.sha })).status).toBe(400);
  });
});
