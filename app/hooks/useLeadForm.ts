import { useEffect, useRef, useState, type FormEvent } from "react";
import { FORMS, type Field, type FormConfig, type FormVariant } from "~/content/forms";
import { useI18n } from "~/i18n/context";
import { leadAttribution } from "~/lib/attribution";
import { goal } from "~/lib/metrika";
import { formValues, leadRows, localizePrivacy, missingFields, sendLead, whatsappLink, whatsappMessage, type LeadRow } from "~/logic/lead";

type Status = "idle" | "sending" | "sent" | "fallback";

/**
 * Состояние формы заявки. Заявка уходит в Telegram через Worker; не дошла —
 * посетитель отправляет готовый текст в WhatsApp сам (закон 7).
 */
export function useLeadForm(variant: FormVariant, objtype = "") {
  const { t, lang, href } = useI18n();
  const cfg: FormConfig = FORMS[variant];
  const [invalid, setInvalid] = useState<ReadonlySet<string>>(() => new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [waLink, setWaLink] = useState("");
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "sent" || status === "fallback") resultRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const value = formValues(e.currentTarget);
    const missing = missingFields(cfg.fields, value);
    setInvalid(missing);
    if (missing.size) return;
    const filled = leadRows(cfg.fields, value);
    const params = { form: variant, page: location.pathname };
    goal("lead_form", params);
    setStatus("sending");
    // Язык браузера и источник визита уходят в заявку: менеджер отвечает на языке посетителя.
    const delivered = await sendLead({ form: variant, rows: filled, lang, browserLang: navigator.languages?.join(", ") || navigator.language, page: location.href, attribution: leadAttribution(), website: value("website") });
    if (delivered) goal("lead_sent", params);
    setRows(filled);
    setWaLink(whatsappLink(whatsappMessage(filled, t, location.href)));
    setStatus(delivered ? "sent" : "fallback");
  }

  /** Снимает ошибку поля, как только в него начали вводить. */
  function clear(name: string) {
    if (invalid.has(name)) setInvalid((s) => new Set([...s].filter((n) => n !== name)));
  }

  const defaultValue = (f: Field) => (f.name === "type" ? objtype : "");

  return { cfg, invalid, status, rows, waLink, resultRef, onSubmit, clear, reset: () => setStatus("idle"), defaultValue, privacy: localizePrivacy(t(cfg.privacy), href("politika")) };
}
