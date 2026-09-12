/**
 * AGRISMART-AI API Helper Service
 * Connects React frontend UI components to FastAPI backend REST endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Checks backend API health & model checkpoint status
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline or unreachable:", err);
    return { status: "offline", error: err.message };
  }
}

/**
 * Submits crop leaf image for disease prediction (POST /api/predict)
 */
export async function predictDisease(imageFileOrBlob, crop = 'tomato', growthStage = 'vegetative', notes = '') {
  try {
    const formData = new FormData();
    if (imageFileOrBlob instanceof File || imageFileOrBlob instanceof Blob) {
      formData.append('file', imageFileOrBlob, imageFileOrBlob.name || 'leaf_specimen.jpg');
    } else if (typeof imageFileOrBlob === 'string' && imageFileOrBlob.startsWith('data:image')) {
      // Convert data URL to blob
      const res = await fetch(imageFileOrBlob);
      const blob = await res.blob();
      formData.append('file', blob, 'leaf_specimen.jpg');
    } else {
      throw new Error("Invalid image format provided for prediction.");
    }

    formData.append('crop', crop);
    formData.append('growth_stage', growthStage);
    if (notes) formData.append('notes', notes);

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Prediction request failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Predict error:", err);
    throw err;
  }
}

/**
 * Requests crop recommendation (POST /api/recommend) - Bonus Module A
 */
export async function recommendCrops(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Crop recommendation failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Crop Recommend error:", err);
    throw err;
  }
}

/**
 * Requests smart irrigation evaluation (POST /api/irrigation) - Bonus Module B
 */
export async function evaluateIrrigation(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/irrigation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Smart irrigation evaluation failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Smart Irrigation error:", err);
    throw err;
  }
}

/**
 * Queries AI Farmer Assistant (POST /api/assistant) - Bonus Module E
 */
export async function askAssistant(message, cropContext = 'Tomato', diseaseContext = 'Tomato Early Blight', history = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        crop_context: cropContext,
        disease_context: diseaseContext,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error(`Assistant query failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Assistant error:", err);
    throw err;
  }
}

/**
 * Sends voice input/transcript (POST /api/voice) - Bonus Module E
 */
export async function processVoice(transcriptionText, language = 'en') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcription_text: transcriptionText,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Voice endpoint error (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error("API Voice error:", err);
    throw err;
  }
}
