import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { exchangeCode } from '../auth/spotifyAuth';

export function CallbackHandler() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error || !code) {
      window.location.replace('/');
      return;
    }

    exchangeCode(code)
      .then(() => window.location.replace('/'))
      .catch(() => window.location.replace('/'));
  }, []);

  return (
    <div className="callback-screen">
      <motion.div
        className="callback-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      />
      <motion.p
        className="callback-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.3 }}
      >
        Verbinde mit Spotify…
      </motion.p>
    </div>
  );
}
