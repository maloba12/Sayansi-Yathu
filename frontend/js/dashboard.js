// Dashboard logic: load experiments for the logged-in user and render them by subject

// Ensure this runs after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const usernameEl = document.getElementById('username');
    const contentEl = document.getElementById('experiment-content');
    const progressFill = document.getElementById('progress-fill');

    const userDataRaw = localStorage.getItem('user_data');
    const user = userDataRaw ? JSON.parse(userDataRaw) : null;

    if (user && usernameEl) {
        usernameEl.textContent = user.name || 'Student';
    }

    async function loadAndRender(subject) {
        if (!user) {
            contentEl.innerHTML = '<p>Please log in again.</p>';
            return;
        }

        try {
            const experiments = await window.ExperimentAPI.getExperiments(user.id);
            const filtered = experiments.filter(exp => exp.subject === subject);

            if (filtered.length === 0) {
                contentEl.innerHTML = `<h2>${subject.toUpperCase()} Experiments</h2><p>No experiments found.</p>`;
                if (progressFill) progressFill.style.width = '0%';
                return;
            }

            // Simple progress: completed experiments / total
            const completed = filtered.filter(exp => Number(exp.completed_steps || 0) > 0).length;
            const percent = Math.round((completed / filtered.length) * 100);
            if (progressFill) progressFill.style.width = `${percent}%`;

            const cards = filtered.map(exp => {
                const difficulty = exp.difficulty_level || '';
                const score = exp.score != null ? `Score: ${exp.score}` : 'Not attempted yet';
                return `
                    <div class="experiment-card">
                        <h3>${exp.title}</h3>
                        <p>${exp.description}</p>
                        <div class="experiment-meta">
                            <span class="difficulty">${difficulty}</span>
                            <span>${score}</span>
                        </div>
                    </div>
                `;
            }).join('');

            contentEl.innerHTML = `
                <h2>${subject.charAt(0).toUpperCase() + subject.slice(1)} Experiments</h2>
                <div class="experiment-grid">${cards}</div>
            `;
        } catch (err) {
            console.error('Failed to load experiments', err);
            contentEl.innerHTML = '<p>Failed to load experiments. Please try again later.</p>';
            if (progressFill) progressFill.style.width = '0%';
        }
    }

    // Expose global function used by buttons in dashboard.html
    window.loadExperiment = loadAndRender;
});
