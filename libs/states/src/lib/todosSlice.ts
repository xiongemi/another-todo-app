import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TodosByDay, TodoItem } from './types';

export type TodosState = {
  byDay: TodosByDay;
};

const initialState: TodosState = { byDay: {} };

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setDayTodos(
      state,
      action: PayloadAction<{ dayKey: string; items: TodoItem[] }>
    ) {
      state.byDay[action.payload.dayKey] = action.payload.items;
    },
    addTodo(state, action: PayloadAction<{ dayKey: string; text: string }>) {
      const { dayKey, text } = action.payload;
      const t = text.trim();
      if (!t) return;
      const arr = state.byDay[dayKey] ?? (state.byDay[dayKey] = []);
      arr.unshift({ id: crypto.randomUUID(), text: t });
    },
    toggleTodo(state, action: PayloadAction<{ dayKey: string; id: string }>) {
      const { dayKey, id } = action.payload;
      const arr = state.byDay[dayKey];
      if (!arr) return;
      const idx = arr.findIndex((t) => t.id === id);
      if (idx >= 0) arr[idx] = { ...arr[idx], done: !arr[idx].done };
    },
  },
});

export const { addTodo, toggleTodo, setDayTodos } = todosSlice.actions;

export type RootState = { todos: TodosState };

export const selectAllByDay = (s: RootState) => s.todos.byDay;
export const selectDayTodos = (s: RootState, dayKey: string) =>
  s.todos.byDay[dayKey] ?? [];
