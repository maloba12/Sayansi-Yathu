// Biology Simulations - Three.js based experiments
// Enhanced with Loader and Interactive Cell Model

// Global State
let currentSimulation = null;
let renderer = null;
let camera = null;
let scene = null;
let animationId = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Main Loader
function loadBiologyExperiment(type) {
    console.log('Loading Biology Experiment:', type);
    
    // Cleanup
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) {
        renderer.dispose();
        const canvasContainer = document.getElementById('biology-canvas');
        canvasContainer.innerHTML = '';
    }
    currentSimulation = null;

    // UI Toggles
    document.querySelectorAll('.experiment-controls').forEach(el => el.classList.add('hidden'));
    const controls = document.getElementById(`${type}-controls`);
    if (controls) controls.classList.remove('hidden');

    // Init Logic
    if (type === 'cell') {
        currentSimulation = new CellSimulation();
    } else if (type === 'dna') {
        currentSimulation = new DNASimulation();
    } else {
        document.getElementById('biology-canvas').innerHTML = '<p class="text-center p-4">Experiment under construction 🚧</p>';
        return;
    }
    
    currentSimulation.init();
    animate();
}

// Shared Animation Loop
function animate() {
    animationId = requestAnimationFrame(animate);
    if (currentSimulation) {
        currentSimulation.update();
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
}

// ==========================================
// CELL STRUCTURE SIMULATION
// ==========================================
class CellSimulation {
    constructor() {
        this.organelles = {};
        this.isMembraneVisible = true;
    }

    init() {
        const container = document.getElementById('biology-canvas');
        const w = container.clientWidth;
        const h = container.clientHeight;

        // Scene Setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xe0f2fe); // Soft blue
        scene.fog = new THREE.Fog(0xe0f2fe, 5, 20);

        camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.set(0, 2, 8);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Lights
        const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Interaction
        renderer.domElement.addEventListener('click', this.onClick.bind(this));
        renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.createCellModel();
    }

    createCellModel() {
        // 1. Cytoplasm / Membrane (Cutosphere)
        const geometry = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.75); // Cut top
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4ade80, 
            transparent: true, 
            opacity: 0.3,
            side: THREE.DoubleSide,
            shininess: 60
        });
        this.membrane = new THREE.Mesh(geometry, material);
        this.membrane.rotation.x = Math.PI / 5;
        scene.add(this.membrane);

        // 2. Nucleus
        const nucGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const nucMat = new THREE.MeshPhongMaterial({ color: 0x9333ea });
        const nucleus = new THREE.Mesh(nucGeo, nucMat);
        nucleus.position.set(0, -0.5, 0);
        nucleus.userData = { id: 'nucleus', name: 'Nucleus' };
        scene.add(nucleus);
        this.organelles['nucleus'] = nucleus;

        // 3. Mitochondria (Capsules)
        const mitoGeo = new THREE.CapsuleGeometry(0.2, 0.6, 4, 8);
        const mitoMat = new THREE.MeshPhongMaterial({ color: 0xf97316 });
        
        const positions = [
            { x: 1.5, y: 0, z: 1 },
            { x: -1.2, y: -1, z: 0.5 },
            { x: 0.5, y: 0.5, z: -1.5 }
        ];

        positions.forEach((pos, i) => {
            const mito = new THREE.Mesh(mitoGeo, mitoMat);
            mito.position.set(pos.x, pos.y, pos.z);
            mito.rotation.set(Math.random(), Math.random(), Math.random());
            mito.userData = { id: 'mitochondria', name: 'Mitochondria' };
            scene.add(mito);
            if (!this.organelles['mitochondria']) this.organelles['mitochondria'] = [];
            this.organelles['mitochondria'].push(mito);
        });

        // 4. ER (Torus knots abstract)
        const erGeo = new THREE.TorusKnotGeometry(0.4, 0.05, 64, 8);
        const erMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4 });
        const er = new THREE.Mesh(erGeo, erMat);
        er.position.set(-1, -0.5, 0);
        er.userData = { id: 'endoplasmic_reticulum', name: 'Endoplasmic Reticulum' };
        scene.add(er);
        this.organelles['endoplasmic_reticulum'] = er;
    }

    update() {
        // Slow rotation for life-like feel
        if (this.membrane) this.membrane.rotation.y += 0.001;
    }

    // Interaction Handlers
    highlight(type) {
        // Reset all
        scene.traverse((obj) => {
            if (obj.isMesh && obj.userData.originalColor) {
               obj.material.color.setHex(obj.userData.originalColor);
               obj.scale.set(1,1,1);
            }
        });

        // Select targets
        let targets = [];
        if (Array.isArray(this.organelles[type])) {
            targets = this.organelles[type];
        } else if (this.organelles[type]) {
            targets = [this.organelles[type]];
        }

        // Highlight
        targets.forEach(t => {
            if (!t.userData.originalColor) t.userData.originalColor = t.material.color.getHex();
            t.material.color.setHex(0xffff00); // Yellow highlight
            t.scale.set(1.2, 1.2, 1.2);
        });

        this.showLabel(type);
    }

    showLabel(text) {
        const lbl = document.getElementById('labels-container');
        lbl.innerHTML = `<div class="canvas-label" style="top: 20px; left: 20px; font-size: 16px;">Selected: ${text.toUpperCase()}</div>`;
        
        // Hide after 3s
        setTimeout(() => lbl.innerHTML = '', 3000);
    }

    onClick(event) {
        // Basic Raycaster implementation
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {
            const obj = intersects[i].object;
            if (obj.userData.id) {
                this.highlight(obj.userData.id);
                break;
            }
        }
    }
    
    onMouseMove(event) {
        // Optional: Cursor change on hover
    }
    
    toggleMembrane() {
        this.isMembraneVisible = !this.isMembraneVisible;
        if(this.membrane) this.membrane.visible = this.isMembraneVisible;
    }
    
    resetCamera() {
        camera.position.set(0, 2, 8);
        camera.lookAt(0,0,0);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
    }
}


// ==========================================
// DNA REPLICATION SIMULATION (Basic)
// ==========================================
class DNASimulation {
    init() {
        const container = document.getElementById('biology-canvas');
        const w = container.clientWidth;
        const h = container.clientHeight;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111827); // Dark for DNA

        camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.set(0, 0, 15);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);
        container.appendChild(renderer.domElement);
        
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);
        
        this.createHelix();
    }
    
    createHelix() {
        this.helixGroup = new THREE.Group();
        const count = 20;
        for(let i = -count; i <= count; i++) {
            const y = i * 0.4;
            const angle = i * 0.5;
            const rad = 2;
            
            // Sphere A
            const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({color: 0xef4444}));
            s1.position.set(Math.cos(angle)*rad, y, Math.sin(angle)*rad);
            
            // Sphere B
            const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({color: 0x3b82f6}));
            s2.position.set(Math.cos(angle + Math.PI)*rad, y, Math.sin(angle + Math.PI)*rad);
            
            // Bar
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, rad*2), new THREE.MeshBasicMaterial({color: 0xffffff}));
            bar.rotation.z = Math.PI/2;
            bar.rotation.y = angle;
            bar.position.set(0, y, 0);
            
            this.helixGroup.add(s1);
            this.helixGroup.add(s2);
            this.helixGroup.add(bar);
        }
        scene.add(this.helixGroup);
    }
    
    update() {
        if(this.helixGroup) {
            this.helixGroup.rotation.y += 0.01;
        }
    }
}

// ==========================================
// EXPORTS & HELPERS
// ==========================================

window.loadBiologyExperiment = loadBiologyExperiment;
window.CellSimulation = CellSimulation;
window.DNASimulation = DNASimulation;

window.highlightOrganelle = (type) => {
    if (currentSimulation instanceof CellSimulation) {
        currentSimulation.highlight(type);
    }
};

window.resetCamera = () => {
    if (currentSimulation instanceof CellSimulation) {
        currentSimulation.resetCamera();
    }
};

window.toggleMembrane = () => {
    if (currentSimulation instanceof CellSimulation) {
        currentSimulation.toggleMembrane();
    }
};

window.startDNAReplication = () => {
    alert("Replication started! (Animation WIP)");
};

window.resetDNASimulation = () => {
     loadBiologyExperiment('dna');
};

// Auto load
document.addEventListener('DOMContentLoaded', () => {
    loadBiologyExperiment('cell');
});
