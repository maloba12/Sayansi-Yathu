
// frontend/js/api.js
const API_BASE_URL = 'http://localhost:5000';   // Python backend
<<<<<<< HEAD
const PHP_BASE_URL = window.location.origin;    // PHP backend (same host/port as frontend)
=======
const PHP_BASE_URL = 'http://localhost:8080';   // PHP backend
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66

// ---- Python endpoints (simulations / AI) ----
async function callPy(endpoint, payload) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// ---- PHP endpoints (auth / progress) ----
async function callPhp(endpoint, payload) {
  const res = await fetch(`${PHP_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}


// User authentication
class AuthAPI {
    static async login(email, password) {
<<<<<<< HEAD
        const response = await fetch(`${PHP_BASE_URL}/backend-php/auth/login.php`, {
=======
        const response = await fetch(`${PHP_BASE_URL}/auth/login.php`, {
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    }

    static async register(userData) {
<<<<<<< HEAD
        const response = await fetch(`${PHP_BASE_URL}/backend-php/auth/register.php`, {
=======
        const response = await fetch(`${PHP_BASE_URL}/auth/register.php`, {
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    }

    static logout() {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    }
}

// Experiment data
class ExperimentAPI {
    static async getExperiments(userId) {
<<<<<<< HEAD
        const response = await fetch(`${PHP_BASE_URL}/backend-php/api/getExperiment.php?userId=${userId}`);
=======
        const response = await fetch(`${PHP_BASE_URL}/getExperiments.php?userId=${userId}`);
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
        return response.json();
    }

    static async saveProgress(experimentId, progress) {
<<<<<<< HEAD
        const response = await fetch(`${PHP_BASE_URL}/backend-php/api/saveProgress.php`, {
=======
        const response = await fetch(`${PHP_BASE_URL}/saveProgress.php`, {
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ experimentId, progress })
        });
        return response.json();
    }
}

// Export for use in other files
window.AuthAPI = AuthAPI;
window.ExperimentAPI = ExperimentAPI;