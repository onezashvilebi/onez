// Единая проверка контакта — форма заявки и просьба о телефоне в чате должны
// отправлять в Telegram один и тот же набор значений: телефон или ник мессенджера.
// Скобка в начале — обычная запись кода города: «(599) 538-277» тоже заявка.
const PHONE = /^\+?[\d(][\d\s()-]{7,17}\d$/;
const HANDLE = /^@[A-Za-z0-9_]{4,32}$/;

export const isValidContact = (value: string): boolean => {
  const v = value.trim();
  return HANDLE.test(v) || PHONE.test(v);
};

/** Ищет телефон или @ник внутри свободного текста (чат, не форма) — первое совпадение или null. */
export function extractContact(text: string): string | null {
  const phone = text.match(/\+?[\d(][\d\s()-]{7,17}\d/)?.[0];
  if (phone && isValidContact(phone)) return phone.trim();
  const handle = text.match(/@[A-Za-z0-9_]{4,32}/)?.[0];
  return handle ?? null;
}
