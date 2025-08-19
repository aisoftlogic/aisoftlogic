from fastapi import FastAPI, Depends
from app.deps import current_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/me")
def me(user = Depends(current_user)):
    # return minimal fields (extend later)
    return {
        "sub": user.get("sub"),
        "email": user.get("email"),
        "name": user.get("name"),
        "roles": user.get("_roles", []),
        "aud": user.get("aud"),
        "iss": user.get("iss"),
    }
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)