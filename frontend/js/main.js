// Service Worker Registration for PWA (temporarily disabled)
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//         .then(registration => {
//             console.log('Service Worker registered successfully:', registration);
//         })
//         .catch(error => {
//             console.log('Service Worker registration failed:', error);
// //         });
}

// Navigation and UI interactions
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // //         });
        }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                        // //         });
                    }
// //         });
    });
        });

        // User authentication check (temporarily disabled - was causing page blinking)
        // function checkAuth() {
        //     const token = localStorage.getItem('authToken');
        //     if (!token && !window.location.pathname.includes('index.html')) {
        //         window.location.href = '/';
        //     }
        // }

        // checkAuth();

        // Experiment navigation function
        function loadExperiment(subject) {
            // Navigate to the appropriate experiment page based on subject
            switch (subject) {
                case 'physics':
                    window.location.href = 'experiments/physics.html';
                    break;
                case 'chemistry':
                    window.location.href = 'experiments/chemistry.html';
                    break;
                case 'biology':
                    window.location.href = 'experiments/biology.html';
                    break;
                default:
                    console.error('Unknown experiment subject:', subject);
            }
        }

        // Backend test function
        // Backend test function removed

        console.log('Sayansi Yathu main.js loaded successfully');
