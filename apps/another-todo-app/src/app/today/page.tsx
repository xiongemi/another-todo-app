'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatDateDisplay, useTodayTodos } from '@another-todo-app/date';
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
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';

function dayColorPalette(date = new Date()) {
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

function useThemeForToday() {
  const [theme, setTheme] = useState(() =>
    createTheme({
      palette: { mode: 'light', ...dayColorPalette(new Date(2000, 0, 3)) },
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

export default function TodayPage() {
  const theme = useThemeForToday();
  const { items, add } = useTodayTodos();
  const [value, setValue] = useState('');
  const [today, setToday] = useState<string>('');
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setToday(formatDateDisplay());
  }, []);

  // Voice input toggle via Web Speech API
  const toggleVoice = useCallback(() => {
    const SpeechRecognition =
      (globalThis as any).webkitSpeechRecognition ||
      (globalThis as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    // If currently recognizing, stop it
    if (recognizing) {
      try {
        recognitionRef.current?.stop?.();
      } finally {
        setRecognizing(false);
      }
      return;
    }

    // Start recognition
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
      setRecognizing(false);
    };
    recognitionRef.current = rec;
    setRecognizing(true);
    try {
      rec.start();
    } catch {
      setRecognizing(false);
    }
  }, [recognizing]);

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
                    aria-label={recognizing ? 'Stop recording' : 'Voice input'}
                    onClick={toggleVoice}
                    edge="start"
                    color={recognizing ? 'error' : 'default'}
                  >
                    {recognizing ? <StopIcon /> : <MicIcon />}
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

