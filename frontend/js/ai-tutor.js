class AITutor {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.panel = null;
        this.init();
    }

    init() {
        // Prepare simulation context (will be updated by SimulationPlayer)
        this.context = {
            simulationTitle: '',
            currentStep: '',
            subject: ''
        };
    }

    setContext(context) {
        this.context = { ...this.context, ...context };
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (!this.panel) {
            this.createPanel();
        }
        this.panel.style.display = 'flex';
        this.isOpen = true;
        
        // Initial greeting if empty
        if (this.chatHistory.length === 0) {
            this.addMessage('bot', `Hello! I'm your Sayansi AI Tutor. I can help you with the **${this.context.simulationTitle}** experiment. What would you like to know?`);
        }
    }

    close() {
        if (this.panel) {
            this.panel.style.display = 'none';
        }
        this.isOpen = false;
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'ai-tutor-panel';
        this.panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 80px;
            width: 350px;
            height: calc(100vh - 120px);
            background: white;
            box-shadow: -5px 0 25px rgba(0,0,0,0.15);
            border-radius: 15px;
            display: none;
            flex-direction: column;
            z-index: 2000;
            overflow: hidden;
            font-family: 'Segoe UI', system-ui, sans-serif;
            border: 1px solid #e2e8f0;
        `;

        this.panel.innerHTML = `
            <div style="background: #3182ce; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <h4 style="margin:0; font-size: 1.1rem;">🧪 Sayansi AI Tutor</h4>
                <button id="close-tutor" style="background:none; border:none; color:white; font-size: 1.5rem; cursor:pointer;">&times;</button>
            </div>
            <div id="ai-chat-messages" style="flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; background: #f7fafc;">
            </div>
            <div style="padding: 15px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px;">
                <input type="text" id="ai-chat-input" placeholder="Ask a question..." style="flex: 1; padding: 10px; border: 1px solid #cbd5e0; border-radius: 8px; outline: none;">
                <button id="ai-chat-send" style="background: #3182ce; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">Send</button>
            </div>
        `;

        document.body.appendChild(this.panel);

        document.getElementById('close-tutor').onclick = () => this.close();
        document.getElementById('ai-chat-send').onclick = () => this.handleSendMessage();
        document.getElementById('ai-chat-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        };
    }

    addMessage(role, text) {
        const msgDiv = document.createElement('div');
        const isBot = role === 'bot';
        msgDiv.style.cssText = `
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.4;
            ${isBot ? 'align-self: flex-start; background: #ebf8ff; color: #2c5282; border-bottom-left-radius: 2px;' 
                   : 'align-self: flex-end; background: #3182ce; color: white; border-bottom-right-radius: 2px;'}
        `;
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        document.getElementById('ai-chat-messages').appendChild(msgDiv);
        document.getElementById('ai-chat-messages').scrollTop = document.getElementById('ai-chat-messages').scrollHeight;
        this.chatHistory.push({ role, text });
    }

    async handleSendMessage() {
        const input = document.getElementById('ai-chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage('user', text);
        input.value = '';

        // Simulate AI "Thinking"
        const thinking = document.createElement('div');
        thinking.style.cssText = 'font-size: 0.8rem; color: #a0aec0; margin-left: 15px;';
        thinking.textContent = 'Thinking...';
        document.getElementById('ai-chat-messages').appendChild(thinking);

        // Fetch AI Response (Mock for now, could connect to backend)
        setTimeout(() => {
            thinking.remove();
            const response = this.generateMockResponse(text);
            this.addMessage('bot', response);
        }, 800);
    }

    generateMockResponse(query) {
        const q = query.toLowerCase();
        
        // Context-aware responses based on science
        if (q.includes('how') || q.includes('step')) {
            return `For this step in the **${this.context.simulationTitle}** lab, you should look at the instructions on the left panel. Currently, you are on: *${this.context.currentStep}*.`;
        }
        if (q.includes('why') || q.includes('explain')) {
            if (this.context.subject === 'Physics') {
                return "In Physics, we study how forces and matter interact. This experiment demonstrates energy conversion or structural stability.";
            }
            if (this.context.subject === 'Chemistry') {
                return "Chemical reactions involve breaking and forming bonds. This lab shows how substances transform based on conditions like temperature or pH.";
            }
            return "This experiment follows the Zambian Form 1 curriculum to help you understand core scientific principles practically.";
        }
        if (q.includes('oxygen') || q.includes('burning')) {
            return "Oxygen is a gas that supports combustion. In the candle experiment, once the oxygen in the jar is used up, the chemical reaction stops.";
        }
        if (q.includes('cell')) {
            return "Cells are the building blocks of life! Plant cells have a rigid **Cell Wall** and **Chloroplasts**, while animal cells are more flexible.";
        }

        return "That's a great question! Explore the interactive 3D model to see how variables change, or ask me something more specific about this lab.";
    }
}

// Global instance
window.aiTutor = new AITutor();
