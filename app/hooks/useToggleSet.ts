import { useCallback, useState } from "react";

/** Какие пункты раскрыты: multiple — независимо друг от друга, иначе открыт один. */
export function useToggleSet(initial: Iterable<number>, multiple: boolean) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set(initial));
  const toggle = useCallback(
    (i: number) =>
      setOpen((prev) => {
        if (!multiple) return prev.has(i) ? new Set() : new Set([i]);
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return next;
      }),
    [multiple],
  );
  return { isOpen: (i: number) => open.has(i), toggle };
}
