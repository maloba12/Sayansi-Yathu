import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any

class AnalyticsDashboard:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def generate_student_analytics(self, user_id: str) -> Dict[str, Any]:
        """Generate comprehensive analytics for a student"""
        
        # Learning velocity
        learning_velocity = self.calculate_learning_velocity(user_id)
        
        # Concept mastery
        concept_mastery = self.analyze_concept_mastery(user_id)
        
        # Performance trends
        performance_trends = self.get_performance_trends(user_id)
        
        # Common mistakes
        common_mistakes = self.identify_common_mistakes(user_id)
        
        # Peer comparison
        peer_comparison = self.compare_with_peers(user_id)
        
        # Recommendations
        recommendations = self.generate_recommendations(user_id)
        
        return {
            "user_id": user_id,
            "learning_velocity": learning_velocity,
            "concept_mastery": concept_mastery,
            "performance_trends": performance_trends,
            "common_mistakes": common_mistakes,
            "peer_comparison": peer_comparison,
            "recommendations": recommendations,
            "last_updated": datetime.now().isoformat()
        }
    
    def calculate_learning_velocity(self, user_id: str) -> Dict[str, float]:
        """Calculate how quickly student learns new concepts"""
        
        query = """
        SELECT experiment_id, completed_steps, time_spent, score, last_accessed
        FROM progress
        WHERE user_id = %s
        ORDER BY last_accessed ASC
        """
        
        df = pd.read_sql(query, self.db, params=[user_id])
        
        if len(df) < 3:
            return {"velocity": 0, "confidence": 0}
        
        # Calculate improvement rate
        df['learning_rate'] = df['score'].diff() / df['time_spent']
        avg_velocity = df['learning_rate'].mean()
        
        return {
            "velocity": max(0, avg_velocity),
            "confidence": min(1, len(df) / 10),
            "category": self.categorize_velocity(avg_velocity)
        }
    
    def analyze_concept_mastery(self, user_id: str) -> Dict[str, Any]:
        """Analyze mastery level for different concepts"""
        
        query = """
        SELECT e.subject, e.difficulty_level, p.score, p.completed_steps, p.total_steps
        FROM experiments e
        JOIN progress p ON e.id = p.experiment_id
        WHERE p.user_id = %s
        """
        
        df = pd.read_sql(query, self.db, params=[user_id])
        
        mastery = {}
        for subject in ['physics', 'chemistry', 'biology']:
            subject_data = df[df['subject'] == subject]
            if not subject_data.empty:
                mastery[subject] = {
                    "average_score": subject_data['score'].mean(),
                    "completion_rate": (subject_data['completed_steps'] / subject_data['total_steps']).mean(),
                    "difficulty_progression": self.analyze_difficulty_progression(subject_data),
                    "mastery_level": self.calculate_mastery_level(subject_data)
                }
        
        return mastery
    
    def get_performance_trends(self, user_id: str) -> Dict[str, List[Any]]:
        """Get performance trends over time"""
        
        query = """
        SELECT DATE(last_accessed) as date, AVG(score) as avg_score, COUNT(*) as experiments_completed
        FROM progress
        WHERE user_id = %s AND last_accessed >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(last_accessed)
        ORDER BY date
        """
        
        df = pd.read_sql(query, self.db, params=[user_id])
        
        return {
            "dates": df['date'].tolist(),
            "scores": df['avg_score'].tolist(),
            "experiments_completed": df['experiments_completed'].tolist(),
            "trend": self.calculate_trend(df['avg_score'])
        }
    
    def identify_common_mistakes(self, user_id: str) -> List[Dict[str, Any]]:
        """Identify common mistakes student makes"""
        
        # This would integrate with experiment-specific data
        mistakes = [
            {
                "concept": "pendulum_period",
                "mistake": "Using large angles (>15°) for simple pendulum",
                "frequency": 3,
                "last_occurrence": "2024-01-15"
            },
            {
                "concept": "chemical_equilibrium",
                "mistake": "Ignoring temperature effects on equilibrium",
                "frequency": 2,
                "last_occurrence": "2024-01-20"
            }
        ]
        
        return mistakes
    
    def generate_recommendations(self, user_id: str) -> List[str]:
        """Generate personalized recommendations"""
        
        recommendations = []
        
        # Based on weak areas
        mastery = self.analyze_concept_mastery(user_id)
        for subject, data in mastery.items():
            if data['average_score'] < 70:
                recommendations.append(f"Focus more on {subject} concepts")
        
        # Based on learning velocity
        velocity = self.calculate_learning_velocity(user_id)
        if velocity['velocity'] < 5:
            recommendations.append("Try breaking complex experiments into smaller steps")
        
        # Based on common mistakes
        mistakes = self.identify_common_mistakes(user_id)
        for mistake in mistakes[:3]:
            recommendations.append(f"Review {mistake['concept']} - common mistake detected")
        
        return recommendations
    
    def generate_class_analytics(self, class_id: str) -> Dict[str, Any]:
        """Generate analytics for entire class"""
        
        query = """
        SELECT u.name, p.experiment_id, p.score, e.subject, e.difficulty_level
        FROM users u
        JOIN progress p ON u.id = p.user_id
        JOIN experiments e ON p.experiment_id = e.id
        WHERE u.class_id = %s
        """
        
        df = pd.read_sql(query, self.db, params=[class_id])
        
        return {
            "class_average": df['score'].mean(),
            "subject_performance": df.groupby('subject')['score'].mean().to_dict(),
            "difficulty_distribution": df.groupby('difficulty_level')['score'].mean().to_dict(),
            "top_performers": self.get_top_performers(df, 5),
            "needs_attention": self.get_needs_attention_students(df),
            "class_insights": self.generate_class_insights(df)
        }