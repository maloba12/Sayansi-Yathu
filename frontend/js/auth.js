// Auth module for handling login, logout, and role-based routing
class Auth {
    constructor() {
        this.tokenKey = 'auth_token';
        this.userKey = 'user_data';
        this.apiBaseUrl = 'http://localhost:8080/auth';
        
        // Initialize event listeners
        this.initEventListeners();
    }

    // Initialize event listeners for login form and buttons
    initEventListeners() {
        // Login button click handler
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => this.showLoginModal());
        }

        // Close modal button
        const closeButton = document.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.hideLoginModal());
        }

        // Click outside modal to close
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideLoginModal();
                }
            });
        }

        // Grade selection
        const gradeOptions = document.querySelectorAll('.grade-option');
        gradeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectGrade(option);
            });
        });

        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    // Show login modal
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide login modal
    hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Reset form
            document.getElementById('loginForm').reset();
            document.getElementById('loginError').textContent = '';
        }
    }

    // Handle grade selection
    selectGrade(selectedOption) {
        const gradeOptions = document.querySelectorAll('.grade-option');
        gradeOptions.forEach(option => option.classList.remove('active'));
        selectedOption.classList.add('active');
        document.getElementById('grade').value = selectedOption.dataset.grade;
    }

    // Handle login form submission
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const grade = document.getElementById('grade').value;
        
        // Show grade selection if not selected (will be shown after first attempt if needed)
        const gradeSelection = document.getElementById('gradeSelection');
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    grade: grade || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // If grade selection is required
                if (data.requires_grade) {
                    gradeSelection.style.display = 'block';
                    document.getElementById('loginError').textContent = 'Please select your grade to continue';
                    return;
                }
                throw new Error(data.message || 'Login failed');
            }

            // Save token and user data
            this.saveAuthData(data.token, data.user);
            
            // Redirect based on user role
            this.redirectBasedOnRole(data.user.role, data.user.grade);
            
            // Hide login modal
            this.hideLoginModal();

        } catch (error) {
            console.error('Login error:', error);
            document.getElementById('loginError').textContent = error.message || 'An error occurred during login';
        }
    }

    // Save authentication data to localStorage
    saveAuthData(token, userData) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

    // Clear authentication data
    clearAuthData() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem(this.tokenKey);
    }

    // Redirect based on user role
    redirectBasedOnRole(role, grade = null) {
        let redirectPath = 'dashboard.html';

        switch(role) {
            case 'student':
            case 'teacher':
            case 'senior_teacher':
            case 'head_teacher':
            case 'admin':
            default:
                redirectPath = 'dashboard.html';
        }

        window.location.href = redirectPath;
    }

    // Logout
    logout() {
        this.clearAuthData();
        window.location.href = '/';
    }
}

// Initialize auth module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});
