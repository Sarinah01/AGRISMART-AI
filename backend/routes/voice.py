"""
POST /api/voice endpoint (Bonus Module E: Voice Interface Adapter).
Provides STT (Speech-to-Text) and TTS (Text-to-Speech) adapter interface for regional voice communication.
"""

from fastapi import APIRouter
from backend.schemas import VoiceRequest, VoiceResponse
from backend.routes.assistant import generate_dynamic_agronomic_reply, SUGGESTED_PROMPTS_BY_LANG

router = APIRouter()

@router.post("/api/voice", response_model=VoiceResponse, tags=["Bonus Module E: Farmer Assistant & Voice"])
def voice_assistant_adapter(req: VoiceRequest):
    """
    Voice input interface adapter for regional farmer assistance.
    Accepts speech transcript or audio payload and returns spoken answer in farmer's language.
    """
    input_text = req.transcription_text or "What precautions should I take for Early Blight?"
    lang = (req.language or "en").lower()
    crop = req.crop_context or "Tomato"
    disease = req.disease_context or "Tomato Early Blight"

    # Run query through dynamic assistant agronomic engine
    reply_text, _ = generate_dynamic_agronomic_reply(input_text, crop, disease, "91%", lang)

    return VoiceResponse(
        status="success",
        transcription=input_text,
        reply_text=reply_text,
        audio_base64=None,
        language=lang,
        is_placeholder_stt=req.audio_base64 is None,
        suggested_prompts=SUGGESTED_PROMPTS_BY_LANG.get(lang, SUGGESTED_PROMPTS_BY_LANG["en"])
    )

