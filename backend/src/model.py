import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from data_pipeline import clean_data, extract_features

def prepare_data(df):
    """
    Prepare data for modeling.
    """
    df = clean_data(df)
    df = extract_features(df)
    
    # Drop records where target is missing if any
    df = df.dropna(subset=['statut'])
    
    # Target Mapping: Résolu -> 1, En Cours/Non Traité -> 0
    df['target'] = df['statut'].apply(lambda x: 1 if x == 'Résolu' else 0)
    
    features = ['commune', 'canal', 'type_plainte', 'month', 'weekday']
    X = df[features]
    y = df['target']
    
    return X, y

def build_preprocessor():
    """
    Build scikit-learn preprocessor.
    """
    categorical_features = ['commune', 'canal', 'type_plainte']
    numeric_features = ['month', 'weekday']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    return preprocessor

def evaluate_model(y_test, y_pred, model_name="Model"):
    """
    Evaluate the model and print metrics.
    """
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"--- {model_name} Metrics ---")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print("Confusion Matrix:")
    print(cm)
    print("-" * 30)

if __name__ == "__main__":
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_path = os.path.join(backend_dir, "plaintes_clients_raw.csv")
    
    if not os.path.exists(raw_path):
        print("Raw dataset not found.")
        exit(1)
        
    df = pd.read_csv(raw_path)
    X, y = prepare_data(df)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    preprocessor = build_preprocessor()
    
    # 1. Logistic Regression
    lr = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(random_state=42))
    ])
    lr.fit(X_train, y_train)
    y_pred_lr = lr.predict(X_test)
    evaluate_model(y_test, y_pred_lr, "Logistic Regression")
    
    # 2. Random Forest Classifier
    rf = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    evaluate_model(y_test, y_pred_rf, "Random Forest")
    
    # Save the best model (using RF as an example but in practice we'd compare)
    # The user asked to export preprocessor pipeline 'encoder.joblib' and 'model.joblib' to disk.
    
    # Fit the preprocessor separately to save as encoder.joblib
    preprocessor.fit(X_train)
    encoder_path = os.path.join(backend_dir, 'encoder.joblib')
    joblib.dump(preprocessor, encoder_path)
    
    # Note: RF performed inside the pipeline. Let's extract the trained classifier to save as model.joblib
    rf_classifier = rf.named_steps['classifier']
    model_path = os.path.join(backend_dir, 'model.joblib')
    joblib.dump(rf_classifier, model_path)
    
    print(f"Saved preprocessor to {encoder_path}")
    print(f"Saved model to {model_path}")
