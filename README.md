# AGRISMART-AI 🌾🤖
> **Intelligent Agriculture for a Sustainable Future**  
> *SIH 2026 Hackathon Problem Statement 1 Submission*

---

## 📌 1. Project Overview & Scope

**AGRISMART-AI** is an AI-powered agricultural advisory platform designed for farmers, agronomists, and agricultural stakeholders. The platform combines Computer Vision foliar pathology detection, explainable crop cultivar recommendation, smart irrigation control, and a grounded GenAI conversational farmer assistant.

### 🏆 Implemented Challenge Scope
- **Mandatory Core Task:** Autonomous Crop Disease Detection from Leaf Images (ResNet-50 PyTorch Pipeline).
- **Bonus Module A:** Crop Recommendation Intelligence (`POST /api/recommend`).
- **Bonus Module B:** Smart Irrigation & Blight Prevention (`POST /api/irrigation`).
- **Bonus Module E:** GenAI Farmer Assistant & Voice Interface Adapter (`POST /api/assistant`, `POST /api/voice`).

---

## 🏗️ 2. System Architecture

```text
AGRISMART-AI/
├── frontend/             # React (Vite) + Tailwind CSS Premium UI
│   ├── src/
│   │   ├── components/   # DashboardTab, DetectionTab, ResultTab, AssistantTab, PrototypeTabs
│   │   ├── services/     # api.js (REST Client for FastAPI Backend)
│   │   └── utils/        # userStore.js (LocalStorage & Session state)
│   └── vite.config.js
├── backend/              # Python FastAPI REST API Backend
│   ├── main.py           # FastAPI entry point & CORS configuration
│   ├── config.py         # App configuration & environment setup
│   ├── schemas.py        # Pydantic request & response schemas
│   └── routes/           # health, predict, recommend, irrigation, assistant, voice
├── model/                # ML Model Adapter & Weights Directory
│   ├── adapter.py        # CropDiseaseModelAdapter (Isolates PyTorch inference)
│   ├── config.py         # 15 PlantVillage class mapping & agronomic metadata
│   └── weights/          # Destination for ML teammate's resnet50_best.pth
├── dataset/              # Dataset directory
│   └── PlantVillage/     # 15 class folders, train.csv (80%), val.csv (20%), train.py
├── report/               # Technical Model Report
│   └── SIH_Technical_Report.md
├── requirements.txt      # Python dependencies
├── README.md             # Project documentation & startup guide
└── .gitignore            # Git exclusion rules
```

---

## 🚀 3. Quick Start & Startup Instructions (Under 10 Minutes)

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ & npm installed

### Step 1: Clone Repository & Setup Backend Environment
```bash
# Clone repository
git clone https://github.com/Yuvraj9652/AGRISMART-AI.git
cd AGRISMART-AI

# Create and activate Python virtual environment
python -m venv venv

# On Windows PowerShell:
.\venv\Scripts\activate

# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Launch FastAPI Backend Server
```bash
# Start FastAPI backend (runs on http://localhost:8000)
python -m uvicorn backend.main:app --reload --port 8000
```
*Verify API docs live at: `http://localhost:8000/docs`*

### Step 3: Launch React/Vite Frontend
In a new terminal window:
```bash
# Navigate to frontend folder
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🔌 4. API Endpoints Contract

The backend exposes clean, structured REST API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & model checkpoint loaded status |
| `POST` | `/api/predict` | Uploads leaf image, runs ResNet-50 PyTorch adapter, returns prediction |
| `POST` | `/api/recommend` | Evaluates soil pH, temp, rainfall NPK & returns top crop recommendations |
| `POST` | `/api/irrigation` | Evaluates soil moisture & rain forecast to calculate drip irrigation decisions |
| `POST` | `/api/assistant` | Queries grounded agronomist expert AI assistant |
| `POST` | `/api/voice` | Regional voice STT / TTS assistant interface adapter |

---

## 🤖 5. ML Teammate Integration (.pth Checkpoint)

The model adapter in `model/adapter.py` isolates model loading and inference from the API code.

### Instructions for ML Teammate:
To plug in your trained PyTorch `.pth` model weights:
1. Train your model using `dataset/PlantVillage/train.py` or your custom notebook.
2. Save your trained state dict checkpoint as **`resnet50_best.pth`**.
3. Place the `.pth` file inside the `model/weights/` directory:
   ```text
   model/weights/resnet50_best.pth
   ```
4. **Checkpoint Requirements:**
   - Architecture: ResNet-50 backbone
   - Number of classes: 15 (matching `model/config.py`)
   - Class order: Alphabetical (matching `CLASS_NAMES` in `model/config.py`)
   - Input size: 224 × 224 RGB
   - Normalization: ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`
   - Checkpoint Dict Format: `{"model_state_dict": model.state_dict(), "classes": classes}`

*When `resnet50_best.pth` is placed in `model/weights/`, the backend automatically loads live PyTorch GPU/CPU inference on server restart!*

---

## 💬 6. GenAI Teammate Integration (API Keys)

To activate Gemini or OpenAI LLM generation in the Farmer Assistant:
1. Create a `.env` file in the root directory (or set environment variables):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```
2. The assistant router (`backend/routes/assistant.py`) automatically detects the key and switches from the grounded agronomic rule engine to live LLM generation.

---

## 📊 7. Dataset & Metrics Summary

- **Dataset:** PlantVillage Dataset (`dataset/PlantVillage`).
- **Classes:** 15 foliage disease classes across Tomato, Potato, and Bell Pepper.
- **Split:** 80% Train (`train.csv`), 20% Validation (`val.csv`).
- **Held-Out Test Set:** Reserved unseen field test set per Section 4.1 of the Problem Statement.
- **Primary Metric:** Macro-averaged F1 Score (evaluated on held-out test set).
- **Report Document:** Detailed technical report available in `report/SIH_Technical_Report.md`.

---

## 📹 8. Demo Walkthrough

1. **Dashboard (`/`):** View system telemetry, operational stats, and rapid diagnosis overview.
2. **Disease Detection Studio (`/detection`):** Upload or select a leaf specimen, select crop type, and click **Analyze Crop**. Triggers `POST /api/predict` and displays real classification, confidence, and precautionary measures.
3. **Diagnostic Results (`/result`):** Inspect lesion location, model confidence meter, disease biology, and actionable precautions.
4. **Crop Recommendation (`/recommendation`):** Adjust soil pH, temperature, and rainfall sliders to test `POST /api/recommend` decision logic.
5. **Smart Irrigation (`/irrigation`):** Adjust soil moisture and rain forecast to test `POST /api/irrigation` automated valve lockout logic.
6. **AI Assistant (`/assistant`):** Ask conversational agronomic questions or click suggested prompt pills to trigger `POST /api/assistant`.

---

## 📄 License & Originality Declaration
Submitted for **SIH 2026 Internal Hackathon**. Reused open-source libraries and pretrained models are cited above. Original solution architecture built for SIH evaluation.