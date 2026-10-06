// Встроенный скрипт <head>: включает анимации (.js) до первой отрисовки.
// Редиректа по языку браузера нет: грузинская главная открывается у
// всех, иначе обходчики и Lighthouse видят /en вместо /. Язык выбирают в шапке.
//
// Страховка: если гидрация не дошла (бандл не загрузился, ошибка в нём),
// через 3 секунды все секции показываются разом. Признак живой гидрации —
// флаг __revealReady, его ставит useReveal (app/hooks/reveal.ts). Без этой
// страховки сломанный бандл оставляет посетителя с пустой страницей: всё
// ниже первого экрана скрыто стилями до появления класса visible (ONEZ-56).
//
// Гидрация стартует после load (scripts/defer-hydration.mjs, ONEZ-22). Форма,
// отправленная раньше, ушла бы обычным GET — с телефоном в адресе страницы.
// Поэтому до флага __hydrated (его ставит markHydrated в root.tsx) отправка
// форм гасится.
export const BOOT_SCRIPT = `document.documentElement.classList.add("js");document.addEventListener("submit",function(e){if(!window.__hydrated)e.preventDefault()},true);setTimeout(function(){if(window.__revealReady)return;var n=document.querySelectorAll(".reveal:not(.visible),.reveal-stagger:not(.visible)");for(var i=0;i<n.length;i++)n[i].classList.add("visible")},3000);`;

/** Ставит флаг живой гидрации: с этого момента формы отправляет React. */
export function markHydrated() {
  (window as unknown as { __hydrated?: boolean }).__hydrated = true;
}
