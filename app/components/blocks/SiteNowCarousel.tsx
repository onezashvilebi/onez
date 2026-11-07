import { useEffect, useRef, useState } from "react";
import { SITE_NOW } from "~/content/company";
import { useI18n } from "~/i18n/context";

type Caption = { ru: string; ka: string; en: string };
type Remote = { id: string; date: string; caption: Caption; src: string };
type Item = { key: string; src: string; srcSet?: string; alt: string; caption: string; date: string };

/** Подпись нужного языка; если её не ввели, показываем русскую, затем любую другую. */
const pick = (c: Caption, lang: string) => c[lang as keyof Caption] || c.ru || c.en || c.ka;
const ARROW = "grid size-11 place-items-center border border-line text-paper transition-colors hover:border-teal hover:text-teal disabled:opacity-30 disabled:hover:border-line disabled:hover:text-paper";

/**
 * «Сейчас строим»: карусель фото с подписью и датой. Фото из SITE_NOW есть в HTML страницы
 * (поиск и первый показ), после загрузки перед ними встают фото из админки (/api/site-now),
 * свежие первыми. Стрелки появляются, только когда есть что листать.
 */
export function SiteNowCarousel() {
  const { t, lang } = useI18n();
  const [remote, setRemote] = useState<Remote[]>([]);
  const [edge, setEdge] = useState({ start: true, end: true });
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/site-now")
      .then((r) => (r.ok ? (r.json() as Promise<{ photos?: Remote[] }>) : null))
      .then((d) => {
        if (alive && d?.photos) setRemote(d.photos);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items: Item[] = [
    ...remote.map((p) => ({ key: p.id, src: p.src, alt: pick(p.caption, lang), caption: pick(p.caption, lang), date: p.date })),
    ...SITE_NOW.photos.map((p) => ({
      key: p.file,
      src: `/assets/${p.file}.webp`,
      srcSet: `/assets/${p.file}-820.webp 820w, /assets/${p.file}.webp 1200w`,
      alt: t(p.alt),
      caption: t(p.stage),
      date: p.date,
    })),
  ];

  const update = () => {
    const el = scroller.current;
    if (el) setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [items.length]);

  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="mt-[42px] sm:mt-[62px]">
      <div ref={scroller} onScroll={update} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => (
          <figure key={p.key} className="m-0 w-[82%] flex-none snap-start sm:w-[calc((100%-1rem)/2)] tab:w-[calc((100%-3rem)/4)]">
            <img
              src={p.src}
              srcSet={p.srcSet}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 82vw"
              alt={p.alt}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-4/3 w-full border border-line object-cover"
            />
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-[11px] tracking-[.06em] text-muted uppercase">
              <span>{p.caption}</span>
              <time dateTime={p.date}>{p.date.split("-").reverse().join(".")}</time>
            </figcaption>
          </figure>
        ))}
      </div>
      {!(edge.start && edge.end) && (
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={t("Предыдущие фото")} className={ARROW}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={t("Следующие фото")} className={ARROW}>
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
