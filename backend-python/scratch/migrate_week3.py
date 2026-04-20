import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def migrate_week3():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST', '127.0.0.1'),
            port=int(os.getenv('DB_PORT', 3306)),
            database=os.getenv('DB_NAME', 'sayansi_yathu'),
            user=os.getenv('DB_USER', 'sayansi_admin'),
            password=os.getenv('DB_PASSWORD', '@mpundu23maloba'),
            connection_timeout=5
        )
        cursor = conn.cursor()
        
        # 1. Update progress table with quiz_score
        print("Adding quiz_score to progress table...")
        try:
            cursor.execute("ALTER TABLE progress ADD COLUMN quiz_score DECIMAL(5,2) DEFAULT NULL")
            conn.commit()
        except mysql.connector.Error as err:
            if err.errno == 1060: # Column already exists
                print("Column quiz_score already exists.")
            else:
                raise err
        
        # 2. Create curriculum_mappings table
        print("Creating curriculum_mappings table...")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS curriculum_mappings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            experiment_id INT NOT NULL,
            strand VARCHAR(100) NOT NULL,
            topic VARCHAR(100) NOT NULL,
            sba_category VARCHAR(100) NOT NULL,
            FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE
        )
        """)
        
        # 3. Seed curriculum mappings for core experiments
        cursor.execute("SELECT COUNT(*) FROM curriculum_mappings")
        if cursor.fetchone()[0] == 0:
            print("Seeding curriculum mappings...")
            mappings = [
                (1, 'Mechanics', 'Simple Pendulum', 'Scientific Inquiry'),
                (2, 'Electricity', "Ohm's Law", 'Calculation'),
                (3, 'Chemical Reactions', 'Acid-Base Titration', 'Laboratory Skills'),
                (4, 'Chemical Reactions', 'Rates of Reaction', 'Scientific Inquiry'),
                (5, 'Cell Biology', 'Cell Structure', 'Scientific Inquiry'),
                (6, 'Genetic Engineering', 'DNA Replication', 'Logic & Analysis')
            ]
            cursor.executemany("""
                INSERT INTO curriculum_mappings (experiment_id, strand, topic, sba_category)
                VALUES (%s, %s, %s, %s)
            """, mappings)
            conn.commit()
            
        print("✅ Week 3 Database Migration successful!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error in Week 3 Migration: {e}")

if __name__ == "__main__":
    migrate_week3()
