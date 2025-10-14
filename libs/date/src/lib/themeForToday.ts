import { useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';

export function dayColorPalette(date = new Date()) {
  const weekday = date.getDay(); // 0 Sun, 6 Sat
  if (weekday === 0) {
    return {
      primary: { main: '#ff7a59' },
      background: { default: '#fff8f5', paper: '#fff' },
    };
  }
  if (weekday === 6) {
    return {
      primary: { main: '#3b82f6' },
      background: { default: '#f5f8ff', paper: '#fff' },
    };
  }
  return {
    primary: { main: '#64748b' },
    background: { default: '#f7f8fa', paper: '#fff' },
  };
}

export function useThemeForToday() {
  const [theme, setTheme] = useState(() =>
    createTheme({
      palette: { mode: 'light', ...dayColorPalette(new Date(2000, 0, 3)) }, // Monday baseline for SSR
      shape: { borderRadius: 10 },
    })
  );
  useEffect(() => {
    const pal = dayColorPalette(new Date());
    setTheme(
      createTheme({
        palette: { mode: 'light', ...pal },
        shape: { borderRadius: 10 },
      })
    );
  }, []);
  return theme;
}

