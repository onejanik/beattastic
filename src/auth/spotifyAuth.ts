import { SPOTIFY_CLIENT_ID, REDIRECT_URI, SCOPES } from './spotifyConfig';

const CODE_VERIFIER_KEY = 'bt_cv';
const TOKEN_KEY = 'bt_token';
const TOKEN_EXPIRY_KEY = 'bt_expiry';
const REFRESH_TOKEN_KEY = 'bt_refresh';

function randomBase64(bytes: number): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
}

function base64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function buildAuthUrl(): Promise<string> {
  const verifier = randomBase64(64);
  sessionStorage.setItem(CODE_VERIFIER_KEY, verifier);

  const challenge = base64url(await sha256(verifier));

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    show_dialog: 'false',
  });

  return `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCode(code: string): Promise<void> {
  const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  if (!verifier) throw new Error('Kein Code-Verifier gefunden');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) throw new Error(`Token-Austausch fehlgeschlagen: ${res.status}`);

  const data = await res.json();
  storeTokens(data.access_token, data.refresh_token, data.expires_in as number);
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  storeTokens(
    data.access_token as string,
    (data.refresh_token as string | undefined) ?? refreshToken,
    data.expires_in as number,
  );
  return data.access_token as string;
}

function storeTokens(access: string, refresh: string, expiresIn: number): void {
  sessionStorage.setItem(TOKEN_KEY, access);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  // Subtract 60s as buffer before actual expiry
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000 - 60_000));
}

export async function getValidToken(): Promise<string | null> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiry = Number(sessionStorage.getItem(TOKEN_EXPIRY_KEY) || '0');

  if (token && Date.now() < expiry) return token;
  return refreshAccessToken();
}

export function clearTokens(): void {
  [TOKEN_KEY, REFRESH_TOKEN_KEY, TOKEN_EXPIRY_KEY].forEach((k) =>
    sessionStorage.removeItem(k),
  );
}

export function hasStoredSession(): boolean {
  return Boolean(sessionStorage.getItem(TOKEN_KEY));
}
