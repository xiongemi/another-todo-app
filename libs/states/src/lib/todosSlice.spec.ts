import {
  todosSlice,
  addTodo,
  toggleTodo,
  setDayTodos,
  selectDayTodos,
} from './todosSlice';

describe('todosSlice reducers', () => {
  const dayKey = '2025-10-14';

  it('sets day todos', () => {
    const state = todosSlice.getInitialState();
    const items = [
      { id: '1', text: 'A' },
      { id: '2', text: 'B', done: true },
    ];
    const next = todosSlice.reducer(state, setDayTodos({ dayKey, items }));
    expect(next.byDay[dayKey]).toEqual(items);
  });

  it('addTodo trims and ignores empty', () => {
    let state = todosSlice.getInitialState();
    state = todosSlice.reducer(state, addTodo({ dayKey, text: '   ' }));
    expect(state.byDay[dayKey]).toBeUndefined();

    state = todosSlice.reducer(state, addTodo({ dayKey, text: '  hello  ' }));
    const arr = state.byDay[dayKey]!;
    expect(arr).toHaveLength(1);
    expect(arr[0].text).toBe('hello');
  });

  it('toggleTodo flips done flag', () => {
    const initial = todosSlice.reducer(
      todosSlice.getInitialState(),
      setDayTodos({ dayKey, items: [{ id: 'x', text: 't', done: false }] })
    );
    const toggled = todosSlice.reducer(
      initial,
      toggleTodo({ dayKey, id: 'x' })
    );
    expect(selectDayTodos({ todos: toggled } as any, dayKey)[0].done).toBe(
      true
    );
  });
});
