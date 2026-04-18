from flask import Flask, request, jsonify
from flask_cors import CORS
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
    from ai.virtual_assistant import VirtualLabAssistant
    from ai.adaptive import AdaptiveLearningEngine
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
virtual_assistant = VirtualLabAssistant()
adaptive_engine = AdaptiveLearningEngine(None)  # Placeholder for DB
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


if __name__ == '__main__':
    print("🧪 Starting Sayansi Yathu Virtual Lab...")
    print("✅ All modules loaded successfully!")
    app.run(debug=True, port=5000, host='0.0.0.0')