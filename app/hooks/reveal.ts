import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

/** Появление .reveal / .reveal-stagger при прокрутке; перезапускается на каждой странице. */
export function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Признак живой гидрации для страховки в BOOT_SCRIPT: без него встроенный
    // скрипт через 3 секунды покажет все секции разом, решив, что бандл не
    // доехал (ONEZ-56).
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;
    const pending = document.querySelectorAll(".reveal:not(.visible), .reveal-stagger:not(.visible)");
    const show = (el: Element) => el.classList.add("visible");
    // Без наблюдателя контент не должен остаться невидимым.
    if (typeof IntersectionObserver === "undefined") {
      pending.forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          show(e.target);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12 },
    );
    // То, что уже в кадре, показываем сразу: первый экран (и LCP) не ждёт
    // события наблюдателя, которое браузер может задержать в фоновой вкладке.
    const vh = window.innerHeight;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) show(el);
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
}

/** Счётчик от нуля до значения, когда попал в кадр. На сервере — сразу итог. */
export function useCountUp(to: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValue(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1500, 1);
          setValue(Math.floor(to * (1 - (1 - p) ** 3)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);
  return { ref, value };
}
