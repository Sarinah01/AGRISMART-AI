"""
GET /api/health endpoint.
"""

import time
from fastapi import APIRouter
from backend.schemas import HealthResponse
from model.adapter import adapter_instance

router = APIRouter()

@router.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(
        status="healthy",
        service="AGRISMART-AI FastAPI Backend",
        version="1.0.0",
        model_checkpoint_loaded=adapter_instance.is_loaded,
        timestamp=time.time()
    )
