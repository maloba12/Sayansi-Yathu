import mysql.connector
from typing import Dict, List

class AdjustmentEngine:
    def __init__(self, db_connection):
        self.db = db_connection

    def calibrate_difficulty(self, user_id: int, experiment_id: int):
        """REC-09: Auto-calibrate difficulty based on performance"""
        try:
            cursor = self.db.cursor(dictionary=True)
            # Fetch last 3 attempts for this student/experiment
            cursor.execute("""
                SELECT score, time_spent, quiz_score 
                FROM progress 
                WHERE user_id = %s AND experiment_id = %s
            """, (user_id, experiment_id))
            data = cursor.fetchone()
            
            if not data: return

            # Simple logic: If score is high (>85) and time is low, increase difficulty
            # If score is low (<40) or quiz is low (<40), decrease difficulty or offer hint
            current_score = float(data.get('score', 0))
            quiz_score = float(data.get('quiz_score', 0)) if data.get('quiz_score') else 0
            
            # This would ideally update a per-user session difficulty, 
            # for now we'll return a recommendation.
            if current_score > 85 and quiz_score > 80:
                return {"action": "increase", "message": "Promoting to Advanced mode."}
            elif current_score < 40:
                return {"action": "decrease", "message": "Enabling guided mode / more hints."}
            
            return {"action": "maintain"}
            
        except Exception as e:
            print(f"Calibration error: {e}")
            return None

    def generate_sba_report(self, user_id: int):
        """Generate SBA (School-Based Assessment) report data"""
        try:
            cursor = self.db.cursor(dictionary=True)
            query = """
                SELECT e.title, cm.strand, cm.topic, cm.sba_category, p.score, p.quiz_score
                FROM progress p
                JOIN experiments e ON p.experiment_id = e.id
                JOIN curriculum_mappings cm ON e.id = cm.experiment_id
                WHERE p.user_id = %s
            """
            cursor.execute(query, (user_id,))
            records = cursor.fetchall()
            cursor.close()
            
            if not records:
                return {"summary": "No curriculum data found for this student."}
            
            # Aggregate by strand
            report = {}
            for rec in records:
                strand = rec['strand']
                if strand not in report:
                    report[strand] = {"score": 0, "count": 0, "topics": []}
                
                report[strand]["score"] += float(rec['score'])
                report[strand]["count"] += 1
                report[strand]["topics"].append(rec['topic'])
            
            for s in report:
                report[s]["average"] = round(report[s]["score"] / report[s]["count"], 2)
            
            return report
        except Exception as e:
            print(f"SBA Report error: {e}")
            return None
