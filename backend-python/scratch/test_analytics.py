import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Add project root to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(os.path.join(project_root, 'backend-python'))

from analytics.dashboard import AnalyticsDashboard

class TestAnalyticsDashboard(unittest.TestCase):

    def setUp(self):
        self.mock_db = MagicMock()
        self.mock_cursor = MagicMock()
        self.mock_db.cursor.return_value = self.mock_cursor
        self.analytics = AnalyticsDashboard(self.mock_db)

    def test_get_student_summary_success(self):
        # Mocking the three cursor.fetchone/fetchall calls in get_student_summary
        self.mock_cursor.fetchone.side_effect = [
            {"experiments_completed": 5, "avg_score": 75.5, "total_time_spent": 120}  # overall
        ]
        self.mock_cursor.fetchall.side_effect = [
            [{"subject": "physics", "avg_score": 80.0, "experiments_done": 2}],       # by_subject
            [{"date": "2026-04-18", "avg_score": 70.0}]                              # trend
        ]

        result = self.analytics.get_student_summary(1)

        self.assertTrue(result["success"])
        self.assertEqual(result["overall"]["experiments_completed"], 5)
        self.assertEqual(result["overall"]["avg_score"], 75.5)
        self.assertEqual(len(result["by_subject"]), 1)
        self.assertEqual(len(result["trend"]), 1)
        self.assertEqual(result["trend"][0]["avg_score"], 70.0)

    def test_get_class_summary_success(self):
        # Mocking the cursor calls in get_class_summary
        self.mock_cursor.fetchall.side_effect = [
            [{"subject": "physics", "average": 72.5, "student_count": 10}],          # subject_performance
            [{"student": "John", "target": "Ohm's Law", "score": 85.0, "last_accessed": "2026-04-18"}], # recent_activity
            [{"name": "Jane", "user_id": 2, "avg_score": 45.0, "experiments_done": 1}] # at_risk
        ]

        result = self.analytics.get_class_summary()
        if not result["success"]:
            print(f"\nError in get_class_summary: {result.get('error')}")

        self.assertTrue(result["success"])
        self.assertEqual(len(result["subject_performance"]), 1)
        self.assertEqual(result["subject_performance"][0]["average"], 72.5)
        self.assertEqual(result["recent_activity"][0]["student"], "John")
        self.assertEqual(len(result["at_risk_students"]), 1)

    def test_no_db_connection(self):
        self.analytics.db = None
        result = self.analytics.get_student_summary(1)
        self.assertFalse(result["success"])
        self.assertEqual(result["error"], "No database connection")

if __name__ == '__main__':
    unittest.main()
