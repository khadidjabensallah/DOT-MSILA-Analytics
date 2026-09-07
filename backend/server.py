from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os
import sys

# Add src folder to the path to import eda and data_pipeline
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
from eda import calculate_kpis, aggregate_by_column, status_breakdown_by_column, get_monthly_metrics
from data_pipeline import extract_features

app = FastAPI(title="DOT M'SILA Complaint Analytics API", version="1.0")

# Allow CORS for all origins for testing, or frontend like Lovable/React URL (e.g. localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load global variables (paths relative to backend/)
backend_dir = os.path.dirname(os.path.abspath(__file__))
raw_path = os.path.join(backend_dir, "plaintes_clients_raw.csv")
encoder_path = os.path.join(backend_dir, "encoder.joblib")
model_path = os.path.join(backend_dir, "model.joblib")

# Try to load models at startup
try:
    preprocessor = joblib.load(encoder_path)
    model = joblib.load(model_path)
except Exception as e:
    print(f"Warning: Could not load ML models: {e}")
    preprocessor = None
    model = None

# Input Validation Model
class ComplaintInput(BaseModel):
    commune: str
    canal: str
    type_plainte: str
    date_plainte: str

@app.get("/api/stats")
async def get_stats():
    """
    Returns aggregated KPIs and breakdown for the dashboard.
    """
    if not os.path.exists(raw_path):
        raise HTTPException(status_code=500, detail="Data file not found")
        
    df = pd.read_csv(raw_path)
    kpis = calculate_kpis(df)
    commune_breakdown = aggregate_by_column(df, "commune")
    canal_breakdown = aggregate_by_column(df, "canal")
    type_breakdown = aggregate_by_column(df, "type_plainte")
    status_by_type = status_breakdown_by_column(df, "type_plainte")
    
    monthly_trends, volume_by_type = get_monthly_metrics(df)
    
    return {
        "kpis": kpis,
        "breakdown": {
            "commune": commune_breakdown,
            "canal": canal_breakdown,
            "type": type_breakdown,
            "status_by_type": status_by_type
        },
        "monthly_trends": monthly_trends,
        "volume_by_type": volume_by_type
    }

@app.get("/api/complaints")
async def get_complaints(skip: int = Query(0, ge=0), limit: int = Query(50, le=100)):
    """
    Returns a paginated list of complaints.
    """
    if not os.path.exists(raw_path):
        raise HTTPException(status_code=500, detail="Data file not found")
        
    df = pd.read_csv(raw_path)
    
    # Handle NaNs for JSON serialization
    df = df.fillna("")
    
    # Pagination
    total = len(df)
    paginated_df = df.iloc[skip:skip+limit]
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": paginated_df.to_dict(orient="records")
    }

@app.post("/api/predict")
async def predict_status(complaint: ComplaintInput):
    """
    Predict the resolution status of a new complaint.
    """
    if preprocessor is None or model is None:
        raise HTTPException(status_code=500, detail="Model pipeline not loaded.")
        
    # Convert input to DataFrame snippet
    input_data = pd.DataFrame([{
        "commune": complaint.commune,
        "canal": complaint.canal,
        "type_plainte": complaint.type_plainte,
        "date_plainte": complaint.date_plainte
    }])
    
    # Extract features the same way as data generation
    input_features = extract_features(input_data)
    
    # Required columns for preprocessor: ['commune', 'canal', 'type_plainte', 'month', 'weekday']
    X = input_features[['commune', 'canal', 'type_plainte', 'month', 'weekday']]
    
    try:
        # Preprocess
        X_encoded = preprocessor.transform(X)
        
        # Predict
        prediction_num = model.predict(X_encoded)[0]
        prediction_prob = model.predict_proba(X_encoded)[0]
        
        # Mapping back
        status = "Résolu" if prediction_num == 1 else "En Cours/Non Traité"
        confidence = float(max(prediction_prob))
        
        return {
            "prediction": status,
            "confidence_score": round(confidence, 4),
            "probabilities": {
                "En Cours/Non Traité": float(prediction_prob[0]),
                "Résolu": float(prediction_prob[1])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
