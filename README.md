# Algérie Télécom - DOT M'SILA Complaint Analytics & Prediction System

![Dashboard Preview](https://github.com/khadidjabensallah/alg-telecom-backend/assets/111000/placeholder.png)

## Overview
This system is a full-stack analytical platform and machine learning demonstrator developed during my internship for **Algérie Télécom - Direction Opérationnelle des Télécommunications (DOT) de M'Sila**. It handles processing, analyzing, and predicting the outcome of customer complaints.

### Key Features
- **Exploratory Data Analysis**: Automatically extracts KPIs (Volume, Resolution Rate, Avg Resolution Time) and geographic breakdowns.
- **Machine Learning Predictor**: Uses pre-trained scikit-learn models (Random Forest) to predict whether a complaint will be resolved properly or exceed the SLA framework based on type, commune, and channel.
- **Dynamic Dashboard**: A premium, responsive React/Vite dashboard allowing interactive exploration of tickets, KPIs, and ML forecasts.

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, TanStack Router/Query, Tailwind CSS, Recharts, shadcn/ui.
- **Backend**: Python, FastAPI, Uvicorn.
- **Data & ML**: Pandas, scikit-learn, joblib.
- **Dashboard (Alternative)**: Streamlit.

---

## 📂 Project Structure
- `/insight-alg-dash` - The standalone Vite/React frontend dashboard.
- `/src` - Python backend logic (ML models, data pipelines, EDA functions).
- `server.py` - The FastAPI backend serving data points and ML predictions to the dashboard.
- `app.py` - An alternative Streamlit dashboard directly interfacing with models.
- `render.yaml` & `vercel.json` - Ready-to-go cloud deployment configs.

---

## 🚀 How to Run Locally

### 1. Backend (FastAPI)
Starts the data providing API on `http://localhost:8000`.
```bash
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000
```
*(The API documentation is then available at `http://localhost:8000/docs`)*

### 2. Frontend (React/Vite Dashboard)
Starts the modern front-end application on `http://localhost:8080`.
```bash
cd insight-alg-dash
npm install
npm run dev
```

### 3. Streamlit Explorer (Optional)
Starts Python's native dashboarding alternative on `http://localhost:8501`.
```bash
streamlit run app.py
```

---

## 🗄 Deployment

Deployment configurations are included out-of-the-box. 
- **Render**: The `render.yaml` is pre-configured to host both the FastAPI backend and Streamlit dashboard automatically.
- **Vercel**: Set `VITE_API_URL` to your hosted Backend API URL in Vercel to dynamically bind the React frontend.

---
**Credits**: Project developed for Algérie Télécom - M'Sila Internship.
