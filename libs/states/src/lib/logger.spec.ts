import { createAppStore } from './store';
import { addTodo } from './todosSlice';

describe('logger middleware', () => {
  const originalEnv = process.env.NODE_ENV;
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('logs via redux-logger', () => {
    const store = createAppStore();
    const sLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    const sGroup = jest
      .spyOn(console as any, 'groupCollapsed')
      .mockImplementation(() => {});
    const sGroupEnd = jest
      .spyOn(console as any, 'groupEnd')
      .mockImplementation(() => {});

    try {
      store.dispatch(addTodo({ dayKey: 'd', text: 'x' }));
      const called =
        sLog.mock.calls.length +
        sGroup.mock.calls.length +
        sGroupEnd.mock.calls.length;
      expect(called).toBeGreaterThan(0);
    } finally {
      sLog.mockRestore();
      sGroup.mockRestore();
      sGroupEnd.mockRestore();
    }
  });
});
