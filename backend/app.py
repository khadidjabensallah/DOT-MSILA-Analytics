import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import joblib
import os
import sys

# Add src to path for local imports
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
from eda import calculate_kpis

# Config
st.set_page_config(page_title="DOT M'SILA Complaints Analytics", layout="wide", page_icon="📶")

# Variables (paths relative to backend/)
backend_dir = os.path.dirname(os.path.abspath(__file__))
raw_path = os.path.join(backend_dir, "plaintes_clients_raw.csv")
encoder_path = os.path.join(backend_dir, "encoder.joblib")
model_path = os.path.join(backend_dir, "model.joblib")

@st.cache_data
def load_data():
    if os.path.exists(raw_path):
        return pd.read_csv(raw_path)
    return pd.DataFrame()

@st.cache_resource
def load_models():
    try:
        preprocessor = joblib.load(encoder_path)
        model = joblib.load(model_path)
        return preprocessor, model
    except:
        return None, None

df = load_data()
preprocessor, model = load_models()

st.title("📶 Dashboard Algérie Télécom (DOT M'SILA) - Analytics & ML")
st.markdown("Plateforme d'analyse et de prédiction des plaintes clients.")

if df.empty:
    st.error("Aucune donnée trouvée. Veuillez générer le dataset d'abord.")
    st.stop()

# KPIs
st.header("1. Indicateurs de Performance (KPIs)")
kpis = calculate_kpis(df)
col1, col2, col3 = st.columns(3)
col1.metric("Total des Plaintes", kpis.get("total_complaints", 0))
col2.metric("Taux de Résolution", f"{kpis.get('resolution_rate_percent', 0)} %")
col3.metric("Temps Moyen de Résolution", f"{kpis.get('avg_resolution_time_days', 0)} jours")

st.markdown("---")

# Charts
st.header("2. Analyse Exploratoire")
c1, c2 = st.columns(2)

with c1:
    st.subheader("Répartition par Commune")
    commune_counts = df['commune'].value_counts().reset_index()
    fig1 = px.pie(commune_counts, values='count', names='commune', hole=0.3, 
                  color_discrete_sequence=px.colors.sequential.RdBu)
    st.plotly_chart(fig1, use_container_width=True)

with c2:
    st.subheader("Canal de Soumission")
    canal_counts = df['canal'].value_counts().reset_index()
    fig2 = px.bar(canal_counts, x='canal', y='count', color='canal', 
                  template='plotly_white')
    st.plotly_chart(fig2, use_container_width=True)

st.subheader("Plaintes par Type et Statut")
type_status = pd.crosstab(df['type_plainte'], df['statut']).reset_index()
fig3 = px.bar(type_status, x='type_plainte', y=['En Cours', 'Non Traité', 'Résolu'], 
              barmode='group', template='plotly_white')
st.plotly_chart(fig3, use_container_width=True)

st.markdown("---")

# ML Prediction
st.header("3. Prédiction Intelligente (Machine Learning)")
st.markdown("Modèle entraîné (Random Forest) pour prédire si une nouvelle plainte sera **Résolue** ou **En Cours**.")

p_col1, p_col2 = st.columns(2)
with p_col1:
    in_commune = st.selectbox("Commune", ["M'Sila", "Bou Saâda", "Sidi Aïssa", "Ain El Hadjel"])
    in_type = st.selectbox("Type de Plainte", ["ADSL", "Fibre FTTH", "Facturation", "Service Client", "Interruption Réseau"])
with p_col2:
    in_canal = st.selectbox("Canal", ["Appel Call Center", "Formulaire Web", "Plainte Écrite"])
    in_date = st.date_input("Date de la plainte")

if st.button("Prédire le statut", type="primary"):
    if preprocessor and model:
        # Create input df
        import datetime
        from data_pipeline import extract_features
        input_data = pd.DataFrame([{
            "commune": in_commune,
            "canal": in_canal,
            "type_plainte": in_type,
            "date_plainte": in_date.strftime("%Y-%m-%d")
        }])
        
        # Extract features
        input_features = extract_features(input_data)
        X = input_features[['commune', 'canal', 'type_plainte', 'month', 'weekday']]
        
        try:
            X_encoded = preprocessor.transform(X)
            pred = model.predict(X_encoded)[0]
            probs = model.predict_proba(X_encoded)[0]
            
            status = "Résolu" if pred == 1 else "En Cours / Non Traité"
            color = "green" if pred == 1 else "orange"
            confidence = max(probs) * 100
            
            st.success(f"**Prédiction :** :{color}[{status}] (Confiance : {confidence:.2f}%)")
            
        except Exception as e:
            st.error(f"Erreur de prédiction: {e}")
    else:
        st.error("Le modèle n'est pas chargé. Avez-vous exécuté le script src/model.py ?")
