import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDateKey } from './formatDateKey';

export type TodoItem = {
  id: string;
  text: string;
  done?: boolean;
};

export function useTodayTodos() {
  const key = useMemo(() => `todos:${formatDateKey()}`, []);
  const [items, setItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* empty */ }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch { /* empty */ }
  }, [key, items]);

  const add = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setItems((prev) => [{ id: crypto.randomUUID(), text: t }, ...prev]);
  }, []);

  return { items, add };
}

