/**
 * LabAudio - Synthesized Sound Effects for Chemistry Lab
 * Uses Web Audio API to avoid external asset dependencies.
 */
class LabAudio {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.3; // Low volume for subtlety
        
        this.oscillators = {};
        this.burnerNode = null;
        this.enabled = true;
    }

    start() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- Sound Generators ---

    // Bunsen Burner: White noise + Lowpass filter
    toggleBurner(isLit) {
        if (!this.enabled) return;
        
        if (isLit) {
            if (this.burnerNode) return;
            const bufferSize = 2 * this.ctx.sampleRate;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            
            const gain = this.ctx.createGain();
            gain.gain.value = 0.15;

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            noise.start();
            this.burnerNode = { source: noise, gain: gain };
        } else {
            if (this.burnerNode) {
                this.burnerNode.source.stop();
                this.burnerNode = null;
            }
        }
    }

    // Bubble: Sine chirp
    playBubble() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.frequency.setValueAtTime(400 + Math.random()*200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800 + Math.random()*200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    // Glass Clink: High ping
    playClink() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000 + Math.random()*500, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    // Drip: Short sine
    playDrip() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    
    // Pour: Brown noise burst (simplified)
    playPour() {
        // ... (simplified as bubble repetition for now)
        this.playBubble();
    }
}
