import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>,
  );
}
