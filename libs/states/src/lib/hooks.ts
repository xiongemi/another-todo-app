import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store';
import type { RootState } from './todosSlice';

export const useAppDispatch: () => AppDispatch = useDispatch as any;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
