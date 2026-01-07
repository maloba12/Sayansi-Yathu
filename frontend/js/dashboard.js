class DashboardManager {
    constructor() {
        this.apiBase = 'http://localhost:8000/api';
        this.container = document.getElementById('dashboard-content');
        this.user = this.getUser();
        this.init();
    }

    getUser() {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error("Invalid user data", e);
            }
        }
        return null;
    }

    async init() {
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }

        // Render based on role
        if (this.user.role === 'admin') {
            await this.renderAdminDashboard();
        } else if (['teacher', 'senior_teacher', 'head_teacher', 'hod'].includes(this.user.role)) {
            await this.renderTeacherDashboard();
        } else {
            await this.renderStudentDashboard();
        }

        // Attach listeners AFTER content is rendered
        this.attachGlobalListeners();
    }

    attachGlobalListeners() {
        // Handle logout for all dashboard types
        const logoutLinks = ['logoutLink', 'adminLogoutLink', 'teacherLogoutLink', 'studentLogoutLink'];
        logoutLinks.forEach(linkId => {
            const logoutLink = document.getElementById(linkId);
            if (logoutLink) {
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    window.location.href = 'login.html';
                });
            }
        });
    }


    // ============================================
    // ADMIN DASHBOARD
    // ============================================
    async renderAdminDashboard() {
        this.container.innerHTML = `
            <div class="dashboard-layout">
                <!-- Sidebar -->
                <aside class="dashboard-sidebar">
                    <div class="dashboard-sidebar-header">
                        <h3>Admin Panel</h3>
                        <p>${this.user.name}</p>
                    </div>
                    
                    <nav>
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="dashboard.html" class="sidebar-nav-link active">
                                    <span class="sidebar-nav-icon">📊</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="admin-users.html" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">👥</span>
                                    <span>Users</span>
                                    <span class="sidebar-badge">350</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="admin-reports.html" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">📈</span>
                                    <span>Reports</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="admin-settings.html" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">⚙️</span>
                                    <span>Settings</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        <p class="sidebar-section-title">System</p>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">🔔</span>
                                    <span>Notifications</span>
                                    <span class="sidebar-badge sidebar-badge-warning">3</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">📚</span>
                                    <span>Documentation</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link" id="adminLogoutLink">
                                    <span class="sidebar-nav-icon">🚪</span>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>
                
                <!-- Main Content -->
                <div class="dashboard-main">
                    <div class="mb-2xl">
                        <h1>Admin Dashboard <span class="badge badge-primary">Admin</span></h1>
                        <p>Welcome back, <strong>${this.user.name}</strong>. Manage your school system here.</p>
                    </div>

                    <div class="grid grid-cols-3 mb-2xl">
                        <div class="card">
                            <h3>Total Users</h3>
                            <p class="text-2xl font-bold" style="color: var(--primary-blue);">350</p>
                            <p class="text-sm text-gray">Teachers & Students</p>
                        </div>
                        <div class="card">
                            <h3>Active Sessions</h3>
                            <p class="text-2xl font-bold" style="color: var(--success-green);">24</p>
                            <p class="text-sm text-gray">Currently online</p>
                        </div>
                        <div class="card">
                            <h3>System Health</h3>
                            <p class="text-2xl font-bold" style="color: var(--accent-cyan);">98%</p>
                            <p class="text-sm text-gray">Uptime</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 mb-2xl">
                        <div class="card">
                            <h3>Quick Actions</h3>
                            <ul style="list-style: none; padding: 0; margin-top: 1rem;">
                                <li style="margin-bottom: 10px;"><a href="admin-users.html" class="btn btn-outline" style="width: 100%;">Manage Users</a></li>
                                <li style="margin-bottom: 10px;"><a href="admin-reports.html" class="btn btn-outline" style="width: 100%;">View Reports</a></li>
                                <li><a href="admin-settings.html" class="btn btn-outline" style="width: 100%;">System Settings</a></li>
                            </ul>
                        </div>
                        <div class="card">
                            <h3>Recent Security Logs</h3>
                            <ul style="font-size: 0.9rem; color: var(--gray-700);">
                                <li>• New login from Admin (Just now)</li>
                                <li>• Password reset for Mrs. Banda (10 mins ago)</li>
                                <li>• New student registration (1 hr ago)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    // ============================================
    // TEACHER DASHBOARD
    // ============================================
    async renderTeacherDashboard() {
        this.container.innerHTML = `
            <div class="dashboard-layout">
                <!-- Sidebar -->
                <aside class="dashboard-sidebar">
                    <div class="dashboard-sidebar-header">
                        <h3>Teacher Portal</h3>
                        <p>${this.user.name}</p>
                    </div>
                    
                    <nav>
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="dashboard.html" class="sidebar-nav-link active">
                                    <span class="sidebar-nav-icon">📊</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">👥</span>
                                    <span>My Classes</span>
                                    <span class="sidebar-badge">5</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">📝</span>
                                    <span>Assignments</span>
                                    <span class="sidebar-badge sidebar-badge-warning">12</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">📚</span>
                                    <span>Gradebook</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="subjects.html" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">🔬</span>
                                    <span>Experiments</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link" id="teacherLogoutLink">
                                    <span class="sidebar-nav-icon">🚪</span>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>
                
                <!-- Main Content -->
                <div class="dashboard-main">
                    <div class="mb-2xl">
                        <h1>Teacher Dashboard <span class="badge badge-success">Teacher</span></h1>
                        <p>Welcome back, <strong>${this.user.name}</strong>. Manage your classes and assignments.</p>
                    </div>

                    <div class="grid grid-cols-3 mb-2xl">
                        <div class="card">
                            <h3>My Classes</h3>
                            <p class="text-2xl font-bold">5</p>
                            <p class="text-sm text-gray">Active Classes</p>
                        </div>
                        <div class="card">
                            <h3>Students</h3>
                            <p class="text-2xl font-bold">128</p>
                            <p class="text-sm text-gray">Total Enrolled</p>
                        </div>
                        <div class="card">
                            <h3>Pending Review</h3>
                            <p class="text-2xl font-bold" style="color: var(--warning-orange);">12</p>
                            <p class="text-sm text-gray">Assignments to Grade</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 mb-2xl">
                        <div class="card">
                            <h3>Class Management</h3>
                            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 10px;">
                                 <button class="btn btn-primary">Create New Assignment</button>
                                 <button class="btn btn-outline">View Gradebook</button>
                                 <button class="btn btn-outline">My Schedule</button>
                            </div>
                        </div>
                        <div class="card">
                            <h3>Recent Student Activity</h3>
                            <div style="height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                                 <p class="text-gray">Chart Placeholder (Activity)</p>
                            </div>
                        </div>
                    </div>
                    
                    <h3>My Subjects</h3>
                    <div class="grid grid-cols-3">
                         <div class="card">Physics Grade 10</div>
                         <div class="card">Chemistry Grade 11</div>
                         <div class="card">Biology Grade 12</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // STUDENT DASHBOARD (Original Logic)
    // ============================================
    async renderStudentDashboard() {
        // Initial skeleton for student
        this.container.innerHTML = `
            <div class="dashboard-layout">
                <!-- Sidebar -->
                <aside class="dashboard-sidebar">
                    <div class="dashboard-sidebar-header">
                        <h3>My Learning</h3>
                        <p>${this.user.name}</p>
                    </div>
                    
                    <nav>
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="dashboard.html" class="sidebar-nav-link active">
                                    <span class="sidebar-nav-icon">📊</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="subjects.html" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">🔬</span>
                                    <span>Experiments</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">📚</span>
                                    <span>My Progress</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">🏆</span>
                                    <span>Achievements</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        <p class="sidebar-section-title">Subjects</p>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="subjects.html#physics" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">⚛️</span>
                                    <span>Physics</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="chemistry-form1.html" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">🧪</span>
                                    <span>Chemistry</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="subjects.html#biology" class="sidebar-nav-link">
                                    <span class="sidebar-nav-icon">🧬</span>
                                    <span>Biology</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="#" class="sidebar-nav-link" id="studentLogoutLink">
                                    <span class="sidebar-nav-icon">🚪</span>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>
                
                <!-- Main Content -->
                <div class="dashboard-main">
                    <div class="mb-2xl">
                        <h1>Welcome, <span id="studentName">${this.user.name}</span>! 👋</h1>
                        <p style="color: var(--gray-700); margin-top: var(--space-sm);">
                            Continue your virtual science journey
                        </p>
                    </div>

                    <!-- Stats Overview -->
                    <div class="grid grid-cols-3 mb-2xl">
                        <div class="card flex-col items-center">
                            <h2 style="color: var(--primary-blue);" id="completedCount">0</h2>
                            <p style="color: var(--gray-700);">Completed</p>
                        </div>
                        <div class="card flex-col items-center">
                            <h2 style="color: var(--accent-cyan);" id="inProgressCount">0</h2>
                            <p style="color: var(--gray-700);">In Progress</p>
                        </div>
                        <div class="card flex-col items-center">
                            <h2 style="color: var(--success-green);" id="avgScore">0%</h2>
                            <p style="color: var(--gray-700);">Avg Score</p>
                        </div>
                    </div>

                    <!-- Recent/In Progress -->
                    <h3 class="mb-lg">Continue Learning</h3>
                    <div class="grid grid-cols-2 mb-2xl" id="recentGrid">
                        <div class="card text-center">
                            <p>Loading your progress...</p>
                        </div>
                    </div>

                    <!-- Quick Start -->
                    <div class="card"
                        style="background: linear-gradient(135deg, var(--primary-blue), var(--accent-cyan)); color: var(--white); text-align: center; padding: 3rem;">
                        <h2 style="color: var(--white); margin-bottom: var(--space-lg);">Start a New Experiment</h2>
                        <a href="subjects.html" class="btn btn-lg" style="background: var(--white); color: var(--primary-blue);">
                            Explore All Experiments →
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Fetch Data
        await this.loadStudentProgress();
    }

    async loadStudentProgress() {
        try {
            const response = await fetch(`${this.apiBase}/progress/get.php?user_id=${this.user.id}`);
            const data = await response.json();

            if (data.success) {
                this.updateStudentStats(data.progress || []);
                this.renderStudentRecent(data.progress || []);
            }
        } catch (error) {
            console.error('Load progress error:', error);
            document.getElementById('recentGrid').innerHTML = '<p>Failed to load progress.</p>';
        }
    }

    updateStudentStats(progress) {
        const completed = progress.filter(p => p.completed).length;
        const inProgress = progress.filter(p => !p.completed).length;
        const avgScore = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + parseInt(p.score), 0) / progress.length)
            : 0;

        const elCompleted = document.getElementById('completedCount');
        const elInProgress = document.getElementById('inProgressCount');
        const elAvg = document.getElementById('avgScore');

        if(elCompleted) elCompleted.textContent = completed;
        if(elInProgress) elInProgress.textContent = inProgress;
        if(elAvg) elAvg.textContent = avgScore + '%';
    }

    renderStudentRecent(progress) {
        const grid = document.getElementById('recentGrid');
        if(!grid) return;

        if (progress.length === 0) {
            grid.innerHTML = `
                <div class="card text-center" style="grid-column: 1 / -1;">
                    <p>No experiments started yet. <a href="subjects.html">Start your first experiment</a></p>
                </div>
            `;
            return;
        }

        grid.innerHTML = progress.slice(0, 4).map(p => `
            <div class="card" style="cursor: pointer;" onclick="window.location.href='simulation-player.html?id=${p.simulation_id}'">
                <div class="flex justify-between items-center mb-md">
                    <span class="badge badge-${(p.subject || 'physics').toLowerCase()}">${p.subject || 'Science'}</span>
                    ${p.completed ? '<span class="badge badge-easy">✓ Complete</span>' : `<span style="font-size: 0.875rem; color: var(--gray-700);">${p.score}%</span>`}
                </div>
                <h4>${p.title}</h4>
                <div class="mt-md" style="background: var(--gray-200); height: 6px; border-radius: 999px; overflow: hidden;">
                    <div style="height: 100%; background: var(--primary-blue); width: ${p.score}%;"></div>
                </div>
                <button class="btn btn-primary mt-md" style="width: 100%;">
                    ${p.completed ? 'Replay' : 'Continue'} →
                </button>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});
