# Beattastic Bot – Makefile für häufige Befehle
# Verwendung: make <ziel>

COMPOSE = docker compose

.PHONY: start stop restart logs update build

start:       ## Container bauen und starten
	$(COMPOSE) up -d --build

stop:        ## Container stoppen
	$(COMPOSE) down

restart:     ## Container neu starten (ohne Rebuild)
	$(COMPOSE) restart

logs:        ## Live-Logs anzeigen (Ctrl+C zum Beenden)
	$(COMPOSE) logs -f

build:       ## Nur bauen, nicht starten
	$(COMPOSE) build

update:      ## Neuesten Code von GitHub holen + neu deployen
	cd .. && git pull --ff-only && cd bot && $(COMPOSE) up -d --build

status:      ## Container-Status anzeigen
	$(COMPOSE) ps

health:      ## Health-Check manuell ausführen
	@curl -sf http://localhost:3001/health && echo "" || echo "Bot nicht erreichbar"
