"""
AGRISMART-AI FastAPI Backend Application.
Entry point for REST API backend serving Core Crop Disease Classification & Bonus Modules A, B, E.
"""

import time
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import CORS_ORIGINS, HOST, PORT
from backend.routes import health, predict, recommend, irrigation, assistant, voice
from model.adapter import adapter_instance

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("agrismart.backend")

app = FastAPI(
    title="AGRISMART-AI REST API",
    description="Intelligent Agriculture for a Sustainable Future — SIH 2026 API Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(recommend.router)
app.include_router(irrigation.router)
app.include_router(assistant.router)
app.include_router(voice.router)

@app.on_event("startup")
def startup_event():
    logger.info("==================================================")
    logger.info("🚀 AGRISMART-AI FastAPI Backend Server Started")
    logger.info(f"Model Loaded Status: {adapter_instance.is_loaded}")
    if not adapter_instance.is_loaded:
        logger.info("ℹ️ ML Model Checkpoint pending in model/weights/resnet50_best.pth")
    logger.info(f"Swagger API Documentation: http://localhost:{PORT}/docs")
    logger.info("==================================================")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
