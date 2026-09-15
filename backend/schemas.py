"""
Pydantic Schemas for AGRISMART-AI REST API endpoints.
Enforces strict contracts for all core and bonus module endpoints.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# 1. HEALTH SCHEMA
# -------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    service: str = Field(..., example="AGRISMART-AI API")
    version: str = Field(..., example="1.0.0")
    model_checkpoint_loaded: bool = Field(..., example=False)
    timestamp: float

# -------------------------------------------------------------
# 2. PREDICT SCHEMAS
# -------------------------------------------------------------
class PredictResponse(BaseModel):
    status: str
    checkpoint_loaded: bool
    is_placeholder: bool
    prediction: str
    raw_class: Optional[str] = None
    crop: str
    pathogen: str
    severity: str
    confidence: float
    confidence_percentage: str
    precautions: List[str]
    disclaimer: str
    inference_time_ms: float
    model_info: Dict[str, Any]
    message: Optional[str] = None

# -------------------------------------------------------------
# 3. CROP RECOMMENDATION SCHEMAS (BONUS MODULE A)
# -------------------------------------------------------------
class CropRecommendRequest(BaseModel):
    soil_type: str = Field("Loamy", example="Loamy")  # Clay, Loamy, Sandy, Alluvial, Black Soil
    ph: float = Field(6.5, ge=0.0, le=14.0, example=6.5)
    temperature: float = Field(28.0, example=28.0)  # Celsius
    humidity: float = Field(70.0, example=70.0)      # %
    rainfall: float = Field(150.0, example=150.0)    # mm
    region: Optional[str] = Field("North India", example="North India")
    season: Optional[str] = Field("Kharif", example="Kharif")
    previous_crop: Optional[str] = Field("Legumes", example="Legumes")

class CropRecommendationItem(BaseModel):
    crop_name: str
    suitability_score: float
    suitability_percentage: str
    pathogen_resistance: str
    estimated_yield_boost: str
    reasoning: str
    nutrient_guidance: str

class CropRecommendResponse(BaseModel):
    status: str = "success"
    soil_summary: Dict[str, Any]
    top_recommendation: CropRecommendationItem
    alternative_recommendations: List[CropRecommendationItem]
    explainable_logic: str

# -------------------------------------------------------------
# 4. SMART IRRIGATION SCHEMAS (BONUS MODULE B)
# -------------------------------------------------------------
class IrrigationRequest(BaseModel):
    soil_moisture: float = Field(35.0, ge=0.0, le=100.0, example=35.0)  # %
    crop_type: str = Field("Tomato", example="Tomato")
    growth_stage: str = Field("Vegetative", example="Vegetative")       # Seedling, Vegetative, Flowering, Fruiting
    temperature: Optional[float] = Field(30.0, example=30.0)
    humidity: Optional[float] = Field(65.0, example=65.0)
    rain_forecast: Optional[str] = Field("High", example="High")         # None, Low, Moderate, High

class IrrigationResponse(BaseModel):
    status: str = "success"
    action: str                        # "Irrigate Now", "Suspend / Delay Irrigation", "Optimal Moisture"
    urgency: str                       # "Immediate", "Low", "Normal"
    foliar_blight_risk: str            # "High Spore Risk", "Low Risk", "Moderate"
    recommended_water_liters_per_sqm: float
    moisture_status: str
    reasoning: str
    solenoid_zone_recommendation: str

# -------------------------------------------------------------
# 5. GENAI FARMER ASSISTANT SCHEMAS (BONUS MODULE E)
# -------------------------------------------------------------
class ChatMessage(BaseModel):
    sender: str  # "user" or "ai"
    text: str

class AssistantRequest(BaseModel):
    message: str = Field(..., example="What precautions should I take for Early Blight?")
    user_name: Optional[str] = Field(None, example="Rahul Sharma")
    crop_context: Optional[str] = Field("Tomato", example="Tomato")
    disease_context: Optional[str] = Field("Tomato Early Blight", example="Tomato Early Blight")
    confidence_context: Optional[str] = Field("91%", example="91%")
    language: Optional[str] = Field("en", example="en")  # en, hi, pa, mr, gu, te, ta, bn
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    api_key: Optional[str] = Field(None, example="AIzaSy... or sk-...")

class AssistantResponse(BaseModel):
    status: str = "success"
    reply: str
    subtext: Optional[str] = None
    source: str = Field(..., example="Agronomic Expert Logic / GenAI Adapter")
    suggested_prompts: List[str]
    language: str = "en"

# -------------------------------------------------------------
# 6. VOICE ASSISTANT SCHEMAS (BONUS MODULE E)
# -------------------------------------------------------------
class VoiceRequest(BaseModel):
    audio_base64: Optional[str] = Field(None, example=None)
    transcription_text: Optional[str] = Field(None, example="How do I cure leaf spot?")
    user_name: Optional[str] = Field(None, example="Rahul Sharma")
    crop_context: Optional[str] = Field("Tomato", example="Tomato")
    disease_context: Optional[str] = Field("Tomato Early Blight", example="Tomato Early Blight")
    language: str = Field("en", example="en")  # en, hi, pa, mr, gu, te, ta, bn
    api_key: Optional[str] = Field(None, example="AIzaSy... or sk-...")

class VoiceResponse(BaseModel):
    status: str = "success"
    transcription: str
    reply_text: str
    audio_base64: Optional[str] = None  # Base64 TTS audio if available
    language: str
    is_placeholder_stt: bool = False
    suggested_prompts: Optional[List[str]] = Field(default_factory=list)
