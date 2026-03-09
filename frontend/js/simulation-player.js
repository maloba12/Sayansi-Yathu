// Simulation Player Logic
class SimulationPlayer {
    constructor() {
        this.simulationId = this.getSimulationIdFromURL();
        this.simulation = null;
        this.currentStepIndex = 0;
        this.userId = this.getUserId(); // From localStorage or session
        this.apiBase = 'http://localhost:8000/api';
        this._startTime = Date.now(); // Track time spent in session
        this._accumulatedTime = 0;    // Time loaded from backend (seconds)
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
                // Map completed_steps back to currentStepIndex safely
                const completedSteps = parseInt(data.progress.completed_steps, 10) || 0;
                const totalSteps = this.simulation ? this.simulation.total_steps : 0;
                this.currentStepIndex = Math.min(completedSteps, Math.max(totalSteps - 1, 0));
                this._accumulatedTime = parseInt(data.progress.time_spent, 10) || 0;
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

        // Update AI Tutor context
        if (window.aiTutor) {
            window.aiTutor.setContext({
                simulationTitle: this.simulation.title,
                currentStep: step.title,
                subject: this.simulation.subject
            });
        }

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
                    <div id="external-sim-message" style="display:none; text-align:center; padding-top: 100px;">
                        <h3>🚀 3D Simulation Launched!</h3>
                        <div style="background: #f0f8ff; border: 2px solid #0066cc; border-radius: 8px; padding: 20px; margin: 20px auto; max-width: 500px;">
                            <h4>📋 How to Use:</h4>
                            <ul style="text-align: left; display: inline-block;">
                                <li>🖱️ <strong>Mouse:</strong> Look around the experiment</li>
                                <li>⌨️ <strong>WASD:</strong> Move camera position</li>
                                <li>🔍 <strong>Scroll:</strong> Zoom in/out</li>
                                <li>🚪 <strong>ESC:</strong> Close the 3D window</li>
                            </ul>
                            <p style="margin-top: 15px; color: #666;">
                                <strong>💡 Tip:</strong> Check your taskbar or press Alt+Tab if you don't see the 3D window
                            </p>
                        </div>
                        <button class="btn btn-primary" onclick="window.location.reload()">Back to Dashboard</button>
                    </div>
                    <canvas id="sim-canvas" style="width: 100%; height: 100%; display: block;"></canvas>
                    <div id="p5-container" style="width: 100%; height: 100%;"></div>
                </div>
                <div class="controls-overlay" style="margin-top: 1rem; text-align: center;">
                    <p>${step.instructions}</p>
                    <button id="launch3DBtn" class="btn btn-success" style="display:none;">Launch 3D View</button>
                </div>
            `;

            // Initialize specific simulation based on visual tag or experiment title
            const visual = config.visual || '';
            
            // Check if this should use React 3D (new approach) or Python/Ursina (legacy)
            const react3DTypes = [
                'pendulum', 'free_fall', 'linear_motion', 'hookes_law', 'friction', 'circuit',
                'density', 'pressure', 'cog', 'apparatus', 'states', 'separation', 'litmus',
                'combustion', 'water_purify', 'cell', 'dna'
            ];
            const t = this.simulation.title.toLowerCase();
            const isReact3D = react3DTypes.includes(visual) ||
                               t.includes('pendulum') ||
                               t.includes('free fall') ||
                               t.includes('acceleration') ||
                               t.includes('linear motion') ||
                               t.includes('hooke') ||
                               t.includes('friction') ||
                               t.includes('circuit') ||
                               t.includes('ohm') ||
                               t.includes('density') ||
                               t.includes('pressure') ||
                               t.includes('gravity') ||
                               t.includes('stability') ||
                               t.includes('moments') ||
                               t.includes('apparatus') ||
                               t.includes('matter') ||
                               t.includes('boiling') ||
                               t.includes('melting') ||
                               t.includes('diffusion') ||
                               t.includes('mixture') ||
                               t.includes('separation') ||
                               t.includes('filter') ||
                               t.includes('evaporat') ||
                               t.includes('indicator') ||
                               t.includes('combustion') ||
                               t.includes('oxygen') ||
                               t.includes('candle') ||
                               t.includes('air') ||
                               t.includes('water purify') ||
                               t.includes('purification') ||
                               t.includes('biological cell') ||
                               t.includes('plant cell') ||
                               t.includes('animal cell') ||
                               t.includes('dna') ||
                               t.includes('helix');
            
            const isPython3D = ['chemistry_mix', 'pipette', 'beaker', 'cell_3d', 'dna'].includes(visual);

            if (isReact3D) {
                // Use new React 3D approach - embed directly
                document.getElementById('sim-canvas').style.display = 'none';
                document.getElementById('p5-container').style.display = 'none';
                
                // Build iframe URL: use configured base or fall back to same-origin relative path
                const sim3dBase = window.SAYANSI_CONFIG?.sim3dBaseUrl || '';
                // Map to React component type — prefer visual tag, fall back to title match
                let simVisual = visual || '';
                if (!react3DTypes.includes(simVisual)) {
                const t = this.simulation.title.toLowerCase();
                if (t.includes('free fall') || t.includes('acceleration')) simVisual = 'free_fall';
                else if (t.includes('linear motion')) simVisual = 'linear_motion';
                else if (t.includes('hooke')) simVisual = 'hookes_law';
                else if (t.includes('friction')) simVisual = 'friction';
                else if (t.includes('circuit') || t.includes('ohm')) simVisual = 'circuit';
                else if (t.includes('density')) simVisual = 'density';
                else if (t.includes('pressure')) simVisual = 'pressure';
                else if (t.includes('gravity') || t.includes('stability') || t.includes('moments')) simVisual = 'cog';
                else if (t.includes('apparatus')) simVisual = 'apparatus';
                else if (t.includes('matter') || t.includes('boiling') || t.includes('melting') || t.includes('diffusion')) simVisual = 'states';
                else if (t.includes('separation') || t.includes('filter') || t.includes('evaporat')) simVisual = 'separation';
                else if (t.includes('acid') || t.includes('base') || t.includes('litmus') || t.includes('indicator')) simVisual = 'litmus';
                else if (t.includes('combustion') || t.includes('oxygen') || t.includes('candle') || t.includes('air')) simVisual = 'combustion';
                else if (t.includes('water purify') || t.includes('purification')) simVisual = 'water_purify';
                else if (t.includes('biological cell') || t.includes('plant cell') || t.includes('animal cell') || t.includes('cell')) simVisual = 'cell';
                else if (t.includes('dna') || t.includes('helix')) simVisual = 'dna';
                else simVisual = 'pendulum';
                }
                const iframeSrc = sim3dBase
                    ? `${sim3dBase}/index_3d.html?type=${simVisual}`
                    : `index_3d.html?type=${simVisual}`;
                
                // Create iframe for React 3D simulation with error fallback
                workspace.innerHTML += `
                    <div id="react3d-container" style="width: 100%; height: 600px; border: 2px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <iframe id="react3d-iframe" src="${iframeSrc}" 
                                style="width: 100%; height: 100%; border: none;" 
                                frameborder="0">
                        </iframe>
                    </div>
                    <div id="react3d-fallback" style="display:none; text-align:center; padding: 40px; background:#fff3cd; border:2px solid #ffc107; border-radius:8px; margin-top:10px;">
                        <p style="color:#856404; font-size:16px;">⚠️ Could not load the 3D simulation. Please ensure the simulation assets are available.</p>
                        <button class="btn btn-primary" onclick="document.getElementById('react3d-iframe').src='${iframeSrc}'">Retry</button>
                    </div>
                    <div style="text-align: center; margin-top: 10px;">
                        <p style="color: #666; font-size: 14px;">
                            🧪 Interactive 3D Pendulum Simulation - Adjust length and angle using controls
                        </p>
                    </div>
                `;
                
                // Attach error fallback listener
                const iframe3d = document.getElementById('react3d-iframe');
                iframe3d.addEventListener('error', () => {
                    document.getElementById('react3d-fallback').style.display = 'block';
                });
                // Also handle load failure (same-origin only)
                iframe3d.addEventListener('load', () => {
                    try {
                        // If cross-origin, this will throw; that's acceptable
                        if (iframe3d.contentDocument && iframe3d.contentDocument.title === '') {
                            // Empty document likely means load failed
                        }
                    } catch(e) { /* cross-origin, ignore */ }
                });
            } else if (isPython3D) {
                const launchBtn = document.getElementById('launch3DBtn');
                launchBtn.style.display = 'inline-block';
                document.getElementById('sim-canvas').style.display = 'none';
                
                // Map frontend visual/title to Ursina backend simulation types
                let simType = 'pendulum'; // Default
                const title = this.simulation.title.toLowerCase();
                
                if (title.includes('titration') || visual === 'pipette') {
                    simType = 'titration';
                } else if (title.includes('apparatus')) {
                    simType = 'apparatus_id';
                } else if (title.includes('melting') || title.includes('boiling')) {
                    simType = 'melting_boiling';
                } else if (title.includes('diffusion')) {
                    simType = 'diffusion';
                } else if (title.includes('filtration') && !title.includes('water')) {
                    simType = 'filtration';
                } else if (title.includes('evaporation')) {
                    simType = 'evaporation';
                } else if (title.includes('combustion') || title.includes('supports burning')) {
                    simType = 'combustion';
                } else if (title.includes('carbon dioxide') || title.includes('co2')) {
                    simType = 'co2_test';
                } else if (title.includes('solvent')) {
                    simType = 'solvent';
                } else if (title.includes('water filtration')) {
                    simType = 'water_filtration';
                } else if (title.includes('litmus')) {
                    simType = 'litmus';
                } else if (title.includes('natural indicator')) {
                    simType = 'indicators';
                } else if (visual === 'beaker' || visual === 'chemistry_mix' || title.includes('reaction')) {
                    simType = 'reaction';
                } else if (visual === 'cell_3d' || this.simulation.subject.toLowerCase() === 'biology') {
                    simType = 'cell';
                } else if (visual === 'dna') {
                    simType = 'dna';
                } else if (title.includes('circuit')) {
                    simType = 'circuit';
                } else if (title.includes('pendulum')) {
                    simType = 'pendulum';
                } else if (title.includes('safety') || title.includes('waste')) {
                    simType = 'safety';
                } else if (title.includes('workflow') || title.includes('investigation')) {
                    simType = 'workflow';
                } else if (title.includes('identification') || title.includes('apparatus')) {
                    simType = 'apparatus_id';
                } else if (title.includes('length')) {
                    simType = 'length';
                } else if (title.includes('mass')) {
                    simType = 'mass';
                } else if (title.includes('volume')) {
                    simType = 'volume';
                } else if (title.includes('time')) {
                    simType = 'time_meas';
                } else if (title.includes('weight')) {
                    simType = 'weight';
                } else if (title.includes('density')) {
                    simType = 'density';
                } else if (title.includes('precision') || title.includes('accuracy')) {
                    simType = 'precision';
                } else if (title.includes('centre of mass')) {
                    simType = 'com';
                } else if (title.includes('equilibrium')) {
                    simType = 'equilibrium';
                } else if (title.includes('linear motion') || title.includes('velocity') || title.includes('acceleration')) {
                    simType = 'linear_motion';
                } else if (title.includes('free fall') || title.includes('gravitational acceleration')) {
                    simType = 'free_fall';
                } else if (title.includes('effect of force') || title.includes('force on motion')) {
                    simType = 'force_effect';
                } else if (title.includes('friction')) {
                    simType = 'friction';
                } else if (title.includes('hooke')) {
                    simType = 'hookes_law';
                } else if (title.includes('circular motion') || title.includes('centripetal')) {
                    simType = 'circular_motion';
                } else if (title.includes('moment of a force') || (title.includes('lever') && !title.includes('principle'))) {
                    simType = 'moments_lever';
                } else if (title.includes('principle of moments')) {
                    simType = 'principle_moments';
                } else if (title.includes('solar system') || title.includes('eclipse')) {
                    simType = 'solar_system';
                } else if (title.includes('structure of the earth') && !title.includes('atmosphere')) {
                    simType = 'earth_structure';
                } else if (title.includes('atmosphere')) {
                    simType = 'atmosphere';
                }

                
                launchBtn.addEventListener('click', async () => {
                    launchBtn.disabled = true;
                    launchBtn.textContent = 'Launching Realism Mode...';
                    
                    try {
                        const response = await fetch(`http://localhost:5000/api/launch-simulation`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: simType })
                        });
                        const res = await response.json();
                        
                        if (res.success) {
                            document.getElementById('external-sim-message').style.display = 'block';
                            launchBtn.style.display = 'none';
                        } else {
                            alert('Failed to launch 3D: ' + res.message);
                            launchBtn.disabled = false;
                            launchBtn.textContent = 'Launch 3D View';
                        }
                    } catch (e) {
                        console.error(e);
                        alert('Error connecting to backend');
                        launchBtn.disabled = false;
                    }
                });
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
        const totalSteps = this.simulation.total_steps || 0;
        const completedSteps = this.currentStepIndex + 1; // 1-based count of completed steps
        const isCompleted = completedSteps >= totalSteps;
        const score = isCompleted ? 100 : Math.floor((completedSteps / totalSteps) * 100);
        // Calculate time spent: accumulated from backend + current session elapsed (in seconds)
        const sessionSeconds = Math.floor((Date.now() - this._startTime) / 1000);
        const timeSpent = (this._accumulatedTime || 0) + sessionSeconds;

        try {
            await fetch(`${this.apiBase}/progress/save.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.userId,
                    simulation_id: this.simulationId,
                    completed_steps: completedSteps,
                    total_steps: totalSteps,
                    time_spent: timeSpent,
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

        document.getElementById('tutorBtn').addEventListener('click', () => {
            if (window.aiTutor) window.aiTutor.toggle();
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
