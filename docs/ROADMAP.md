# ROADMAP (AiSoftLogic Agents Platform)

## Vision

Deliver a robust, self-serve platform where SMBs can “hire” AI Ops Agents (starting with Network Troubleshooter Agent) that operate safely via MCP and RAG.

## Phases

### Phase 0 — Foundations (DONE by this repo)

- Dockerized infra (Postgres, Redis, MinIO, Keycloak)
- API + Web skeleton, healthchecks & smoke tests
- CI (tests run on push/PR), docs & diagrams

**KPIs:** Green smoke, CI passing, local dev < 10m.

**DoD:**

- `make up`, `make smoke-curls`, `make test` are green
- Repo includes docs + diagrams

### Phase 1 — Agent SDK & Ops Agent (MCP + RAG)

- Introduce `agents/` SDK with adapters (MCP clients, vector store)
- Implement Network Troubleshooter Agent (diagnose/run playbooks)
- Audit logging, safe-ops sandbox

**KPIs:** First customer-visible agent demo; 5 core playbooks.

### Phase 2 — Multi-Agent Orchestration

- Jobs, scheduling, escalation, approvals
- Billing metering per job
- Observability dashboards

### Phase 3 — Marketplace & Extensibility

- Bring-your-own-tools (MCP servers), templates & shareable packs
- Usage-based billing + premium SLAs

(Details in `ARCHITECTURE.md`.)
