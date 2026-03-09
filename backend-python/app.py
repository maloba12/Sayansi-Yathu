from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our modules
try:
    from simulations.physics_engine import PhysicsEngine
    from simulations.chemistry_engine import ChemistryEngine
    from simulations.biology_engine import BiologyEngine
    from ai.tutor import AITutor
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
virtual_assistant = VirtualLabAssistant()
adaptive_engine = AdaptiveLearningEngine(None)  # Placeholder for DB
analytics = AnalyticsDashboard(None)  # Placeholder for DB

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
        <li>POST /api/ai/virtual-assistant</li>
    </ul>
    '''

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
    response = ai_tutor.get_response(data['question'], data['context'])
    return jsonify({"response": response})

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
        "version": "1.0.0",
        "features": [
            "physics_simulations",
            "chemistry_simulations", 
            "biology_simulations",
            "ai_tutor",
            "virtual_assistant"
        ]
    })

if __name__ == '__main__':
    print("🧪 Starting Sayansi Yathu Virtual Lab...")
    print("✅ All modules loaded successfully!")
    app.run(debug=True, port=5000, host='0.0.0.0')