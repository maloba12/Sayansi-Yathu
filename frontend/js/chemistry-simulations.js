// Chemistry Simulations - p5.js based experiments

let titrationSketch = null;
let reactionSketch = null;

// Titration Simulation
function createTitrationSketch() {
    const sketch = (p) => {
        let buretteLevel = 0;
        let flaskVolume = 50;
        let acidConcentration = 0.1;
        let baseConcentration = 0.1;
        let equivalencePoint = (acidConcentration * flaskVolume) / baseConcentration;
        let pH = 7;
        let isTitrating = false;

        p.setup = () => {
            const canvas = p.createCanvas(600, 400);
            canvas.parent('titration-canvas');
            p.background(240);
        };

        p.draw = () => {
            p.background(240);
            
            // Draw burette
            p.fill(200);
            p.stroke(100);
            p.strokeWeight(2);
            p.rect(100, 50, 40, 250); // Burette body
            
            // Burette liquid
            p.fill(100, 150, 255);
            p.noStroke();
            p.rect(105, 50 + (250 - buretteLevel * 2.5), 30, buretteLevel * 2.5);
            
            // Draw flask
            p.fill(255);
            p.stroke(100);
            p.strokeWeight(2);
            p.ellipse(400, 250, 120, 80); // Flask body
            p.rect(370, 290, 60, 60); // Flask neck
            
            // Flask liquid
            p.fill(255, 255, 150);
            p.noStroke();
            p.ellipse(400, 250, 100, 60);
            
            // Add some bubbles for reaction
            if (buretteLevel > equivalencePoint * 0.8) {
                for (let i = 0; i < 5; i++) {
                    p.fill(255);
                    p.noStroke();
                    p.ellipse(
                        400 + p.random(-20, 20), 
                        250 + p.random(-10, 10), 
                        p.random(2, 5)
                    );
                }
            }
            
            // pH indicator
            let indicatorColor = p.color(255, 255, 150); // Neutral
            if (pH < 7) indicatorColor = p.color(255, 100, 100); // Acidic
            if (pH > 7) indicatorColor = p.color(100, 255, 100); // Basic
            
            p.fill(indicatorColor);
            p.noStroke();
            p.ellipse(400, 250, 80, 40);
            
            // Display values
            p.fill(0);
            p.textAlign(p.LEFT);
            p.textSize(14);
            p.text(`Volume added: ${buretteLevel.toFixed(1)} mL`, 20, 350);
            p.text(`pH: ${pH.toFixed(2)}`, 20, 370);
            p.text(`Equivalence point: ${equivalencePoint.toFixed(1)} mL`, 250, 350);
        };
        
        return {
            addBase: (amount) => {
                buretteLevel += amount;
                buretteLevel = Math.min(buretteLevel, 100);
                
                // Calculate pH (simplified)
                const baseAdded = buretteLevel * baseConcentration;
                const acidPresent = flaskVolume * acidConcentration;
                
                if (baseAdded < acidPresent) {
                    // Still acidic
                    pH = 7 - Math.log10((acidPresent - baseAdded) / flaskVolume);
                } else {
                    // Basic
                    pH = 7 + Math.log10((baseAdded - acidPresent) / flaskVolume);
                }
                pH = Math.max(0, Math.min(14, pH));
            },
            
            reset: () => {
                buretteLevel = 0;
                pH = 7;
            },
            
            setAcidConcentration: (conc) => {
                acidConcentration = conc;
                equivalencePoint = (acidConcentration * flaskVolume) / baseConcentration;
            },
            
            setBaseConcentration: (conc) => {
                baseConcentration = conc;
                equivalencePoint = (acidConcentration * flaskVolume) / baseConcentration;
            }
        };
    };
    
    return new p5(sketch);
}

// Chemical Reaction Simulation
function createReactionSketch() {
    const sketch = (p) => {
        let molecules = [];
        let reactionType = 'synthesis'; // synthesis, decomposition, replacement
        
        p.setup = () => {
            const canvas = p.createCanvas(600, 400);
            canvas.parent('reaction-canvas');
            p.background(240);
            initializeMolecules();
        };
        
        p.draw = () => {
            p.background(240);
            
            // Draw reaction chamber
            p.fill(255);
            p.stroke(100);
            p.strokeWeight(2);
            p.rect(50, 50, 500, 300);
            
            // Draw molecules
            molecules.forEach(mol => {
                mol.update();
                mol.display();
            });
            
            // Draw reaction equation
            p.fill(0);
            p.textAlign(p.CENTER);
            p.textSize(16);
            let equation = '';
            switch(reactionType) {
                case 'synthesis':
                    equation = 'A + B → AB';
                    break;
                case 'decomposition':
                    equation = 'AB → A + B';
                    break;
                case 'replacement':
                    equation = 'AB + C → AC + B';
                    break;
            }
            p.text(equation, 300, 380);
        };
        
        function initializeMolecules() {
            molecules = [];
            
            switch(reactionType) {
                case 'synthesis':
                    // Add reactant molecules
                    for (let i = 0; i < 5; i++) {
                        molecules.push(new Molecule(100 + i * 40, 150, 'A', p.color(255, 100, 100)));
                        molecules.push(new Molecule(100 + i * 40, 200, 'B', p.color(100, 100, 255)));
                    }
                    break;
                case 'decomposition':
                    // Add compound molecules
                    for (let i = 0; i < 5; i++) {
                        molecules.push(new Molecule(150 + i * 60, 175, 'AB', p.color(255, 255, 100)));
                    }
                    break;
                case 'replacement':
                    // Add mixed molecules
                    for (let i = 0; i < 3; i++) {
                        molecules.push(new Molecule(120 + i * 80, 160, 'AB', p.color(255, 255, 100)));
                        molecules.push(new Molecule(120 + i * 80, 190, 'C', p.color(100, 255, 100)));
                    }
                    break;
            }
        }
        
        class Molecule {
            constructor(x, y, type, col) {
                this.x = x;
                this.y = y;
                this.type = type;
                this.color = col;
                this.vx = p.random(-1, 1);
                this.vy = p.random(-1, 1);
                this.size = 20;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounce off walls
                if (this.x < 70 || this.x > 530) this.vx *= -1;
                if (this.y < 70 || this.y > 330) this.vy *= -1;
                
                // Keep within bounds
                this.x = p.constrain(this.x, 70, 530);
                this.y = p.constrain(this.y, 70, 330);
            }
            
            display() {
                p.fill(this.color);
                p.stroke(0);
                p.strokeWeight(1);
                p.ellipse(this.x, this.y, this.size);
                
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(12);
                p.text(this.type, this.x, this.y);
            }
        }
        
        return {
            setReactionType: (type) => {
                reactionType = type;
                initializeMolecules();
            },
            
            reset: () => {
                initializeMolecules();
            }
        };
    };
    
    return new p5(sketch);
}

// Global instances
let titrationSimulation = null;
let reactionSimulation = null;

// Initialize chemistry simulations
function initChemistrySimulations() {
    titrationSimulation = createTitrationSketch();
    reactionSimulation = createReactionSketch();
}

// Control functions
function addBase(volume = 1) {
    if (titrationSimulation) {
        titrationSimulation.addBase(volume);
    }
}

function resetTitration() {
    if (titrationSimulation) {
        titrationSimulation.reset();
    }
}

function setReactionType(type) {
    if (reactionSimulation) {
        reactionSimulation.setReactionType(type);
    }
}

function resetReaction() {
    if (reactionSimulation) {
        reactionSimulation.reset();
    }
}

function updateAcidConcentration() {
    const conc = parseFloat(document.getElementById('acid-conc').value) || 0.1;
    if (titrationSimulation) {
        titrationSimulation.setAcidConcentration(conc);
    }
    document.getElementById('acid-conc-value').textContent = conc.toFixed(3);
}

function updateBaseConcentration() {
    const conc = parseFloat(document.getElementById('base-conc').value) || 0.1;
    if (titrationSimulation) {
        titrationSimulation.setBaseConcentration(conc);
    }
    document.getElementById('base-conc-value').textContent = conc.toFixed(3);
}

// Make functions globally available
window.initChemistrySimulations = initChemistrySimulations;
window.addBase = addBase;
window.resetTitration = resetTitration;
window.setReactionType = setReactionType;
window.resetReaction = resetReaction;
window.updateAcidConcentration = updateAcidConcentration;
window.updateBaseConcentration = updateBaseConcentration;
