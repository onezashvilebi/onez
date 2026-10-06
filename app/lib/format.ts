/** Порядковый номер в две цифры: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Целое с разделителем разрядов: 180000 → "180 000". */
export const formatInt = (n: number) => n.toLocaleString("ru-RU");
