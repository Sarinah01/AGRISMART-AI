"""
Backend configuration settings for AGRISMART-AI FastAPI application.
"""

import os

PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

# Allowed origins for CORS (React frontend)
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  # Open CORS for local hackathon testing & demo
]

# Teammates GenAI API keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", None)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", None)

# Database Configuration (SQLite default)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agrismart.db")

# Google Identity Services Client ID
GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID",
    "794206114572-o0espebqkcgrs9cjpjvh9msb4u32nh0t.apps.googleusercontent.com"
)

# JWT Authentication Settings
import secrets
_env_jwt_secret = os.getenv("JWT_SECRET_KEY")
if not _env_jwt_secret:
    # Generate cryptographically secure secret if not explicitly provided
    JWT_SECRET_KEY = secrets.token_hex(32)
else:
    JWT_SECRET_KEY = _env_jwt_secret

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))  # 7 days
