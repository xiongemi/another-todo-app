'use client';

import { useEffect, useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from 'next/link';
import { formatDateDisplay } from '@another-todo-app/date';

export default function NavBar() {
  const [today, setToday] = useState('');
  useEffect(() => {
    setToday(formatDateDisplay());
  }, []);

  return (
    <AppBar position="sticky" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" component={Link} href="/today" style={{ color: 'inherit', textDecoration: 'none' }}>
          Another TODO App
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton aria-label="Open calendar" color="inherit" component={Link} href="/calendar" sx={{ mr: 1 }}>
          <CalendarMonthIcon />
        </IconButton>
        <Typography component={Link} href="/today" variant="body2" suppressHydrationWarning style={{ color: 'inherit', textDecoration: 'none' }}>
          {today}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

