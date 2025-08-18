#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f infra/docker/compose.yml"

wait_for() {
  local name="$1" check_cmd="$2" timeout="${3:-60}"
  echo "==> Waiting for $name to be healthy (timeout ${timeout}s)..."
  local start now
  start=$(date +%s)
  while true; do
    if eval "$check_cmd" >/dev/null 2>&1; then
      echo "    $name is ready."
      return 0
    fi
    sleep 2
    now=$(date +%s)
    if (( now - start > timeout )); then
      echo "ERROR: $name not ready after ${timeout}s"
      return 1
    fi
  done
}

# DB: rely on compose health flag (string match)
wait_for "db"    "$COMPOSE ps | grep -E 'db[[:space:]].*\\(healthy\\)'" 60
# Redis: ping through container
wait_for "redis" "$COMPOSE exec -T redis redis-cli ping | grep -q PONG" 60
# MinIO: ready endpoint
wait_for "minio" "curl -fsS http://localhost:9000/minio/health/ready" 60
# Keycloak: OIDC discovery
wait_for "keycloak" "curl -fsS http://localhost:8081/realms/master/.well-known/openid-configuration" 90
# Web: HTTP status probe (accept any 2xx/3xx). Log code every second.
wait_for "web" '
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ || true)
  echo "    web http status: ${code}"
  case "$code" in
    2??|3??) exit 0 ;;
    *)       exit 1 ;;
  esac
' 90

echo "==> Web /"
curl -sI http://localhost:3000 | head -n1

echo "==> API /healthz"
curl -s http://localhost:8000/healthz

echo "==> MinIO :9000 (HEAD)"
curl -sI http://localhost:9000/minio/health/ready | head -n1

echo "==> Keycloak :8081 OIDC discovery (HEAD)"
curl -sI http://localhost:8081/realms/master/.well-known/openid-configuration | head -n1

echo "Smoke curls OK."