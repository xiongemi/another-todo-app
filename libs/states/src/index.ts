// Explicit re-exports to ensure TypeScript picks up values in project refs
export { createAppStore, store, persistor } from './lib/store';
export type { AppDispatch } from './lib/store';

export {
  todosSlice,
  addTodo,
  toggleTodo,
  setDayTodos,
  selectAllByDay,
  selectDayTodos,
} from './lib/todosSlice';
export type { RootState } from './lib/todosSlice';

export { useAppDispatch, useAppSelector } from './lib/hooks';
