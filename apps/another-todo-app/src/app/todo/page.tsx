'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';

type TodoItem = {
  id: string;
  text: string;
  done?: boolean;
};

function formatDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function useTodayTodos() {
  const key = useMemo(() => `todos:${formatDateKey()}`, []);
  const [items, setItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
  }, [key, items]);

  const add = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setItems((prev) => [{ id: crypto.randomUUID(), text: t }, ...prev]);
  }, []);

  return { items, add };
}

function dayColorPalette(date = new Date()) {
  const weekday = date.getDay(); // 0 Sun, 6 Sat
  if (weekday === 0) {
    // Sunday – pinkish orange
    return {
      primary: { main: '#ff7a59' },
      background: { default: '#fff8f5', paper: '#fff' },
    };
  }
  if (weekday === 6) {
    // Saturday – blue
    return {
      primary: { main: '#3b82f6' },
      background: { default: '#f5f8ff', paper: '#fff' },
    };
  }
  // Weekday – grey / blue‑ish grey
  return {
    primary: { main: '#64748b' },
    background: { default: '#f7f8fa', paper: '#fff' },
  };
}

function useThemeForToday() {
  // Use a deterministic default palette during SSR to avoid hydration mismatch,
  // then update after mount based on the client date.
  const [theme, setTheme] = useState(() =>
    createTheme({
      palette: { mode: 'light', ...dayColorPalette(new Date(2000, 0, 3)) }, // Monday baseline
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

export default function TodoPage() {
  const theme = useThemeForToday();
  const { items, add } = useTodayTodos();
  const [value, setValue] = useState('');
  const [today, setToday] = useState<string>('');
  const recognizingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Compute today's label only on the client to avoid SSR time zone drift.
    setToday(formatDateKey());
  }, []);

  // Voice input via Web Speech API (if available)
  const startVoice = useCallback(() => {
    const SpeechRecognition =
      (globalThis as any).webkitSpeechRecognition ||
      (globalThis as any).SpeechRecognition;
    if (!SpeechRecognition || recognizingRef.current) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? '';
      if (transcript)
        setValue((prev) => (prev ? prev + ' ' + transcript : transcript));
    };
    rec.onend = () => {
      recognizingRef.current = false;
    };
    recognitionRef.current = rec;
    recognizingRef.current = true;
    try {
      rec.start();
    } catch {
      recognizingRef.current = false;
    }
  }, []);

  const submit = useCallback(() => {
    if (!value.trim()) return;
    add(value);
    setValue('');
  }, [add, value]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div">
            Today’s Todos
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" suppressHydrationWarning>
            {today}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
        <Paper variant="outlined" sx={{ p: 1 }}>
          {items.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              No todos yet. Add your first one below.
            </Box>
          ) : (
            <List>
              {items.map((t) => (
                <ListItem key={t.id} divider>
                  <ListItemText primary={t.text} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      {/* Fixed bottom input bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          py: 1,
        }}
      >
        <Container maxWidth="sm">
          <TextField
            fullWidth
            placeholder="Add a todo for today…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label="Voice input"
                    onClick={startVoice}
                    edge="start"
                  >
                    <MicIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Add todo"
                    onClick={submit}
                    edge="end"
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
