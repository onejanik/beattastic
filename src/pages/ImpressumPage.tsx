import { LegalPage } from './LegalPage';

export function ImpressumPage() {
  return (
    <LegalPage title="Impressum">

      <p className="legal-notice">
        Angaben gemäß § 5 DMG
      </p>

      <h2>Betreiber</h2>
      <p>

        Janik Färber<br />
        Stephan-Jantzen-Ring 14<br />
        18106 Rostock<br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
       
        E-Mail: <a href="mailto:admin@onejanik.xyz">admin@onejanik.xyz</a>
      </p>

      <h2>Hinweis zur Plattform</h2>
      <p>
        Beattastic ist ein privates Open-Source-Projekt und wird ohne kommerziellen Hintergrund
        betrieben. Der Quellcode ist auf{' '}
        <a href="https://github.com/onejanik/beattastic" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>{' '}
        öffentlich verfügbar.
      </p>

      <h2>Haftungsausschluss</h2>
      <p>
        Die über diese App angezeigten Songtexte stammen von{' '}
        <a href="https://lrclib.net" target="_blank" rel="noopener noreferrer">LRCLib</a>,
        einem freien Community-Projekt. Wir übernehmen keine Gewähr für Vollständigkeit
        oder Richtigkeit der Texte.
      </p>
      <p>
        Spotify® ist eine eingetragene Marke der Spotify AB. Discord® ist eine eingetragene
        Marke der Discord Inc. Beattastic ist weder mit Spotify noch mit Discord affiliiert.
      </p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>.<br />
        Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor
        einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>

    </LegalPage>
  );
}
