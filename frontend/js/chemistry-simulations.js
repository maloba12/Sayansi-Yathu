// Chemistry Simulations - p5.js based experiments
// Enhanced with realistic visuals and improved interaction

let currentP5Instance = null;
let currentExperimentType = null;

// Main Loader Function
function loadChemistryExperiment(type) {
    // defined in chemistry.html buttons
    console.log('Loading experiment:', type);
    currentExperimentType = type;

    // cleanup previous
    if (currentP5Instance) {
        currentP5Instance.remove();
        currentP5Instance = null;
    }

    // Toggle Controls
    document.querySelectorAll('.experiment-controls').forEach(el => el.classList.add('hidden'));
    const controls = document.getElementById(`${type}-controls`);
    if (controls) controls.classList.remove('hidden');

    // Initialize new sketch
    if (type === 'titration') {
        currentP5Instance = new p5(createTitrationSketch(), 'chemistry-canvas');
    } else if (type === 'reaction') {
        currentP5Instance = new p5(createReactionSketch(), 'chemistry-canvas');
    } else {
        document.getElementById('chemistry-canvas').innerHTML = '<p style="padding:20px;">Experiment under construction 🚧</p>';
    }
}

// ==========================================
// TITRATION SIMULATION
// ==========================================
function createTitrationSketch() {
    return (p) => {
        // State
        let buretteLevel = 50; // mL max
        let flaskVolume = 100; // mL
        let currentVolume = 25; // Initial acid volume
        
        let acidConc = 0.1;
        let baseConc = 0.1;
        
        let ph = 1.0;
        let droplets = [];
        let liquidColor;
        let targetColor;
        
        // Assets or Shapes
        const flaskWidth = 120;
        const flaskHeight = 160;
        
        p.setup = () => {
             // Canvas is created by p5 constructor via second arg, but resizing here ensures fit
            const container = document.getElementById('chemistry-canvas');
            const w = container.clientWidth || 600;
            p.createCanvas(w, 450);
            
            // Initial calculation
            recalculatePH();
            liquidColor = p.color(240, 240, 255, 200); // Clear/Watery
            targetColor = p.color(240, 240, 255, 200);
        };

        p.windowResized = () => {
            const container = document.getElementById('chemistry-canvas');
            if (container) {
                 p.resizeCanvas(container.clientWidth || 600, 450);
            }
        };

        p.draw = () => {
            p.clear();
            p.background(255);
            
            p.push();
            p.translate(p.width / 2, 50);

            // 1. Draw Burette (Top)
            drawBurette(p, buretteLevel);

            // 2. Draw Flask (Bottom)
            p.translate(0, 220);
            drawFlask(p, currentVolume);

            // 3. Droplets
            updateDroplets(p);
            
            p.pop();

            // 4. HUD / Info
            drawHUD(p);
            
            // Smooth color transition
            liquidColor = p.lerpColor(liquidColor, targetColor, 0.05);
        };

        // --- Helpers ---

        function drawBurette(p, level) {
            p.push();
            p.stroke(100);
            p.strokeWeight(2);
            p.fill(245, 245, 245, 150);
            
            // Tube
            p.rect(-15, 0, 30, 180);
            
            // Liquid inside burette
            p.noStroke();
            p.fill(200, 220, 255); // Blue tint base
            let liquidH = p.map(level, 0, 50, 0, 180);
            p.rect(-13, 180 - liquidH, 26, liquidH);
            
            // Tip
            p.stroke(100);
            p.beginShape();
            p.vertex(-15, 180);
            p.vertex(-5, 200); // Point
            p.vertex(5, 200);
            p.vertex(15, 180);
            p.endShape();
            
            // Stopcock
            p.fill(50);
            p.rect(-20, 160, 40, 10, 2);
            
            p.pop();
        }

        function drawFlask(p, volume) {
            // Erlenmeyer Flask Shape
            p.stroke(150);
            p.strokeWeight(2);
            p.fill(255, 255, 255, 50); // Glassy

            // We draw the liquid FIRST so it's behind glass
            // Liquid Level
            let h = p.map(volume, 0, 200, 0, flaskHeight - 20); // rough scale
            h = p.constrain(h, 0, flaskHeight - 10);
            
            p.push();
            p.noStroke();
            p.fill(liquidColor);
            
            // Masking liquid to flask shape is hard in p5 without clip().
            // Simple trapezoid approximation for liquid
            let baseW = flaskWidth;
            let topW = p.map(h, 0, flaskHeight, flaskWidth, 40); // Tapering
            
            p.beginShape();
            p.vertex(-baseW/2, flaskHeight);
            p.vertex(baseW/2, flaskHeight);
            p.vertex(topW/2, flaskHeight - h);
            p.vertex(-topW/2, flaskHeight - h);
            p.endShape(p.CLOSE);
            p.pop();

            // Glass Outline
            p.noFill(); // Draw outline over liquid
            p.stroke(180);
            p.strokeWeight(3);
            p.beginShape();
            p.vertex(-20, -40); // Neck top
            p.vertex(-20, 20);  // Neck bottom
            p.vertex(-flaskWidth/2, flaskHeight); // Base left
            p.vertex(flaskWidth/2, flaskHeight);  // Base right
            p.vertex(20, 20);   // Neck bottom right
            p.vertex(20, -40);  // Neck top right
            p.endShape();
            
            // Rim
            p.ellipse(0, -40, 40, 10);
            
            // Label
            p.noStroke();
            p.fill(100);
            p.textAlign(p.CENTER);
            p.textSize(12);
            p.text("250ml", 0, 50);
        }

        function updateDroplets(p) {
            for (let i = droplets.length - 1; i >= 0; i--) {
                let d = droplets[i];
                d.y += d.speed;
                d.speed += 0.2; // gravity
                
                p.fill(200, 220, 255);
                p.noStroke();
                p.ellipse(0, 200 + d.y, 6, 8); // Relative to burette tip
                
                // Hit liquid surface (approx 220 + heightOffset)
                // Simplified: hit flask bottom area
                if (d.y > 100) { 
                    droplets.splice(i, 1);
                    // Splash effect or just disappear
                }
            }
        }

        function drawHUD(p) {
            p.fill(50);
            p.noStroke();
            p.textSize(16);
            p.textAlign(p.LEFT);
            
            p.text(`pH: ${ph.toFixed(2)}`, 20, 40);
            
            // Color scale
            strokeIndicatorScale(p, 20, 60);
            
            p.text(`Acid Vol: 25mL`, 20, 430);
            p.text(`Total Vol: ${currentVolume.toFixed(1)}mL`, 200, 430);
        }

        function strokeIndicatorScale(p, x, y) {
            p.push();
            p.translate(x, y);
            for(let i=0; i<140; i+=2) {
                let val = p.map(i, 0, 140, 0, 14);
                let c = getIndicatorColor(p, val);
                p.fill(c);
                p.rect(i, 0, 2, 10);
            }
            // Marker
            let xPos = p.map(ph, 0, 14, 0, 140);
            p.stroke(0);
            p.line(xPos, -2, xPos, 12);
            p.pop();
        }

        // Logic
        function recalculatePH() {
            // Strong Acid (HCl) - Strong Base (NaOH) approximation
            // Initial moles H+
            let molesAcid = 0.025 * acidConc; // Used 25mL initial
            
            // Added moles OH-
            let addedVolL = (currentVolume - 25) / 1000;
            let molesBase = addedVolL * baseConc;
            
            let totalVolL = currentVolume / 1000;
            
            if (molesAcid > molesBase) {
                let remainingH = molesAcid - molesBase;
                let concH = remainingH / totalVolL;
                ph = -Math.log10(concH);
            } else if (molesBase > molesAcid) {
                let remainingOH = molesBase - molesAcid;
                let concOH = remainingOH / totalVolL;
                let pOH = -Math.log10(concOH);
                ph = 14 - pOH;
            } else {
                ph = 7.0;
            }
            
            ph = p.constrain(ph, 0, 14);
            targetColor = getIndicatorColor(p, ph);
        }

        function getIndicatorColor(p, val) {
            // Phenolphthalein: Clear < 8.2, Pink > 10.0
            if (val < 8.2) return p.color(240, 245, 255, 100); // Clear water
            if (val >= 10.0) return p.color(255, 0, 127, 200); // Deep Pink
            
            // Gradient
            return p.lerpColor(
                p.color(240, 245, 255, 100), 
                p.color(255, 0, 127, 200), 
                (val - 8.2) / (10.0 - 8.2)
            );
        }

        // --- Expose interactions to Global Scope ---
        p.addDrop = (vol) => {
            if (vol > 0.1) {
                // Bulk add
                for(let i=0; i<5; i++) droplets.push({y: 0, speed: 2 + Math.random()});
            } else {
                droplets.push({y: 0, speed: 2});
            }
            
            // Animation delay for volume visual update could be added here
            // For now instant logic, animated visual
            currentVolume += vol;
            buretteLevel -= vol; 
            if (buretteLevel < 0) buretteLevel = 50; // Refill magic
            
            recalculatePH();
        };

        p.reset = () => {
             currentVolume = 25;
             buretteLevel = 50;
             ph = 1.0;
             acidConc = parseFloat(document.getElementById('acid-conc').value) || 0.1;
             baseConc = parseFloat(document.getElementById('base-conc').value) || 0.1;
             recalculatePH();
        };
        
        p.setConc = (a, b) => {
            acidConc = a;
            baseConc = b;
            recalculatePH();
        };
    };
}

// ==========================================
// REACTION SIMULATION (Legacy/Basic)
// ==========================================
function createReactionSketch() {
    return (p) => {
        let molecules = [];
        p.setup = () => {
            const container = document.getElementById('chemistry-canvas');
            p.createCanvas(container.clientWidth || 600, 400);
            for(let i=0; i<10; i++) molecules.push(new p.Molecule());
        };
        
        p.draw = () => {
            p.background(250);
            p.text("Chemical Reaction Chamber (Basic)", 20, 20);
            molecules.forEach(m => { m.update(); m.display(); });
        };
        
        p.Molecule = class {
            constructor() {
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.vx = p.random(-2,2);
                this.vy = p.random(-2,2);
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if(this.x<0 || this.x>p.width) this.vx*=-1;
                if(this.y<0 || this.y>p.height) this.vy*=-1;
            }
            display() {
                p.fill(100, 200, 100);
                p.ellipse(this.x, this.y, 10);
            }
        };
    };
}


// ==========================================
// GLOBAL CONTROL HANDLERS
// ==========================================

// Attach to window so HTML onClick works
window.loadChemistryExperiment = loadChemistryExperiment;

window.addBase = (amount) => {
    if (currentExperimentType === 'titration' && currentP5Instance) {
        currentP5Instance.addDrop(amount);
    }
};

window.resetTitration = () => {
    if (currentExperimentType === 'titration' && currentP5Instance) {
        currentP5Instance.reset();
    }
};

window.updateAcidConcentration = () => {
    if (currentExperimentType === 'titration' && currentP5Instance) {
        const a = parseFloat(document.getElementById('acid-conc').value);
        const b = parseFloat(document.getElementById('base-conc').value);
        currentP5Instance.setConc(a, b);
    }
};

window.updateBaseConcentration = window.updateAcidConcentration;

// Auto-load titration on start for demo
document.addEventListener('DOMContentLoaded', () => {
    loadChemistryExperiment('titration');
});
