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
            // Build iframe URL using simulation_type from the API response
            const simType = this.simulation.simulation_type;
            const sim3dBase = window.SAYANSI_CONFIG?.sim3dBaseUrl || 'http://localhost:3001';
            
            if (!simType) {
                // Explicit fallback for missing type
                workspace.innerHTML = `
                    <div class="simulation-view" style="width: 100%; height: 600px; display: flex; align-items: center; justify-content: center; background: #1e293b; color: #e2e8f0; border-radius: 8px;">
                        <div style="text-align: center;">
                            <h2 style="color: #93c5fd; margin-bottom: 10px;">Simulation Type Unknown</h2>
                            <p style="color: #94a3b8;">This experiment does not have a defined simulation type metadata.</p>
                        </div>
                    </div>
                `;
                return;
            }

            const iframeSrc = `${sim3dBase}/index_3d.html?type=${simType}`;
            
            workspace.innerHTML = `
                <div class="simulation-view" style="width: 100%; height: 600px; position: relative;">
                    <iframe id="react3d-iframe" src="${iframeSrc}" 
                            style="width: 100%; height: 100%; border: 2px solid #ddd; border-radius: 8px;" 
                            frameborder="0">
                    </iframe>
                    <div id="react3d-fallback" style="display:none; text-align:center; padding: 40px; background:#fff3cd; border:2px solid #ffc107; border-radius:8px; margin-top:10px;">
                        <p style="color:#856404; font-size:16px;">⚠️ Could not load the 3D simulation. Please ensure the simulation assets are available.</p>
                        <button class="btn btn-primary" onclick="document.getElementById('react3d-iframe').src='${iframeSrc}'">Retry</button>
                    </div>
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
                        document.getElementById('react3d-fallback').style.display = 'block';
                    }
                } catch(e) { /* cross-origin, ignore */ }
            });

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
