import time
from typing import Any, Dict, Optional
import httpx
import jwt
from cachetools import TTLCache
from .errors import AuthError  # we'll add below
from app.config import settings

_jwks_cache = TTLCache(maxsize=4, ttl=600)  # 10 min

def _issuer() -> str:
    return f"{settings.KEYCLOAK_URL}/realms/{settings.KEYCLOAK_REALM}"

def _discovery_url() -> str:
    return f"{_issuer()}/.well-known/openid-configuration"

def _get_jwks() -> Dict[str, Any]:
    if "jwks" in _jwks_cache:
        return _jwks_cache["jwks"]
    with httpx.Client(timeout=5.0) as client:
        oidc = client.get(_discovery_url()).raise_for_status().json()
        jwks_uri = oidc["jwks_uri"]
        jwks = client.get(jwks_uri).raise_for_status().json()
        _jwks_cache["jwks"] = jwks
        return jwks

def _find_key(kid: str) -> Optional[Dict[str, str]]:
    jwks = _get_jwks()
    for k in jwks.get("keys", []):
        if k.get("kid") == kid:
            return k
    return None

def decode_and_verify(token: str) -> Dict[str, Any]:
    try:
        header = jwt.get_unverified_header(token)
    except jwt.InvalidTokenError as e:
        raise AuthError("invalid_token_header", str(e))
    kid = header.get("kid")
    if not kid:
        raise AuthError("missing_kid", "no 'kid' in JWT header")

    key = _find_key(kid)
    if not key:
        # Clear cache and try once more (key rotation)
        _jwks_cache.pop("jwks", None)
        key = _find_key(kid)
        if not key:
            raise AuthError("unknown_kid", f"kid {kid} not found in JWKS")

    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
    options = {"require": ["exp", "iat", "iss"], "verify_aud": True}
    decoded = jwt.decode(
        token,
        key=public_key,
        algorithms=[key.get("alg", "RS256")],
        issuer=_issuer(),
        audience=settings.KEYCLOAK_AUDIENCE,
        leeway=settings.JWT_LEEWAY_SECONDS,
        options=options,
    )
    # minimal shape we rely on
    decoded["_roles"] = decoded.get("realm_access", {}).get("roles", [])
    decoded["_now"] = int(time.time())
    return decoded