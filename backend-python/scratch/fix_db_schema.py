import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def apply_db_changes():
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
        
        # Create assignments table
        print("Creating assignments table...")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS assignments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            teacher_id INT NOT NULL,
            experiment_id INT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            grade_or_form VARCHAR(16) NOT NULL,
            class VARCHAR(32) NULL,
            due_date DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_assignments_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_assignments_experiment FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE SET NULL
        )
        """)
        
        # Create indexes
        print("Creating indexes...")
        try:
            cursor.execute("CREATE INDEX idx_assignments_teacher ON assignments(teacher_id)")
        except: pass
        
        try:
            cursor.execute("CREATE INDEX idx_assignments_class ON assignments(grade_or_form, class)")
        except: pass
        
        # Seed assignments if empty
        cursor.execute("SELECT COUNT(*) FROM assignments")
        if cursor.fetchone()[0] == 0:
            print("Seeding sample assignments...")
            assignments = [
                (2, 1, 'Pendulum Basics', 'Complete the simple pendulum experiment and record results.', 'Form 1', 'A', '2024-05-15 23:59:59'),
                (2, 2, 'Circuit Verification', 'Verify Ohm\'s Law for three different resistances.', 'Form 1', 'A', '2024-05-20 23:59:59'),
                (2, 3, 'Titration Lab', 'Perform the titration experiment and submit the final concentration.', 'Form 1', 'B', '2024-05-22 23:59:59')
            ]
            cursor.executemany("""
                INSERT INTO assignments (teacher_id, experiment_id, title, description, grade_or_form, class, due_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, assignments)
            
        conn.commit()
        print("✅ Database changes applied successfully!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error applying DB changes: {e}")

if __name__ == "__main__":
    apply_db_changes()
