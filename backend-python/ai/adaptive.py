import pandas as pd
import numpy as np
import os
import joblib
from typing import Dict, List, Any
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models')
if not os.path.exists(MODEL_PATH):
    os.makedirs(MODEL_PATH)

class AdaptiveLearningEngine:
    def __init__(self, db_connection=None):
        self.db = db_connection
        self.recommender = RandomForestRegressor(n_estimators=100, random_state=42)
        self.risk_model = LogisticRegression(random_state=42)
        self.le_subject = LabelEncoder()
        self.is_trained = False
    
    def train_models(self):
        """Train both recommendation and risk models from progress data"""
        if not self.db:
            print("No DB connection for training")
            return
        
        try:
            query = """
                SELECT p.*, e.subject, e.difficulty_level 
                FROM progress p 
                JOIN experiments e ON p.experiment_id = e.id
            """
            df = pd.read_sql(query, self.db)
            
            if len(df) < 5:
                print("Insufficient data for ML training")
                return

            # Preprocessing
            df['subject_enc'] = self.le_subject.fit_transform(df['subject'])
            
            # 1. Train Recommender (Predict score based on subject + progress)
            # Use score as target
            X = df[['subject_enc', 'completed_steps', 'time_spent']]
            y = df['score']
            self.recommender.fit(X, y)
            
            # 2. Train Risk Model (Predict if score < 50)
            y_risk = (df['score'] < 50).astype(int)
            self.risk_model.fit(X, y_risk)
            
            # Save models
            joblib.dump(self.recommender, os.path.join(MODEL_PATH, 'recommender.joblib'))
            joblib.dump(self.risk_model, os.path.join(MODEL_PATH, 'risk_model.joblib'))
            joblib.dump(self.le_subject, os.path.join(MODEL_PATH, 'le_subject.joblib'))
            
            self.is_trained = True
            print("Adaptive models trained successfully")
        except Exception as e:
            print(f"Training error: {e}")

    def get_recommendations(self, user_id: int) -> List[Dict]:
        """Recommend experiments the user hasn't done yet"""
        if not self.is_trained:
            self.load_models()
        
        try:
            cursor = self.db.cursor(dictionary=True)
            # Get experiments not done by user
            cursor.execute("""
                SELECT id, title, subject, difficulty_level 
                FROM experiments 
                WHERE id NOT IN (SELECT experiment_id FROM progress WHERE user_id = %s)
            """, (user_id,))
            available = cursor.fetchall()
            cursor.close()
            
            if not available or not self.is_trained:
                return []

            recommendations = []
            for exp in available:
                # Predict score for this experiment (simplified features)
                # subject_enc, completed_steps (avg), time_spent (avg)
                sub_enc = self.le_subject.transform([exp['subject']])[0]
                features = np.array([[sub_enc, 5, 300]]) # placeholders for typical steps/time
                pred_score = self.recommender.predict(features)[0]
                
                recommendations.append({
                    "experiment_id": exp['id'],
                    "title": exp['title'],
                    "subject": exp['subject'],
                    "predicted_score": round(float(pred_score), 1),
                    "reason": f"Matches your competency in {exp['subject']}"
                })
            
            # Sort by predicted score (recommend things they will do well in)
            return sorted(recommendations, key=lambda x: x['predicted_score'], reverse=True)[:3]
            
        except Exception as e:
            print(f"Recommendation error: {e}")
            return []

    def predict_risk(self, user_id: int) -> Dict:
        """Predict if a student is at risk (low scores predicted or actual)"""
        if not self.is_trained:
            self.load_models()

        try:
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("SELECT score, subject FROM progress WHERE user_id = %s", (user_id,))
            recent = cursor.fetchall()
            cursor.close()

            if not recent:
                return {"is_at_risk": False, "probability": 0.0}

            # Use average of recent performance
            df_recent = pd.DataFrame(recent)
            sub_enc = self.le_subject.transform(df_recent['subject']).mean()
            features = np.array([[sub_enc, 5, 300]])
            
            risk_prob = self.risk_model.predict_proba(features)[0][1]
            actual_avg = df_recent['score'].mean()
            
            is_at_risk = bool(risk_prob > 0.5 or actual_avg < 50)
            
            return {
                "user_id": user_id,
                "is_at_risk": is_at_risk,
                "probability": round(float(risk_prob), 2),
                "actual_avg_score": float(actual_avg)
            }
        except Exception as e:
            print(f"Risk prediction error: {e}")
            return {"is_at_risk": False, "error": str(e)}

    def load_models(self):
        """Load trained models from disk"""
        try:
            self.recommender = joblib.load(os.path.join(MODEL_PATH, 'recommender.joblib'))
            self.risk_model = joblib.load(os.path.join(MODEL_PATH, 'risk_model.joblib'))
            self.le_subject = joblib.load(os.path.join(MODEL_PATH, 'le_subject.joblib'))
            self.is_trained = True
        except:
            self.is_trained = False