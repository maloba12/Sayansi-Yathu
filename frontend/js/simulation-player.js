// Simulation Player Logic
class SimulationPlayer {
    constructor() {
        this.simulationId = this.getSimulationIdFromURL();
        this.simulation = null;
        this.currentStepIndex = 0;
        this.userId = this.getUserId(); // From localStorage or session
        this.apiBase = 'http://localhost:8000/api';
        this.init();
    }

    getSimulationIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || 1;
    }

    getUserId() {
        // Get from auth token or localStorage
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.id;
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        }
        return 1; // Fallback for demo
    }

    async init() {
        await this.loadSimulation();
        await this.loadUserProgress();
        this.attachEventListeners();
        this.renderCurrentStep();
    }

    async loadSimulation() {
        try {
            const response = await fetch(`${this.apiBase}/simulations/get.php?id=${this.simulationId}`);
            const data = await response.json();

            if (data.success) {
                this.simulation = data.simulation;
                this.updateHeader();
            } else {
                this.showError('Failed to load simulation');
            }
        } catch (error) {
            console.error('Load simulation error:', error);
            this.showError('Network error loading simulation');
        }
    }

    async loadUserProgress() {
        try {
            const response = await fetch(
                `${this.apiBase}/progress/get.php?user_id=${this.userId}&simulation_id=${this.simulationId}`
            );
            const data = await response.json();

            if (data.success && data.progress) {
                this.currentStepIndex = data.progress.current_step || 0;
            }
        } catch (error) {
            console.error('Load progress error:', error);
        }
    }

    updateHeader() {
        document.getElementById('simTitle').textContent = this.simulation.title;
        const subjectBadge = document.getElementById('simSubject');
        subjectBadge.textContent = this.simulation.subject;
        subjectBadge.className = `badge badge-${this.simulation.subject.toLowerCase()}`;
    }

    renderCurrentStep() {
        if (!this.simulation || !this.simulation.steps) return;

        const step = this.simulation.steps[this.currentStepIndex];
        if (!step) return;

        // Update instructions panel
        document.getElementById('stepTitle').textContent = step.title;
        document.getElementById('stepInstructions').textContent = step.instructions;

        // Update progress
        const progress = ((this.currentStepIndex + 1) / this.simulation.total_steps) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
        document.getElementById('progressText').textContent =
            `Step ${this.currentStepIndex + 1} of ${this.simulation.total_steps}`;

        // Update buttons
        document.getElementById('prevBtn').disabled = this.currentStepIndex === 0;
        document.getElementById('nextBtn').disabled = false;

        // Render workspace based on step config
        this.renderWorkspace(step);

        // Save progress
        this.saveProgress();
    }

    renderWorkspace(step) {
        const workspace = document.getElementById('workspace');
        const config = step.config || {};

        if (config.type === 'intro') {
            workspace.innerHTML = `
                <div class="card" style="max-width: 600px; text-align: center;">
                    <h2>Welcome! 🧪</h2>
                    <p>Click Next to begin this experiment.</p>
                </div>
            `;
        } else if (config.type === 'slider') {
            workspace.innerHTML = `
                <div class="card" style="max-width: 600px;">
                    <div class="interactive-slider">
                        <div class="slider-label">
                            <span>${config.unit || 'Value'}</span>
                            <span id="sliderValue">${config.default || config.min}</span>
                        </div>
                        <input 
                            type="range" 
                            class="slider-input" 
                            min="${config.min}" 
                            max="${config.max}" 
                            value="${config.default || config.min}"
                            id="mainSlider"
                        >
                    </div>
                    <div class="visual-display">
                        <p>Value: <strong id="displayValue">${config.default || config.min} ${config.unit}</strong></p>
                    </div>
                </div>
            `;

            // Add slider listener
            const slider = document.getElementById('mainSlider');
            slider.addEventListener('input', (e) => {
                document.getElementById('sliderValue').textContent = e.target.value;
                document.getElementById('displayValue').textContent =
                    `${e.target.value} ${config.unit}`;
            });
        } else if (config.type === 'action' || config.type === 'observation') {
            // Check if we need to launch a real simulation
            // Use visual type to determine which engine to load
            
            // Clean up previous content but keep container
            workspace.innerHTML = `
                <div class="simulation-view" style="width: 100%; height: 500px; position: relative;">
                    <canvas id="sim-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
                    <div id="p5-container" style="width: 100%; height: 100%;"></div>
                </div>
                <div class="controls-overlay" style="margin-top: 1rem; text-align: center;">
                    <p>${step.instructions}</p>
                </div>
            `;

            // Initialize specific simulation based on visual tag or experiment title
            // This maps the Database 'visual' config to the JS classes
            const visual = config.visual || '';
            
            if (visual === 'pendulum') {
                if (!this.currentSim) {
                    this.currentSim = new PendulumSimulation('sim-canvas');
                    this.currentSim.createPendulum();
                    this.currentSim.start();
                }
            } 
            else if (visual === 'pipette' || this.simulation.title.includes('Titration')) {
                // Chemistry uses p5.js which attaches to a div
                document.getElementById('sim-canvas').style.display = 'none'; // Hide ThreeJS canvas
                // Only create if not exists
                if (!this.currentP5) {
                    this.currentP5 = new p5(createTitrationSketch(), 'p5-container');
                }
            }
            else if (visual === 'circuit' || this.simulation.title.includes('Ohm')) {
                if (!this.currentSim) {
                    this.currentSim = new CircuitSimulation('sim-canvas');
                    this.currentSim.createCircuit();
                    this.currentSim.start();
                }
            }
            else if (visual === 'cell_3d' || this.simulation.subject === 'Biology') {
                if (window.CellSimulation) {
                    if (!this.currentSim) {
                        this.currentSim = new CellSimulation();
                        this.currentSim.init(); // Biology sim uses init() not constructor for canvas
                    }
                }
            } else if (visual.includes('dna')) {
                if (window.DNASimulation) {
                    if (!this.currentSim) {
                        this.currentSim = new DNASimulation();
                         this.currentSim.init();
                    }
                }
            } else if (visual.includes('bubbles') || config.visual === 'beaker') {
                 // Chemistry Reaction
                 document.getElementById('sim-canvas').style.display = 'none';
                 if (!this.currentP5) {
                     this.currentP5 = new p5(createReactionSketch(), 'p5-container');
                 }
            }
            else {
                 // Fallback to searching by title keywords if visual tag is generic
                 if (this.simulation.title.toLowerCase().includes('optics')) {
                      // Optics placeholder using Physics base or simple threejs setup
                      // For now, we reuse Circuit or similar if no specific optics class exists
                      // Or implement a basic lens setup here?
                      // Given constraints, showing a generic placeholder or creating a simple lens scene
                      if(window.PhysicsSimulation) {
                           // Basic ThreeJS setup
                           this.currentSim = new PhysicsSimulation('sim-canvas');
                           this.currentSim.start();
                           // Add a simple lens object
                           const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
                           const material = new THREE.MeshPhongMaterial( {color: 0xaaffff, transparent: true, opacity: 0.5} );
                           const lens = new THREE.Mesh( geometry, material );
                           lens.rotation.x = Math.PI/2;
                           this.currentSim.scene.add( lens );
                      }
                 }
            }

        } else if (config.type === 'result' || config.type === 'calculation') {
            workspace.innerHTML = `
                <div class="card" style="max-width: 600px;">
                    <h3>📊 Results</h3>
                    <p>Record your observations and calculations in your notes.</p>
                    <div class="visual-display">
                        <p>✅ Experiment data recorded</p>
                    </div>
                </div>
            `;
        } else {
            workspace.innerHTML = `
                <div class="placeholder-message">
                    <p>🧪 Simulation workspace</p>
                    <p class="text-muted">Follow the instructions on the left</p>
                </div>
            `;
        }
    }

    async saveProgress() {
        const completed = this.currentStepIndex >= this.simulation.total_steps - 1;
        const score = completed ? 100 : Math.floor((this.currentStepIndex / this.simulation.total_steps) * 100);

        try {
            await fetch(`${this.apiBase}/progress/save.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.userId,
                    simulation_id: this.simulationId,
                    current_step: this.currentStepIndex,
                    completed: completed,
                    score: score
                })
            });
        } catch (error) {
            console.error('Save progress error:', error);
        }
    }

    nextStep() {
        if (this.currentStepIndex < this.simulation.total_steps - 1) {
            this.currentStepIndex++;
            this.renderCurrentStep();
        } else {
            // Show completion modal
            this.showCompletionModal();
        }
    }

    prevStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.renderCurrentStep();
        }
    }

    showCompletionModal() {
        const modal = document.getElementById('completionModal');
        modal.classList.add('active');
        document.getElementById('finalScore').textContent = '100';
    }

    attachEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());

        document.getElementById('exitBtn').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'subjects.html';
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Reset simulation to beginning?')) {
                this.currentStepIndex = 0;
                this.renderCurrentStep();
            }
        });

        document.getElementById('helpBtn').addEventListener('click', () => {
            alert('Read the instructions carefully on the left. Follow each step in order.');
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            document.getElementById('completionModal').classList.remove('active');
            this.currentStepIndex = 0;
            this.renderCurrentStep();
        });

        document.getElementById('returnBtn').addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    showError(message) {
        alert(message);
    }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimulationPlayer();
});
