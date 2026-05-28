import { Router } from 'express';

const router = Router();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  FRONTEND_URL,
} = process.env;

/** Step 1: Redirect user to Discord OAuth */
router.get('/auth/discord', (_req, res) => {
  const params = new URLSearchParams({
    client_id:     DISCORD_CLIENT_ID!,
    redirect_uri:  DISCORD_REDIRECT_URI!,
    response_type: 'code',
    scope:         'identify',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

/** Step 2: Discord redirects here with ?code – exchange for userId, redirect to frontend */
router.get('/auth/discord/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${FRONTEND_URL}?discord_error=access_denied`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type:    'authorization_code',
        code:          String(code),
        redirect_uri:  DISCORD_REDIRECT_URI!,
      }),
    });

    if (!tokenRes.ok) throw new Error(`Token exchange failed: ${tokenRes.status}`);
    const tokenData = await tokenRes.json() as { access_token: string };

    // Fetch Discord user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
    const user = await userRes.json() as { id: string; username: string; global_name?: string };

    const displayName = user.global_name ?? user.username;

    // Redirect to frontend – only the non-sensitive userId travels to the client
    res.redirect(
      `${FRONTEND_URL}/discord-callback?userId=${user.id}&username=${encodeURIComponent(displayName)}`,
    );
  } catch (err) {
    console.error('[routes] OAuth error:', err);
    res.redirect(`${FRONTEND_URL}?discord_error=server_error`);
  }
});

/** Health check */
router.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

export default router;
