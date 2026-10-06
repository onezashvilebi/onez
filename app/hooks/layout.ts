// Поведение шапки и текстовых страниц: прокрутка, мобильное меню, оглавление.
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";

/** true, когда страница прокручена дальше offset пикселей. */
export function useScrolled(offset: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/** Мобильное меню: закрывается при переходе, пока открыто — на body класс menu-open. */
export function useMobileMenu() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { open, toggle };
}

/**
 * id раздела, который сейчас в зоне чтения, — для подсветки оглавления.
 * Подписка зависит от состава id, а не от ссылки на массив: иначе
 * наблюдатель пересоздавался бы на каждом рендере.
 */
export function useScrollSpy(ids: string[]) {
  const [current, setCurrent] = useState<string | null>(null);
  const key = ids.join("\n");
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    for (const id of key.split("\n")) {
      const el = id && document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [key]);
  return current;
}
