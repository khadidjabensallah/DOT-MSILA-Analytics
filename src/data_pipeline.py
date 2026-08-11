import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

def generate_synthetic_data(num_records=1500):
    """
    Generate synthetic data for DOT M'SILA customer complaints.
    """
    np.random.seed(42)
    random.seed(42)
    
    communes = ["M'Sila", "Bou Saâda", "Sidi Aïssa", "Ain El Hadjel"]
    canaux = ["Appel Call Center", "Formulaire Web", "Plainte Écrite"]
    types_plainte = ["ADSL", "Fibre FTTH", "Facturation", "Service Client", "Interruption Réseau"]
    statuts = ["Résolu", "En Cours", "Non Traité"]
    
    # Generate dates over the last 1 year
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    date_range = (end_date - start_date).days
    
    data = []
    for i in range(1, num_records + 1):
        client_id = f"CUST{i:04d}"
        commune = random.choice(communes)
        canal = random.choice(canaux)
        type_plainte = random.choice(types_plainte)
        statut = np.random.choice(statuts, p=[0.6, 0.25, 0.15]) # 60% Resolved, 25% In Progress, 15% Not Processed
        
        # Random date
        random_days = random.randint(0, date_range)
        date_plainte = start_date + timedelta(days=random_days)
        
        # Resolution date (only if resolved)
        date_resolution = np.nan
        if statut == "Résolu":
            resolution_days = random.randint(1, 14) # Takes 1-14 days to resolve
            date_resolution = (date_plainte + timedelta(days=resolution_days))
            if date_resolution > end_date:
                date_resolution = end_date
            date_resolution = date_resolution.strftime("%Y-%m-%d")
        
        data.append({
            "client_id": client_id,
            "commune": commune,
            "date_plainte": date_plainte.strftime("%Y-%m-%d"),
            "canal": canal,
            "type_plainte": type_plainte,
            "statut": statut,
            "date_resolution": date_resolution
        })
        
    df = pd.DataFrame(data)
    
    # Add some noise/missing values to simulate real world
    missing_indices = np.random.choice(df.index, size=int(num_records * 0.05), replace=False)
    df.loc[missing_indices, 'canal'] = np.nan
    
    # Split into raw and to_predict
    # We say 1400 raw for training, 100 recent for predicting (e.g. without status)
    df_raw = df.iloc[:1400].copy()
    df_predict = df.iloc[1400:].copy()
    
    # For prediction dataset, we can drop statut and date_resolution for realism, or keep them to evaluate.
    # The prompt mentions predicting status, we'll keep it for testing the endpoint, but let's drop it 
    # if it's meant to be new complaints. Actually we'll keep the columns for evaluation purposes but assume new.
    df_predict['statut'] = "Nouvelle"
    df_predict['date_resolution'] = np.nan
    
    return df_raw, df_predict

def clean_data(df):
    """
    Clean the dataset by handling missing values and converting types.
    """
    df = df.copy()
    # Handle missing values
    df['canal'] = df['canal'].fillna('Inconnu')
    
    # Convert dates
    df['date_plainte'] = pd.to_datetime(df['date_plainte'])
    if 'date_resolution' in df.columns:
        df['date_resolution'] = pd.to_datetime(df['date_resolution'])
        
    return df

def extract_features(df):
    """
    Extract temporal features from date_plainte.
    """
    df = df.copy()
    if not pd.api.types.is_datetime64_any_dtype(df['date_plainte']):
         df['date_plainte'] = pd.to_datetime(df['date_plainte'])
         
    df['month'] = df['date_plainte'].dt.month
    df['day'] = df['date_plainte'].dt.day
    df['weekday'] = df['date_plainte'].dt.weekday
    df['quarter'] = df['date_plainte'].dt.quarter
    
    return df

if __name__ == "__main__":
    print("Generating synthetic data...")
    df_raw, df_predict = generate_synthetic_data(1500)
    
    workspace_dir = "/home/bjservices/Desktop/internship"
    raw_path = os.path.join(workspace_dir, "plaintes_clients_raw.csv")
    predict_path = os.path.join(workspace_dir, "plaintes_nouvelles_a_predire.csv")
    
    df_raw.to_csv(raw_path, index=False, encoding='utf-8')
    df_predict.to_csv(predict_path, index=False, encoding='utf-8')
    
    print(f"Data saved to {raw_path}")
    print(f"Data saved to {predict_path}")
    
    print("Testing data cleaning and feature extraction...")
    df_clean = clean_data(df_raw)
    df_features = extract_features(df_clean)
    print("Successfully tested pipeline functions.")
