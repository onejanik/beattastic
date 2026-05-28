// Keys for sessionStorage
const UID_KEY  = 'bt_discord_uid';
const NAME_KEY = 'bt_discord_name';

export interface DiscordUser {
  userId:   string;
  username: string;
}

/**
 * Read the Discord user stored after OAuth callback.
 * Returns null if the user hasn't connected Discord.
 */
export function getDiscordUser(): DiscordUser | null {
  const userId = sessionStorage.getItem(UID_KEY);
  if (!userId) return null;
  return { userId, username: sessionStorage.getItem(NAME_KEY) ?? 'User' };
}

/** Persist userId after the bot server's OAuth callback */
export function storeDiscordUser(userId: string, username: string): void {
  sessionStorage.setItem(UID_KEY,  userId);
  sessionStorage.setItem(NAME_KEY, username);
}

/** Disconnect Discord */
export function clearDiscordUser(): void {
  sessionStorage.removeItem(UID_KEY);
  sessionStorage.removeItem(NAME_KEY);
}

/**
 * Redirect the user to the bot server's OAuth initiation endpoint.
 * The bot server handles the Discord OAuth flow and redirects back here.
 */
export function loginWithDiscord(): void {
  const botUrl = import.meta.env.VITE_BOT_URL as string | undefined;
  if (!botUrl) {
    console.error('[discord] VITE_BOT_URL not set');
    return;
  }
  window.location.href = `${botUrl}/auth/discord`;
}
