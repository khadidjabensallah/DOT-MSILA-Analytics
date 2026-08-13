# M'Sila Insights Hub

A comprehensive, AI-enhanced customer complaint analytics platform designed to monitor, visualize, and predict issue resolutions across regional telecom operations.

## Overview

The **M'Sila Insights Hub** addresses the need for proactive customer service management. Telecommunications operations receive significant volumes of customer complaints across multiple channels. This platform empowers operational managers to dynamically analyze complaint trends and uses artificial intelligence to predict whether incoming complaints are likely to meet service-level agreements (SLAs). By bridging visual data exploration with proactive machine learning insights, it enables a shift from reactive to preventative customer service management.

## Key Features

- **Executive KPI Dashboard**: High-level metrics tracking total complaint volume, overall resolution rates, and average resolution time metrics.
- **Visual Analytics**: Interactive charts breaking down complaint volume by category and resolutions by status.
- **Complaint Data Explorer**: A dynamic tabular interface with advanced filtering (by status, commune, channel) and search functionality to investigate individual complaints.
- **Machine Learning Predictive Engine**: A dedicated inference simulator that accepts complaint parameters and computes a live confidence score on whether the issue will be successfully resolved.

## AI / Machine Learning

This project implements a full machine learning pipeline designed to predict complaint resolution outcomes.
- **Model Used**: Random Forest Classifier (trained using `scikit-learn`), selected over baseline Logistic Regression due to superior classification metrics.
- **Objective**: Predicts the boolean target outcome of a complaint (1 for *Résolu*, 0 for *En Cours* or *Non Traité*).
- **Input Features**: The model processes categorical data (`commune`, `canal`, `type_plainte`) and numeric temporal data (extracted `month`, `weekday`) via a `ColumnTransformer`.
- **Integration**: The trained pipeline (both `OneHotEncoder` and `RandomForestClassifier`) is serialized to disk via `joblib` and instantly served via a dedicated FastAPI endpoint (`/api/predict`). 

## Technologies

**Frontend**
- React 19 / TypeScript
- Vite
- Tailwind CSS
- Recharts (Data Visualization)
- shadcn/ui & Radix UI (Component primitives)
- Lucide React (Iconography)

**Backend & Data Science**
- Python 3.10
- FastAPI & Uvicorn
- Pandas
- scikit-learn
- joblib
- Streamlit (Secondary Python-native exploratory dashboard)

## Application Structure

The platform is designed in a decoupled architecture to separate logic from presentation:
- `/insight-alg-dash`: Contains the complete, stand-alone React/Vite Single Page Application (SPA).
- `/src`: Houses the Python data pipelines, Exploratory Data Analysis (EDA) functions, and the ML training script (`model.py`).
- `server.py`: The FastAPI application that acts as the bridge, exposing REST endpoints for fetching datasets and serving ML predictions.
- `app.py`: A supplementary Streamlit dashboard implementation.

## Dashboard

The primary dashboard consists of multiple distinct views:
1. **Tableau Exécutif**: Displays the primary KPI metrics alongside a line chart tracking resolution times and pie charts illustrating the distribution of complaint resolutions.
2. **Explorateur de données**: A paginated view of raw complaint tickets fetching directly from the backend API.
3. **Prédiction & insights**: The interface querying the Random Forest model for live resolution forecasting.

## Data

The core dataset (`plaintes_clients_raw.csv`) utilized in this demonstrator contains raw ticketing records featuring attributes such as complaint date, commune, channel, description, and final status. This is a prototype static dataset acting as the foundational data source for both analytics generation and model training. No confidential, real-world personal identifying information (PII) is exposed in this repository.

## Installation

To run this platform locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/khadidjabensallah/DOT-MSILA-Analytics.git
   cd DOT-MSILA-Analytics
   ```

2. **Launch the Backend (FastAPI)**
   ```bash
   pip install -r requirements.txt
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```
   *The Swagger UI documentation will available at `http://localhost:8000/docs`*

3. **Launch the Frontend (React)**
   Open a new terminal window:
   ```bash
   cd insight-alg-dash
   npm install
   npm run dev
   ```

## Environment Variables

The React frontend utilizes a centralized environment configuration to locate the backend API.
- Create a `.env` file in the `insight-alg-dash` directory.
- Define the following variable pointing to your backend address:
  ```env
  VITE_API_URL=http://localhost:8000
  ```

If no variable is set, the frontend defaults to `http://localhost:8000` for local development.

## Usage

1. Launch both the backend server and frontend development server.
2. Navigate to `http://localhost:8080/` in your web browser.
3. Switch between the Tabs to explore statistics, search the ticket database, or test the predictive model artificially by adjusting the dropdown parameters in the Predictive Tab.

## Limitations

As an internship proof-of-concept, the current implementation possesses the following limitations:
- **Static Dataset**: The analytics are derived from a static CSV snapshot. Live database ingestion pipelines were not implemented.
- **Authentication**: There is no authentication or Role-Based Access Control (RBAC) currently separating operational managers from standard agents.
- **Model Scope**: The model is trained on a limited geographical slice (M'Sila) and requires retraining logic to adapt to natural data drift.

## Future Improvements

- **Database Integration**: Migrate from static CSV ingestion to a robust relational database (e.g., PostgreSQL).
- **Authentication Layer**: Implement JWT-based sessions using a provider like Supabase or Firebase.
- **Automated Model Retraining**: Build an Airflow pipeline to refit the machine learning model nightly as new resolutions are registered in the system.

## Internship Context

This analytical platform and predictive model were conceptualized and developed as the capstone project for my internship at **Algérie Télécom — Direction Opérationnelle M'Sila (DOT M'SILA)**. The project objective was to demonstrate the feasibility of integrating modern web tooling and predictive machine learning into telecommunications customer service workflows.

## Author

Khadidja Bensallah  
*Computer Science — Artificial Intelligence*
