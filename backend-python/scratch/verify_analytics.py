import sys
import os
import json
from dotenv import load_dotenv

# Add the project root to sys.path to allow importing from backend-python
# Adjust paths if necessary. We assume the script is in root or backend-python/scratch
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(os.path.join(project_root, 'backend-python'))

from analytics.dashboard import AnalyticsDashboard
import mysql.connector

load_dotenv()

def _get_db():
    try:
        return mysql.connector.connect(
            host=os.getenv('DB_HOST', '127.0.0.1'),
            port=int(os.getenv('DB_PORT', 3306)),
            database=os.getenv('DB_NAME', 'sayansi_yathu'),
            user=os.getenv('DB_USER', 'sayansi_admin'),
            password=os.getenv('DB_PASSWORD', '@mpundu23maloba'),
            connection_timeout=5
        )
    except Exception as e:
        print(f"DB connection error: {e}")
        return None

def verify():
    db = _get_db()
    if not db:
        print("❌ FAILED: Could not connect to database.")
        return

    print("✅ Connected to database.")
    analytics = AnalyticsDashboard(db)

    # Test Student Summary
    print("\n--- Testing Student Summary (ID: 1) ---")
    try:
        student_res = analytics.get_student_summary(1)
        if student_res.get("success"):
            print("✅ Student summary fetched successfully.")
            print(f"Stats: {student_res['overall']}")
            print(f"Subject performance: {[s['subject'] for s in student_res['by_subject']]}")
            print(f"Trend entries: {len(student_res['trend'])}")
        else:
            print(f"❌ Student summary failed: {student_res.get('error')}")
    except Exception as e:
        print(f"❌ Crash during student summary: {e}")

    # Test Class Summary
    print("\n--- Testing Class Summary ---")
    try:
        class_res = analytics.get_class_summary()
        if class_res.get("success"):
            print("✅ Class summary fetched successfully.")
            print(f"Subject counts: {len(class_res['subject_performance'])}")
            print(f"Recent activity entries: {len(class_res['recent_activity'])}")
            print(f"At-risk students: {len(class_res['at_risk_students'])}")
        else:
            print(f"❌ Class summary failed: {class_res.get('error')}")
    except Exception as e:
        print(f"❌ Crash during class summary: {e}")

    db.close()

if __name__ == "__main__":
    verify()
