import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SpotifyProvider } from './auth/SpotifyProvider';
import { App } from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpotifyProvider>
      <App />
    </SpotifyProvider>
  </StrictMode>,
);
