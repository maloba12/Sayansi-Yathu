from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sys
import os
from dotenv import load_dotenv
try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False
    print("WARNING: mysql-connector-python not installed. Analytics will be unavailable.")

# Load environment variables
load_dotenv()
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our modules
try:
    from simulations.physics_engine import PhysicsEngine
    from simulations.chemistry_engine import ChemistryEngine
    from simulations.biology_engine import BiologyEngine
    from ai.tutor import AITutor, ECZContentGenerator
    from ai.lab_assistant import LabAssistant
    from ai.adaptive import AdaptiveLearningEngine
    from ai.calibration import AdjustmentEngine
    from analytics.dashboard import AnalyticsDashboard
except ImportError as e:
    print(f"Import error: {e}")
    print("Please install required packages: pip install flask flask-cors pandas scikit-learn numpy")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Initialize engines
physics_engine = PhysicsEngine()
chemistry_engine = ChemistryEngine()
biology_engine = BiologyEngine()
ai_tutor = AITutor()
ecz_gen = ECZContentGenerator()
virtual_assistant = LabAssistant()
adaptive_engine = AdaptiveLearningEngine(None)
adjustment_engine = AdjustmentEngine(None)
# Initialize analytics as a helper instance (will be updated with a real DB connection per request)
analytics_helper = AnalyticsDashboard()

@app.route('/')
def home():
    return '''
    <h1>🧪 Sayansi Yathu - Virtual Lab API</h1>
    <p>Welcome to the enhanced Zambian Virtual Science Lab!</p>
    <p>Available endpoints:</p>
    <ul>
        <li>POST /api/physics/simulate</li>
        <li>POST /api/chemistry/simulate</li>
        <li>POST /api/biology/simulate</li>
        <li>POST /api/ai/tutor</li>
        <li>POST /api/ai/generate-content</li>
        <li>POST /api/ai/virtual-assistant</li>
    </ul>
    '''

@app.route('/api/ai/generate-content', methods=['POST'])
def generate_content():
    data = request.json
    content_type = data.get('type', 'explanation')
    topic = data.get('topic', 'general science')
    grade = data.get('grade', 'Grade 10')
    
    content = ecz_gen.generate(content_type, topic, grade)
    return jsonify({
        "success": True,
        "content": content
    })

@app.route('/api/physics/simulate', methods=['POST'])
def simulate_physics():
    data = request.json
    result = physics_engine.simulate(data['experiment'], data['parameters'])
    return jsonify(result)

@app.route('/api/chemistry/simulate', methods=['POST'])
def simulate_chemistry():
    data = request.json
    result = chemistry_engine.simulate(data['experiment'], data['parameters'])
    return jsonify(result)

@app.route('/api/biology/simulate', methods=['POST'])
def simulate_biology():
    data = request.json
    result = biology_engine.simulate(data['experiment'], data['parameters'])
    return jsonify(result)

@app.route('/api/ai/tutor', methods=['POST'])
def ai_tutor_response():
    data = request.json
    session_id = data.get('session_id')  # optional; enables conversation memory
    response = ai_tutor.get_response(
        data['question'],
        data.get('context', {}),
        session_id=session_id
    )
    return jsonify({"response": response, "session_id": session_id})


@app.route('/api/ai/tutor/clear', methods=['POST'])
def ai_tutor_clear_session():
    """Clear conversation history for a given session (e.g. on logout)."""
    data = request.json
    session_id = data.get('session_id')
    if session_id:
        ai_tutor.clear_session(session_id)
    return jsonify({"success": True})

@app.route('/api/ai/virtual-assistant', methods=['POST'])
def virtual_assistant():
    data = request.json
    response = virtual_assistant.process_message(
        data['message'], 
        data['user_id'], 
        data.get('context', {})
    )
    return jsonify(response)

def _launch_script(script_path, sim_type):
    """Helper: launch a Python script in a subprocess and return JSON result."""
    import subprocess
    import time

    # Determine Python executable (prioritize local venv)
    venv_python = os.path.join(os.path.dirname(__file__), 'venv', 'bin', 'python')
    python_exe = venv_python if os.path.exists(venv_python) else sys.executable

    # Set environment variables for display
    env = os.environ.copy()
    env['DISPLAY'] = ':0.0'

    print(f"Launching 3D simulation: {python_exe} {script_path} --type {sim_type}")

    process = subprocess.Popen(
        [python_exe, script_path, '--type', sim_type],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Wait a moment to check if it starts successfully
    time.sleep(2)

    if process.poll() is None:  # Still running
        print(f"✅ 3D simulation launched successfully (PID: {process.pid})")
        return jsonify({
            "success": True,
            "message": f"Launched {sim_type} simulation",
            "pid": process.pid,
            "debug": "Check for separate 3D window"
        })
    else:
        stdout, stderr = process.communicate()
        print(f"❌ 3D simulation failed to start")
        print(f"STDOUT: {stdout}")
        print(f"STDERR: {stderr}")
        return jsonify({
            "success": False,
            "message": f"Failed to start {sim_type} simulation",
            "error": stderr or stdout
        })


@app.route('/api/launch-simulation', methods=['POST'])
def launch_3d_simulation():
    """
    Launches the Ursina 3D simulation in a separate process.
    Uses ursa_lab/main.py by default for experiment-specific dispatch.
    Pass {"debug": true} to fall back to the simple placeholder scene.
    """
    data = request.json
    sim_type = data.get('type', 'pendulum')
    use_debug = data.get('debug', False)

    try:
        if use_debug:
            # Explicit debug flag — use simple placeholder scene
            script_path = os.path.join(os.path.dirname(__file__), 'simple_3d.py')
            if not os.path.exists(script_path):
                return jsonify({"success": False, "message": "simple_3d.py not found"})
        else:
            # Default: use the full Ursina simulation dispatcher
            script_path = os.path.join(os.path.dirname(__file__), 'ursa_lab', 'main.py')
            if not os.path.exists(script_path):
                return jsonify({"success": False, "message": "ursa_lab/main.py not found"})

        return _launch_script(script_path, sim_type)

    except Exception as e:
        print(f"Error launching simulation: {e}")
        return jsonify({"success": False, "message": str(e)})


@app.route('/api/debug/launch-simulation', methods=['POST'])
def launch_debug_simulation():
    """
    Dedicated debug endpoint — always uses simple_3d.py placeholder scene.
    """
    data = request.json
    sim_type = data.get('type', 'pendulum')

    try:
        script_path = os.path.join(os.path.dirname(__file__), 'simple_3d.py')
        if not os.path.exists(script_path):
            return jsonify({"success": False, "message": "simple_3d.py not found"})

        return _launch_script(script_path, sim_type)

    except Exception as e:
        print(f"Error launching debug simulation: {e}")
        return jsonify({"success": False, "message": str(e)})


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "version": "1.1.0",
        "features": [
            "physics_simulations",
            "chemistry_simulations",
            "biology_simulations",
            "ai_tutor",
            "ai_tutor_session_memory",
            "virtual_assistant",
            "ecz_content_generator",
            "analytics"
        ]
    })


# ---------------------------------------------------------------------------
# Analytics endpoints (REC-03)
# ---------------------------------------------------------------------------

def _get_db():
    """Create and return a fresh MySQL connection using the same credentials
    as the PHP backend (env vars with local dev fallbacks)."""
    if not MYSQL_AVAILABLE:
        return None
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
        print(f"Analytics DB connection error: {e}")
        return None


@app.route('/api/analytics/student/<int:user_id>', methods=['GET'])
def student_analytics(user_id):
    """Return progress statistics for a single student (Refactored to use AnalyticsDashboard)."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        # Pass the database connection to the analytics module
        analytics = AnalyticsDashboard(db)
        result = analytics.get_student_summary(user_id)
        db.close()
        
        if result.get("success"):
            return jsonify({
                "success": True,
                "user_id": user_id,
                "overall": result["overall"],
                "by_subject": result["by_subject"],
                "trend": result["trend"]
            })
        else:
            return jsonify(result), 500

    except Exception as e:
        print(f"Student analytics error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/analytics/class', methods=['GET'])
def class_analytics():
    """Return aggregated class performance for teachers (Refactored to use AnalyticsDashboard)."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        analytics = AnalyticsDashboard(db)
        result = analytics.get_class_summary()
        db.close()

        if result.get("success"):
            return jsonify(result)
        else:
            return jsonify(result), 500

    except Exception as e:
        print(f"Class analytics error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Return the list of all classes currently in the system."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        analytics = AnalyticsDashboard(db)
        result = analytics.get_classes_list()
        db.close()

        if result.get("success"):
            return jsonify(result)
        else:
            return jsonify(result), 500

    except Exception as e:
        print(f"Error fetching classes: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/assignments', methods=['GET', 'POST'])
def manage_assignments():
    """GET: Fetch assignments (optional ?teacher_id=). POST: Create new assignment."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        analytics = AnalyticsDashboard(db)
        if request.method == 'POST':
            data = request.json
            result = analytics.create_assignment(data)
        else:
            teacher_id = request.args.get('teacher_id')
            result = analytics.get_assignments(teacher_id)
        
        db.close()
        return jsonify(result)
    except Exception as e:
        print(f"Assignment error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/admin/summary', methods=['GET'])
def admin_summary():
    """Return system-wide statistics for the admin dashboard."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        analytics = AnalyticsDashboard(db)
        result = analytics.get_system_summary()
        db.close()
        return jsonify(result)
    except Exception as e:
        print(f"Admin summary error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/experiments', methods=['GET'])
def get_experiments():
    """Return all available experiments."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, title, subject, difficulty_level FROM experiments")
        experiments = cursor.fetchall()
        db.close()
        return jsonify({"success": True, "experiments": experiments})
    except Exception as e:
        print(f"Error fetching experiments: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ai/quiz', methods=['GET', 'POST'])
def handle_quiz():
    """GET: Generate a quiz for an experiment. POST: Submit quiz results."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        if request.method == 'GET':
            experiment_id = request.args.get('experiment_id')
            if not experiment_id:
                return jsonify({"success": False, "error": "experiment_id required"}), 400
            
            # Fetch experiment details
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT title, subject FROM experiments WHERE id = %s", (experiment_id,))
            exp = cursor.fetchone()
            cursor.close()
            
            if not exp:
                return jsonify({"success": False, "error": "Experiment not found"}), 404
            
            # Generate Quiz using ECZContentGenerator
            quiz = ecz_gen.generate_quiz(exp['subject'], exp['title'], count=3)
            db.close()
            return jsonify({"success": True, "quiz": quiz})

        elif request.method == 'POST':
            data = request.json
            user_id = data.get('user_id')
            experiment_id = data.get('experiment_id')
            quiz_score = data.get('score') # expected percentage
            
            if not all([user_id, experiment_id, quiz_score is not None]):
                return jsonify({"success": False, "error": "Missing required fields"}), 400

            # Update progress table with quiz score
            cursor = db.cursor()
            query = """
                INSERT INTO progress (user_id, experiment_id, quiz_score)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE quiz_score = VALUES(quiz_score)
            """
            cursor.execute(query, (user_id, experiment_id, quiz_score))
            db.commit()
            cursor.close()
            db.close()
            
            return jsonify({"success": True, "message": "Quiz score saved"})

    except Exception as e:
        print(f"Quiz Endpoint Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ai/adaptive/recommend', methods=['GET'])
def adaptive_recommend():
    """Return personalized experiment recommendations for a user."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"success": False, "error": "user_id required"}), 400
    
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        engine = AdaptiveLearningEngine(db)
        recomms = engine.get_recommendations(int(user_id))
        db.close()
        return jsonify({"success": True, "recommendations": recomms})
    except Exception as e:
        print(f"Adaptive Recomm error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ai/adaptive/risk', methods=['GET'])
def adaptive_risk():
    """Return risk assessment for a student."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"success": False, "error": "user_id required"}), 400
    
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        engine = AdaptiveLearningEngine(db)
        risk_data = engine.predict_risk(int(user_id))
        db.close()
        return jsonify({"success": True, "risk": risk_data})
    except Exception as e:
        print(f"Adaptive Risk error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ai/adaptive/train', methods=['POST'])
def adaptive_train():
    """Trigger training of the adaptive models."""
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        engine = AdaptiveLearningEngine(db)
        engine.train_models()
        db.close()
        return jsonify({"success": True, "message": "Models trained successfully"})
    except Exception as e:
        print(f"Adaptive Training error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/analytics/sba', methods=['GET'])
def get_sba_report():
    """Return SBA curriculum alignment report for a student."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"success": False, "error": "user_id required"}), 400
    
    db = _get_db()
    if not db:
        return jsonify({"success": False, "error": "Database unavailable"}), 503

    try:
        engine = AdjustmentEngine(db)
        report = engine.generate_sba_report(int(user_id))
        db.close()
        return jsonify({"success": True, "report": report})
    except Exception as e:
        print(f"SBA Report Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ai/assistant', methods=['POST'])
def assistant_search():
    """Handle natural language questions via semantic search LabAssistant."""
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({"success": False, "error": "query required"}), 400
    
    answer = virtual_assistant.get_answer(query)
    return jsonify({"success": True, "answer": answer})


UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/chat/send', methods=['POST'])
def chat_send():
    data = request.json
    db = _get_db()
    if not db: return jsonify({"success": False, "error": "DB unavailable"}), 503
    try:
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO messages (sender_id, receiver_id, message_text, role, media_url, file_url, file_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (data.get('sender_id'), data.get('receiver_id'), data.get('message_text'), data.get('role'), data.get('media_url'), data.get('file_url'), data.get('file_type')))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/chat/messages', methods=['GET'])
def get_messages():
    user_id = request.args.get('user_id')
    db = _get_db()
    if not db: return jsonify({"success": False, "error": "DB unavailable"}), 503
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM messages 
            WHERE sender_id = %s OR receiver_id = %s OR receiver_id IS NULL 
            ORDER BY timestamp ASC
        """, (user_id, user_id))
        messages = cursor.fetchall()
        return jsonify({"success": True, "messages": messages})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/chat/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({"success": False, "error": "No audio file"}), 400
    file = request.files['audio']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename) or "audio.webm"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({"success": True, "url": f"/api/uploads/{filename}"})

@app.route('/api/chat/upload-file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({"success": True, "url": f"/api/uploads/{filename}", "type": filename.split('.')[-1]})

@app.route('/api/reports/submit', methods=['POST'])
def submit_report():
    data = request.json
    db = _get_db()
    if not db: return jsonify({"success": False, "error": "DB unavailable"}), 503
    try:
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO reports (teacher_id, class_id, subject, experiments_count, period_type)
            VALUES (%s, %s, %s, %s, %s)
        """, (data.get('teacher_id'), data.get('class_id'), data.get('subject'), data.get('experiments_count'), data.get('period_type')))
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/reports/summary', methods=['GET'])
def get_reports_summary():
    db = _get_db()
    if not db: return jsonify({"success": False, "error": "DB unavailable"}), 503
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM reports ORDER BY created_at DESC")
        reports = cursor.fetchall()
        return jsonify({"success": True, "reports": reports})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/reports/auto-summary', methods=['GET'])
def get_auto_summary():
    period = request.args.get('period', 'monthly')
    db = _get_db()
    if not db: return jsonify({"success": False, "error": "DB unavailable"}), 503
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT sum(experiments_count) as total_experiments, count(id) as reports_count FROM reports WHERE period_type = %s", (period,))
        stats = cursor.fetchone()
        summary_text = f"Auto Summary for {period}: {stats['total_experiments'] or 0} experiments completed across {stats['reports_count'] or 0} report submissions."
        
        cursor.execute("INSERT INTO report_summaries (period, summary_text) VALUES (%s, %s)", (period, summary_text))
        db.commit()
        return jsonify({"success": True, "summary": summary_text})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/analytics/heatmap', methods=['GET'])
def get_heatmap():
    db = _get_db()
    if not db: return jsonify({"success": False, "error": "DB unavailable"}), 503
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT e.subject, e.grade_or_form as class_name, AVG(p.score) as avg_score
            FROM progress p
            JOIN experiments e ON p.experiment_id = e.id
            GROUP BY e.subject, e.grade_or_form
        """)
        data = cursor.fetchall()
        return jsonify({"success": True, "heatmap": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.close()


if __name__ == '__main__':
    print("🧪 Starting Sayansi Yathu Virtual Lab...")
    print("✅ All modules loaded successfully!")
    app.run(debug=True, port=5000, host='0.0.0.0')