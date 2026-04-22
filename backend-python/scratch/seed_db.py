import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend-python/.env'))

def seed():
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
        
        print("🌱 Seeding database with expanded sample data...")
        
        # Clear existing data to avoid PK conflicts with the new expanded seed
        # In a real app we'd be more careful, but for this dev setup we want a clean state
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        tables = ['progress', 'students', 'users', 'experiments']
        for table in tables:
            cursor.execute(f"DELETE FROM {table}")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        # 1. Experiments
        experiments_sql = """
        INSERT INTO experiments (id, title, subject, description, difficulty_level, simulation_type, curriculum, grade_or_form) VALUES
        (1, 'Simple Pendulum', 'physics', 'Study the motion of a simple pendulum', 'beginner', 'threejs', 'new', 'Form 1'),
        (2, 'Ohm\\'s Law Circuit', 'physics', 'Verify Ohm\\'s law using virtual circuits', 'intermediate', 'threejs', 'new', 'Form 1'),
        (3, 'Acid-Base Titration', 'chemistry', 'Perform acid-base titration experiment', 'intermediate', 'p5js', 'new', 'Form 1'),
        (4, 'Chemical Reactions', 'chemistry', 'Observe different types of chemical reactions', 'beginner', 'p5js', 'new', 'Form 1'),
        (5, 'Cell Structure', 'biology', 'Explore animal and plant cell structures', 'beginner', 'threejs', 'new', 'Form 1'),
        (6, 'DNA Replication', 'biology', 'Visualize DNA replication process', 'advanced', 'threejs', 'new', 'Form 1'),
        (7, 'Scientific Inquiry Method', 'biology', 'To apply the scientific inquiry method in carrying out scientific investigations.', 'beginner', 'threejs', 'new', 'Form 1'),
        (8, 'Characteristics of Living Things', 'biology', 'To investigate the characteristics of living things.', 'beginner', 'threejs', 'new', 'Form 1'),
        (9, 'Use of Microscopes', 'biology', 'To use different types of microscopes to examine specimens.', 'beginner', 'threejs', 'new', 'Form 1'),
        (10, 'Basic Cell Structure', 'biology', 'To explore the basic cell structure of plant and animal cells.', 'beginner', 'threejs', 'new', 'Form 1'),
        (11, 'Types of Cells (Eukaryotic vs Prokaryotic)', 'biology', 'To distinguish between eukaryotic and prokaryotic cells.', 'intermediate', 'threejs', 'new', 'Form 1'),
        (12, 'Specialised Cells', 'biology', 'To relate adaptive features of specialised cells to their functions.', 'intermediate', 'threejs', 'new', 'Form 1'),
        (13, 'Nutritional Deficiency Diseases and Disorders', 'biology', 'To investigate nutritional deficiency diseases and disorders in plants and humans.', 'intermediate', 'threejs', 'new', 'Form 1'),
        (14, 'Reproduction in Living Organisms', 'biology', 'To demonstrate understanding of how living organisms reproduce.', 'intermediate', 'threejs', 'new', 'Form 1'),
        (15, 'Tropisms in Plants', 'biology', 'To explore tropisms in plants and their relevance to survival.', 'advanced', 'threejs', 'new', 'Form 1'),
        (16, 'Taxic Responses in Invertebrates', 'biology', 'To explore taxic responses in invertebrates such as woodlice and earthworms.', 'advanced', 'threejs', 'new', 'Form 1'),
        (17, 'Features of Ecosystems', 'biology', 'To explore features of ecosystems in the local environment.', 'advanced', 'threejs', 'new', 'Form 1'),
        (18, 'Soil Composition and Fertility', 'biology', 'To analyse soil composition and fertility using different soil samples.', 'advanced', 'threejs', 'new', 'Form 1');
        """
        cursor.execute(experiments_sql)
        
        # 2. Users
        users_sql = """
        INSERT INTO users (id, name, email, password, role) VALUES
        (1, 'Natasha Kalusa', 'NatashaK@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
        (2, 'Mary Phiri', 'mary@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
        (3, 'Mpundu Maloba', 'MpunduM@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
        (4, 'Chanda Bwalya', 'chanda@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
        (5, 'Lubasi Musonda', 'lubasi@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
        (6, 'Mutinta Moomba', 'mutinta@sayansi-yathu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');
        """
        cursor.execute(users_sql)
        
        # 3. Students
        students_sql = """
        INSERT INTO students (student_id, grade_or_form, class, stream, enrolled_year, linked_user_id) VALUES
        ('S2024001', 'Form 1', 'A', 'Science', 2024, 1),
        ('S2024002', 'Form 1', 'A', 'Science', 2024, 4),
        ('S2024003', 'Form 1', 'B', 'Arts', 2024, 5),
        ('S2024004', 'Form 2', 'A', 'Science', 2024, 6);
        """
        cursor.execute(students_sql)
        
        # 4. Progress
        progress_sql = """
        INSERT INTO progress (user_id, experiment_id, completed_steps, total_steps, score) VALUES
        (1, 1, 5, 5, 85.50),
        (1, 2, 3, 5, 60.00),
        (1, 4, 2, 3, 75.00),
        (4, 1, 5, 5, 92.00),
        (5, 1, 2, 5, 32.00),
        (6, 1, 5, 5, 78.00);
        """
        cursor.execute(progress_sql)
        
        conn.commit()
        print("✅ Database seeded successfully!")
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")

if __name__ == '__main__':
    seed()
