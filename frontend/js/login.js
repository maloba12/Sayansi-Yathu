class LoginPageAuth {
    constructor() {
        this.apiBaseUrl = '/backend-php/auth';
        this.tokenKey = 'auth_token';
        this.userKey = 'user_data';
        this.init();
    }

    init() {
        const form = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('togglePassword');
        if (!passwordInput || !toggleButton) return;

        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleButton.textContent = isPassword ? 'Hide' : 'Show';
        toggleButton.setAttribute('aria-pressed', String(isPassword));
    }

    showError(message, isLockMessage = false) {
        const errorEl = document.getElementById('loginError');
        if (!errorEl) return;

        errorEl.textContent = message || 'Invalid login credentials. Please check your email, Student ID, or password and try again.';
        errorEl.classList.add('visible', 'shake');

        if (isLockMessage) {
            // Keep visible until next attempt
            return;
        }

        setTimeout(() => {
            errorEl.classList.remove('shake');
        }, 300);
    }

    clearError() {
        const errorEl = document.getElementById('loginError');
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.classList.remove('visible', 'shake');
    }

    saveAuthData(token, userData) {
        if (token) {
            localStorage.setItem(this.tokenKey, token);
        }
        if (userData) {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
        }
    }

    redirectToDashboard(route) {
        if (!route) {
            window.location.href = 'dashboard.html';
            return;
        }
        window.location.href = route;
    }

    async handleLogin() {
        this.clearError();

        const identifier = document.getElementById('identifier')?.value.trim();
        const password = document.getElementById('password')?.value;
        const rememberDevice = document.getElementById('rememberDevice')?.checked || false;

        if (!identifier || !password) {
            this.showError('Invalid login credentials. Please check your email, Student ID, or password and try again.');
            return;
        }

        const loginButton = document.getElementById('loginButton');
        const originalText = loginButton ? loginButton.textContent : '';
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = 'Signing in...';
        }

        try {
            // Basic device fingerprint placeholder
            const deviceFingerprint = navigator.userAgent + '|' + (window.screen?.width || '') + 'x' + (window.screen?.height || '');

            const response = await fetch(`${this.apiBaseUrl}/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    identifier,
                    password,
                    remember_device: rememberDevice,
                    device_fingerprint: deviceFingerprint
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (data.locked) {
                    this.showError(
                        'Too many failed attempts. Please try again after a few minutes.',
                        true
                    );
                    return;
                }

                this.showError(
                    'Invalid login credentials. Please check your email, Student ID, or password and try again.'
                );
                return;
            }

            // If additional verification is required (MFA / device check), this is where you would branch
            if (data.requires_verification) {
                this.showError(
                    'We detected a login from an unrecognized device. Please verify this login using the code sent to your email.'
                );
                // In a full implementation you would navigate to a verification step/page.
                return;
            }

            this.saveAuthData(data.token, data.user);
            this.redirectToDashboard(data.dashboard_route || (data.user && data.user.dashboard_route));
        } catch (err) {
            console.error('Login error', err);
            this.showError(
                'Invalid login credentials. Please check your email, Student ID, or password and try again.'
            );
        } finally {
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = originalText || 'Login';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginPageAuth();
});


