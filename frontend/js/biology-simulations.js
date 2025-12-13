// Biology Simulations - Three.js based experiments

class BiologySimulation {
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
        this.renderer.setClearColor(0xe6f3ff);

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

// Cell Structure Simulation
class CellSimulation extends BiologySimulation {
    constructor(canvasId) {
        super(canvasId);
        this.cell = null;
        this.organelles = [];
    }

    createCell() {
        // Cell membrane (outer boundary)
        const membraneGeometry = new THREE.TorusGeometry(2, 0.1, 8, 16);
        const membraneMaterial = new THREE.MeshLambertMaterial({ color: 0x4ade80 });
        const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
        membrane.rotation.x = Math.PI / 2;
        this.scene.add(membrane);

        // Cytoplasm (cell interior)
        const cytoplasmGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.2);
        const cytoplasmMaterial = new THREE.MeshLambertMaterial({ color: 0xfef3c7, transparent: true, opacity: 0.7 });
        const cytoplasm = new THREE.Mesh(cytoplasmGeometry, cytoplasmMaterial);
        this.scene.add(cytoplasm);

        // Nucleus
        const nucleusGeometry = new THREE.SphereGeometry(0.4);
        const nucleusMaterial = new THREE.MeshLambertMaterial({ color: 0x8b5cf6 });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        nucleus.position.set(0.5, 0.1, 0);
        this.scene.add(nucleus);

        // Mitochondria
        for (let i = 0; i < 3; i++) {
            const mitoGeometry = new THREE.CapsuleGeometry(0.1, 0.3);
            const mitoMaterial = new THREE.MeshLambertMaterial({ color: 0xf97316 });
            const mitochondrion = new THREE.Mesh(mitoGeometry, mitoMaterial);
            mitochondrion.position.set(
                Math.cos(i * Math.PI * 2 / 3) * 1.2,
                0.1,
                Math.sin(i * Math.PI * 2 / 3) * 1.2
            );
            this.scene.add(mitochondrion);
        }

        // Endoplasmic Reticulum
        const erGeometry = new THREE.TorusGeometry(1.0, 0.05, 6, 12);
        const erMaterial = new THREE.MeshLambertMaterial({ color: 0x06b6d4 });
        const er = new THREE.Mesh(erGeometry, erMaterial);
        er.rotation.x = Math.PI / 2;
        er.position.y = -0.1;
        this.scene.add(er);

        this.cell = { membrane, cytoplasm, nucleus };
    }

    highlightOrganelle(organelleType) {
        // Reset all colors
        this.cell.nucleus.material.color.setHex(0x8b5cf6);
        
        // Find mitochondria and reset colors
        this.scene.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'CapsuleGeometry') {
                child.material.color.setHex(0xf97316);
            }
            if (child.geometry && child.geometry.type === 'TorusGeometry' && child !== this.cell.membrane) {
                child.material.color.setHex(0x06b6d4);
            }
        });

        // Highlight selected organelle
        switch(organelleType) {
            case 'nucleus':
                this.cell.nucleus.material.color.setHex(0xffff00);
                break;
            case 'mitochondria':
                this.scene.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'CapsuleGeometry') {
                        child.material.color.setHex(0xffff00);
                    }
                });
                break;
            case 'endoplasmic-reticulum':
                this.scene.children.forEach(child => {
                    if (child.geometry && child.geometry.type === 'TorusGeometry' && child !== this.cell.membrane) {
                        child.material.color.setHex(0xffff00);
                    }
                });
                break;
        }
    }
}

// DNA Replication Simulation
class DNASimulation extends BiologySimulation {
    constructor(canvasId) {
        super(canvasId);
        this.dnaStrands = [];
        this.replicationProgress = 0;
    }

    createDNA() {
        // Create double helix DNA structure
        for (let i = 0; i < 20; i++) {
            // Phosphate backbone (sugar-phosphate)
            const phosphateGeometry = new THREE.SphereGeometry(0.05);
            const phosphateMaterial = new THREE.MeshLambertMaterial({ color: 0x8b5cf6 });
            
            // Left strand
            const phosphate1 = new THREE.Mesh(phosphateGeometry, phosphateMaterial);
            phosphate1.position.set(
                Math.cos(i * 0.3) * 1.5,
                i * 0.1 - 1,
                Math.sin(i * 0.3) * 1.5
            );
            this.scene.add(phosphate1);
            
            // Right strand
            const phosphate2 = new THREE.Mesh(phosphateGeometry, phosphateMaterial);
            phosphate2.position.set(
                Math.cos(i * 0.3 + Math.PI) * 1.5,
                i * 0.1 - 1,
                Math.sin(i * 0.3 + Math.PI) * 1.5
            );
            this.scene.add(phosphate2);
            
            // Base pairs
            if (i % 2 === 0) {
                const baseGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.05);
                const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x10b981 });
                const base = new THREE.Mesh(baseGeometry, baseMaterial);
                base.position.set(0, i * 0.1 - 1, 0);
                base.rotation.z = i * 0.3;
                this.scene.add(base);
            }
        }
    }

    startReplication() {
        this.replicationProgress = 0;
        this.animateReplication();
    }

    animateReplication() {
        if (this.replicationProgress < 1) {
            this.replicationProgress += 0.01;
            
            // Create new strands (simplified visualization)
            const progress = this.replicationProgress;
            const yPos = progress * 2 - 1;
            
            // Add replication fork visualization
            const forkGeometry = new THREE.ConeGeometry(0.1, 0.3);
            const forkMaterial = new THREE.MeshLambertMaterial({ color: 0xf59e0b });
            const fork = new THREE.Mesh(forkGeometry, forkMaterial);
            fork.position.set(0, yPos, 0);
            fork.rotation.x = Math.PI;
            this.scene.add(fork);
            
            setTimeout(() => this.animateReplication(), 50);
        }
    }

    reset() {
        this.replicationProgress = 0;
        this.clear();
        this.createDNA();
    }
}

// Global instances
let cellSim = null;
let dnaSim = null;

// Initialize biology simulations
function initBiologySimulations() {
    // Cell structure simulation
    cellSim = new CellSimulation('cell-canvas');
    cellSim.createCell();
    cellSim.start();

    // DNA simulation
    dnaSim = new DNASimulation('dna-canvas');
    dnaSim.createDNA();
    dnaSim.start();
}

// Control functions
function highlightOrganelle(type) {
    if (cellSim) {
        cellSim.highlightOrganelle(type);
    }
}

function startDNAReplication() {
    if (dnaSim) {
        dnaSim.startReplication();
    }
}

function resetDNASimulation() {
    if (dnaSim) {
        dnaSim.reset();
    }
}

function zoomCamera(direction) {
    // Zoom in/out for better viewing
    if (cellSim) {
        cellSim.camera.position.z += direction * 0.5;
        cellSim.camera.position.z = Math.max(2, Math.min(10, cellSim.camera.position.z));
    }
    if (dnaSim) {
        dnaSim.camera.position.z += direction * 0.5;
        dnaSim.camera.position.z = Math.max(2, Math.min(10, dnaSim.camera.position.z));
    }
}

// Make functions globally available
window.initBiologySimulations = initBiologySimulations;
window.highlightOrganelle = highlightOrganelle;
window.startDNAReplication = startDNAReplication;
window.resetDNASimulation = resetDNASimulation;
window.zoomCamera = zoomCamera;
