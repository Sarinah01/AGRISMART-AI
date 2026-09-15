"""
Security utilities for Password Hashing, JWT Tokens, and Google ID Token verification.
"""

import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from backend.config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES, GOOGLE_CLIENT_ID

def hash_password(password: str) -> str:
    """Hashes a plain text password using bcrypt with 72-byte max length limit."""
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against a stored bcrypt hash."""
    if not hashed_password:
        return False
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates a signed JWT token containing user identity and expiration info."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a signed JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def verify_google_id_token(token_str: str) -> Dict[str, Any]:
    """
    Verifies a Google ID Token server-side using Google Identity Services library.
    Returns verified payload dictionary containing 'sub', 'email', 'name', etc.
    Raises ValueError if validation fails.
    """
    try:
        id_info = id_token.verify_oauth2_token(
            token_str,
            google_requests.Request(),
            audience=None
        )

        if id_info.get("iss") not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer in Google ID token.")

        if "sub" not in id_info:
            raise ValueError("Google ID token missing 'sub' identifier.")

        return id_info
    except Exception as e:
        raise ValueError(f"Google ID token verification failed: {str(e)}")
