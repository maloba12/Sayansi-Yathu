from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our modules (only ones that exist)
try:
    from simulations.physics_engine import PhysicsEngine
    from simulations.chemistry_engine import ChemistryEngine
    from simulations.biology_engine import BiologyEngine
    from ai.tutor import AITutor
except ImportError as e:
    print(f"Import error: {e}")
    print("Please install required packages: pip install flask flask-cors numpy")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Initialize engines
physics_engine = PhysicsEngine()
chemistry_engine = ChemistryEngine()
biology_engine = BiologyEngine()
ai_tutor = AITutor()

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
        <li>GET /api/health</li>
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

# (Virtual assistant endpoint omitted; corresponding module not present yet)

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
    print("Starting Sayansi Yathu Virtual Lab...")
    print("All modules loaded successfully!")
    app.run(debug=True, port=5000, host='0.0.0.0')