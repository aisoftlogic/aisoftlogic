# AiSoftLogic — Phase 0 (Agent Platform Foundations)

A tiny, production-oriented scaffold for an AI Agent platform:

- FastAPI API (`/healthz`) with Docker healthchecks.
- Next.js 14 web, pnpm, Vitest + @testing-library, jsdom.
- Redis, Postgres, MinIO, Keycloak with boot gating via healthchecks.
- Makefile targets, smoke curls, and CI with GitHub Actions.

## Quickstart

```bash
make env         # creates .env if missing
make up          # build & start all services
make smoke-curls # wait for health + curl checks
make test        # api + web tests
```


Open:

* Web: http://localhost:3000
* API: http://localhost:8000/healthz
* MinIO: http://localhost:9001 (console) / :9000 (S3)
* Keycloak: http://localhost:8081
