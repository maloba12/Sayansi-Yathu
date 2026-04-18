class GamificationEngine {
    constructor() {
        this.badges = [
            { id: 'first_experiment', name: 'First Steps', icon: '🧪', requirement: 1 },
            { id: 'physics_master', name: 'Physics Master', icon: '⚡', requirement: 5 },
            { id: 'chemistry_expert', name: 'Chemistry Expert', icon: '🧪', requirement: 5 },
            { id: 'biology_pro', name: 'Biology Pro', icon: '🧬', requirement: 5 },
            { id: 'streak_3', name: '3-Day Streak', icon: '🔥', requirement: 3 },
            { id: 'perfect_score', name: 'Perfect Score', icon: '⭐', requirement: 100 },
            { id: 'team_player', name: 'Team Player', icon: '👥', requirement: 1 },
            { id: 'innovator', name: 'Innovator', icon: '💡', requirement: 1 }
        ];

        this.levels = [
            { level: 1, xpRequired: 0, title: 'Novice' },
            { level: 2, xpRequired: 100, title: 'Learner' },
            { level: 3, xpRequired: 250, title: 'Explorer' },
            { level: 4, xpRequired: 500, title: 'Student' },
            { level: 5, xpRequired: 1000, title: 'Apprentice' },
            { level: 6, xpRequired: 2000, title: 'Scientist' },
            { level: 7, xpRequired: 4000, title: 'Expert' },
            { level: 8, xpRequired: 8000, title: 'Master' },
            { level: 9, xpRequired: 16000, title: 'Professor' },
            { level: 10, xpRequired: 32000, title: 'Grandmaster' }
        ];

        this.init();
    }

    init() {
        this.loadUserProgress();
        this.loadFromBackend(); // REC-Gamification: fetch persisted data from MySQL
        this.createGamificationUI();
    }

    loadUserProgress() {
        this.userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
            level: 1,
            xp: 0,
            badges: [],
            streak: 0,
            lastActivity: new Date().toISOString(),
            totalExperiments: 0,
            subjectsCompleted: { physics: 0, chemistry: 0, biology: 0 }
        };
    }

    saveProgress() {
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
        this.syncToBackend(); // REC-Gamification: persist to MySQL
    }

    // --------------------------------------------------
    // Sync gamification state UP to the PHP backend
    // --------------------------------------------------
    syncToBackend() {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const userId = userData.id;
        if (!userId) return; // not logged in, skip sync

        const payload = {
            user_id: userId,
            xp: this.userProgress.xp,
            level: this.userProgress.level,
            streak: this.userProgress.streak,
            badges: this.userProgress.badges,
            experiments_completed: this.userProgress.totalExperiments
        };

        fetch('http://localhost:8000/api/gamification/sync.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {}); // fire-and-forget; localStorage is the source of truth
    }

    // --------------------------------------------------
    // Load persisted gamification state FROM the backend
    // and merge with localStorage (keeping the higher value)
    // --------------------------------------------------
    loadFromBackend() {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const userId = userData.id;
        if (!userId) return;

        fetch(`http://localhost:8000/api/gamification/sync.php?user_id=${userId}`)
            .then(r => r.json())
            .then(data => {
                if (!data.success || !data.gamification) return;
                const remote = data.gamification;
                // Merge: always keep the HIGHER value to avoid data loss
                this.userProgress.xp    = Math.max(this.userProgress.xp,    remote.xp    || 0);
                this.userProgress.level = Math.max(this.userProgress.level,  remote.level || 1);
                this.userProgress.streak = remote.streak || this.userProgress.streak;
                this.userProgress.totalExperiments = Math.max(
                    this.userProgress.totalExperiments,
                    remote.experiments_completed || 0
                );
                // Merge badges: union of both badge arrays
                if (Array.isArray(remote.badges)) {
                    const merged = [...new Set([...this.userProgress.badges, ...remote.badges])];
                    this.userProgress.badges = merged;
                }
                // Persist the merged result back to localStorage
                localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
            })
            .catch(() => {}); // silently ignore on network error
    }

    awardXP(amount, reason) {
        this.userProgress.xp += amount;
        this.checkLevelUp();
        this.showXPNofication(amount, reason);
        this.saveProgress();
    }

    checkLevelUp() {
        const currentLevel = this.userProgress.level;
        const nextLevel = this.levels.find(l => l.level === currentLevel + 1);

        if (nextLevel && this.userProgress.xp >= nextLevel.xpRequired) {
            this.userProgress.level = nextLevel.level;
            this.showLevelUpNotification(nextLevel);
        }
    }

    awardBadge(badgeId) {
        if (!this.userProgress.badges.includes(badgeId)) {
            const badge = this.badges.find(b => b.id === badgeId);
            this.userProgress.badges.push(badgeId);
            this.showBadgeNotification(badge);
            this.saveProgress();
        }
    }

    completeExperiment(experiment) {
        this.userProgress.totalExperiments++;
        this.userProgress.subjectsCompleted[experiment.subject]++;

        // Award XP based on difficulty
        const xpAmount = experiment.difficulty === 'easy' ? 10 :
                        experiment.difficulty === 'medium' ? 25 : 50;
        this.awardXP(xpAmount, `Completed ${experiment.title}`);

        // Check for badges
        this.checkBadges();
    }

    checkBadges() {
        if (this.userProgress.totalExperiments === 1) {
            this.awardBadge('first_experiment');
        }

        if (this.userProgress.subjectsCompleted.physics >= 5) {
            this.awardBadge('physics_master');
        }

        if (this.userProgress.subjectsCompleted.chemistry >= 5) {
            this.awardBadge('chemistry_expert');
        }

        if (this.userProgress.subjectsCompleted.biology >= 5) {
            this.awardBadge('biology_pro');
        }
    }

    createGamificationUI() {
        const gamificationPanel = document.createElement('div');
        gamificationPanel.className = 'gamification-panel';
        gamificationPanel.innerHTML = `
            <div class="level-display">
                <span>Level ${this.userProgress.level}</span>
                <div class="xp-bar">
                    <div class="xp-fill" style="width: ${this.getXPPercentage()}%"></div>
                </div>
                <span>${this.userProgress.xp} / ${this.getNextLevelXP()} XP</span>
            </div>
            <div class="badges-display">
                <h4>Badges</h4>
                <div class="badges-grid">
                    ${this.renderBadges()}
                </div>
            </div>
            <div class="leaderboard-preview">
                <h4>Top Students</h4>
                <div id="leaderboard-list"></div>
            </div>
        `;

        document.querySelector('.dashboard-container').appendChild(gamificationPanel);
    }

    renderBadges() {
        return this.badges.map(badge => {
            const earned = this.userProgress.badges.includes(badge.id);
            return `
                <div class="badge ${earned ? 'earned' : 'locked'}"
                     title="${badge.name}: ${badge.requirement}">
                    <span class="badge-icon">${badge.icon}</span>
                    <span class="badge-name">${badge.name}</span>
                </div>
            `;
        }).join('');
    }

    getXPPercentage() {
        const currentLevel = this.levels.find(l => l.level === this.userProgress.level);
        const nextLevel = this.levels.find(l => l.level === this.userProgress.level + 1);

        if (!nextLevel) return 100;

        const levelStartXP = currentLevel.xpRequired;
        const levelEndXP = nextLevel.xpRequired;
        const currentXP = this.userProgress.xp;

        return ((currentXP - levelStartXP) / (levelEndXP - levelStartXP)) * 100;
    }

    getNextLevelXP() {
        const nextLevel = this.levels.find(l => l.level === this.userProgress.level + 1);
        return nextLevel ? nextLevel.xpRequired : this.levels[this.levels.length - 1].xpRequired;
    }

    showXPNofication(amount, reason) {
        this.showNotification(`+${amount} XP`, reason, 'xp-notification');
    }

    showLevelUpNotification(level) {
        this.showNotification(`Level Up!`, `You reached ${level.title}`, 'level-notification');
    }

    showBadgeNotification(badge) {
        this.showNotification('New Badge!', `You earned: ${badge.name}`, 'badge-notification');
    }

    showNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

window.gamification = new GamificationEngine();
