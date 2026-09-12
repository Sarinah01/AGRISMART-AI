"""
POST /api/predict endpoint.
Accepts crop/leaf image upload and runs prediction through dedicated model adapter.
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from backend.schemas import PredictResponse
from model.adapter import adapter_instance

router = APIRouter()

@router.post("/api/predict", response_model=PredictResponse, tags=["Disease Detection"])
async def predict_crop_disease(
    file: Optional[UploadFile] = File(None),
    crop: Optional[str] = Form("tomato"),
    growth_stage: Optional[str] = Form("vegetative"),
    notes: Optional[str] = Form(None)
):
    """
    Accepts crop leaf image and executes classification pipeline via dedicated model adapter.
    If .pth checkpoint is loaded, performs real PyTorch ResNet-50 inference.
    If .pth checkpoint is pending, returns integration placeholder.
    """
    if file is None:
        # If no file provided, read default sample image if needed or raise 400
        raise HTTPException(status_code=400, detail="Image file is required for crop disease prediction.")

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        prediction = adapter_instance.predict(contents)
        return PredictResponse(**prediction)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
