import sys
import os
from dotenv import load_dotenv
try:
    import mysql.connector
    import pandas as pd
    print("Imports successful")
except ImportError as e:
    print(f"Import failed: {e}")
    sys.exit(1)

load_dotenv()

def test_conn():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST', '127.0.0.1'),
            port=int(os.getenv('DB_PORT', 3306)),
            database=os.getenv('DB_NAME', 'sayansi_yathu'),
            user=os.getenv('DB_USER', 'sayansi_admin'),
            password=os.getenv('DB_PASSWORD', '@mpundu23maloba'),
            connection_timeout=5
        )
        print("Connection successful")
        df = pd.read_sql("SELECT 1 as test", conn)
        print("Pandas read_sql successful")
        print(df)
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_conn()
