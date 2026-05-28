import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { storeDiscordUser } from './discordAuth';

/**
 * Rendered at /discord-callback.
 * The bot server redirects here with ?userId=XXX&username=XXX after OAuth.
 * We persist the userId and navigate home.
 */
export function DiscordCallbackHandler() {
  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const userId   = params.get('userId');
    const username = params.get('username') ?? 'User';

    if (userId) {
      storeDiscordUser(userId, username);
    }

    // Replace state so the back button doesn't re-run this
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return (
    <div className="app-loading">
      <motion.div
        className="callback-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      />
      <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '1rem', fontSize: '0.85rem' }}>
        Discord verbinden…
      </p>
    </div>
  );
}
