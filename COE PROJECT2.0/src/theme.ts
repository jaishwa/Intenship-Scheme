import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#0ea5e9' }, // teal-ish
    secondary: { main: '#e11d48' }, // pinkish
    background: { default: '#0a0a0a', paper: 'rgba(255,255,255,0.04)' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
  },
});

export default theme;
