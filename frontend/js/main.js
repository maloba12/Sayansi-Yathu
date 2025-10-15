// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// Navigation and UI interactions
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// User authentication check
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token && !window.location.pathname.includes('index.html')) {
        window.location.href = '/';
    }
}

checkAuth();

// Backend connectivity test used by index.html button
async function testBackend() {
    const resultEl = document.getElementById('api-result');
    resultEl.textContent = 'Checking backend...';
    try {
        const res = await fetch('http://localhost:5000/api/health');
        const data = await res.json();
        resultEl.textContent = `Backend: ${data.status} | Features: ${data.features?.join(', ')}`;
    } catch (err) {
        resultEl.textContent = 'Failed to reach backend. Is Flask running on port 5000?';
    }
}