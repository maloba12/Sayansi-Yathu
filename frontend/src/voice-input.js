/**
 * voice-input.js - Client-side Voice Commands for Sayansi Yathu
 * Implementation of REC-08: Browser Voice Input (en-ZM)
 */

class VoiceInput {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.callbacks = {};
    
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-ZM'; // Zambian English
      
      this.recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.trim().toLowerCase();
        console.log('Voice Command Received:', command);
        this.handleCommand(command);
      };

      this.recognition.onend = () => {
        // Restart if it should be listening
        if (this.isListening) this.recognition.start();
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') return; // Silence non-critical error
        console.error('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') this.isListening = false;
      };
    } else {
      console.warn('Web Speech API not supported in this browser.');
    }
  }

  handleCommand(command) {
    // Exact matches or keyword inclusions
    if (command.includes('start experiment') || command === 'start') {
      this.dispatch('start');
    } else if (command.includes('next step') || command === 'next') {
      this.dispatch('next');
    } else if (command.includes('help') || command.includes('assistant')) {
      this.dispatch('help');
    } else if (command.includes('stop experiment') || command === 'stop') {
      this.dispatch('stop');
    }
  }

  dispatch(action) {
    // 1. Trigger custom event for simulations to listen for
    const event = new CustomEvent('sayansi-voice-command', { detail: { action } });
    window.dispatchEvent(event);

    // 2. Map to standard UI elements for zero-effort integration
    if (action === 'start') {
      const btn = document.querySelector('[id*="start"], [class*="start-btn"]');
      if (btn) btn.click();
    } else if (action === 'next') {
      const btn = document.querySelector('[id*="next"], [class*="next-btn"]');
      if (btn) btn.click();
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      console.log('Voice Recognition Started (en-ZM)');
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('Voice Recognition Stopped');
    }
  }
}

// Singleton instance
const voiceInput = new VoiceInput();
export default voiceInput;
