import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useI18n } from "~/i18n/context";
import { leadAttribution } from "~/lib/attribution";
import { goal } from "~/lib/metrika";
import { isValidContact } from "~/lib/phone";

export type ChatMessage = { id: number; from: "visitor" | "agent"; text: string; author?: string };

const POLL_MS = 4000;
/** Ответа может не быть вовсе (менеджер занят, ассистент промолчал) — бесконечные точки обещали бы его. */
const WAIT_MS = 25_000;
/** Контакт уже оставлен — просьбу о телефоне больше не показываем. */
const CONTACT_KEY = "onez_chat_contact";
/** Свободный текст посетителя мог содержать контакт попутно — проверяем мягче, чем поле формы. */
const CONTACT_IN_TEXT = /\+?\d[\d\s()-]{6,}\d|@[A-Za-z0-9_]{4,}/;

/**
 * Онлайн-чат (workers/chat.ts): отвечает ассистент, ответ приходит опросом,
 * пока окно открыто. После первого сообщения посетителя окно просит телефон
 * или ник мессенджера, но разговору не мешает: писать можно и без контакта.
 * Пока его нет, воркер ничего не шлёт менеджерам — переписка без обратного
 * адреса им ни к чему.
 */
export function useLiveChat() {
  const { lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [phone, setPhone] = useState("");
  const [hasContact, setHasContact] = useState(false);
  const [sending, setSending] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const lastId = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const toggler = useRef<HTMLButtonElement>(null);

  // Чат есть только в браузере: пререндеренный HTML страниц от него не зависит.
  useEffect(() => {
    setMounted(true);
    try {
      setHasContact(localStorage.getItem(CONTACT_KEY) === "1");
    } catch {
      // хранилище закрыто — просто спросим ещё раз
    }
  }, []);

  type Payload = { messages: ChatMessage[]; hasContact?: boolean };

  function merge({ messages: incoming, hasContact: known }: Payload) {
    if (known) rememberContact();
    if (!incoming.length) return;
    if (incoming.some((m) => m.from === "agent" && m.id > lastId.current)) setWaiting(false);
    if (incoming.some((m) => m.from === "visitor" && CONTACT_IN_TEXT.test(m.text))) rememberContact();
    lastId.current = Math.max(lastId.current, ...incoming.map((m) => m.id));
    setMessages((current) => {
      const seen = new Set(current.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      return fresh.length ? [...current, ...fresh].sort((a, b) => a.id - b.id) : current;
    });
  }

  function rememberContact() {
    setHasContact(true);
    try {
      localStorage.setItem(CONTACT_KEY, "1");
    } catch {
      // не критично
    }
  }

  // Закрытое окно молчит: опрос идёт, только пока чат открыт.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const resp = await fetch(`/api/chat/poll?since=${lastId.current}`);
        if (resp.ok && !cancelled) merge((await resp.json()) as Payload);
      } catch {
        // пропущенный опрос подберёт следующий
      }
    };
    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [open]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, waiting, open]);

  // Пока окно открыто, Tab ходит только по нему; Escape закрывает и возвращает фокус на кнопку.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const items = dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])');
      if (!items?.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      const active = document.activeElement;
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || !dialog.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!waiting) return;
    const timer = setTimeout(() => setWaiting(false), WAIT_MS);
    return () => clearTimeout(timer);
  }, [waiting]);

  function toggle() {
    if (!open) goal("chat_open");
    setOpen(!open);
  }

  // Закрыли окно — фокус возвращается на кнопку чата, а не улетает в начало страницы.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) toggler.current?.focus();
    wasOpen.current = open;
  }, [open]);

  async function post(text: string): Promise<boolean> {
    setSending(true);
    setFailed(false);
    try {
      const resp = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, lang, browserLang: navigator.languages?.join(", ") || navigator.language, page: location.href, attribution: leadAttribution() }),
      });
      if (!resp.ok) throw new Error(String(resp.status));
      merge((await resp.json()) as Payload);
      setWaiting(true);
      goal("chat_message");
      return true;
    } catch {
      setFailed(true);
      return false;
    } finally {
      setSending(false);
    }
  }

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    if (!(await post(text))) setDraft(text);
  }

  // Та же проверка, что у поля «Телефон» в форме заявки (app/lib/phone.ts) — один стандарт на оба канала.
  const phoneValid = isValidContact(phone);

  async function sendPhone(e: FormEvent) {
    e.preventDefault();
    if (!phoneValid || sending) return;
    if (await post(`📞 ${phone.trim()}`)) {
      setPhone("");
      rememberContact();
      goal("chat_phone");
    }
  }

  /** Enter отправляет, Shift+Enter — новая строка. */
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  /** Первое сообщение написано, контакта нет — показываем просьбу оставить телефон. */
  const askPhone = !hasContact && messages.some((m) => m.from === "visitor");

  // Окно открыли — курсор сразу в поле сообщения.
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  return { mounted, open, toggle, close: () => setOpen(false), messages, draft, setDraft, sending, waiting, failed, send, onKeyDown, scroller, input, dialog, toggler, askPhone, phone, setPhone, phoneValid, sendPhone };
}
