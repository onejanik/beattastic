import { LegalPage } from './LegalPage';

export function PrivacyPage() {
  return (
    <LegalPage title="Datenschutzerklärung">

      <p className="legal-updated">Stand: Mai 2026</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlicher im Sinne der DSGVO ist der Betreiber dieser Instanz von Beattastic.
        Kontaktdaten siehe <a href="/impressum">Impressum</a>.
      </p>

      <h2>2. Grundsatz: Keine Datenspeicherung</h2>
      <p>
        Beattastic speichert <strong>keine personenbezogenen Daten auf eigenen Servern</strong>.
        Alle sensiblen Informationen (OAuth-Tokens, User-IDs) verbleiben ausschließlich im
        Arbeitsspeicher deines Browsers (<code>sessionStorage</code>) und werden beim Schließen
        des Tabs automatisch gelöscht.
      </p>

      <h2>3. Spotify-Modus</h2>
      <p>
        Wenn du dich mit Spotify verbindest, findet ein OAuth 2.0 PKCE-Austausch statt.
        Dabei werden folgende Daten verarbeitet:
      </p>
      <ul>
        <li>
          <strong>Spotify Access Token</strong> – wird ausschließlich im <code>sessionStorage</code>
          deines Browsers gespeichert, nie an unsere Server übertragen.
        </li>
        <li>
          <strong>Playback-State</strong> – Titelname, Interpret, Album, Fortschritt.
          Diese Daten werden direkt vom Spotify-Server an deinen Browser geliefert und
          von uns nicht gespeichert.
        </li>
      </ul>
      <p>
        Für die Verarbeitung durch Spotify gilt deren eigene{' '}
        <a href="https://www.spotify.com/de/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
          Datenschutzrichtlinie
        </a>.
      </p>

      <h2>4. Discord-Modus (optional)</h2>
      <p>
        Wenn du dich mit Discord verbindest, werden folgende Daten verarbeitet:
      </p>
      <ul>
        <li>
          <strong>Discord-OAuth-Code</strong> – wird auf unserem Bot-Server einmalig gegen einen
          Access Token getauscht. Der Token wird <em>nicht</em> gespeichert, sondern nur zur
          Abfrage deiner User-ID verwendet.
        </li>
        <li>
          <strong>Discord User-ID</strong> – eine öffentliche, nicht-personenbezogene Kennung.
          Sie wird im <code>sessionStorage</code> deines Browsers gespeichert und auf unserem
          Bot-Server als Subscription-Schlüssel für die WebSocket-Verbindung genutzt.
        </li>
        <li>
          <strong>Spotify-Aktivität via Discord-Presence</strong> – Titelname, Interpret, Album,
          Timestamps. Diese Daten werden in Echtzeit gestreamt und <em>nicht persistiert</em>.
          Im Arbeitsspeicher des Servers wird lediglich die zuletzt empfangene Presence pro
          User-ID zwischengespeichert (flüchtig, kein Datenbank-Einsatz).
        </li>
      </ul>
      <p>
        Für die Verarbeitung durch Discord gilt deren eigene{' '}
        <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
          Datenschutzrichtlinie
        </a>.
      </p>

      <h2>5. Lyrics-Abfragen (LRCLib)</h2>
      <p>
        Beim Laden von Songtexten wird eine Anfrage an{' '}
        <a href="https://lrclib.net" target="_blank" rel="noopener noreferrer">lrclib.net</a>{' '}
        gestellt. Dabei werden <strong>Titelname, Interpret, Album und Dauer</strong> als
        URL-Parameter übertragen. Es werden keine Kontodaten oder IP-Adressen von uns weitergegeben.
        LRCLib ist ein gemeinnütziges Open-Source-Projekt.
      </p>

      <h2>6. Hosting (Vercel)</h2>
      <p>
        Das Frontend wird über{' '}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a>{' '}
        ausgeliefert. Vercel kann dabei technische Zugriffsdaten (IP-Adresse, Zeitstempel,
        Browser-Typ) verarbeiten. Details findest du in{' '}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
          Vercels Datenschutzrichtlinie
        </a>.
      </p>

      <h2>7. Cookies &amp; Tracking</h2>
      <p>
        Beattastic verwendet <strong>keine Cookies</strong>, kein Analytics,
        kein Tracking, keine Werbung.
      </p>

      <h2>8. Deine Rechte (DSGVO)</h2>
      <p>
        Da wir keine personenbezogenen Daten dauerhaft speichern, entfallen die meisten
        Auskunftspflichten praktisch. Du hast dennoch das Recht auf:
      </p>
      <ul>
        <li>Auskunft (Art. 15 DSGVO)</li>
        <li>Berichtigung (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO) – durch Schließen des Tabs sofort wirksam</li>
        <li>Widerspruch (Art. 21 DSGVO)</li>
        <li>Beschwerde bei einer Aufsichtsbehörde</li>
      </ul>
      <p>
        Kontaktdaten für Anfragen: siehe <a href="/impressum">Impressum</a>.
      </p>

    </LegalPage>
  );
}
