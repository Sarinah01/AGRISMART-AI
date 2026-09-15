# AGRISMART-AI 🌾🤖
> **Intelligent Agriculture for a Sustainable Future**  
> *SIH 2026 Hackathon Submission*

---

## 📌 1. Project Overview & Scope

**AGRISMART-AI** is an AI-powered agricultural advisory platform designed for farmers, agronomists, and agricultural stakeholders. The platform combines Computer Vision foliar pathology detection, explainable crop cultivar recommendation, smart irrigation control, grounded GenAI conversational advisory, and server-side JWT / Google OAuth authentication.

### 🏆 Implemented Challenge Scope
- **Real JWT & Google Authentication Authority:** FastAPI backend authority, SQLite database via SQLAlchemy, secure password hashing, and Google Identity Services server-side token verification.
- **Mandatory Core Task:** Autonomous Crop Disease Detection from Leaf Images (ResNet-50 PyTorch Model Adapter).
- **Bonus Module A:** Crop Recommendation Intelligence (`POST /api/recommend`).
- **Bonus Module B:** Smart Irrigation & Blight Prevention (`POST /api/irrigation`).
- **Bonus Module E:** GenAI Farmer Assistant & Voice Interface Adapter (`POST /api/assistant`, `POST /api/voice`).

---

## 🔐 2. Authentication & Security Architecture

AGRISMART-AI implements real, production-ready authentication:

```text
React Frontend (Vite)
  ├── Google Identity Services (Client ID in VITE_GOOGLE_CLIENT_ID)
  ├── Auth & API Service (JWT stored in LocalStorage, Bearer Token)
  └── Protected Application UI
        │
        ▼ (HTTP REST API)
FastAPI Backend Authority
  ├── POST /api/auth/register
  ├── POST /api/auth/login
  ├── POST /api/auth/google  ──▶ Server-Side Verification via google.oauth2.id_token
  ├── GET  /api/auth/me      ──▶ Protected Endpoint (JWT Verification)
  └── POST /api/auth/logout
        │
        ▼
SQLite Database (SQLAlchemy)
  └── users table (id, email, name, password_hash, google_sub, auth_provider, created_at)
```

### Key Security Features
- **FastAPI Authentication Authority:** Backend verifies all credentials and issues signed JWT tokens.
- **SQLite Database:** Automatically creates `agrismart.db` using SQLAlchemy models on server startup.
- **Google OAuth Verification:** Google ID token is verified server-side using Google's public certs. Uses stable Google `sub` identifier.
- **Password Hashing:** Secure salted password hashing using `bcrypt`.
- **Environment Configuration:** All private secrets (`JWT_SECRET_KEY`, `DATABASE_URL`) are isolated in backend environment variables. Frontend only uses public `VITE_GOOGLE_CLIENT_ID`.

---

## ⚙️ 3. Environment Configuration

### Root Backend `.env` Setup
Create a `.env` file in the project root directory (copied from `.env.example`):

```env
GOOGLE_CLIENT_ID=794206114572-o0espebqkcgrs9cjpjvh9msb4u32nh0t.apps.googleusercontent.com
JWT_SECRET_KEY=agrismart_super_secret_jwt_key_sih_2026_demo
DATABASE_URL=sqlite:///./agrismart.db
GEMINI_API_KEY=
OPENAI_API_KEY=
```
*Note: If `JWT_SECRET_KEY` is omitted, the backend automatically generates a cryptographically secure 32-byte secret on startup.*

### Frontend `.env` Setup
Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=794206114572-o0espebqkcgrs9cjpjvh9msb4u32nh0t.apps.googleusercontent.com
```

---

## 🚀 4. Quick Start & Startup Instructions

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ & npm installed

### Step 1: Setup Backend & Virtual Environment
```bash
# Clone repository
git clone https://github.com/Yuvraj9652/AGRISMART-AI.git
cd AGRISMART-AI

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Launch FastAPI Backend Server
```bash
# Start FastAPI backend (runs on http://localhost:8000)
python -m uvicorn backend.main:app --reload --port 8000
```
*Database `agrismart.db` is initialized automatically on startup.*  
*Interactive Swagger Documentation live at: `http://localhost:8000/docs`*

### Step 3: Launch React/Vite Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🔌 5. API Endpoints Contract

| Group | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Registers new user and returns JWT token |
| **Auth** | `POST` | `/api/auth/login` | Authenticates email + password and returns JWT token |
| **Auth** | `POST` | `/api/auth/google` | Verifies Google ID token server-side and issues JWT |
| **Auth** | `GET` | `/api/auth/me` | Protected route returning authenticated user profile |
| **Auth** | `PUT` | `/api/auth/profile` | Updates user profile details in SQLite database |
| **Auth** | `POST` | `/api/auth/logout` | Client session logout acknowledgement |
| **System** | `GET` | `/api/health` | System health check & model checkpoint loaded status |
| **Core** | `POST` | `/api/predict` | Uploads leaf image, runs ResNet-50 PyTorch adapter |
| **Bonus A** | `POST` | `/api/recommend` | Evaluates soil pH, temp, rainfall NPK & crop suitability |
| **Bonus B** | `POST` | `/api/irrigation` | Evaluates soil moisture & rain forecast for smart irrigation |
| **Bonus E** | `POST` | `/api/assistant` | Queries grounded agronomist expert AI assistant |
| **Bonus E** | `POST` | `/api/voice` | Regional voice STT / TTS assistant interface adapter |

---

## 🤖 6. Service Availability & ML / GenAI Integration Status

AGRISMART-AI follows a **Strict Integration Boundary** design pattern. It does NOT generate fake or hardcoded predictions to pretend a model is loaded when it is not.

- **ML ResNet-50 Model Adapter (`model/adapter.py`):**
  - Accepts `.pth` PyTorch weights placed in `model/weights/resnet50_best.pth`.
  - When checkpoint is loaded, executes real PyTorch ResNet-50 inference.
  - When `.pth` checkpoint is pending, returns explicit adapter status (`checkpoint_loaded: false`, `is_placeholder: true`) so the UI displays an authentic status badge.

- **GenAI Farmer Assistant (`backend/routes/assistant.py`):**
  - Connects dynamically to Gemini LLM (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`).
  - If API key is missing, returns `status: "service_unavailable"` informing the user that GenAI API keys are pending configuration, rather than outputting hardcoded AI responses.

---

## 📄 License & Originality Declaration
Submitted for **SIH 2026 Hackathon Evaluation**. Reused open-source libraries and pretrained models are cited above. Original solution architecture built for SIH evaluation.
License & Originality Declaration
Submitted for **SIH 2026 Internal Hackathon**. Reused open-source libraries and pretrained models are cited above. Original solution architecture built for SIH evaluation.