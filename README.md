# DOT-MSILA-Analytics — Monorepo

A comprehensive, AI-enhanced customer complaint analytics platform designed to monitor, visualize, and predict issue resolutions across regional telecom operations.

## 📁 Repository Structure

This is a **monorepo** containing both backend and frontend applications:

```
DOT-MSILA-Analytics/
├── backend/                           # Python FastAPI backend
│   ├── .gitignore                     # Python-specific git ignore rules
│   ├── server.py                      # FastAPI server entry point
│   ├── app.py                         # Streamlit alternative dashboard
│   ├── requirements.txt               # Python dependencies
│   ├── src/                           # Python source code
│   │   ├── data_pipeline.py          # Data processing pipeline
│   │   ├── eda.py                    # Exploratory Data Analysis
│   │   └── model.py                  # ML model training
│   ├── encoder.joblib                 # Pre-trained OneHotEncoder
│   ├── model.joblib                   # Pre-trained RandomForest model
│   └── plaintes_*.csv                 # Dataset files
│
├── frontend/                          # React/Vite TypeScript frontend
│   ├── .gitignore                     # Node/Vite git ignore rules
│   ├── package.json                   # Node.js dependencies
│   ├── vite.config.ts                 # Vite bundler configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── src/                           # Frontend source code
│   │   ├── components/                # React UI components
│   │   ├── lib/                       # Utility functions & helpers ✅ NOW TRACKED
│   │   ├── routes/                    # Route definitions
│   │   ├── router.tsx                 # Router configuration
│   │   └── styles.css                 # Global styles
│   └── public/                        # Static assets
│
├── .gitignore                         # Root monorepo-level git ignore
└── README.md                          # This file
```

## 🎯 Project Overview

The **M'Sila Insights Hub** is an AI-enhanced customer complaint analytics platform that enables:

- **Executive KPI Dashboard**: Real-time metrics tracking complaint volume, resolution rates, and timelines
- **Visual Analytics**: Interactive charts analyzing complaint trends by category and status
- **Complaint Data Explorer**: Dynamic search and filtering across complaint tickets
- **ML Predictive Engine**: Random Forest model predicting complaint resolution probability

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 18+ with npm/bun
- Git

### Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khadidjabensallah/DOT-MSILA-Analytics.git
   cd DOT-MSILA-Analytics
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python server.py
   ```
   Backend API runs at `http://localhost:8000` (Swagger docs: `/docs`)

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

### Environment Variables

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

## 📦 Technologies

**Frontend**
- React 19 / TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Recharts (data visualization)
- TanStack Router

**Backend**
- Python 3.10
- FastAPI & Uvicorn
- Pandas / scikit-learn
- joblib (model serialization)

## 🔍 Key Features

### Machine Learning
- **Model**: Random Forest Classifier (scikit-learn)
- **Objective**: Predict complaint resolution (binary classification)
- **Features**: Categorical (`commune`, `canal`, `type_plainte`) + temporal (`month`, `weekday`)
- **Endpoint**: `POST /api/predict` with confidence scores

### Dashboard Tabs
1. **Tableau Exécutif**: KPI metrics and trend analysis
2. **Explorateur de Données**: Search and filter complaint database
3. **Prédiction & Insights**: Live model inference simulator

## 📝 Git Structure

Each directory has appropriate `.gitignore` rules:

| Directory | Rules |
|-----------|-------|
| `/backend` | Python venv, .egg-info, __pycache__, etc. |
| `/frontend` | node_modules, dist, .output, etc. |
| `/root` | IDE files, OS temp files, monorepo config |

✅ **This ensures the frontend `lib/` directory is now properly tracked and committed!**

## 🔧 Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

### Building for Production
```bash
# Backend (deployment via Render/Heroku)
cd backend

# Frontend
cd frontend
npm run build  # Creates optimized dist/
```

## 📊 Data

- **Dataset**: `plaintes_clients_raw.csv` - Raw complaint tickets
- **Format**: CSV with fields: date, commune, channel, type, description, status
- **Scope**: M'Sila region (prototype data, no real PII)

## ⚠️ Limitations & Future Work

### Current Limitations
- Static CSV dataset (no live DB integration)
- No authentication/RBAC
- Single-region model (requires retraining for drift)

### Planned Improvements
- PostgreSQL integration
- JWT authentication + role-based access
- Automated model retraining pipeline (Airflow)
- Real-time data ingestion

## 📚 Additional Resources

- Backend API Docs: `http://localhost:8000/docs`
- Frontend Config: `frontend/vite.config.ts`
- Model Pipeline: `backend/src/model.py`

## 👨‍💼 Internship Context

Developed as the capstone project for an internship at **Algérie Télécom — Direction Opérationnelle M'Sila (DOT M'SILA)**. Demonstrates integration of modern web tooling and ML into telecom customer service workflows.

## 👤 Author

**Khadidja Bensallah** — Computer Science & Artificial Intelligence
