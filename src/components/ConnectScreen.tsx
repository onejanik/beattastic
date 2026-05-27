import { motion } from 'framer-motion';
import { useSpotify } from '../auth/SpotifyProvider';

const words = ['BEAT', 'TASTIC'];

export function ConnectScreen() {
  const { login } = useSpotify();

  return (
    <div className="connect-screen">
      {/* Animated rings */}
      <div className="connect-rings" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="connect-ring" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      {/* Noise overlay handled by CSS */}

      <div className="connect-content">
        {/* Logo */}
        <motion.div
          className="connect-logo"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="connect-wordmark">
            {words.map((word, wi) => (
              <span key={wi} className="connect-wordmark-part">
                {word.split('').map((char, ci) => (
                  <motion.span
                    key={ci}
                    className="connect-char"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.08 + wi * 0.06 + ci * 0.03,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>
          <motion.p
            className="connect-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            lyrics in motion
          </motion.p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="connect-description"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          Verbinde dein Spotify-Konto und erlebe Lyrics<br />
          als dynamische Kinetic Typography – live im Takt.
        </motion.p>

        {/* CTA */}
        <motion.button
          className="connect-btn"
          onClick={login}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg className="connect-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.293a.75.75 0 01-1.032.243c-2.827-1.729-6.388-2.12-10.583-1.162a.75.75 0 01-.334-1.462c4.587-1.048 8.52-.597 11.706 1.349a.75.75 0 01.243 1.032zm1.47-3.27a.938.938 0 01-1.29.305c-3.234-1.988-8.164-2.564-11.99-1.403a.937.937 0 01-.543-1.793c4.37-1.326 9.803-.682 13.518 1.601a.938.938 0 01.305 1.29zm.127-3.407C15.27 8.35 9.11 8.15 5.543 9.24a1.125 1.125 0 11-.652-2.153c4.125-1.25 10.981-1.008 15.308 1.626a1.125 1.125 0 01-1.086 1.973z" />
          </svg>
          Mit Spotify verbinden
        </motion.button>

        <motion.p
          className="connect-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          Kein Audio-Upload · Kein Premium erforderlich
        </motion.p>
      </div>
    </div>
  );
}
