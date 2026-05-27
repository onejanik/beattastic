import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { buildAuthUrl, clearTokens, getValidToken, hasStoredSession } from './spotifyAuth';

interface SpotifyCtx {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getToken: () => Promise<string | null>;
}

const SpotifyContext = createContext<SpotifyCtx | null>(null);

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasStoredSession()) {
      getValidToken().then((t) => {
        setToken(t);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    window.location.href = await buildAuthUrl();
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setToken(null);
  }, []);

  const getToken = useCallback(async () => {
    const t = await getValidToken();
    setToken(t);
    return t;
  }, []);

  return (
    <SpotifyContext.Provider
      value={{ token, isAuthenticated: Boolean(token), isLoading, login, logout, getToken }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const ctx = useContext(SpotifyContext);
  if (!ctx) throw new Error('useSpotify must be inside SpotifyProvider');
  return ctx;
}
