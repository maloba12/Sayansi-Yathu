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