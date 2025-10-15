
// frontend/js/api.js
const API_BASE_URL = 'http://localhost:5000';   // Python backend
const PHP_BASE_URL = 'http://localhost:8080';   // PHP backend

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
        const response = await fetch(`${PHP_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.json();
    }

    static async register(userData) {
        const response = await fetch(`${PHP_BASE_URL}/auth/register.php`, {
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
        const response = await fetch(`${PHP_BASE_URL}/api/getExperiment.php?userId=${userId}`);
        return response.json();
    }

    static async saveProgress(experimentId, progress) {
        const response = await fetch(`${PHP_BASE_URL}/api/saveProgress.php`, {
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