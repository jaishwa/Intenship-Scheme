import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalAuthProvider } from './lib/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LocalAuthProvider>
  </StrictMode>,
);
