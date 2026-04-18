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
    // NAVIGATION & PANEL LOGIC
    // ============================================
    showPanel(panelName) {
        console.log(`Showing panel: ${panelName}`);
        const mainContent = document.querySelector('.dashboard-main');
        if (!mainContent) return;

        // Update active state in sidebar
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(panelName)) {
                link.classList.add('active');
            }
        });

        switch (panelName) {
            case 'admin-home':
                this.renderAdminHome(mainContent);
                break;
            case 'admin-users':
                this.renderAdminUsers(mainContent);
                break;
            case 'admin-reports':
                this.renderAdminReports(mainContent);
                break;
            case 'admin-settings':
                this.renderAdminSettings(mainContent);
                break;
            case 'admin-notifications':
                this.renderAdminNotifications(mainContent);
                break;
            case 'admin-documentation':
                this.renderAdminDocumentation(mainContent);
                break;
            case 'teacher-home':
                this.renderTeacherHome(mainContent);
                break;
            case 'teacher-classes':
                this.renderTeacherClasses(mainContent);
                break;
            case 'teacher-assignments':
                this.renderTeacherAssignments(mainContent);
                break;
            case 'teacher-experiments':
                this.renderTeacherExperiments(mainContent);
                break;
            case 'teacher-ai':
                this.renderTeacherAI(mainContent);
                break;
            case 'student-home':
                this.renderStudentHome(mainContent);
                break;
            case 'student-progress':
                this.renderStudentProgress(mainContent);
                break;
            case 'student-achievements':
                this.renderStudentAchievements(mainContent);
                break;
            default:
                mainContent.innerHTML = `<h2>Panel ${panelName} under construction</h2>`;
        }
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
                                <a href="javascript:void(0)" class="sidebar-nav-link active" onclick="dashboard.showPanel('admin-home')">
                                    <span class="sidebar-nav-icon">📊</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('admin-users')">
                                    <span class="sidebar-nav-icon">👥</span>
                                    <span>Users</span>
                                    <span class="sidebar-badge">350</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('admin-reports')">
                                    <span class="sidebar-nav-icon">📈</span>
                                    <span>Reports</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('admin-settings')">
                                    <span class="sidebar-nav-icon">⚙️</span>
                                    <span>Settings</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        <p class="sidebar-section-title">System</p>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('admin-notifications')">
                                    <span class="sidebar-nav-icon">🔔</span>
                                    <span>Notifications</span>
                                    <span class="sidebar-badge sidebar-badge-warning">3</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('admin-documentation')">
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
                    <!-- Default Panel -->
                </div>
            </div>
        `;
        this.showPanel('admin-home');
    }

    renderAdminHome(container) {
        container.innerHTML = `
            <div class="mb-2xl animate-fade-in">
                <h1 style="background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">Admin Dashboard</h1>
                <p class="text-gray mt-xs">Welcome back, <strong>${this.user.name}</strong>. System status: <span class="badge badge-easy">Optimal</span></p>
            </div>

            <!-- Quick Stats Bar -->
            <div class="grid grid-cols-4 mb-2xl">
                <div class="stat-card-vibrant text-center card-vibrant">
                    <p class="text-3xl font-bold" style="color: var(--primary-vibrant);">350</p>
                    <p class="text-xs text-uppercase font-bold tracking-wider text-gray mt-xs">Total Users</p>
                </div>
                <div class="stat-card-vibrant text-center card-vibrant" style="border-left-color: var(--success-green);">
                    <p class="text-3xl font-bold" style="color: var(--success-green);">28</p>
                    <p class="text-xs text-uppercase font-bold tracking-wider text-gray mt-xs">Teachers</p>
                </div>
                <div class="stat-card-vibrant text-center card-vibrant" style="border-left-color: var(--warning-yellow);">
                    <p class="text-3xl font-bold" style="color: var(--warning-yellow);">322</p>
                    <p class="text-xs text-uppercase font-bold tracking-wider text-gray mt-xs">Students</p>
                </div>
                <div class="stat-card-vibrant text-center card-vibrant" style="border-left-color: var(--accent-cyan);">
                    <p class="text-3xl font-bold" style="color: var(--accent-cyan);">24</p>
                    <p class="text-xs text-uppercase font-bold tracking-wider text-gray mt-xs">Active Now</p>
                </div>
            </div>

            <div class="grid grid-cols-3 mb-2xl">
                <!-- System Health -->
                <div class="stat-card-vibrant">
                    <h3>🟢 System Health</h3>
                    <div style="font-size: 0.9rem; margin-top: 15px;">
                        <div class="flex items-center mb-md"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--success-green); margin-right: 12px; box-shadow: 0 0 8px var(--success-green);"></span> API Server — Online</div>
                        <div class="flex items-center mb-md"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--success-green); margin-right: 12px; box-shadow: 0 0 8px var(--success-green);"></span> Database — Connected</div>
                        <div class="flex items-center mb-md"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--success-green); margin-right: 12px; box-shadow: 0 0 8px var(--success-green);"></span> Python AI — Running</div>
                        <div class="text-gray mt-md pt-md border-t">Uptime: <strong>99.9%</strong></div>
                    </div>
                </div>
                <!-- Pending Approvals -->
                <div class="stat-card-vibrant">
                    <h3>⏳ Pending Approvals</h3>
                    <div style="font-size: 0.85rem; margin-top: 15px;">
                        <div class="flex justify-between items-center mb-md p-sm bg-gray-50 rounded">
                            <span>Teachers</span>
                            <span class="badge badge-warning">2 pending</span>
                        </div>
                        <div class="flex justify-between items-center mb-md p-sm bg-gray-50 rounded">
                            <span>Students</span>
                            <span class="badge badge-warning">5 pending</span>
                        </div>
                        <div class="flex justify-between items-center p-sm bg-gray-50 rounded">
                            <span>Pass Reset</span>
                            <span class="badge badge-warning">1 pending</span>
                        </div>
                    </div>
                </div>
                <!-- Quick Actions -->
                <div class="stat-card-vibrant">
                    <h3>⚡ Quick Actions</h3>
                    <div style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                        <button class="btn btn-primary btn-sm" style="background: var(--primary-gradient);" onclick="dashboard.showPanel('admin-users')">👥 Manage Users</button>
                        <button class="btn btn-outline btn-sm" onclick="dashboard.showPanel('admin-reports')">📈 View Reports</button>
                        <button class="btn btn-outline btn-sm" onclick="dashboard.showPanel('admin-settings')">⚙️ Settings</button>
                    </div>
                </div>
            </div>

            <!-- Subject Breakdown -->
            <div class="grid grid-cols-3 mb-2xl">
                <div class="stat-card-vibrant bg-gradient-primary" style="border: none;">
                    <div class="text-3xl mb-md">⚛️</div>
                    <h4 style="color: white; margin-bottom: 5px;">Physics</h4>
                    <p class="text-sm opacity-80">167 experiments completed</p>
                </div>
                <div class="stat-card-vibrant" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none;">
                    <div class="text-3xl mb-md">🧪</div>
                    <h4 style="color: white; margin-bottom: 5px;">Chemistry</h4>
                    <p class="text-sm opacity-80">198 experiments completed</p>
                </div>
                <div class="stat-card-vibrant" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none;">
                    <div class="text-3xl mb-md">🧬</div>
                    <h4 style="color: white; margin-bottom: 5px;">Biology</h4>
                    <p class="text-sm opacity-80">245 experiments completed</p>
                </div>
            </div>

            <div class="grid grid-cols-2">
                <div class="stat-card-vibrant border-t-4" style="border-top-color: var(--primary-vibrant);">
                    <div class="flex justify-between items-center mb-md">
                        <h3>📡 Activity Feed</h3>
                        <button class="btn btn-link btn-sm" onclick="dashboard.showPanel('admin-notifications')">View All</button>
                    </div>
                    <ul class="text-sm" style="list-style: none; padding: 0;">
                        <li class="border-b py-md flex justify-between">
                            <span>Chanda Mwansa completed <strong>Cell Structure</strong></span>
                            <span class="text-xs text-gray">2m ago</span>
                        </li>
                        <li class="border-b py-md flex justify-between">
                            <span>John Tembo started <strong>Titration</strong></span>
                            <span class="text-xs text-gray">5m ago</span>
                        </li>
                        <li class="border-b py-md flex justify-between">
                            <span>New student registered: <strong>Mwila Banda</strong></span>
                            <span class="text-xs text-gray">12m ago</span>
                        </li>
                        <li class="py-md flex justify-between">
                            <span>Thandiwe Phiri scored 96% on <strong>Pendulum</strong></span>
                            <span class="text-xs text-gray">20m ago</span>
                        </li>
                    </ul>
                </div>
                <div class="stat-card-vibrant border-t-4" style="border-top-color: var(--error-red);">
                    <div class="flex justify-between items-center mb-md">
                        <h3>🔒 Security Logs</h3>
                        <button class="btn btn-link btn-sm">Export</button>
                    </div>
                    <ul class="text-sm" style="list-style: none; padding: 0;">
                        <li class="border-b py-md flex justify-between items-center">
                            <span><span class="badge badge-easy" style="margin-right: 8px;">OK</span> Admin login success</span>
                            <span class="text-xs text-gray">Just now</span>
                        </li>
                        <li class="border-b py-md flex justify-between items-center">
                            <span><span class="badge badge-warning" style="margin-right: 8px;">KEY</span> Password reset — Mrs. Banda</span>
                            <span class="text-xs text-gray">10m ago</span>
                        </li>
                        <li class="border-b py-md flex justify-between items-center">
                            <span><span class="badge badge-easy" style="margin-right: 8px;">NEW</span> New student registration</span>
                            <span class="text-xs text-gray">1h ago</span>
                        </li>
                        <li class="py-md flex justify-between items-center">
                            <span><span class="badge badge-hard" style="margin-right: 8px;">FAIL</span> Failed login attempt (3x)</span>
                            <span class="text-xs text-gray">2h ago</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderAdminUsers(container) {
        container.innerHTML = `
            <iframe src="admin-users.html?v=${new Date().getTime()}" style="width: 100%; height: 80vh; border: none;"></iframe>
        `;
    }

    renderAdminReports(container) {
        container.innerHTML = `
            <iframe src="admin-reports.html?v=${new Date().getTime()}" style="width: 100%; height: 80vh; border: none;"></iframe>
        `;
    }

    renderAdminSettings(container) {
        container.innerHTML = `
            <iframe src="admin-settings.html?v=${new Date().getTime()}" style="width: 100%; height: 80vh; border: none;"></iframe>
        `;
    }

    renderAdminNotifications(container) {
        container.innerHTML = `
            <div class="mb-2xl">
                <h1>System Notifications</h1>
                <p>Stay updated with the latest platform events.</p>
            </div>
            <div class="card">
                <div class="notification-list">
                    <div class="p-md border-b flex justify-between items-start" style="background: rgba(245, 158, 11, 0.05);">
                        <div>
                            <span class="badge badge-warning mb-xs">Warning</span>
                            <h4 class="mb-xs">Database Backup Overdue</h4>
                            <p class="text-sm text-gray">Last backup was performed 8 days ago. Recommended interval: 7 days.</p>
                        </div>
                        <span class="text-xs text-gray">2h ago</span>
                    </div>
                    <div class="p-md border-b flex justify-between items-start">
                        <div>
                            <span class="badge badge-easy mb-xs">System</span>
                            <h4 class="mb-xs">New Teacher Registered</h4>
                            <p class="text-sm text-gray">Mr. Kelvin Chanda has requested access to the Biology laboratory.</p>
                        </div>
                        <span class="text-xs text-gray">5h ago</span>
                    </div>
                    <div class="p-md flex justify-between items-start">
                        <div>
                            <span class="badge badge-physics mb-xs">Update</span>
                            <h4 class="mb-xs">Physics Engine Patch</h4>
                            <p class="text-sm text-gray">Successfully applied version 1.2.4 patch to the Pendulum simulation.</p>
                        </div>
                        <span class="text-xs text-gray">1d ago</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderAdminDocumentation(container) {
        container.innerHTML = `
            <div class="mb-2xl">
                <h1>Platform Documentation</h1>
                <p>Everything you need to know about managing Sayansi Yathu.</p>
            </div>
            <div class="grid grid-cols-2 gap-lg">
                <div class="card">
                    <h3>🚀 Getting Started</h3>
                    <p class="text-sm text-gray mt-md">Learn the basics of user management and experiment distribution.</p>
                    <ul class="text-sm mt-md" style="list-style: none; padding: 0;">
                        <li class="py-xs">📖 <a href="#">Dashboard Overview</a></li>
                        <li class="py-xs">📖 <a href="#">Managing User Roles</a></li>
                        <li class="py-xs">📖 <a href="#">System Health Monitoring</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>🧪 Laboratory Management</h3>
                    <p class="text-sm text-gray mt-md">Configuring simulations and assigning them to curriculum subjects.</p>
                    <ul class="text-sm mt-md" style="list-style: none; padding: 0;">
                        <li class="py-xs">📖 <a href="#">Adding New Experiments</a></li>
                        <li class="py-xs">📖 <a href="#">Curriculum Alignment Guide</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>🛠️ Maintenance</h3>
                    <p class="text-sm text-gray mt-md">Technical guides for site reliability and data safety.</p>
                    <ul class="text-sm mt-md" style="list-style: none; padding: 0;">
                        <li class="py-xs">📖 <a href="#">Database Backup & Restore</a></li>
                        <li class="py-xs) ">📖 <a href="#">Clearing System Cache</a></li>
                    </ul>
                </div>
                <div class="card">
                    <h3>🤖 AI Integration</h3>
                    <p class="text-sm text-gray mt-md">Guidelines for using the ECZ Content Generator and AI Tutors.</p>
                    <ul class="text-sm mt-md" style="list-style: none; padding: 0;">
                        <li class="py-xs">📖 <a href="#">AI Best Practices</a></li>
                        <li class="py-xs">📖 <a href="#">Prompt Engineering for Teachers</a></li>
                    </ul>
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
                        <h3>Teacher Panel</h3>
                        <p>${this.user.name}</p>
                    </div>
                    
                    <nav>
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link active" onclick="dashboard.showPanel('teacher-home')">
                                    <span class="sidebar-nav-icon">📊</span>
                                    <span>Home</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('teacher-classes')">
                                    <span class="sidebar-nav-icon">🏫</span>
                                    <span>My Classes</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('teacher-assignments')">
                                    <span class="sidebar-nav-icon">📝</span>
                                    <span>Assignments</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('teacher-experiments')">
                                    <span class="sidebar-nav-icon">🧪</span>
                                    <span>Experiments</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('teacher-ai')">
                                    <span class="sidebar-nav-icon">🤖</span>
                                    <span>AI Generator</span>
                                    <span class="sidebar-badge sidebar-badge-success">NEW</span>
                                </a>
                            </li>
                        </ul>
                        
                        <div class="sidebar-divider"></div>
                        <p class="sidebar-section-title">Academic</p>
                        
                        <ul class="sidebar-nav">
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('teacher-gradebook')">
                                    <span class="sidebar-nav-icon">📒</span>
                                    <span>Gradebook</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('teacher-schedule')">
                                    <span class="sidebar-nav-icon">📅</span>
                                    <span>My Schedule</span>
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
    // STUDENT DASHBOARD
    // ============================================
    async renderStudentDashboard() {
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
                                <a href="javascript:void(0)" class="sidebar-nav-link active" onclick="dashboard.showPanel('student-home')">
                                    <span class="sidebar-nav-icon">🏠</span>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('student-experiments')">
                                    <span class="sidebar-nav-icon">🔬</span>
                                    <span>Experiments</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('student-progress')">
                                    <span class="sidebar-nav-icon">📊</span>
                                    <span>My Progress</span>
                                </a>
                            </li>
                            <li class="sidebar-nav-item">
                                <a href="javascript:void(0)" class="sidebar-nav-link" onclick="dashboard.showPanel('student-achievements')">
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
                    <!-- Default Panel -->
                </div>
            </div>
        `;
        this.showPanel('student-home');
    }

    renderStudentHome(container) {
        container.innerHTML = `
            <div class="mb-2xl">
                <h1>Welcome, ${this.user.name}! 👋</h1>
                <p>Continue your virtual science journey.</p>
            </div>

            <div class="grid grid-cols-3 mb-2xl">
                <div class="card flex-col items-center">
                    <h2 style="color: var(--primary-blue);" id="home-completedCount">0</h2>
                    <p style="color: var(--gray-700);">Completed</p>
                </div>
                <div class="card flex-col items-center">
                    <h2 style="color: var(--accent-cyan);" id="home-inProgressCount">0</h2>
                    <p style="color: var(--gray-700);">In Progress</p>
                </div>
                <div class="card flex-col items-center">
                    <h2 style="color: var(--success-green);" id="home-avgScore">0%</h2>
                    <p style="color: var(--gray-700);">Avg Score</p>
                </div>
            </div>

            <h3 class="mb-lg">Continue Learning</h3>
            <div class="grid grid-cols-2 mb-2xl" id="home-recentGrid">
                <div class="card text-center">
                    <p>Loading your progress...</p>
                </div>
            </div>

            <div class="card" style="background: linear-gradient(135deg, var(--primary-blue), var(--accent-cyan)); color: var(--white); text-align: center; padding: 2rem; border-radius: 12px;">
                <h2 style="color: var(--white); margin-bottom: 1rem;">Start a New Experiment</h2>
                <button class="btn" style="background: var(--white); color: var(--primary-blue);" onclick="dashboard.showPanel('student-experiments')">Explore All Experiments →</button>
            </div>
        `;
        this.loadStudentHomeData();
    }

    async loadStudentHomeData() {
        try {
            const response = await fetch(`${this.apiBase}/progress/get.php?user_id=${this.user.id}`);
            const data = await response.json();
            if (data.success) {
                const progress = data.progress || [];
                const completed = progress.filter(p => p.completed).length;
                const inProgress = progress.filter(p => !p.completed).length;
                const avgScore = progress.length > 0 
                    ? Math.round(progress.reduce((sum, p) => sum + parseInt(p.score), 0) / progress.length) 
                    : 0;

                document.getElementById('home-completedCount').textContent = completed;
                document.getElementById('home-inProgressCount').textContent = inProgress;
                document.getElementById('home-avgScore').textContent = avgScore + '%';

                const grid = document.getElementById('home-recentGrid');
                if (progress.length === 0) {
                    grid.innerHTML = '<div class="card text-center" style="grid-column: 1 / -1;"><p>No experiments started yet.</p></div>';
                } else {
                    grid.innerHTML = progress.slice(0, 4).map(p => `
                        <div class="card" onclick="window.location.href='simulation-player.html?id=${p.simulation_id}'" style="cursor: pointer;">
                            <div class="flex justify-between mb-sm">
                                <span class="badge badge-primary">${p.subject}</span>
                                <span class="text-xs">${p.score}%</span>
                            </div>
                            <h4>${p.title}</h4>
                            <div style="background: var(--gray-200); height: 6px; border-radius: 3px; margin-top: 10px;">
                                <div style="background: var(--primary-blue); width: ${p.score}%; height: 100%; border-radius: 3px;"></div>
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (e) { console.error(e); }
    }

    renderStudentExperiments(container) {
        container.innerHTML = `
            <iframe src="subjects.html" style="width: 100%; height: 80vh; border: none;"></iframe>
        `;
    }

    renderStudentProgress(container) {
        container.innerHTML = `
            <div class="mb-2xl">
                <h1>My Progress</h1>
                <p>Detailed breakdown of your learning journey.</p>
            </div>
            <div class="grid grid-cols-1 gap-lg">
                <div class="card">
                    <h3>Subject Progress</h3>
                    <div class="mt-md">
                        <div class="flex justify-between mb-sm">Physics <span class="text-xs">60%</span></div>
                        <div style="background: var(--gray-200); height: 10px; border-radius: 5px; margin-bottom: 1.5rem;">
                            <div style="background: #8b5cf6; width: 60%; height: 100%; border-radius: 5px;"></div>
                        </div>
                        <div class="flex justify-between mb-sm">Chemistry <span class="text-xs">35%</span></div>
                        <div style="background: var(--gray-200); height: 10px; border-radius: 5px; margin-bottom: 1.5rem;">
                            <div style="background: #f59e0b; width: 35%; height: 100%; border-radius: 5px;"></div>
                        </div>
                        <div class="flex justify-between mb-sm">Biology <span class="text-xs">85%</span></div>
                        <div style="background: var(--gray-200); height: 10px; border-radius: 5px;">
                            <div style="background: #10b981; width: 85%; height: 100%; border-radius: 5px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStudentAchievements(container) {
        container.innerHTML = `
            <div class="mb-2xl">
                <h1>Achievements</h1>
                <p>Earn badges by completing experiments and scoring high!</p>
            </div>
            <div class="grid grid-cols-4 gap-lg">
                <div class="card text-center">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🥇</div>
                    <h4>First Step</h4>
                    <p class="text-xs text-gray">Complete 1 experiment</p>
                    <span class="badge badge-success mt-sm">Unlocked</span>
                </div>
                <div class="card text-center" style="opacity: 0.5;">
                    <div style="font-size: 3rem; margin-bottom: 10px; filter: grayscale(1);">🧬</div>
                    <h4>Geneticist</h4>
                    <p class="text-xs text-gray">Complete DNA experiment</p>
                    <span class="badge badge-secondary mt-sm">Locked</span>
                </div>
                <div class="card text-center" style="opacity: 0.5;">
                    <div style="font-size: 3rem; margin-bottom: 10px; filter: grayscale(1);">⚡</div>
                    <h4>Electrician</h4>
                    <p class="text-xs text-gray">Score 100% in Circuitry</p>
                    <span class="badge badge-secondary mt-sm">Locked</span>
                </div>
                <div class="card text-center" style="opacity: 0.5;">
                    <div style="font-size: 3rem; margin-bottom: 10px; filter: grayscale(1);">👨‍🔬</div>
                    <h4>Master Scientist</h4>
                    <p class="text-xs text-gray">Complete 10 experiments</p>
                    <span class="badge badge-secondary mt-sm">Locked</span>
                </div>
            </div>
        `;
    }
}

const dashboard = new DashboardManager();
