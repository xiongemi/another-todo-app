'use client';

import { useMemo, useCallback, useRef, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  addTodo,
  toggleTodo,
} from '@another-todo-app/states';
import { formatDateKey } from '@another-todo-app/date';
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  TextField,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';

// theme moved to shared date lib

export default function TodayPage() {
  const dispatch = useAppDispatch();
  const dayKey = useMemo(() => formatDateKey(), []);
  const items = useAppSelector((s) => s.todos.byDay[dayKey] ?? []);
  const [value, setValue] = useState('');
  // page-local state
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // no header-managed date here; NavBar shows it

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
    dispatch(addTodo({ dayKey, text: value }));
    setValue('');
    // keep focus in the input for quick entry
    try {
      inputRef.current?.focus();
    } catch {
      // ignore errors
    }
  }, [dispatch, dayKey, value]);

  return (
    <>
      <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
        <Paper variant="outlined" sx={{ p: 1 }}>
          {items.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              No todos yet. Add your first one below.
            </Box>
          ) : (
            <List>
              {items.map((t) => (
                <ListItem
                  key={t.id}
                  divider
                  disableGutters
                  secondaryAction={null}
                >
                  <Checkbox
                    edge="start"
                    checked={!!t.done}
                    onChange={() => dispatch(toggleTodo({ dayKey, id: t.id }))}
                    inputProps={{ 'aria-label': 'Mark complete' }}
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primaryTypographyProps={{
                      sx: t.done
                        ? {
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                          }
                        : undefined,
                    }}
                    primary={t.text}
                  />
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
            inputRef={inputRef}
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
                    type="button"
                    edge="end"
                    color="primary"
                    disabled={!value.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>
    </>
  );
}
