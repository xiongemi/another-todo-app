'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeForToday } from '@another-todo-app/date';

export default function Theme({ children }: PropsWithChildren) {
  const theme = useThemeForToday();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

