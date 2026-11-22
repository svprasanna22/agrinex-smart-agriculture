# AgriNex – Hybrid AI Framework for Smart Agriculture Using Explainable AI, Federated Learning and Edge Computing

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat&logo=react)](https://react.dev/)
[![PyTorch](https://img.shields.io/badge/Deep%20Learning-PyTorch%20MobileNetV3-EE4C2C?style=flat&logo=pytorch)](https://pytorch.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zero-Database](https://img.shields.io/badge/Architecture-Zero--Database%20Client%20Ledger-22c55e?style=flat)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌾 1. Project Overview

**AgriNex** is an open-source, full-stack decision-support system engineered for precision agriculture and smallholder farmers. It unites edge-based local computation, decentralized federated learning, and post-hoc Explainable AI (XAI) across five essential agricultural functions:

1. **Instant Crop Disease Diagnostics:** Classifies uploaded leaf photographs into Healthy, Diseased, or Uncertain categories using a fine-tuned MobileNetV3 neural network, generating localized PyTorch Grad-CAM attention heatmaps.
2. **Personalized Farmer Dashboard & Activity History:** Maintains a private browser-local activity ledger (`localStorage`) tracking previous evaluations, disease hotspots, and management steps without external database dependencies.
3. **Stoichiometric Fertilizer Recommendation:** Calculates exact N-P-K nutrient deficits, commercial fertilizer bags (Urea, DAP, MOP), soil leaching adjustments, and 3-stage split application schedules.
4. **Multi-Factor Crop Yield Forecasting:** Estimates seasonal harvest tonnage (tonnes/ha and quintals) based on multi-variate climate, soil texture, and irrigation data.
5. **Decentralized Federated Learning & Explainability Suite:** Simulates reliability-weighted Federated Averaging (FedAvg) with CORAL ordinal loss for weekly variable-rate irrigation zones, accompanied by SHAP Shapley values and LIME decision boundaries.

---

## 🚨 2. Problem Statement

Modern precision agriculture faces four persistent deployment bottlenecks:
- **Application Fragmentation:** Most existing software solutions address isolated tasks (e.g., crop recommendation only or pathology only) rather than offering a synchronized multi-decision support architecture.
- **Data Privacy & Ownership Concerns:** Centralizing proprietary farm data onto third-party cloud servers risks sensitive commercial and land information leakage.
- **Sensor Unreliability & Non-IID Field Data:** Long-term in-situ agricultural IoT sensors suffer from missing transmissions, flatlines, zero-dominated readings, and calibration drift.
- **Opaque "Black-Box" Decisions:** Without interpretable reasons and actionable counterfactual alternatives, farmer trust and adoption remain severely restricted.

---

## 🎯 3. Project Objectives

- **Democratize Agricultural AI:** Provide a clean, farmer-first interface designed for non-technical users on both desktop and mobile browsers.
- **Guarantee Privacy with Zero-Database Architecture:** Eliminate external databases (no MongoDB, MySQL, Firebase, or Supabase). All computations run statelessly in-memory or in the client's browser storage.
- **Deliver Transparent Explanations:** Pair every disease diagnosis with a Grad-CAM visual heatmap and accompany fertilizer recommendations with SHAP feature importance attributions.
- **Support Edge-Cloud Optimization:** Model decentralized federated learning where raw sensor data remains field-side on edge nodes (e.g., Raspberry Pi / Jetson).

---

## ✨ 4. Main Features

### A. Farmer Decision Portal (Farmer-Facing)
- **Demonstration Authentication:** Clean demo login (`farmer@agrinex.com` / `Farmer@123`) with session persistence in `localStorage`.
- **Dynamic Farmer Dashboard:** Live summary cards (Total Analyses, Healthy Crops, Diseased Crops, Fertilizer Plans, Last Analysis Date) derived from real local history.
- **Instant Crop Health Checker:**
  - Drag-and-drop file upload, native file picker, and direct smartphone camera capture.
  - Supports JPG, JPEG, PNG, and WEBP formats (up to 15MB).
  - Fine-tuned **MobileNetV3** classification across 39 PlantVillage condition classes.
  - Generates PyTorch **Grad-CAM attention heatmaps** highlighting infected foliar lesions.
  - Returns crop name, disease name, confidence %, pathological description, and organic/chemical recommendations.
- **My Crop History Ledger:**
  - Search evaluations by crop name or disease.
  - Filter by condition (Healthy, Diseased, Uncertain) or crop species.
  - Sort by date (Newest / Oldest first).
  - Inspection modal showing uploaded photos, Grad-CAM overlays, and management advice.
  - Delete individual records or reset the local history.
- **Fertilizer Recommendation Engine:**
  - Required inputs: Crop, Soil Type, Nitrogen (N), Phosphorus (P), Potassium (K), Moisture %, Soil pH, Farm Area.
  - Optional inputs: Growth stage, previous fertilizer, temperature, air humidity.
  - Computes commercial dosages (kg and 50 kg bags for Urea, DAP, and MOP).
  - Generates 3-stage split application schedules and pH corrective amendments (Limestone / Gypsum).
  - SHAP-style feature attribution indicating which nutrient deficit drove the dosage.
- **Crop Yield Prediction Engine:**
  - Inputs: Crop type, cultivated area, area unit (acres/ha), season (Kharif, Rabi, Zaid, Whole Year), soil texture, rainfall, temperature, irrigation availability.
  - Calculates predicted yield in tonnes/ha and total farm harvest in tonnes and quintals.
  - Breaks down agronomic capacity scores across soil fertility, moisture, irrigation, and thermal comfort.
- **System Settings & AI Diagnostics:**
  - Live model status monitor reporting the operational health of all loaded neural and statistical engines.
  - Browser storage memory manager.

### B. Research & Advanced Edge Modules (Scientist/Agronomist Facing)
- **AgroXAI Crop Recommender:** 22 crops, 99.24% Random Forest benchmark accuracy with minimal feature perturbation counterfactual what-if analysis.
- **Federated Ordinal Irrigation Management:** Simulates weekly Variable-Rate Irrigation (VRI) zone prediction across distributed edge clients using CORAL ordinal loss, achieving **0.975 Quadratic Weighted Kappa (QWK)** and **0.944 Accuracy**.
- **Comprehensive Explainable AI Suite:** SHAP waterfall plots, LIME tabular decision rules, cross-modal radar harmony, and the Tahir et al. (2025) Accuracy-Interpretability utility metric $UT(A, I)$.
- **Edge-Fog-Cloud Resource Optimizer:** Benchmarks edge inference latency (< 18.2 ms) against cloud processing, demonstrating 59% IoT energy reduction and 92.6% latency reduction.

---

## 💻 5. Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-based, type-safe reactive user interface |
| **Build Tool** | Vite 8.3 | Ultra-fast module bundling and hot module replacement (HMR) |
| **Styling & Design** | Tailwind CSS 3.4 | Agricultural design palette (Forest green, slate, off-white) |
| **Iconography** | Lucide React | Clean, responsive vector icons |
| **Backend Framework** | Python 3.10+ / FastAPI | High-performance asynchronous REST API with Pydantic validation |
| **Server Engine** | Uvicorn (ASGI) | Production-ready asynchronous server |
| **Deep Learning** | PyTorch & Torchvision | MobileNetV3 neural inference & Grad-CAM backpropagation |
| **Machine Learning** | Scikit-Learn & NumPy | Random forest, ordinal classifiers, and agronomic regression |
| **Image Processing** | Pillow (PIL) | In-memory image decoding, format validation, and thumbnail downscaling |
| **Data Architecture** | Zero-Database / In-Memory | In-memory state, high-performance CSVs, and client `localStorage` |

---

## 🏛️ 6. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. CLIENT PRESENTATION LAYER                          │
│  - React 19 + Vite Farmer Portal (Desktop & Mobile Responsive)              │
│  - Browser localStorage Activity Ledger (Zero-Database Privacy)             │
│  - Modules: Health Checker, Crop History, Fertilizer, Yield, Research Hub   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON & multipart/form-data)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       2. FASTAPI ASYNC BACKEND LAYER                        │
│  - Cross-Origin Resource Sharing (CORS) Middleware                          │
│  - Pydantic Request Validation & Streaming In-Memory Image Decoding         │
│  - Endpoints: /api/disease/*, /api/fertilizer/*, /api/yield/*, /api/model/* │
└──────────────────┬───────────────────┴───────────────────┬──────────────────┘
                   │                                       │
                   ▼                                       ▼
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│     3. DEEP LEARNING & CV ENGINE     ││   4. STATISTICAL & AGRONOMIC ENGINES │
│ - MobileNetV3 Large (39 Classes)     ││ - AgroXAI Random Forest (22 Crops)   │
│ - PyTorch Dynamic Grad-CAM Overlays  ││ - Stoichiometric NPK Deficit Engine  │
│ - Zero Disk Footprint (RAM-only)     ││ - Koksal (2026) Multi-Factor Yield   │
└──────────────────────────────────────┘│ - Federated Learning Ordinal Regressor│
                                        └──────────────────────────────────────┘
```

---

## 📁 7. Project Folder Structure

```
agrinex-smart-agriculture/
├── .env.example                         # Environment configuration template
├── .gitignore                           # Git exclusion rules (node_modules, cache, logs)
├── README.md                            # Comprehensive project documentation
├── start.bat                            # 1-Click Windows Batch launcher
├── start.ps1                            # 1-Click PowerShell launcher
├── crop_recommendation.csv              # Reference crop dataset (2,200 samples)
├── fertilizer_prediction.csv            # Reference fertilizer standard values
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # FastAPI application routes & middleware
│   │   ├── disease_classifier.py        # MobileNetV3 loader, inference & Grad-CAM
│   │   ├── fertilizer_analyzer.py       # NPK deficit calculator & split guidance
│   │   ├── crop_yield_engine.py         # Multi-factor yield estimation model
│   │   ├── crop_recommender.py          # AgroXAI Random Forest classifier
│   │   ├── xai_engine.py                # SHAP, LIME, and utility calculations
│   │   ├── irrigation_fl_engine.py      # Federated Learning FedAvg simulation
│   │   └── field_health_cv.py           # ExG computer vision & canopy analysis
│   ├── data/
│   │   ├── crop_recommendation.csv      # Kaggle precision agriculture dataset
│   │   └── fertilizer.csv               # Standard crop nutrient benchmarks
│   ├── models/
│   │   └── .gitkeep                     # Holds plant_village.pth (downloadable)
│   ├── download_model.py                # Helper script to download MobileNetV3 weights
│   ├── requirements.txt                 # Backend Python package dependencies
│   ├── run_backend.py                   # Server startup script (Port 8000)
│   └── test_all_upgraded_endpoints.py   # Automated integration test suite
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── LoginPage.tsx            # Demonstration farmer authentication
│   │   │   ├── Sidebar.tsx              # Responsive navigation sidebar
│   │   │   ├── FarmerDashboard.tsx      # Main dashboard with summary metrics
│   │   │   ├── FarmerHealthChecker.tsx  # Crop disease upload & Grad-CAM viewer
│   │   │   ├── CropHistoryPage.tsx      # LocalStorage-backed diagnosis ledger
│   │   │   ├── FertilizerRecommendationPage.tsx # Fertilizer form & dosage output
│   │   │   ├── CropYieldPredictionPage.tsx      # Harvest yield estimator
│   │   │   ├── SettingsPage.tsx         # Account settings & live model health
│   │   │   ├── OverviewTab.tsx          # System architecture breakdown
│   │   │   ├── CropRecommenderTab.tsx   # AgroXAI interactive tool
│   │   │   ├── XAITab.tsx               # SHAP/LIME technical explanation tab
│   │   │   ├── FederatedIrrigationTab.tsx # Federated learning rounds explorer
│   │   │   ├── FertilizerTab.tsx        # Stoichiometry research tab
│   │   │   ├── FieldDiagnosticsTab.tsx  # Computer vision inspection tab
│   │   │   ├── YieldOptimizerTab.tsx    # Edge-fog-cloud latency benchmarks
│   │   │   └── ResearchLibraryTab.tsx   # The 10 core research paper references
│   │   ├── services/
│   │   │   ├── api.ts                   # Typed API service functions
│   │   │   └── storage.ts               # LocalStorage manager with quota safeguards
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript type definitions
│   │   ├── App.css
│   │   ├── App.tsx                      # Root application component
│   │   ├── index.css                    # Tailwind CSS directives
│   │   └── main.tsx                     # React DOM entrypoint
│   ├── package.json                     # Frontend dependencies & scripts
│   ├── tsconfig.json                    # TypeScript compiler configuration
│   └── vite.config.ts                   # Vite bundler configuration
│
└── plant_disease_dataset/
    └── .gitkeep                         # User-uploaded images folder (cleared)
```

---

## 🛠️ 8. Installation Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python:** v3.10, v3.11, or v3.12 ([Download Python](https://www.python.org/))
- **Git:** Installed on your system

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/agrinex-smart-agriculture.git
cd agrinex-smart-agriculture
```

### Step 2: Configure Environment Variables
Copy the template file:
```bash
cp .env.example .env
```

---

## 🖥️ 9. Backend Execution Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Download the pre-trained MobileNetV3 disease classification model weights:
   ```bash
   python download_model.py
   ```
   *(This downloads `plant_village.pth` [17.2 MB] into `backend/models/`)*

5. Run the FastAPI backend server:
   ```bash
   python run_backend.py
   ```
   The backend server will start at `http://127.0.0.1:8000`.  
   Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## 🌐 10. Frontend Execution Instructions

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application dashboard will be available at `http://localhost:5173`.

### ⚡ One-Click Startup (Windows)
For convenience on Windows systems, double-click `start.bat` or run:
```powershell
.\start.ps1
```
This automatically launches both the backend and frontend servers in background windows.

---

## 📖 11. API Documentation

| Method | Endpoint | Description | Payload Format |
|---|---|---|---|
| `GET` | `/api/health` | Service health & architectural metadata | None |
| `GET` | `/api/model/status` | Real-time loading status of all 5 AI engines | None |
| `POST` | `/api/crop/diagnose` | Core disease diagnosis with MobileNetV3 | `multipart/form-data` (`file`) |
| `POST` | `/api/disease/predict` | Alias endpoint for disease prediction | `multipart/form-data` (`file`) |
| `POST` | `/api/disease/explain` | Returns pathology and Grad-CAM method notes | JSON `{ crop_name, disease_name }` |
| `POST` | `/api/fertilizer/recommend` | NPK deficit dosages, bags, & 3 split stages | JSON `FertilizerRecommendationRequest` |
| `POST` | `/api/yield/predict` | Multi-factor harvest yield prediction | JSON `YieldPredictionRequest` |
| `POST` | `/api/crops/predict` | AgroXAI crop recommendation (22 crops) | JSON `CropPredictionRequest` |
| `POST` | `/api/xai/shap` | SHAP waterfall explanation for crop choice | JSON `CropPredictionRequest` |
| `POST` | `/api/xai/lime` | LIME tabular decision rules | JSON `CropPredictionRequest` |
| `GET` | `/api/federated/round` | Aggregated parameters for FedAvg round | Query `?round_number=52` |

---

## 🧠 12. Model and Dataset Requirements

### 1. Plant Disease Classifier (MobileNetV3 Large)
- **Architecture:** `torchvision.models.mobilenet_v3_large` with 39-class linear classifier head (`Linear(1280, 39)`).
- **Dataset:** PlantVillage / New Plant Diseases Dataset (54,305 curated leaf images across 14 crop species).
- **Explainability:** Backpropagated gradient hook on `model.features[-1]` generating $(960, 7, 7)$ activation maps smoothed with a 12px Gaussian filter and colorized via a JET colormap.
- **Checkpoint Location:** `backend/models/plant_village.pth` (17.2 MB).

### 2. AgroXAI Crop Recommendation Engine
- **Algorithm:** Random Forest Classifier (100 estimators, Gini criterion).
- **Dataset:** `backend/data/crop_recommendation.csv` (2,200 rows with 7 soil/climate features: N, P, K, temperature, humidity, pH, rainfall).
- **Validation Accuracy:** 99.24% on 20% holdout test split.

### 3. Stoichiometric Fertilizer Knowledge Base
- **Dataset:** `backend/data/fertilizer.csv` and Indian Council of Agricultural Research (ICAR) benchmarks.
- **Chemistry:** Stoichiometric nutrient balancing for Urea (46% N), DAP (18% N, 46% P₂O₅), and MOP (60% K₂O) with soil percolation factors.

---

## 📸 13. Screenshots Section

*(Add your application screenshots here after deploying)*

| Screen | Description | Placeholder |
|---|---|---|
| **Farmer Dashboard** | Live metric cards, quick actions, and recent evaluations | `![Dashboard](docs/screenshots/dashboard.png)` |
| **Disease Detection** | Image dropzone, camera upload, and Grad-CAM heatmap | `![Disease Detection](docs/screenshots/disease_detection.png)` |
| **My Crop History** | Searchable local ledger with filterable condition tags | `![Crop History](docs/screenshots/crop_history.png)` |
| **Fertilizer Advisory** | Form inputs, 50kg bag calculations, and split stages | `![Fertilizer](docs/screenshots/fertilizer.png)` |
| **Yield Forecasting** | Multi-factor capacity scores and tonnes/ha forecast | `![Yield](docs/screenshots/yield.png)` |

---

## 📊 14. Current Implementation Status

| Feature / Module | Status | Verification Detail |
|---|---|---|
| **Demo Authentication** | ✅ Implemented | Browser `localStorage` session management; dummy account `farmer@agrinex.com` |
| **MobileNetV3 Plant Classifier** | ✅ Implemented | Live inference on 39 classes using real PyTorch model weights (`plant_village.pth`) |
| **Grad-CAM Visual Heatmaps** | ✅ Implemented | Real-time gradient backpropagation on layer `features[-1]` (< 15 ms latency) |
| **My Crop History** | ✅ Implemented | Client-side activity ledger with automatic thumbnail compression |
| **Fertilizer Stoichiometry** | ✅ Implemented | Verified NPK deficit formulas, commercial bag calculations, and pH remedies |
| **Yield Prediction** | ✅ Implemented | Multi-factor climate, soil, and irrigation regression engine |
| **AgroXAI Random Forest** | ✅ Implemented | 22-class crop classifier with 99.24% benchmark accuracy |
| **Explainable AI (SHAP/LIME)** | ✅ Implemented | Local feature importances, force plots, and decision rules |
| **Federated Learning Simulation** | ✅ Implemented | 77-round FedAvg convergence tracking with CORAL loss (0.975 QWK) |
| **Zero-Database Architecture** | ✅ Implemented | 100% database-free (no SQL/NoSQL external service required) |

---

## 🔮 15. Future Enhancements

- [ ] **On-Device WebAssembly Inference:** Port MobileNetV3 to ONNX Runtime Web / WebGPU for 100% offline edge execution directly in the client's smartphone browser.
- [ ] **Multilingual Vernacular Support:** Add localized translations (Hindi, Tamil, Telugu, Spanish, Swahili) to expand usability among smallholder farming communities.
- [ ] **Automated Satellite NDVI Retrieval:** Integrate Open-Meteo and Copernicus Sentinel-2 open APIs to automatically fetch real-time vegetation indices for given GPS coordinates.
- [ ] **Physical Hardware Edge Deployment:** Deploy client edge nodes to Raspberry Pi 4B / Jetson Orin Nano connected to physical Dragino LSE01 soil moisture sensors over LoRaWAN.

---

## 📚 16. Research References

This platform synthesizes algorithms and benchmark methodologies established in peer-reviewed precision agriculture literature:

1. **Vijay Prasanna S, Sakthi Sriram S, Nalin Naik M, Dr. Senthil Kumar Thangavel** (2026). *AgriNex – Hybrid AI Framework for Smart Agriculture Using Explainable AI, Federated Learning, and Edge Computing.* AgriNex Research Initiative.
2. **Ö. Turgut, İ. Kök, S. Özdemir** (2024). *AgroXAI: Explainable AI-Driven Crop Recommendation System for Agriculture 4.0.* arXiv:2412.16196.
3. **R. Mwawado et al.** (2026). *Reliability-Aware Federated Ordinal Learning for Weekly Irrigation Management Zone Prediction on Edge Nodes.* Smart Agricultural Technology, 15: 102460.
4. **H. A. Tahir, W. Alayed, W. U. Hassan** (2025). *A Federated Explainable AI Framework for Smart Agriculture: Enhancing Transparency, Efficiency, and Sustainability.* IEEE Access, 13: 97567–97584.
5. **S. M. Venkateswara, J. Padmanaban** (2025). *Interpretable Deep Learning Models for Independent Fertilizer and Crop Recommendation.* Scientific Reports (Nature), 15: 41721.
6. **D. D. Koksal, K. E. Bennin, B. Tekinerdogan** (2026). *Centralized and Vertical Federated Learning for Climate-Based Crop Yield Prediction.* Computers and Electronics in Agriculture, 249: 111851.
7. **D. M. Kabala et al.** (2023). *Image-Based Crop Disease Detection with Federated Learning.* Scientific Reports, 13: 19220.
8. **V. Hiremani et al.** (2025). *Federated Learning for Crop Yield Prediction.* MethodsX, 14: 103408.
9. **N. Alasbali et al.** (2025). *IoT-UAV Enabled Intelligent Resource Management in Low-Carbon Smart Agriculture Using Federated Reinforcement Learning.* IEEE Trans. Consumer Electronics.
10. **S. Shastri et al.** (2025). *Advancing Crop Recommendation System with Supervised Machine Learning and Explainable Artificial Intelligence.* Scientific Reports.

---

## 👥 17. Author and Team Credits

- **Vijay Prasanna S** – *Senior Software Architect & Full-Stack Lead*
- **Sakthi Sriram S** – *AI/ML & Deep Learning Engineer*
- **Nalin Naik M** – *Edge Computing & Embedded Systems Specialist*
- **Dr. Senthil Kumar Thangavel** – *Research Advisor & Project Supervisor*

---

## 📄 18. License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
