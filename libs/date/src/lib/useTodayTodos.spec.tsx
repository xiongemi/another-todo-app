import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodayTodos } from './useTodayTodos';
import { formatDateKey } from './formatDateKey';

describe('useTodayTodos', () => {
  beforeEach(() => {
    localStorage.clear();
    global.crypto = {
      randomUUID: () => 'test-id-1',
    } as any;
  });

  it('loads from localStorage and adds items', async () => {
    // Seed a previous day to ensure it does not load it for today
    localStorage.setItem(
      `todos:${formatDateKey(new Date(1999, 0, 1))}`,
      '[{"id":"old","text":"old"}]'
    );

    const { result } = renderHook(() => useTodayTodos());

    // Ensure initial state reflects no carry-over from prior day
    expect(result.current.items.find((i) => i.text === 'old')).toBeUndefined();

    // Add an item via the hook API
    act(() => {
      result.current.add('hello');
    });

    await waitFor(() => {
      expect(result.current.items.find((i) => i.text === 'hello')).toBeDefined();
    });

    // Verify it persisted for today's key
    const todaysKey = `todos:${formatDateKey(new Date())}`;
    const stored = localStorage.getItem(todaysKey);
    expect(stored).toContain('hello');
  });
});
