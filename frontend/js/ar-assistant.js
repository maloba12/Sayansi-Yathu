class ARLabAssistant {
    constructor() {
        this.arSession = null;
        this.markerDetector = null;
        this.cameraStream = null;
        this.isARActive = false;
    }

    async initializeAR() {
        try {
            // Check for WebXR support
            if (!navigator.xr) {
                throw new Error('WebXR not supported');
            }

            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            this.setupARCanvas();
            this.startMarkerDetection();
            this.isARActive = true;

            console.log('AR Lab Assistant initialized');
        } catch (error) {
            console.error('AR initialization failed:', error);
            this.showARError("AR features require a camera-enabled device");
        }
    }

    setupARCanvas() {
        this.arCanvas = document.createElement('canvas');
        this.arCanvas.id = 'ar-canvas';
        this.arCanvas.width = 640;
        this.arCanvas.height = 480;
        this.arCanvas.style.position = 'fixed';
        this.arCanvas.style.top = '0';
        this.arCanvas.style.left = '0';
        this.arCanvas.style.zIndex = '1000';

        document.body.appendChild(this.arCanvas);
        this.ctx = this.arCanvas.getContext('2d');
    }

    startMarkerDetection() {
        const video = document.createElement('video');
        video.srcObject = this.cameraStream;
        video.play();

        const detectMarkers = () => {
            this.ctx.drawImage(video, 0, 0, 640, 480);

            // Simple marker detection (would use AR.js or similar in production)
            const markers = this.detectMarkersInFrame();

            markers.forEach(marker => {
                this.overlayARContent(marker);
            });

            if (this.isARActive) {
                requestAnimationFrame(detectMarkers);
            }
        };

        detectMarkers();
    }

    detectMarkersInFrame() {
        // Simplified marker detection
        // In production, use AR.js or similar library
        const markers = [];

        // Detect lab equipment markers
        const equipmentMarkers = [
            { id: 'beaker', name: 'Beaker', x: 100, y: 200 },
            { id: 'test_tube', name: 'Test Tube', x: 300, y: 150 },
            { id: 'microscope', name: 'Microscope', x: 500, y: 300 }
        ];

        return equipmentMarkers;
    }

    overlayARContent(marker) {
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.fillRect(marker.x - 20, marker.y - 20, 40, 40);

        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(marker.name, marker.x - 30, marker.y - 30);

        // Add interactive buttons
        this.addARButton(marker.x, marker.y + 30, 'Info', () => this.showEquipmentInfo(marker));
    }

    addARButton(x, y, text, callback) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(x - 30, y - 10, 60, 20);

        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, x - 15, y + 5);

        // Add click handler (simplified)
        this.arCanvas.addEventListener('click', (e) => {
            const rect = this.arCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            if (Math.abs(clickX - x) < 30 && Math.abs(clickY - y) < 10) {
                callback();
            }
        });
    }

    showEquipmentInfo(marker) {
        const info = {
            'beaker': {
                name: 'Laboratory Beaker',
                usage: 'For mixing and heating liquids',
                capacity: '250ml',
                safety: 'Use heat-resistant gloves when hot'
            },
            'test_tube': {
                name: 'Test Tube',
                usage: 'For small-scale reactions',
                capacity: '10ml',
                safety: 'Point away from yourself and others'
            },
            'microscope': {
                name: 'Compound Microscope',
                usage: 'For viewing microscopic specimens',
                magnification: '40x to 400x',
                safety: 'Handle with care, clean lenses gently'
            }
        };

        const equipment = info[marker.id];
        if (equipment) {
            this.displayARInfo(equipment, marker.x, marker.y);
        }
    }

    displayARInfo(equipment, x, y) {
        const infoPanel = document.createElement('div');
        infoPanel.className = 'ar-info-panel';
        infoPanel.style.position = 'absolute';
        infoPanel.style.left = x + 'px';
        infoPanel.style.top = y + 'px';
        infoPanel.style.background = 'rgba(0, 0, 0, 0.8)';
        infoPanel.style.color = 'white';
        infoPanel.style.padding = '10px';
        infoPanel.style.borderRadius = '5px';
        infoPanel.style.zIndex = '1001';

        infoPanel.innerHTML = `
            <h4>${equipment.name}</h4>
            <p><strong>Usage:</strong> ${equipment.usage}</p>
            <p><strong>Capacity:</strong> ${equipment.capacity || equipment.magnification}</p>
            <p><strong>Safety:</strong> ${equipment.safety}</p>
            <button onclick="this.parentElement.remove()">Close</button>
        `;

        document.body.appendChild(infoPanel);

        // Auto-close after 5 seconds
        setTimeout(() => infoPanel.remove(), 5000);
    }

    stopAR() {
        this.isARActive = false;
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
        }
        if (this.arCanvas) {
            this.arCanvas.remove();
        }
    }
}

window.arAssistant = new ARLabAssistant();
