import pandas as pd
import numpy as np

def calculate_kpis(df):
    """
    Calculate high-level KPIs from the dataset.
    """
    df = df.copy()
    if 'statut' not in df.columns:
        return {}

    total_complaints = len(df)
    resolved_complaints = len(df[df['statut'] == 'Résolu'])
    resolution_rate = (resolved_complaints / total_complaints) * 100 if total_complaints > 0 else 0
    
    avg_resolution_time = 0
    if 'date_resolution' in df.columns and 'date_plainte' in df.columns:
        df['date_plainte'] = pd.to_datetime(df['date_plainte'], errors='coerce')
        df['date_resolution'] = pd.to_datetime(df['date_resolution'], errors='coerce')
        resolved_df = df.dropna(subset=['date_resolution'])
        if not resolved_df.empty:
            resolution_times = (resolved_df['date_resolution'] - resolved_df['date_plainte']).dt.days
            avg_resolution_time = resolution_times.mean()
            
    return {
        "total_complaints": total_complaints,
        "resolution_rate_percent": round(resolution_rate, 2),
        "avg_resolution_time_days": round(avg_resolution_time, 2)
    }

def aggregate_by_column(df, column_name):
    """
    Aggregate complaints by a specific column (e.g., commune, canal, type_plainte).
    Returns a dictionary of counts.
    """
    if column_name not in df.columns:
        return {}
        
    counts = df[column_name].value_counts().to_dict()
    return counts

def status_breakdown_by_column(df, column_name):
    """
    Get the breakdown of statuts for each category in the specified column.
    """
    if column_name not in df.columns or 'statut' not in df.columns:
        return {}
        
    crosstab = pd.crosstab(df[column_name], df['statut'])
    return crosstab.to_dict(orient='index')

if __name__ == "__main__":
    import os
    
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_path = os.path.join(backend_dir, "plaintes_clients_raw.csv")
    
    if os.path.exists(raw_path):
        df = pd.read_csv(raw_path)
        print("KPIs:")
        print(calculate_kpis(df))
        
        print("\nBreakdown by Commune:")
        print(aggregate_by_column(df, "commune"))
        
        print("\nStatus Breakdown by Type:")
        print(status_breakdown_by_column(df, "type_plainte"))
    else:
        print(f"File not found: {raw_path}")

def get_monthly_metrics(df):
    if 'date_plainte' not in df.columns or 'statut' not in df.columns or 'type_plainte' not in df.columns:
        return [], []
    
    df = df.copy()
    df['date_plainte'] = pd.to_datetime(df['date_plainte'], errors='coerce')
    df_valid = df.dropna(subset=['date_plainte'])
    
    # Mapping for French short months
    months_map = {1: 'Jan', 2: 'Fév', 3: 'Mar', 4: 'Avr', 5: 'Mai', 6: 'Juin', 7: 'Juil', 8: 'Août', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Déc'}
    df_valid['month_num'] = df_valid['date_plainte'].dt.month
    df_valid['month'] = df_valid['month_num'].map(months_map)
    
    # Sort order by month
    months_order = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    
    trend_list = []
    volume_list = []
    
    for m in months_order:
        df_m = df_valid[df_valid['month'] == m]
        if df_m.empty:
            continue
            
        recues = len(df_m)
        resolues = len(df_m[df_m['statut'] == 'Résolu'])
        
        # calculate delai
        df_m_res = df_m.dropna(subset=['date_resolution']) if 'date_resolution' in df_m.columns else pd.DataFrame()
        if not df_m_res.empty:
            df_m_res['date_resolution'] = pd.to_datetime(df_m_res['date_resolution'], errors='coerce')
            delai = (df_m_res['date_resolution'] - df_m_res['date_plainte']).dt.days.mean()
            delai = round(delai, 1) if pd.notna(delai) else 0.0
        else:
            delai = 0.0
            
        trend_list.append({
            "month": m,
            "recues": recues,
            "resolues": resolues,
            "delai": delai
        })
        
        counts = df_m['type_plainte'].value_counts().to_dict()
        vol = {"month": m}
        for k, v in counts.items():
            vol[k] = v
        for t in ["ADSL", "FTTH Fibre", "Facturation", "Coupure Réseau", "Qualité Call Center"]:
            if t not in vol:
                vol[t] = 0
            # Some mock types don't exactly match the CSV 'type_plainte' values, let's just output whatever is in counts.
        volume_list.append(vol)
        
    return trend_list, volume_list

