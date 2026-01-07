// Physics Simulations - Three.js based experiments

class PhysicsSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }

        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(0xf0f0f0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        this.camera.position.z = 5;
        this.animate = this.animate.bind(this);
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    clear() {
        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        // Re-add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }
}

// Pendulum Simulation
class PendulumSimulation extends PhysicsSimulation {
    constructor(canvasId) {
        super(canvasId);
        this.pendulum = null;
        this.length = 2;
        this.angle = Math.PI / 4; // 45 degrees
        this.angularVelocity = 0;
        this.gravity = 9.81;
        this.damping = 0.995;
        this.time = 0;
    }

    createPendulum() {
        // Create pivot point
        const pivotGeometry = new THREE.SphereGeometry(0.05);
        const pivotMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
        pivot.position.set(0, 2, 0);
        this.scene.add(pivot);

        // Create string
        const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, this.length);
        const stringMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.set(0, 1, 0);
        string.rotation.z = Math.PI / 2;
        this.scene.add(string);

        // Create bob
        const bobGeometry = new THREE.SphereGeometry(0.1);
        const bobMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
        const bob = new THREE.Mesh(bobGeometry, bobMaterial);
        bob.position.set(Math.sin(this.angle) * this.length, 2 - Math.cos(this.angle) * this.length, 0);
        this.scene.add(bob);

        this.pendulum = { pivot, string, bob };
    }

    updatePendulum(deltaTime) {
        if (!this.pendulum) return;

        // Physics calculation
        const acceleration = -(this.gravity / this.length) * Math.sin(this.angle);
        this.angularVelocity += acceleration * deltaTime;
        this.angularVelocity *= this.damping; // Damping
        this.angle += this.angularVelocity * deltaTime;

        // Update positions
        const bob = this.pendulum.bob;
        bob.position.x = Math.sin(this.angle) * this.length;
        bob.position.y = 2 - Math.cos(this.angle) * this.length;

        const string = this.pendulum.string;
        string.rotation.z = Math.PI / 2 + this.angle;
        string.position.x = Math.sin(this.angle) * this.length / 2;
        string.position.y = 2 - Math.cos(this.angle) * this.length / 2;
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(this.animate);

        const currentTime = Date.now() * 0.001;
        const deltaTime = currentTime - this.time;
        this.time = currentTime;

        this.updatePendulum(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

    reset() {
        this.angle = Math.PI / 4;
        this.angularVelocity = 0;
        this.time = Date.now() * 0.001;
    }

    setGravity(value) {
        this.gravity = value;
    }

    setLength(value) {
        this.length = value;
        this.reset();
        this.clear();
        this.createPendulum();
    }

    setDamping(value) {
        this.damping = value;
    }
}

// Circuit Simulation (simplified visual)
class CircuitSimulation extends PhysicsSimulation {
    constructor(canvasId) {
        super(canvasId);
        this.circuit = null;
    }

    createCircuit() {
        // Create battery
        const batteryGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
        const batteryMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const battery = new THREE.Mesh(batteryGeometry, batteryMaterial);
        battery.position.set(-2, 0, 0);
        battery.rotation.z = Math.PI / 2;
        this.scene.add(battery);

        // Create resistor
        const resistorGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.1);
        const resistorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
        resistor.position.set(0, 0, 0);
        this.scene.add(resistor);

        // Create wires (simple lines)
        this.createWire(-1.5, 0, 0, -0.3, 0, 0);
        this.createWire(0.3, 0, 0, 1.5, 0, 0);

        // Create light bulb
        const bulbGeometry = new THREE.SphereGeometry(0.15);
        const bulbMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF99, emissive: 0x444400 });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.set(1.5, 0.3, 0);
        this.scene.add(bulb);
    }

    createWire(x1, y1, z1, x2, y2, z2) {
        const wireGeometry = new THREE.CylinderGeometry(0.02, 0.02, Math.sqrt((x2-x1)**2 + (y2-y1)**2));
        const wireMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        
        // Position and rotate wire
        wire.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
        wire.lookAt(x2, y2, z2);
        wire.rotateX(Math.PI / 2);
        
        this.scene.add(wire);
    }

    setVoltage(voltage) {
        // Visual feedback for voltage changes
        console.log('Voltage set to:', voltage);
    }

    setResistance(resistance) {
        // Visual feedback for resistance changes
        console.log('Resistance set to:', resistance);
    }
}

// Global instances
let pendulumSim = null;
let circuitSim = null;

// Initialize simulations when page loads
function initPhysicsSimulations() {
    // Pendulum simulation
    pendulumSim = new PendulumSimulation('physics-canvas');
    pendulumSim.createPendulum();
    pendulumSim.start();

    // Circuit simulation
    circuitSim = new CircuitSimulation('circuit-canvas');
    circuitSim.createCircuit();
    circuitSim.start();
}

// Control functions
function startPendulum() {
    if (pendulumSim) pendulumSim.start();
}

function stopPendulum() {
    if (pendulumSim) pendulumSim.stop();
}

function resetPendulum() {
    if (pendulumSim) pendulumSim.reset();
}

function updatePendulumGravity() {
    const gravity = parseFloat(document.getElementById('gravity').value) || 9.81;
    if (pendulumSim) pendulumSim.setGravity(gravity);
    document.getElementById('gravity-value').textContent = gravity.toFixed(2);
}

function updatePendulumLength() {
    const length = parseFloat(document.getElementById('length').value) || 2;
    if (pendulumSim) pendulumSim.setLength(length);
    document.getElementById('length-value').textContent = length.toFixed(2);
}

function updateCircuitVoltage() {
    const voltage = parseFloat(document.getElementById('voltage').value) || 5;
    if (circuitSim) circuitSim.setVoltage(voltage);
    document.getElementById('voltage-value').textContent = voltage.toFixed(1);
}

function updateCircuitResistance() {
    const resistance = parseFloat(document.getElementById('resistance').value) || 100;
    if (circuitSim) circuitSim.setResistance(resistance);
    document.getElementById('resistance-value').textContent = resistance.toFixed(0);
}

// Make functions globally available
// Make functions globally available
window.initPhysicsSimulations = initPhysicsSimulations;
window.startPendulum = startPendulum;
window.stopPendulum = stopPendulum;
window.resetPendulum = resetPendulum;
window.updatePendulumGravity = updatePendulumGravity;
window.updatePendulumLength = updatePendulumLength;
window.updateCircuitVoltage = updateCircuitVoltage;
window.updateCircuitResistance = updateCircuitResistance;

// Expose Classes for Simulation Player
window.PendulumSimulation = PendulumSimulation;
window.CircuitSimulation = CircuitSimulation;
