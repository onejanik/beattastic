import { LegalPage } from './LegalPage';

export function AboutPage() {
  return (
    <LegalPage title="Über Beattastic">

      <h2>Was ist Beattastic?</h2>
      <p>
        Beattastic ist ein Open-Source-Webprojekt, das deine aktuell bei Spotify laufende Musik
        in echtzeitsynchronisierte Lyrics verwandelt – dargestellt als dynamische Kinetic Typography
        direkt im Browser. Kein Audio-Upload, kein Premium-Abo erforderlich.
      </p>

      <h2>Wie funktioniert es?</h2>
      <p>
        Beattastic verbindet sich über die offizielle{' '}
        <a href="https://developer.spotify.com" target="_blank" rel="noopener noreferrer">
          Spotify Web API
        </a>{' '}
        mit deinem Konto und fragt alle 3 Sekunden ab, was gerade läuft. Den Songtext bezieht
        die App von{' '}
        <a href="https://lrclib.net" target="_blank" rel="noopener noreferrer">
          LRCLib
        </a>
        , einer freien, werbefinanzierten Lyrics-Datenbank.
      </p>
      <p>
        Als Alternative steht ein Discord-Modus zur Verfügung: Ein Bot liest die Spotify-Aktivität
        direkt aus deinem Discord-Status und überträgt sie per WebSocket an den Browser – ohne
        Spotify-OAuth, ohne API-Limits.
      </p>

      <h2>Open Source</h2>
      <p>
        Der gesamte Quellcode ist öffentlich einsehbar auf{' '}
        <a href="https://github.com/onejanik/beattastic" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        . Jeder kann das Projekt forken, lokal hosten oder verbessern.
      </p>

      <h2>KI-Transparenz</h2>
      <p>
        Beattastic wurde gemeinsam mit <strong>Cursor</strong> (einem KI-gestützten Code-Editor)
        entwickelt. Idee, Produktentscheidungen und Ausrichtung lagen beim Entwickler – die KI
        hat bei Architektur, Implementierung und Debugging unterstützt.
      </p>
      <p>
        Wir halten Transparenz hier für selbstverständlich: KI ist ein Werkzeug, kein Ersatz für
        menschliche Kreativität.
      </p>

      <h2>Technologie</h2>
      <ul>
        <li>React 18 + TypeScript, gebaut mit Vite</li>
        <li>Framer Motion für Animationen</li>
        <li>Spotify Web API (OAuth 2.0 PKCE)</li>
        <li>LRCLib für synchronisierte Lyrics</li>
        <li>discord.js 14, Express, WebSocket (Discord-Modus)</li>
        <li>Gehostet auf Vercel (Frontend) und einem privaten Cloud-Server (Bot)</li>
      </ul>

      <h2>Kontakt</h2>
      <p>
        Fragen, Feedback oder Bugs? Einfach ein{' '}
        <a href="https://github.com/onejanik/beattastic/issues" target="_blank" rel="noopener noreferrer">
          GitHub Issue
        </a>{' '}
        erstellen.
      </p>

    </LegalPage>
  );
}
