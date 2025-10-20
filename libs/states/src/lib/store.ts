import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer, Storage } from 'redux-persist';
import { todosSlice } from './todosSlice';

// Use web storage when available; fall back to in-memory storage for Node/test
const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null as any),
  setItem: (_key: string, value: any) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const webStorage = (() => {
  try {
    // Dynamically require to avoid accessing window in Node
    return require('redux-persist/lib/storage').default as Storage;
  } catch {
    return undefined;
  }
})();

const storage: any =
  typeof globalThis !== 'undefined' && (globalThis as any).window && webStorage
    ? webStorage
    : createNoopStorage();

const rootReducer = combineReducers({
  todos: todosSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['todos'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createAppStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (gDM) => {
      const mws = gDM({ serializableCheck: false });
      const extra: Middleware[] = [];
      if (process.env.NODE_ENV !== 'production') {
        const logger = createLogger({ collapsed: true, duration: true });
        extra.push(logger);
      }
      return mws.concat(extra);
    },
    devTools:
      process.env.NODE_ENV !== 'production'
        ? { trace: true, traceLimit: 25 }
        : false,
  });

export const store = createAppStore();

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

// Helpful in-browser debugging hook (no-op in SSR/tests)
if (typeof globalThis !== 'undefined')
  (globalThis as any).__APP_STORE__ = store;
