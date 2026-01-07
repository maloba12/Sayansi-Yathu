// Form 1 Chemistry Experiments Manager
class ChemistryExperimentsManager {
    constructor() {
        this.experiments = [];
        this.init();
    }

    async init() {
        await this.loadExperiments();
        this.attachModalListeners();
    }

    async loadExperiments() {
        try {
            const response = await fetch('data/chemistry_form1.json');
            this.experiments = await response.json();
            this.renderExperiments();
        } catch (error) {
            console.error('Error loading experiments:', error);
            document.getElementById('experimentGrid').innerHTML = '<p>Error loading experiments. Please try again later.</p>';
        }
    }

    renderExperiments() {
        const grid = document.getElementById('experimentGrid');
        if (!grid) return;

        grid.innerHTML = this.experiments.map(exp => `
            <div class="experiment-card" onclick="chemistryManager.openExperiment(${exp.id})">
                <div class="experiment-topic">${exp.topic}</div>
                <div class="experiment-title">${exp.title}</div>
                <div class="experiment-aim">${exp.aim}</div>
                <div class="experiment-footer">
                    <span class="badge badge-primary">CDC 2024</span>
                    <button class="btn btn-outline" onclick="event.stopPropagation(); window.location.href='chemistry-lab.html?id=${exp.id}'" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">View Lab</button>
                </div>
            </div>
        `).join('');
    }

    openExperiment(id) {
        const exp = this.experiments.find(e => e.id === id);
        if (!exp) return;

        const modal = document.getElementById('experimentModal');
        const body = document.getElementById('modalBody');

        body.innerHTML = `
            <div class="experiment-topic" style="font-size: 1rem;">${exp.topic}</div>
            <h2 class="experiment-title" style="font-size: 2rem; margin-bottom: 1.5rem;">${exp.title}</h2>
            
            <div class="experiment-detail-section">
                <h4>Aim</h4>
                <p>${exp.aim}</p>
            </div>

            <div class="experiment-detail-section">
                <h4>Materials</h4>
                <div class="materials-tags">
                    ${exp.materials.map(m => `<span class="material-tag">${m}</span>`).join('')}
                </div>
            </div>

            <div class="experiment-detail-section">
                <h4>Procedure</h4>
                <ol class="procedure-list">
                    ${exp.procedure.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>

            <div class="experiment-grid" style="grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="experiment-detail-section">
                    <h4>Observations</h4>
                    <p>${exp.observations}</p>
                </div>
                <div class="experiment-detail-section">
                    <h4>Conclusion</h4>
                    <p>${exp.conclusion}</p>
                </div>
            </div>

            <div class="safety-alert">
                <strong>⚠️ Safety Precaution:</strong> ${exp.safety_precautions}
            </div>

            <div style="margin-top: 2rem; font-size: 0.875rem; color: var(--gray-500);">
                Curriculum Link: ${exp.curriculum_link}
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    attachModalListeners() {
        const modal = document.getElementById('experimentModal');
        const close = document.getElementById('closeModal');

        close.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

const chemistryManager = new ChemistryExperimentsManager();
window.chemistryManager = chemistryManager;
