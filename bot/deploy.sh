#!/usr/bin/env bash
# =============================================================================
# Beattastic Bot – Ein-Befehl-Deployment
# =============================================================================
# Verwendung:
#   Erstes Setup:  bash deploy.sh
#   Update:        bash deploy.sh --update
# =============================================================================
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

log()  { echo -e "${BOLD}▶ $*${RESET}"; }
ok()   { echo -e "${GREEN}✓ $*${RESET}"; }
warn() { echo -e "${YELLOW}⚠ $*${RESET}"; }
err()  { echo -e "${RED}✗ $*${RESET}"; exit 1; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║       Beattastic Bot Deployment       ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════╝${RESET}"
echo ""

# ── 1. Docker prüfen / installieren ──────────────────────────────────────────
log "Prüfe Docker..."
if ! command -v docker &>/dev/null; then
    warn "Docker nicht gefunden. Installiere Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
    ok "Docker installiert. Bitte neu einloggen damit die Gruppe aktiv wird, dann erneut ausführen."
    exit 0
fi
ok "Docker $(docker --version | awk '{print $3}' | tr -d ',')"

# Prüfe ob docker compose verfügbar ist (Plugin oder standalone)
if docker compose version &>/dev/null 2>&1; then
    COMPOSE="docker compose"
elif command -v docker-compose &>/dev/null; then
    COMPOSE="docker-compose"
else
    warn "Docker Compose nicht gefunden. Installiere..."
    sudo apt-get install -y docker-compose-plugin 2>/dev/null \
        || sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
            -o /usr/local/bin/docker-compose \
        && sudo chmod +x /usr/local/bin/docker-compose
    COMPOSE="docker-compose"
fi
ok "Docker Compose verfügbar"

# ── 2. .env prüfen ───────────────────────────────────────────────────────────
log "Prüfe .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo ""
    warn "Keine .env gefunden. Eine Vorlage wurde unter bot/.env erstellt."
    echo ""
    echo "  Bitte folgende Werte eintragen:"
    echo ""
    echo "  ${BOLD}DISCORD_BOT_TOKEN${RESET}    → Discord Developer Portal → Bot → Token"
    echo "  ${BOLD}DISCORD_CLIENT_ID${RESET}    → Discord Developer Portal → OAuth2"
    echo "  ${BOLD}DISCORD_CLIENT_SECRET${RESET}→ Discord Developer Portal → OAuth2"
    echo "  ${BOLD}DISCORD_REDIRECT_URI${RESET} → https://api.deine-domain.com/auth/discord/callback"
    echo "  ${BOLD}FRONTEND_URL${RESET}         → https://beattastic.vercel.app"
    echo ""
    echo "  Danach erneut ausführen:  ${BOLD}bash deploy.sh${RESET}"
    echo ""
    exit 0
fi

# Pflichtfelder prüfen
REQUIRED=(DISCORD_BOT_TOKEN DISCORD_CLIENT_ID DISCORD_CLIENT_SECRET DISCORD_REDIRECT_URI FRONTEND_URL)
MISSING=()
for key in "${REQUIRED[@]}"; do
    val=$(grep -E "^${key}=" .env | cut -d= -f2- | tr -d '"' | xargs)
    if [ -z "$val" ]; then
        MISSING+=("$key")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    err "Folgende Pflichtfelder in .env fehlen noch:\n$(printf '  - %s\n' "${MISSING[@]}")"
fi
ok ".env vollständig"

# ── 3. Update: neuesten Code holen ───────────────────────────────────────────
if [[ "${1:-}" == "--update" ]]; then
    log "Hole neuesten Code von GitHub..."
    cd ..
    git pull --ff-only
    cd bot
    ok "Code aktualisiert"
fi

# ── 4. Container bauen und starten ───────────────────────────────────────────
log "Baue und starte Container..."
$COMPOSE up -d --build
ok "Container gestartet"

# ── 5. Health-Check ──────────────────────────────────────────────────────────
log "Warte auf Health-Check..."
sleep 5
for i in {1..12}; do
    STATUS=$(curl -sf http://localhost:3001/health 2>/dev/null | grep -o '"ok"' || true)
    if [ "$STATUS" = '"ok"' ]; then
        break
    fi
    sleep 5
done

if [ "$STATUS" = '"ok"' ]; then
    ok "Bot läuft und ist erreichbar"
else
    warn "Health-Check nicht erfolgreich. Logs prüfen:"
    echo "  $COMPOSE logs --tail=30"
fi

# ── 6. Zusammenfassung ────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║           Deployment fertig!          ║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════╝${RESET}"
echo ""
echo "  Nützliche Befehle:"
echo "  ${BOLD}make logs${RESET}       → Live-Logs anzeigen"
echo "  ${BOLD}make restart${RESET}    → Container neu starten"
echo "  ${BOLD}make update${RESET}     → Code updaten + neu deployen"
echo "  ${BOLD}make stop${RESET}       → Container stoppen"
echo ""
echo "  Nächster Schritt: nginx konfigurieren"
echo "  ${BOLD}sudo cp nginx.conf /etc/nginx/sites-available/beattastic-bot${RESET}"
echo "  ${BOLD}sudo certbot --nginx -d api.deine-domain.com${RESET}"
echo ""
