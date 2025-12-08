// Three.js setup for 3D simulations
let scene, camera, renderer;

function initThreeJS(canvasId) {
    const canvas = document.getElementById(canvasId);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    return { scene, camera, renderer };
}

// Physics simulation: Simple Pendulum
class PendulumSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.length = 150;
        this.angle = Math.PI / 4;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.gravity = 0.3;
        this.damping = 0.995;
    }

    update() {
        this.angularAcceleration = -(this.gravity / this.length) * Math.sin(this.angle);
        this.angularVelocity += this.angularAcceleration;
        this.angularVelocity *= this.damping;
        this.angle += this.angularVelocity;
    }

    draw() {
        const centerX = this.canvas.width / 2;
        const centerY = 100;
        const bobX = centerX + Math.sin(this.angle) * this.length;
        const bobY = centerY + Math.cos(this.angle) * this.length;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw pendulum
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(bobX, bobY);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw bob
        this.ctx.beginPath();
        this.ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize simulations
window.initPendulum = function(canvasId) {
    const sim = new PendulumSimulation(canvasId);
    sim.animate();
    return sim;
};
