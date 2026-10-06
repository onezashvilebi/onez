import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { ChatMessage } from "~/hooks/useLiveChat";

/** Сообщение в админке — с временем: воркер отдаёт его менеджеру, а посетителю нет. */
export type AdminMessage = ChatMessage & { at: number };

/** Разговор в списке — то, что отдаёт `summary()` в workers/admin.ts. */
export type ChatSummary = { id: string; page: string; lang: string; lastAt: number; contact: string | null; manual: boolean; unread: number; last: { from: "visitor" | "agent"; text: string; at: number } | null; source: string[] };
export type Lead = { id: string; at: number; form: string; rows: { label: string; value: string }[]; lang: string; page: string; country?: string; source: string[]; delivered: boolean; done?: boolean };
export type AdminPage = "chats" | "leads";

const LIST_POLL_MS = 5000;
const THREAD_POLL_MS = 3000;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`/api/admin${path}`, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  if (resp.status === 401) throw new Error("unauthorized");
  if (!resp.ok) throw new Error(String(resp.status));
  return (await resp.json()) as T;
}

/**
 * Состояние админки (/admin): вход по паролю, список разговоров с опросом,
 * открытый разговор с ответом менеджера, заявки. Компоненты только рисуют.
 */
export function useAdmin() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [page, setPage] = useState<AdminPage>("chats");
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [browserLang, setBrowserLang] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const signOut = useCallback(() => {
    setAuthed(false);
    setChats([]);
    setLeads([]);
    setActiveId(null);
  }, []);

  const guard = useCallback(
    (err: unknown) => {
      if (err instanceof Error && err.message === "unauthorized") signOut();
      else setError("Не удалось получить данные. Проверьте связь и обновите страницу.");
    },
    [signOut],
  );

  // Только в браузере: пререндер отдаёт пустую оболочку, состояние входа известно после запроса.
  useEffect(() => {
    setMounted(true);
    api("/me")
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const resp = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
      if (resp.status === 429) return setLoginError("Слишком много попыток. Подождите минуту.");
      if (resp.status === 503) return setLoginError("Пароль админки не задан на сервере (секрет ADMIN_PASSWORD).");
      if (!resp.ok) return setLoginError("Неверный пароль.");
      setPassword("");
      setAuthed(true);
    } catch {
      setLoginError("Нет связи с сервером.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", headers: { "content-type": "application/json" } }).catch(() => null);
    signOut();
  }

  const loadChats = useCallback(() => api<{ chats: ChatSummary[] }>("/chats").then((r) => setChats(r.chats)).catch(guard), [guard]);
  const loadLeads = useCallback(() => api<{ leads: Lead[] }>("/leads").then((r) => setLeads(r.leads)).catch(guard), [guard]);

  // Список разговоров и заявки обновляются, пока админка открыта.
  useEffect(() => {
    if (!authed) return;
    loadChats();
    loadLeads();
    const timer = setInterval(() => {
      loadChats();
      if (page === "leads") loadLeads();
    }, LIST_POLL_MS);
    return () => clearInterval(timer);
  }, [authed, page, loadChats, loadLeads]);

  // Открытый разговор: полная переписка, затем опрос — посетитель может писать прямо сейчас.
  useEffect(() => {
    if (!authed || !activeId) return;
    let cancelled = false;
    const pull = async () => {
      try {
        const r = await api<{ messages: AdminMessage[]; browserLang: string }>(`/chats/${activeId}`);
        if (cancelled) return;
        setMessages(r.messages);
        setBrowserLang(r.browserLang);
      } catch (err) {
        guard(err);
      }
    };
    pull();
    api(`/chats/${activeId}/seen`, { method: "POST" }).then(loadChats).catch(() => null);
    const timer = setInterval(pull, THREAD_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [authed, activeId, guard, loadChats]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages]);

  async function sendReply(e?: FormEvent) {
    e?.preventDefault();
    const text = reply.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    setReply("");
    try {
      const r = await api<{ messages: AdminMessage[] }>(`/chats/${activeId}/reply`, { method: "POST", body: JSON.stringify({ text }) });
      setMessages(r.messages);
      loadChats();
    } catch (err) {
      setReply(text);
      guard(err);
    } finally {
      setSending(false);
    }
  }

  async function toggleLeadDone(lead: Lead) {
    try {
      const r = await api<{ lead: Lead }>(`/leads/${lead.id}/done`, { method: "POST", body: JSON.stringify({ done: !lead.done }) });
      setLeads((current) => current.map((l) => (l.id === r.lead.id ? r.lead : l)));
    } catch (err) {
      guard(err);
    }
  }

  const active = chats.find((c) => c.id === activeId) ?? null;
  const unreadTotal = chats.reduce((sum, c) => sum + c.unread, 0);
  const openLeads = leads.filter((l) => !l.done).length;

  return { mounted, authed, password, setPassword, loginError, login, logout, page, setPage, chats, active, activeId, setActiveId, messages, browserLang, reply, setReply, sending, sendReply, scroller, leads, toggleLeadDone, unreadTotal, openLeads, error };
}
