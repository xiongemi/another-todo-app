'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge, Box, Button, Container, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { DateCalendar, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateDisplay, formatDateKey } from '@another-todo-app/date';

type Todo = { id: string; text: string; done?: boolean };

function loadAllTodos(): Record<string, Todo[]> {
  const map: Record<string, Todo[]> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? '';
      if (!k.startsWith('todos:')) continue;
      const dayKey = k.slice('todos:'.length);
      try {
        const val = localStorage.getItem(k);
        if (!val) continue;
        const arr = JSON.parse(val) as Todo[];
        if (Array.isArray(arr)) map[dayKey] = arr;
      } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
  return map;
}

export default function CalendarPage() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [all, setAll] = useState<Record<string, Todo[]>>({});

  useEffect(() => {
    setAll(loadAllTodos());
    const onStorage = () => setAll(loadAllTodos());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const selectedKey = useMemo(() => formatDateKey(selected), [selected]);
  const selectedTodos = all[selectedKey] ?? [];
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const k of Object.keys(all)) m.set(k, all[k]?.length ?? 0);
    return m;
  }, [all]);

  function HighlightDay(
    props: React.ComponentProps<typeof PickersDay> & { day?: Date }
  ) {
    const { day, outsideCurrentMonth, ...other } = props as any;
    const key = day ? formatDateKey(day) : '';
    const count = counts.get(key) ?? 0;
    return (
      <Badge
        overlap="circular"
        color="primary"
        badgeContent={count > 0 ? Math.min(count, 99) : null}
        max={99}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <PickersDay {...(other as any)} day={day} outsideCurrentMonth={outsideCurrentMonth} />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
          <Button variant="outlined" size="small" onClick={() => setSelected(new Date())}>Today</Button>
        </Box>

        <Paper variant="outlined" sx={{ p: 1, mb: 2 }}>
          <DateCalendar
            value={selected}
            onChange={(d) => d && setSelected(d)}
            views={["day"]}
            slots={{ day: HighlightDay as any }}
          />
        </Paper>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {formatDateDisplay(selected)}
        </Typography>

        <Paper variant="outlined">
          {selectedTodos.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              No todos for this day.
            </Box>
          ) : (
            <List>
              {selectedTodos.map((t) => (
                <ListItem key={t.id} divider>
                  <ListItemText
                    primary={t.text}
                    primaryTypographyProps={{
                      sx: t.done ? { textDecoration: 'line-through', color: 'text.secondary' } : undefined,
                    }}
                    secondary={t.done ? 'Completed' : undefined}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
