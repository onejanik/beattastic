export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
export const REDIRECT_URI = (import.meta.env.VITE_REDIRECT_URI as string) || 'http://127.0.0.1:5173/callback';

export const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-private',
].join(' ');
