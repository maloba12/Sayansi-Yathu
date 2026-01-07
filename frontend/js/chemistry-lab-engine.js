/**
 * Interactive Chemistry Lab Engine
 * Aligned with Zambia Secondary School CDC 2024
 */

class ChemistryLabEngine {
    constructor() {
        this.experimentId = this.getExperimentId();
        this.experiment = null;
        this.currentStep = 0;
        this.mode = 'student'; // 'student' or 'teacher'
        this.canvas = null;
        this.apparatus = []; // Objects on the bench
        this.p = null; // p5 instance
        
        this.audio = new LabAudio();
        
        this.init();
    }

    getExperimentId() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || 1;
    }

    async init() {
        this.setupP5();
        this.setupUI();
        this.attachDragListeners();
        await this.loadExperimentData();
    }

    async loadExperimentData() {
        try {
            const response = await fetch('data/chemistry_form1.json');
            const data = await response.json();
            this.experiment = data.find(e => e.id === this.experimentId);
            
            if (this.experiment) {
                this.updateSidebars();
            }
        } catch (error) {
            console.error('Error loading experiment data:', error);
        }
    }

    updateSidebars() {
        document.getElementById('experimentTitle').textContent = this.experiment.title;
        document.getElementById('expAim').textContent = this.experiment.aim;
        document.getElementById('expSafety').querySelector('span').textContent = this.experiment.safety_precautions;
        document.getElementById('cdcTag').textContent = `Syllabus: ${this.experiment.curriculum_link}`;

        // Render procedure
        const procList = document.getElementById('expProcedure');
        procList.innerHTML = this.experiment.procedure.map((step, i) => 
            `<li class="${i === 0 ? 'active' : ''}">${step}</li>`
        ).join('');

        // Render materials in sidebar
        const materialsGrid = document.getElementById('materialsGrid');
        materialsGrid.innerHTML = this.experiment.materials.map(m => `
            <div class="tool-item material-item" data-type="material" data-name="${m}" draggable="false">
                <span class="tool-icon">📦</span>
                <span class="tool-name">${m}</span>
            </div>
        `).join('');

        this.attachDragListeners(); // Re-called to ensure dynamic items are covered if using old method, but with delegation we call once
    }

    attachDragListeners() {
        const toolsPanel = document.querySelector('.tools-panel');
        if (!toolsPanel || this.delegationAttached) return;
        
        toolsPanel.addEventListener('mousedown', (e) => {
            const item = e.target.closest('.tool-item');
            if (item) {
                e.preventDefault(); // Prevent text selection/native drag
                const type = item.dataset.type;
                const name = item.dataset.name || (item.querySelector('.tool-name') ? item.querySelector('.tool-name').textContent : '');
                this.spawnApparatus(type, name, e.clientX, e.clientY);
            }
        });
        this.delegationAttached = true;
    }

    spawnApparatus(type, name, startX, startY) {
        if (this.p) {
            const container = document.getElementById('lab-canvas-container');
            const rect = container.getBoundingClientRect();
            const canvasX = startX - rect.left;
            const canvasY = startY - rect.top;
            
            this.p.addApparatus(type, name, canvasX, canvasY);
        }
    }

    setupUI() {
        // Start Audio Context on user interaction (browser policy)
        document.body.addEventListener('click', () => {
            if (this.audio) this.audio.start();
        }, { once: true });

        // Mode toggle
        document.getElementById('toggleModeBtn').addEventListener('click', (e) => {
            this.mode = this.mode === 'student' ? 'teacher' : 'student';
            e.target.textContent = this.mode === 'student' ? 'Teacher Mode' : 'Student Mode';
            const badge = document.getElementById('modeBadge');
            badge.textContent = this.mode === 'student' ? 'Student Mode' : 'Teacher Mode';
            badge.className = `mode-indicator mode-${this.mode}`;
        });

        // Step navigation
        document.getElementById('nextStepBtn').addEventListener('click', () => {
            if (this.currentStep < this.experiment.procedure.length - 1) {
                this.currentStep++;
                this.updateStepUI();
            }
        });

        document.getElementById('prevStepBtn').addEventListener('click', () => {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.updateStepUI();
            }
        });

        document.getElementById('resetBenchBtn').addEventListener('click', () => {
             if(this.p) this.p.resetBench();
        });
    }

    updateStepUI() {
        const steps = document.querySelectorAll('.procedure-steps li');
        steps.forEach((li, i) => {
            li.classList.toggle('active', i === this.currentStep);
        });

        document.getElementById('prevStepBtn').disabled = this.currentStep === 0;
        document.getElementById('nextStepBtn').disabled = this.currentStep === this.experiment.procedure.length - 1;
        
        // Trigger specific engine events based on step if needed
        if (this.p) this.p.onStepChange(this.currentStep);
    }

    showTimedObservation(text, duration) {
        const obs = document.getElementById('expObservations');
        obs.textContent = text;
        obs.classList.add('pulse');
        setTimeout(() => obs.classList.remove('pulse'), duration);
    }

    setupP5() {
        const sketch = (p) => {
            let apparatusOnBench = [];
            let draggingObj = null;
            let benchY;
            let container;
            let dragStartPos = { x: 0, y: 0 };

            p.setup = () => {
                container = document.getElementById('lab-canvas-container');
                const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
                canvas.parent(container);
                benchY = p.height - 100;
                console.log("p5 Lab Bench initialized");
            };

            p.draw = () => {
                p.background(240, 242, 245);
                this.renderBench(p, benchY);
                
                apparatusOnBench.forEach(obj => {
                    obj.update();
                    obj.display();
                });
            };

            p.addApparatus = (type, name, startX, startY) => {
                let newObj = new LabApparatus(p, type, name, startX || p.width/2, startY || p.height/2);
                apparatusOnBench.push(newObj);
                draggingObj = newObj;
                console.log("Apparatus added:", name);
            };

            p.getApparatus = () => apparatusOnBench;

            p.resetBench = () => {
                apparatusOnBench = [];
            };

            p.onStepChange = (step) => {
                console.log("Engine Step:", step);
            };

            p.mousePressed = () => {
                if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
                
                dragStartPos = { x: p.mouseX, y: p.mouseY };

                for (let i = apparatusOnBench.length - 1; i >= 0; i--) {
                    if (apparatusOnBench[i].isMouseOver()) {
                        draggingObj = apparatusOnBench[i];
                        console.log("Started dragging existing:", draggingObj.name);
                        break;
                    }
                }
            };

            const updateDragPos = (e) => {
                if (draggingObj && container) {
                    const rect = container.getBoundingClientRect();
                    draggingObj.x = e.clientX - rect.left;
                    draggingObj.y = e.clientY - rect.top;
                    
                    // Audio: Drag noise (simulated by infrequent low-volume clinks/scrapes if moving fast)
                    if (Math.random() < 0.02) window.labEngine.audio.playClink();
                }
            };

            window.addEventListener('mousemove', updateDragPos);

            window.addEventListener('mouseup', (e) => {
                if (draggingObj) {
                    console.log("Dropped apparatus:", draggingObj.name);
                    updateDragPos(e);

                    if (draggingObj.type === 'bunsen_burner') {
                         const dist = p.dist(dragStartPos.x, dragStartPos.y, p.mouseX, p.mouseY);
                         if (dist < 10) {
                             draggingObj.isLit = !draggingObj.isLit;
                             console.log("Burner lit state toggled:", draggingObj.isLit);
                             // Audio: Toggle burner sound
                             if (window.labEngine.audio) window.labEngine.audio.toggleBurner(draggingObj.isLit);
                         }
                    }

                    for (let obj of apparatusOnBench) {
                        if (obj !== draggingObj && p.dist(draggingObj.x, draggingObj.y, obj.x, obj.y) < 50) {
                            if (obj.interact(draggingObj)) {
                                apparatusOnBench = apparatusOnBench.filter(o => o !== draggingObj);
                                break;
                            }
                        }
                    }
                    draggingObj = null;
                }
            });

            p.windowResized = () => {
                if (container) {
                    p.resizeCanvas(container.clientWidth, container.clientHeight);
                    benchY = p.height - 100;
                }
            };
        };

        this.p = new p5(sketch);
    } // End setupP5

    renderBench(p, y) {
        // Render bench surface with high-realism
        p.noStroke();
        
        // Bench top shadow/depth
        p.fill(30, 30, 32); 
        p.rect(0, y, p.width, 20); // Front edge depth
        
        // Main surface
        p.fill(45, 45, 48); // Dark laboratory surface
        p.rect(0, y + 5, p.width, p.height - y);
        
        // Add "wear and tear" details
        p.stroke(60, 60, 65);
        for(let i=0; i<15; i++) {
           let wx = (i * 137) % p.width;
           let wy = y + ((i * 89) % (p.height - y));
           p.line(wx, wy, wx + 10, wy + 2); // Subtle scratches
        }
        
        // Water stains
        p.noStroke();
        p.fill(60, 60, 70, 40);
        p.ellipse(200, y + 50, 80, 40);
        p.ellipse(p.width - 300, y + 30, 120, 60);

        // Grid lines for "alignment" - very subtle
        p.stroke(55, 55, 60);
        for(let gx=0; gx<p.width; gx+=50) p.line(gx, y, gx, p.height);

        // Sink area - more realistic
        p.fill(20, 20, 22);
        p.rect(50, y + 10, 140, p.height - y - 30, 5);
        p.fill(35, 38, 42); // Stainless steel look
        p.rect(60, y + 15, 120, p.height - y - 50, 3);
        
        // Faucet shadows
        p.noFill();
        p.stroke(10, 10, 10, 50);
        p.strokeWeight(10);
        p.beginShape();
        p.vertex(115, y);
        p.bezierVertex(115, y-55, 65, y-55, 65, y-35);
        p.endShape();

        // Chrome Faucet
        p.stroke(200, 205, 215);
        p.strokeWeight(8);
        p.beginShape();
        p.vertex(110, y);
        p.bezierVertex(110, y-60, 60, y-60, 60, y-40);
        p.endShape();
        p.strokeWeight(2);
    }
}

/**
 * Apparatus Class for p5
 */
class LabApparatus {
    constructor(p, type, name, x, y) {
        this.p = p;
        this.type = type;
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = type === 'test_tube' ? 30 : 70;
        this.h = type === 'test_tube' ? 90 : 80;
        this.liquidLevel = 0; // 0 to 1
        this.liquidColor = p.color(200, 220, 255, 150);
        this.temp = 25;
        this.pH = 7; // Neutral
        this.isLit = false;
        this.onTripod = false;
        this.isDraggable = true;
        
        // --- Realism/physics properties ---
        this.mass = (['beaker'].includes(type) ? 2.2 : ['test_tube'].includes(type) ? 1 : 0.8) + Math.random()*0.2; 
        this.dragResistance = 0.78 + 0.10 * this.mass;
        this.isDragging = false;
        this.vx = 0; this.vy = 0; 
        this.snapNoise = 4 + Math.random()*3;
        this.tilt = 0; // radians
        this.safeTiltThreshold = Math.PI/7;
        this.deltaTime = 1/60; 
        this.surfaceOsc = 0; 
        this.targetColor = null; this.colorBlendTime = 0;
        
        // - Real gas state -
        this.hasGas = false;
        this.gasOpacity = 0; this.gasFadeRate = 0.12;
        
        // - Filtration/drip/diffusion/evaporation -
        this.diffusionValue = 0;
        this.filtrationRate = 0; this.isFiltering = false;
        this.lastDripTime = 0; this.evapRate = 0; this.isEvaporating = false;
        
        // - Safety/Event flags -
        this.warning = null; this.isOverheating = false; this.wrongOrder = false;
        this.eventListeners = {};
    }

    update() {
        const prevTemp = this.temp;
        const prevBoiling = this.temp >= 100;
        const prevGasOpacity = this.gasOpacity;
        const prevLiquidLevel = this.liquidLevel;
        const p = this.p;
        // --- FIXED TIMESTEP PHYSICS/REALISM ---
        const dt = this.deltaTime; // fixed for determinism

        // --- Time-Driven Heat/Boil/Evaporation (Physics Realism) ---
        if (this.temp !== prevTemp) this.emit('onHeatChange', this.temp);

        // Bunsen/candle heat nearby liquids
        if (this.type === 'bunsen_burner' && this.isLit) {
            window.labEngine.p.getApparatus().forEach(obj => {
                if (obj !== this && p.abs(this.x - obj.x) < 40) {
                    let flameY = this.y - this.h/2;
                    let bottomY = obj.y + obj.h/2;
                    if (bottomY < flameY + 20 && bottomY > flameY - 60) {
                        // Slow, exponential  ocus realistic delay to boiling
                        if (obj.liquidLevel > 0) {
                            if (obj.temp < 99) obj.temp += dt * (0.35 + 0.08*Math.random());
                            // Event: Overheating (for realism)
                            if (obj.temp > 106) {
                                obj.isOverheating = true;
                                obj.evapRate = dt * 0.0012;
                                this.emit('onBubbleStart');
                            } else {
                                obj.isOverheating = false;
                                obj.evapRate = dt * 0.0004;
                            }
                        }
                    }
                }
            });
        }
        // Combustion + loss of flame by O2
        if (this.type === 'candle' && this.isLit) {
            const jar = window.labEngine.p.getApparatus().find(obj => 
                obj.type === 'jar' && p.dist(this.x, this.y, obj.x, obj.y) < 20
            );
            if (jar) {
                this.isLit = false;
                this.emit('onFlameIgnite'); // Extinguish
                window.labEngine.showTimedObservation("The flame goes out because oxygen is depleted.", 3000);
            }
        }
        // Gradual boiling and evaporation
        if (this.liquidLevel > 0) {
            if (this.temp >= 100 && !prevBoiling) this.emit('onBoilStart');
            if (this.temp >= 100) {
                // Boiling (advance slowly)
                this.surfaceOsc += Math.sin(performance.now()/95)*dt*2;
                this.isEvaporating = true;
                if (this.evapRate) {
                    this.liquidLevel = Math.max(0, this.liquidLevel - this.evapRate);
                    if (Math.random() < 0.14) {
                        this.emit('onBubbleStart'); // trigger UI/audio
                        if (window.labEngine.audio) window.labEngine.audio.playBubble();
                    }
                }
            } else if (this.temp > 50) {
                this.surfaceOsc += Math.sin(performance.now()/156)*dt;
            }
        } else {
            this.isEvaporating = false;
        }

        // --- Diffusion (visual/physics) ---
        // Simple: blend in over time when colored solute is present
        if (this.diffusionValue < 1 && this.type === 'beaker' && this.liquidLevel > 0 && this.liquidColor && this.targetColor) {
            this.diffusionValue += dt * 0.18; // seconds for full blend
            // Gradually blend color (LAB or RGB)
            let c = p.lerpColor(this.liquidColor, this.targetColor, Math.min(this.diffusionValue,1));
            this.liquidColor = c;
            // Event: Bubble at start
            if (Math.random()<0.1 && this.diffusionValue<0.25) this.emit('onBubbleStart');
        }

        // --- Filtration realism ---
        if (this.isFiltering && this.liquidLevel > 0) {
            // Drip at a real gravity-driven rate, with event emission
            if (performance.now() - this.lastDripTime > 520 + Math.random()*80) {
                this.liquidLevel = Math.max(0, this.liquidLevel - this.filtrationRate * dt * (1+(0.1*Math.random())));
                this.lastDripTime = performance.now();
                this.emit('onDrip');
                if (window.labEngine.audio) window.labEngine.audio.playDrip();
            }
            if (this.liquidLevel <= 0.01) {
                this.isFiltering = false;
            }
        }

        // --- Gas Fade Realism ---
        if (this.hasGas) {
            this.gasOpacity -= this.gasFadeRate * dt * (0.9 + Math.random()*0.2);
            if (this.gasOpacity !== prevGasOpacity) this.emit('onGasRelease', this.gasOpacity);
            if (this.gasOpacity <= 0) this.hasGas = false;
        }

        // --- Color blending ---
        if (this.colorBlendTime > 0 && this.targetColor && this.liquidColor) {
            let t = Math.min(1, (performance.now()%1000)/this.colorBlendTime);
            this.liquidColor = p.lerpColor(this.liquidColor, this.targetColor, t);
            if (t === 1) this.colorBlendTime = 0;
        }

        // --- Flame Flicker State ---
        if ((this.type === 'bunsen_burner' || this.type === 'candle') && this.isLit) {
            this.flameIntensity = 0.9 + (Math.random()-0.5) * 0.21;
            this.flameOrientation = (Math.random()-0.5)*0.09;
        }

        // --- Light/Glass Reflection Variance ---
        this.glassReflectance = 0.89 + (Math.random()-0.5) * 0.08;
        this.glassShadowRatio = 0.13 + (Math.random()-0.5) * 0.013;

        // --- Interaction Physics: Drag/Drop/Tilt/Spill ---
        
        if (this.isDragging) {
            // Resistance & inertia
            this.vx *= Math.pow(1-this.dragResistance*dt, 1.05);
            this.vy *= Math.pow(1-this.dragResistance*dt, 1.05);
            // Snap to bench/surf, but not laser straight
            if (Math.abs(this.x%this.snapNoise)<this.snapNoise/2) this.x += this.snapNoise/2;
            if (Math.abs(this.y%this.snapNoise)<this.snapNoise/2) this.y += this.snapNoise/2;
        }
        // Tilt (simulate tilt when pouring)
        if (Math.abs(this.tilt) > this.safeTiltThreshold && this.liquidLevel > 0) {
            this.warning = 'SPILL';
            this.liquidLevel = Math.max(0, this.liquidLevel - dt*0.05 * Math.abs(this.tilt));
            this.emit('onSpill', {level: this.liquidLevel, tilt: this.tilt});
            if (Math.random()<0.16) this.emit('onDrip');
        } else {
            this.warning = null;
        }
    }

    // ---- Lightweight sensory event system ----
    on(event, handler) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(handler);
    }
    emit(event) {
        if (this.eventListeners[event]) {
            for (const h of this.eventListeners[event]) {
                h();
            }
        }
    }


    display() {
        const p = this.p;
        
        // Drop Shadow
        p.noStroke();
        p.fill(0, 0, 0, 40);
        p.ellipse(this.x, this.y + this.h/2, this.w * 0.8, 10);

        p.push();
        p.translate(this.x, this.y);
        
        p.stroke(120);
        p.strokeWeight(1.5);

        // Render contents first
        if (this.liquidLevel > 0) {
            p.noStroke();
            p.fill(this.liquidColor);
            const lh = this.h * 0.8 * this.liquidLevel;
            if (this.type === 'test_tube') {
                p.rect(-this.w/2 + 2, this.h/2 - lh - 5, this.w - 4, lh, 0, 0, 15, 15);
            } else {
                p.rect(-this.w/2 + 2, this.h/2 - lh - 2, this.w - 4, lh);
            }

            // Bubbles if boiling
            if (this.temp > 95) {
                p.fill(255, 255, 255, 150);
                for(let i=0; i<3; i++) {
                    p.ellipse(p.random(-this.w/2 + 5, this.w/2 - 5), 
                              p.random(this.h/2 - lh, this.h/2 - 5), 
                              p.random(2, 4));
                }
            }
        }

        // Render glass/apparatus
        p.fill(220, 240, 255, 60); // Translucent blueish glass
        p.stroke(150, 180, 255, 200);
        p.strokeWeight(2);
        
        if (this.type === 'beaker') {
            p.beginShape();
            p.vertex(-this.w/2, -this.h/2);
            p.vertex(-this.w/2, this.h/2);
            p.vertex(this.w/2, this.h/2);
            p.vertex(this.w/2, -this.h/2);
            p.endShape();
            // Rim
            p.ellipse(0, -this.h/2, this.w, 8);
            
            // Glass Highlight
            p.noStroke();
            p.fill(255, 255, 255, 40);
            p.rect(-this.w/2 + 5, -this.h/2 + 5, 8, this.h - 10, 2);
        } else if (this.type === 'test_tube') {
            p.beginShape();
            p.vertex(-this.w/2, -this.h/2);
            p.vertex(-this.w/2, this.h/2 - 15);
            p.bezierVertex(-this.w/2, this.h/2, this.w/2, this.h/2, this.w/2, this.h/2 - 15);
            p.vertex(this.w/2, -this.h/2);
            p.endShape();
            // Highlight
            p.noStroke();
            p.fill(255, 255, 255, 40);
            p.rect(-this.w/2 + 3, -this.h/2 + 5, 4, this.h - 20, 2);
        } else if (this.type === 'bunsen_burner' || this.type === 'candle') {
            p.fill(this.type === 'candle' ? 240 : 100);
            p.rect(this.type === 'candle' ? -8 : -25, this.h/2 - 10, this.type === 'candle' ? 16 : 50, 10); // Base
            p.fill(this.type === 'candle' ? 255 : 180);
            p.rect(this.type === 'candle' ? -6 : -6, -this.h/2, 12, this.h - 10); // Tube/Wax
            
            if(this.isLit) {
                p.noStroke();
                const pulse = p.sin(p.frameCount * 0.1) * 3;
                
                // Outer flame
                p.fill(255, 120, 0, 180);
                p.beginShape();
                p.vertex(-8, -this.h/2);
                p.bezierVertex(-15, -this.h/2 - 35 - pulse, 15, -this.h/2 - 35 - pulse, 8, -this.h/2);
                p.endShape(p.CLOSE);
                
                if (this.type === 'bunsen_burner') {
                    // Inner blue flame (hotter)
                    p.fill(0, 150, 255, 220);
                    p.beginShape();
                    p.vertex(-4, -this.h/2);
                    p.bezierVertex(-6, -this.h/2 - 15 - pulse/2, 6, -this.h/2 - 15 - pulse/2, 4, -this.h/2);
                    p.endShape(p.CLOSE);
                }
            }
        } else if (this.type === 'jar') {
            p.fill(200, 220, 255, 50);
            p.stroke(200, 220, 255, 150);
            p.rect(-30, -40, 60, 80, 5);
        } else if (this.type === 'tripod') {
            p.stroke(80);
            p.strokeWeight(4);
            // Legs (3D perspective)
            p.line(-30, this.h/2, -45, this.h/2 + 40);
            p.line(30, this.h/2, 45, this.h/2 + 40);
            p.line(0, this.h/2 - 5, 0, this.h/2 + 35);
            // Top ring
            p.strokeWeight(5);
            p.noFill();
            p.ellipse(0, this.h/2 - 5, 70, 15);
        } else if (this.type.includes('litmus')) {
            p.fill(this.type === 'litmus_red' ? '#ff4d4d' : '#4d79ff');
            p.noStroke();
            p.rect(-5, -20, 10, 40);
            p.stroke(255, 100);
            p.line(-5, -20, 5, -20);
        }

        // Label for materials
        if (this.type === 'material') {
            p.fill(255);
            p.stroke(100);
            p.rect(-30, -15, 60, 30, 5);
            p.fill(0);
            p.noStroke();
            p.textSize(10);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(this.name, 0, 0);
        }

        // Temp indicator if hot
        if (this.temp > 40) {
            p.noStroke();
            p.fill(255, 0, 0, p.map(this.temp, 40, 100, 50, 200));
            p.textSize(8);
            p.text(`${Math.floor(this.temp)}°C`, 0, -this.h/2 - 15);
        }

        // Gas/Steam rendering
        if (this.hasGas || this.gasOpacity > 0) {
            p.noStroke();
            let opacity = p.map(this.gasOpacity, 0, 1, 0, 150);
            p.fill(240, 240, 255, opacity);
            for(let i=0; i<5; i++) {
                let gx = (p.frameCount * 2 + i * 30) % 60 - 30;
                let gy = -(p.frameCount + i * 50) % 80 - this.h/2; 
                let s = 10 + Math.sin(p.frameCount * 0.1 + i) * 5;
                p.ellipse(gx * 0.5, gy, s, s*0.8);
            }
        }

        p.pop();
    }

    isMouseOver() {
        return this.p.mouseX > this.x - this.w/2 && 
               this.p.mouseX < this.x + this.w/2 && 
               this.p.mouseY > this.y - this.h/2 && 
               this.p.mouseY < this.y + this.h/2;
    }

    // Simulate drag resistance proportional to mass (called from engine on drag start and drag move)
    applyDrag(dx, dy) {
        this.vx = dx / (this.mass * 0.8);
        this.vy = dy / (this.mass * 0.8);
        this.x += this.vx;
        this.y += this.vy;
        this.isDragging = true;
    }

    // Snap-to-surface logic for alignment with light randomness
    snapToBench(benchY) {
        this.y = benchY - this.h/2 + (Math.random()-0.5)*this.snapNoise;
    }

    // Adjust tilt (used when user rotates/tilts apparatus)
    setTilt(angle) {
        this.tilt = angle;
    }


    interact(other) {
        const p = this.p;
        // Mixing or pouring logic
        
        // 1. Pouring from another container (Beaker -> Beaker/TestTube)
        if ((other.type === 'beaker' || other.type === 'test_tube') && (this.type === 'beaker' || this.type === 'test_tube')) {
            if (other.liquidLevel > 0) {
                // Transfer liquid
                const transferAmount = Math.min(other.liquidLevel, 1 - this.liquidLevel);
                if (transferAmount > 0) {
                    // Mix colors (simple averaging weighted by volume could be better, but lerp is okay for now)
                    if (this.liquidLevel > 0) {
                         this.targetColor = p.lerpColor(this.liquidColor, other.liquidColor, 0.5);
                         this.colorBlendTime = 1000;
                         // Mix pH
                         this.pH = (this.pH + other.pH) / 2;
                    } else {
                         this.liquidColor = other.liquidColor;
                         this.pH = other.pH;
                    }

                    this.liquidLevel += transferAmount;
                    other.liquidLevel -= transferAmount;
                    
                    // Visual/Audio feedback
                    window.labEngine.showTimedObservation(`Poured contents from ${other.name} to ${this.name}.`, 2000);
                    this.emit('onBubbleStart'); // Splash effect
                    if (window.labEngine.audio) window.labEngine.audio.playPour();
                    
                    // React logic (simple for now)
                    // Acid + Base = Neutralization visualization?
                    if (Math.abs(this.pH - 7) < 2 && Math.abs(other.pH - 7) > 3) {
                         // Neutralization happened
                         this.emit('onBubbleStart'); 
                    }
                }
            }
            return false; // Do NOT consume the apparatus
        }

        // 2. Adding Materials (Consumed)
        if (other.type === 'material' && (this.type === 'beaker' || this.type === 'test_tube')) {
            this.liquidLevel = p.constrain(this.liquidLevel + 0.1, 0, 1);
            
            // Material properties
            if (other.name.includes('Water')) {
                this.liquidColor = p.color(200, 220, 255, 150);
                this.pH = 7;
            }
            if (other.name.includes('Permanganate')) {
                this.targetColor = p.color(150, 0, 200, 180);
                this.colorBlendTime = 1500;
            }
            if (other.name.includes('Lemon') || other.name.includes('Acid')) {
                this.liquidColor = p.color(255, 255, 200, 180);
                this.pH = 3;
            }
            if (other.name.includes('Soap') || other.name.includes('Alkali') || other.name.includes('Limewater')) {
                this.liquidColor = p.color(230, 230, 255, 180);
                this.pH = 10;
            }
            if (other.name.includes('Universal Indicator')) {
                 // Change color based on pH
                 if (this.pH < 3) this.targetColor = p.color(255, 0, 0, 180);
                 else if (this.pH < 6) this.targetColor = p.color(255, 165, 0, 180);
                 else if (this.pH === 7) this.targetColor = p.color(0, 255, 0, 180);
                 else if (this.pH > 7) this.targetColor = p.color(0, 0, 255, 180);
                 this.colorBlendTime = 1000;
            }
            
            window.labEngine.showTimedObservation(`Added ${other.name} to ${this.type}.`, 2000);
            return true; // Consume material
        }
        
        // 3. Litmus Test
        if (this.type.includes('litmus') && (other.type === 'beaker' || other.type === 'test_tube')) {
            if (other.liquidLevel > 0) {
                if (this.type === 'litmus_red' && other.pH > 7) {
                    this.name = 'Blue Litmus';
                    this.type = 'litmus_blue';
                    window.labEngine.showTimedObservation("Red litmus turned BLUE (Alkaline).", 4000);
                } else if (this.type === 'litmus_blue' && other.pH < 7) {
                    this.name = 'Red Litmus';
                    this.type = 'litmus_red';
                    window.labEngine.showTimedObservation("Blue litmus turned RED (Acidic).", 4000);
                } else {
                    window.labEngine.showTimedObservation("No color change.", 2000);
                }
            }
             return false; // Don't consume litmus dragging object (if it's the one being dragged)
             // Wait, interact is called on the STATIONARY object (this).
             // If dragging litmus (other) onto beaker (this), we want to test.
             // But usually we drag litmus ONTO beaker.
             // Interact is called as: stationaryObj.interact(draggingObj).
             // So if stationary is Beaker (this), and other is Litmus.
             // My previous code had: if (this.type.includes('litmus')... this implied stationary was litmus.
             // But usually you drag Litmus onto Beaker.
             // If drag Litmus (other) onto Beaker (this):
             // Beaker.interact(Litmus) -> check logic.
        }
        
        // Fix Litmus logic: If THIS is Beaker and OTHER is Litmus
        if ((this.type === 'beaker' || this.type === 'test_tube') && other.type.includes('litmus')) {
             if (this.liquidLevel > 0) {
                if (other.type === 'litmus_red' && this.pH > 7) {
                    other.name = 'Blue Litmus';
                    other.type = 'litmus_blue';
                    window.labEngine.showTimedObservation("Red litmus turned BLUE (Alkaline).", 4000);
                } else if (other.type === 'litmus_blue' && this.pH < 7) {
                    other.name = 'Red Litmus';
                    other.type = 'litmus_red';
                    window.labEngine.showTimedObservation("Blue litmus turned RED (Acidic).", 4000);
                } else {
                    window.labEngine.showTimedObservation("No color change.", 2000);
                }
             }
             return false;
        }

        return false;
    }
}

// Initialize
window.labEngine = new ChemistryLabEngine();
