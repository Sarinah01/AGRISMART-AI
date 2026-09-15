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
    user_name = (req.user_name or "Farmer").strip()
    lang = (req.language or "en").lower()
    crop = req.crop_context or "Tomato"
    disease = req.disease_context or "Tomato Early Blight"

    # Delegate query to farmer_assistant logic for LLM or dynamic fallback handling
    from backend.schemas import AssistantRequest
    assistant_req = AssistantRequest(
        message=input_text,
        user_name=user_name,
        crop_context=crop,
        disease_context=disease,
        language=lang,
        api_key=req.api_key
    )
    from backend.routes.assistant import farmer_assistant
    assistant_res = farmer_assistant(assistant_req)

    return VoiceResponse(
        status="success",
        transcription=input_text,
        reply_text=assistant_res.reply,
        audio_base64=None,
        language=lang,
        is_placeholder_stt=req.audio_base64 is None,
        suggested_prompts=SUGGESTED_PROMPTS_BY_LANG.get(lang, SUGGESTED_PROMPTS_BY_LANG["en"])
    )

