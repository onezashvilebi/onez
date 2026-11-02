import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { BUTTON, CARD, Empty, FIELD, GHOST, LABEL } from "~/components/admin/AdminShell";
import { cn } from "~/lib/cn";

// Раздел «Фото стройки»: фото для блока «Сейчас строим» на сайте. Менеджер выбирает снимок,
// пишет подпись (на трёх языках) и дату, сайт показывает его каруселью. Данные — /api/admin/site-now
// (workers/site-now.ts). Кадр обрезается до 4:3 и сжимается прямо в браузере.

type Caption = { ru: string; ka: string; en: string };
type Photo = { id: string; date: string; caption: Caption; src: string };

const EMPTY: Caption = { ru: "", ka: "", en: "" };
const LANGS: { key: keyof Caption; name: string }[] = [
  { key: "ru", name: "русский" },
  { key: "ka", name: "грузинский" },
  { key: "en", name: "английский" },
];
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tbilisi" });
const NET_ERROR = "Не удалось выполнить запрос. Проверьте связь и обновите страницу.";
/** Показываем только наши сообщения (по-русски); английский текст ошибки браузера заменяем общим. */
const msg = (e: unknown) => (e instanceof Error && /[А-Яа-яЁё]/.test(e.message) ? e.message : NET_ERROR);

/** Кадр 4:3 шириной 1200 px, как у фото на сайте: обрезка по центру и WebP на 100–300 КБ. */
async function prepare(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const W = 1200;
  const H = 900;
  const scale = Math.max(W / bmp.width, H / bmp.height);
  const w = bmp.width * scale;
  const h = bmp.height * scale;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, (W - w) / 2, (H - h) / 2, w, h);
  bmp.close();
  const encode = (type: string, quality: number) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  for (const [type, quality] of [["image/webp", 0.84], ["image/webp", 0.7], ["image/jpeg", 0.82], ["image/jpeg", 0.7]] as const) {
    const blob = await encode(type, quality);
    if (blob && blob.type === type && blob.size <= 900_000) return blob;
  }
  throw new Error("too_big");
}

async function call(path: string, init?: RequestInit): Promise<Response> {
  const resp = await fetch(`/api/admin/site-now${path}`, init);
  if (resp.status === 401) throw new Error("Сессия закончилась. Обновите страницу и войдите заново.");
  return resp;
}

function CaptionFields({ value, onChange }: { value: Caption; onChange: (c: Caption) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LANGS.map((l) => (
        <label key={l.key} className="flex flex-col gap-2">
          <span className={LABEL}>Подпись · {l.name}</span>
          <input type="text" maxLength={120} value={value[l.key]} onChange={(e) => onChange({ ...value, [l.key]: e.target.value })} className={FIELD} />
        </label>
      ))}
    </div>
  );
}

function PhotoRow({ photo, onChanged, onError }: { photo: Photo; onChanged: () => void; onError: (m: string) => void }) {
  const [date, setDate] = useState(photo.date);
  const [caption, setCaption] = useState<Caption>(photo.caption);
  const [busy, setBusy] = useState(false);
  const dirty = date !== photo.date || LANGS.some((l) => caption[l.key] !== photo.caption[l.key]);

  const run = async (job: () => Promise<Response>, fail: string) => {
    setBusy(true);
    onError("");
    try {
      const resp = await job();
      if (!resp.ok) throw new Error(fail);
      onChanged();
    } catch (e) {
      onError(msg(e));
    } finally {
      setBusy(false);
    }
  };
  const save = () =>
    run(() => call(`/${photo.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ date, ...caption }) }), "Не удалось сохранить. Нужна дата и подпись хотя бы на одном языке.");
  const remove = () => {
    if (window.confirm("Удалить это фото с сайта?")) void run(() => call(`/${photo.id}`, { method: "DELETE" }), "Не удалось удалить фото.");
  };

  return (
    <div className={cn(CARD, "flex flex-col gap-4 p-4")}>
      <img src={photo.src} alt="" loading="lazy" className="aspect-4/3 w-full border border-line object-cover" />
      <label className="flex flex-col gap-2">
        <span className={LABEL}>Дата съёмки</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} />
      </label>
      {LANGS.map((l) => (
        <label key={l.key} className="flex flex-col gap-2">
          <span className={LABEL}>Подпись · {l.name}</span>
          <input type="text" maxLength={120} value={caption[l.key]} onChange={(e) => setCaption({ ...caption, [l.key]: e.target.value })} className={FIELD} />
        </label>
      ))}
      <div className="flex gap-3">
        <button type="button" onClick={save} disabled={!dirty || busy} className={cn(BUTTON, "flex-1")}>
          Сохранить
        </button>
        <button type="button" onClick={remove} disabled={busy} className={GHOST}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export function AdminSiteNow() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(today);
  const [caption, setCaption] = useState<Caption>(EMPTY);
  const input = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

  const load = useCallback(async () => {
    try {
      const resp = await call("");
      if (!resp.ok) throw new Error(NET_ERROR);
      setPhotos(((await resp.json()) as { photos: Photo[] }).photos);
    } catch (e) {
      setError(msg(e));
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const upload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Выберите фото.");
    if (!caption.ru && !caption.ka && !caption.en) return setError("Впишите подпись хотя бы на одном языке.");
    setBusy(true);
    setError("");
    try {
      const blob = await prepare(file).catch(() => {
        throw new Error("Не удалось подготовить фото. Выберите другой файл (JPG, PNG или WebP).");
      });
      const form = new FormData();
      form.set("file", new File([blob], "photo", { type: blob.type }));
      form.set("date", date);
      for (const l of LANGS) form.set(l.key, caption[l.key]);
      const resp = await call("", { method: "POST", body: form });
      if (!resp.ok) throw new Error(resp.status === 409 ? "Фото уже много (60). Удалите ненужные." : "Не удалось загрузить фото. Проверьте файл (JPG, PNG или WebP) и попробуйте ещё раз.");
      setFile(null);
      setCaption(EMPTY);
      if (input.current) input.current.value = "";
      await load();
    } catch (err) {
      setError(msg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={upload} className={cn(CARD, "flex flex-col gap-5 p-5")}>
        <div>
          <div className="font-display text-[15px] font-semibold text-paper">Добавить фото в «Сейчас строим»</div>
          <p className="mt-2 text-sm text-muted">Фото обрежется до формата 4:3 и сожмётся само. Новые встают в начало карусели на сайте; появляются в течение минуты. Если подписи на каком-то языке нет, на нём покажется русская.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <label className="flex flex-col gap-2">
            <span className={LABEL}>Фото</span>
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={cn(FIELD, "file:mr-4 file:border-0 file:bg-transparent file:text-teal")} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={LABEL}>Дата съёмки</span>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} />
          </label>
        </div>
        {preview && <img src={preview} alt="" className="aspect-4/3 w-full max-w-xs border border-line object-cover" />}
        <CaptionFields value={caption} onChange={setCaption} />
        {error && <p className="text-sm text-error">{error}</p>}
        <div>
          <button type="submit" disabled={busy} className={BUTTON}>
            {busy ? "Загружаю…" : "Добавить на сайт"}
          </button>
        </div>
      </form>

      {photos === null ? null : photos.length === 0 ? (
        <div className={CARD}>
          <Empty text="Своих фото пока нет — на сайте показываются прежние четыре" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map((p) => (
            <PhotoRow key={`${p.id}:${p.date}:${p.caption.ru}:${p.caption.ka}:${p.caption.en}`} photo={p} onChanged={() => void load()} onError={setError} />
          ))}
        </div>
      )}
    </div>
  );
}
