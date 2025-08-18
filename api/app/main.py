from fastapi import FastAPI

app = FastAPI(title="AiSoftLogic API - Phase 0")

@app.get("/healthz")
def healthz():
    return {"status": "ok"}