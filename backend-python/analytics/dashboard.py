import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any

class AnalyticsDashboard:
    def __init__(self, db_connection=None):
        self.db = db_connection
    
    def generate_student_analytics(self, user_id: int) -> Dict[str, Any]:
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

    # -----------------------------------------------------------------------
    # Refactor Implementation (REC-03)
    # These methods provide the exact structure expected by the React frontend
    # -----------------------------------------------------------------------

    def get_student_summary(self, user_id: int) -> Dict[str, Any]:
        """Return progress statistics for a single student (replaces inline logic in app.py)"""
        if not self.db: return {"success": False, "error": "No database connection"}

        try:
            # We use the db connection passed in constructor
            cursor = self.db.cursor(dictionary=True)

            # 1. Overall stats
            cursor.execute("""
                SELECT
                    COUNT(*)                          AS experiments_completed,
                    COALESCE(AVG(score), 0)           AS avg_score,
                    COALESCE(SUM(time_spent), 0)      AS total_time_spent
                FROM progress
                WHERE user_id = %s
            """, (user_id,))
            overall = cursor.fetchone()

            # 2. Performance by subject (last 30 days)
            cursor.execute("""
                SELECT e.subject,
                       ROUND(AVG(p.score), 1)         AS avg_score,
                       COUNT(*)                       AS experiments_done
                FROM progress p
                JOIN experiments e ON e.id = p.experiment_id
                WHERE p.user_id = %s
                  AND p.last_accessed >= DATE_SUB(Now(), INTERVAL 30 DAY)
                GROUP BY e.subject
            """, (user_id,))
            by_subject = cursor.fetchall()

            # 3. Score trend (last 10 sessions)
            cursor.execute("""
                SELECT DATE(p.last_accessed) AS date,
                       ROUND(AVG(p.score), 1) AS avg_score
                FROM progress p
                WHERE p.user_id = %s
                GROUP BY DATE(p.last_accessed)
                ORDER BY date DESC
                LIMIT 10
            """, (user_id,))
            trend_rows = cursor.fetchall()
            trend = [{"date": str(r["date"]), "avg_score": r["avg_score"]} for r in reversed(trend_rows)]

            cursor.close()

            return {
                "success": True,
                "overall": {
                    "experiments_completed": overall["experiments_completed"],
                    "avg_score": round(float(overall["avg_score"]), 1),
                    "total_time_spent": overall["total_time_spent"]
                },
                "by_subject": by_subject,
                "trend": trend
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_class_summary(self) -> Dict[str, Any]:
        """Return aggregated class performance for teachers (replaces inline logic in app.py)"""
        if not self.db: return {"success": False, "error": "No database connection"}

        try:
            cursor = self.db.cursor(dictionary=True)

            # 1. Subject performance averages
            cursor.execute("""
                SELECT e.subject,
                       ROUND(AVG(p.score), 1)  AS average,
                       COUNT(DISTINCT p.user_id) AS student_count
                FROM progress p
                JOIN experiments e ON e.id = p.experiment_id
                GROUP BY e.subject
            """)
            subject_perf = cursor.fetchall()

            # 2. Recent activity (last 20 sessions across all students)
            cursor.execute("""
                SELECT u.name AS student, e.title AS target,
                       p.score, p.last_accessed
                FROM progress p
                JOIN users u ON u.id = p.user_id
                JOIN experiments e ON e.id = p.experiment_id
                ORDER BY p.last_accessed DESC
                LIMIT 20
            """)
            recent_rows = cursor.fetchall()
            recent = [{
                "student": r["student"],
                "target": r["target"],
                "score": float(r["score"]),
                "time": str(r["last_accessed"])
            } for r in recent_rows]

            # 3. Students who may need attention (avg_score < 50)
            cursor.execute("""
                SELECT u.name, u.id AS user_id,
                       ROUND(AVG(p.score), 1) AS avg_score,
                       COUNT(*) AS experiments_done
                FROM progress p
                JOIN users u ON u.id = p.user_id
                GROUP BY u.id
                HAVING avg_score < 50
                ORDER BY avg_score ASC
                LIMIT 5
            """)
            at_risk = cursor.fetchall()

            cursor.close()

            return {
                "success": True,
                "subject_performance": subject_perf,
                "recent_activity": recent,
                "at_risk_students": at_risk
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_classes_list(self) -> Dict[str, Any]:
        """Return a unique list of classes with student counts."""
        if not self.db: return {"success": False, "error": "No database connection"}

        try:
            cursor = self.db.cursor(dictionary=True)
            cursor.execute("""
                SELECT grade_or_form, class, COUNT(*) as student_count
                FROM students
                GROUP BY grade_or_form, class
                ORDER BY grade_or_form, class
            """)
            classes = cursor.fetchall()
            cursor.close()

            return {
                "success": True,
                "classes": classes
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_assignments(self, teacher_id: int = None) -> Dict[str, Any]:
        """Return a list of assignments, optionally filtered by teacher."""
        if not self.db: return {"success": False, "error": "No database connection"}

        try:
            cursor = self.db.cursor(dictionary=True)
            if teacher_id:
                query = """
                    SELECT a.*, e.title as experiment_title
                    FROM assignments a
                    LEFT JOIN experiments e ON a.experiment_id = e.id
                    WHERE a.teacher_id = %s
                    ORDER BY a.created_at DESC
                """
                cursor.execute(query, (teacher_id,))
            else:
                query = """
                    SELECT a.*, e.title as experiment_title, u.name as teacher_name
                    FROM assignments a
                    LEFT JOIN experiments e ON a.experiment_id = e.id
                    JOIN users u ON a.teacher_id = u.id
                    ORDER BY a.created_at DESC
                """
                cursor.execute(query)
            
            assignments = cursor.fetchall()
            cursor.close()

            return {
                "success": True,
                "assignments": [{
                    **a,
                    "created_at": str(a["created_at"]),
                    "due_date": str(a["due_date"]) if a["due_date"] else None
                } for a in assignments]
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def create_assignment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new assignment in the database."""
        if not self.db: return {"success": False, "error": "No database connection"}

        try:
            cursor = self.db.cursor()
            query = """
                INSERT INTO assignments (teacher_id, experiment_id, title, description, grade_or_form, class, due_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                data['teacher_id'],
                data.get('experiment_id'),
                data['title'],
                data.get('description'),
                data['grade_or_form'],
                data.get('class'),
                data.get('due_date')
            ))
            self.db.commit()
            new_id = cursor.lastrowid
            cursor.close()

            return {"success": True, "assignment_id": new_id}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_system_summary(self) -> Dict[str, Any]:
        """Return high-level system statistics for the Admin dashboard."""
        if not self.db: return {"success": False, "error": "No database connection"}

        try:
            cursor = self.db.cursor(dictionary=True)
            
            # Counts
            cursor.execute("SELECT COUNT(*) as count FROM users")
            total_users = cursor.fetchone()['count']
            
            cursor.execute("SELECT COUNT(*) as count FROM students")
            total_students = cursor.fetchone()['count']
            
            cursor.execute("SELECT COUNT(*) as count FROM experiments")
            total_experiments = cursor.fetchone()['count']
            
            cursor.execute("SELECT COUNT(*) as count FROM progress")
            total_progress = cursor.fetchone()['count']
            
            # Recent registrations
            cursor.execute("SELECT name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5")
            recent_users = cursor.fetchall()
            
            # Subject popularity
            cursor.execute("""
                SELECT e.subject, COUNT(*) as usage_count
                FROM progress p
                JOIN experiments e ON p.experiment_id = e.id
                GROUP BY e.subject
            """)
            subject_usage = cursor.fetchall()
            
            cursor.close()

            return {
                "success": True,
                "stats": {
                    "total_users": total_users,
                    "total_students": total_students,
                    "total_experiments": total_experiments,
                    "total_interactions": total_progress
                },
                "recent_users": [{**u, "created_at": str(u["created_at"])} for u in recent_users],
                "subject_usage": subject_usage
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    # Helper methods (placeholders for advanced logic currently missing in the base class)
    def categorize_velocity(self, velocity): return "average"
    def analyze_difficulty_progression(self, data): return "normal"
    def calculate_mastery_level(self, data): return "intermediate"
    def calculate_trend(self, scores): return "stable"
    def get_top_performers(self, df, n): return []
    def get_needs_attention_students(self, df): return []
    def generate_class_insights(self, df): return []
    def compare_with_peers(self, user_id): return {}