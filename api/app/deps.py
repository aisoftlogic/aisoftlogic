from typing import Dict
from fastapi import Depends, Header
from .security.jwt import decode_and_verify, AuthError

def get_bearer_token(authorization: str = Header(default="")) -> str:
    if not authorization.lower().startswith("bearer "):
        raise AuthError("missing_bearer", "Authorization: Bearer <token> required")
    return authorization.split(" ", 1)[1].strip()

def current_user(token: str = Depends(get_bearer_token)) -> Dict:
    return decode_and_verify(token)