# Makefile for AiSoftLogic project (Phase 0)
SHELL := /bin/bash
COMPOSE := docker compose -f infra/docker/compose.yml

.PHONY: help env env-reset up down logs ps rebuild nuke \
        test test-api test-web test-web-watch \
        coverage coverage-api coverage-web \
        smoke smoke-curls dev clean logs-%

# -------- Help --------
help:
	@echo "Targets:"
	@echo "  env              - create .env from .env.example if missing"
	@echo "  env-reset        - overwrite .env from .env.example"
	@echo "  up / down / ps   - manage docker compose stack"
	@echo "  logs             - tail logs for all services"
	@echo "  rebuild          - rebuild images (no cache)"
	@echo "  nuke             - down -v --remove-orphans"
	@echo "  test             - api + web unit tests"
	@echo "  test-api         - api unit tests (pytest)"
	@echo "  test-web         - web unit tests (vitest)"
	@echo "  smoke            - api + web smoke tests"
	@echo "  smoke-curls      - curl-based runtime checks"
	@echo "  dev              - start + logs for dev loop"
	@echo "  clean            - down + prune dangling images"

# -------- Environment --------
env:
	@if [ ! -f .env ]; then \
		cp .env.example .env && echo "✅ .env created from .env.example"; \
	else \
		echo "ℹ️  .env already exists, not overwritten"; \
	fi

env-reset:
	@cp .env.example .env && echo "♻️  .env reset from .env.example"

# -------- Compose lifecycle --------
up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

logs-%:
	$(COMPOSE) logs -f $*

rebuild:
	$(COMPOSE) build --no-cache

nuke:
	$(COMPOSE) down -v --remove-orphans

# -------- Tests --------
test: test-api test-web

test-api:
	docker compose -f infra/docker/compose.yml run --rm \
		-v "$$PWD/api:/app" \
		-e PYTHONPATH=/app \
		api pytest -q

test-web:
	$(COMPOSE) run --rm \
		-e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
		-e NODE_ENV=test \
		-v "$$PWD/web:/app" \
		web sh -lc 'corepack enable && pnpm install --no-frozen-lockfile >/dev/null && pnpm vitest run'

# ---- Smoke (fast, critical checks) ----
smoke:
	docker compose -f infra/docker/compose.yml run --rm \
		-v "$$PWD/api:/app" \
		-e PYTHONPATH=/app \
		api pytest -q -k smoke
	docker compose -f infra/docker/compose.yml run --rm \
		-e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
		-e NODE_ENV=test \
		-v "$$PWD/web:/app" \
		web sh -lc 'corepack enable && pnpm install --no-frozen-lockfile >/dev/null && pnpm vitest run -t "smoke:"'

smoke-curls:
	./scripts/smoke.sh

# -------- Dev & Clean --------
dev: up logs

clean:
	$(COMPOSE) down -v --remove-orphans
	docker image prune -f