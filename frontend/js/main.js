// Service Worker Registration for PWA (temporarily disabled)
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//         .then(registration => {
//             console.log('Service Worker registered successfully:', registration);
//         })
//         .catch(error => {
//             console.log('Service Worker registration failed:', error);
//         });
// }

// Navigation and UI interactions
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 2. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Experiment navigation function
    window.loadExperiment = (subject) => {
        const routes = {
            physics: 'experiments/physics.html',
            chemistry: 'experiments/chemistry.html',
            biology: 'experiments/biology.html'
        };
        const route = routes[subject];
        if (route) {
            window.location.href = route;
        } else {
            console.error('Unknown experiment subject:', subject);
        }
    };

    console.log('Sayansi Yathu main.js initialized');
});
