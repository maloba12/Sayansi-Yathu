import pandas as pd
import numpy as np
from typing import Dict, List, Any
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

class AdaptiveLearningEngine:
    def __init__(self, db_connection):
        self.db = db_connection
        self.learning_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def generate_learning_path(self, user_id: str) -> Dict[str, Any]:
        """Generate personalized learning path for user"""
        
        # Get user data
        user_profile = self.get_user_profile(user_id)
        performance_data = self.get_performance_data(user_id)
        
        # Analyze learning style
        learning_style = self.analyze_learning_style(user_profile, performance_data)
        
        # Determine current level
        current_level = self.assess_current_level(performance_data)
        
        # Generate next steps
        next_experiments = self.recommend_next_experiments(user_id, current_level, learning_style)
        
        # Calculate estimated time
        estimated_time = self.estimate_completion_time(user_id, next_experiments)
        
        # Identify prerequisites
        prerequisites = self.check_prerequisites(user_id, next_experiments)
        
        # Create adaptive timeline
        timeline = self.create_adaptive_timeline(user_id, next_experiments)
        
        return {
            "user_id": user_id,
            "learning_style": learning_style,
            "current_level": current_level,
            "next_experiments": next_experiments,
            "estimated_time": estimated_time,
            "prerequisites": prerequisites,
            "timeline": timeline,
            "adaptation_reasons": self.explain_adaptation(user_id)
        }
    
    def analyze_learning_style(self, profile: Dict, performance: pd.DataFrame) -> Dict[str, str]:
        """Analyze student's learning preferences and style"""
        
        # Analyze time patterns
        time_patterns = self.analyze_time_patterns(performance)
        
        # Analyze success rates by difficulty
        difficulty_success = self.analyze_difficulty_success(performance)
        
        # Analyze subject preferences
        subject_preferences = self.analyze_subject_preferences(performance)
        
        # Determine learning style
        if time_patterns['prefers_short_sessions']:
            session_style = "micro-learning"
        elif time_patterns['prefers_long_sessions']:
            session_style = "deep-dive"
        else:
            session_style = "balanced"
        
        if difficulty_success['improves_with_scaffolding']:
            approach = "scaffolded"
        else:
            approach = "exploratory"
        
        return {
            "session_style": session_style,
            "approach": approach,
            "strongest_subject": subject_preferences['highest_score'],
            "weakest_subject": subject_preferences['lowest_score'],
            "preferred_difficulty": difficulty_success['optimal_difficulty']
        }
    
    def assess_current_level(self, performance: pd.DataFrame) -> Dict[str, Any]:
        """Assess student's current competency level"""
        
        if performance.empty:
            return {"level": 1, "confidence": "high", "description": "Beginner"}
        
        # Calculate composite score
        avg_score = performance['score'].mean()
        completion_rate = (performance['completed_steps'] / performance['total_steps']).mean()
        
        # Subject-specific levels
        subject_levels = {}
        for subject in ['physics', 'chemistry', 'biology']:
            subject_data = performance[performance['subject'] == subject]
            if not subject_data.empty:
                subject_levels[subject] = self.calculate_subject_level(subject_data)
        
        # Overall level
        overall_level = self.calculate_overall_level(avg_score, completion_rate, subject_levels)
        
        return {
            "overall_level": overall_level,
            "subject_levels": subject_levels,
            "avg_score": avg_score,
            "completion_rate": completion_rate
        }
    
    def recommend_next_experiments(self, user_id: str, current_level: Dict, learning_style: Dict) -> List[Dict[str, Any]]:
        """Recommend next experiments based on analysis"""
        
        # Get available experiments
        available_experiments = self.get_available_experiments(current_level['overall_level'])
        
        # Score experiments based on user profile
        scored_experiments = []
        for experiment in available_experiments:
            score = self.score_experiment(user_id, experiment, learning_style)
            scored_experiments.append({**experiment, "recommendation_score": score})
        
        # Sort by score and return top 5
        scored_experiments.sort(key=lambda x: x['recommendation_score'], reverse=True)
        return scored_experiments[:5]
    
    def create_adaptive_timeline(self, user_id: str, experiments: List[Dict]) -> Dict[str, Any]:
        """Create personalized timeline based on learning patterns"""
        
        user_patterns = self.get_user_learning_patterns(user_id)
        
        timeline = []
        cumulative_hours = 0
        
        for experiment in experiments:
            # Estimate time based on user patterns
            estimated_time = self.estimate_experiment_time(user_id, experiment)
            
            # Adjust based on difficulty and user skill
            difficulty_factor = self.get_difficulty_factor(experiment['difficulty_level'], user_id)
            adjusted_time = estimated_time * difficulty_factor
            
            timeline.append({
                "experiment_id": experiment['id'],
                "experiment_name": experiment['title'],
                "estimated_hours": adjusted_time,
                "start_time": cumulative_hours,
                "end_time": cumulative_hours + adjusted_time,
                "difficulty": experiment['difficulty_level'],
                "prerequisites": experiment.get('prerequisites', [])
            })
            
            cumulative_hours += adjusted_time
        
        return {
            "total_estimated_hours": cumulative_hours,
            "timeline": timeline,
            "weekly_breakdown": self.create_weekly_breakdown(timeline, user_patterns)
        }
    
    def predict_performance(self, user_id: str, experiment_id: str) -> Dict[str, float]:
        """Predict performance on a new experiment"""
        
        if not self.is_trained:
            self.train_model()
        
        user_features = self.extract_user_features(user_id)
        experiment_features = self.extract_experiment_features(experiment_id)
        
        features = np.array([user_features + experiment_features])
        features_scaled = self.scaler.transform(features)
        
        prediction = self.learning_model.predict_proba(features_scaled)[0]
        
        return {
            "predicted_score": float(prediction[1] * 100),
            "confidence": float(max(prediction)),
            "estimated_completion_time": self.predict_completion_time(user_id, experiment_id)
        }