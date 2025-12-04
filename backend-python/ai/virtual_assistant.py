from typing import Dict, List, Any
import datetime

class VirtualLabAssistant:
    def __init__(self):
        self.conversation_history = {}
        self.available_commands = {
            "start_experiment": self.start_experiment,
            "pause_experiment": self.pause_experiment,
            "explain_step": self.explain_step,
            "hint": self.provide_hint,
            "safety_check": self.safety_check,
            "calculate": self.calculate_value,
            "help": self.provide_help,
            "progress": self.show_progress
        }
        
    def process_message(self, message: str, user_id: str, context: Dict) -> Dict[str, Any]:
        """Process user message and return appropriate response"""
        
        # Add to conversation history
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        self.conversation_history[user_id].append({
            "message": message,
            "timestamp": datetime.datetime.now().isoformat(),
            "context": context
        })
        
        # Extract command
        command = self.extract_command(message.lower())
        
        if command in self.available_commands:
            return self.available_commands[command](context)
        else:
            return self.handle_natural_language(message, context)
    
    def extract_command(self, text: str) -> str:
        """Extract command from text"""
        command_keywords = {
            "start": "start_experiment",
            "begin": "start_experiment",
            "pause": "pause_experiment",
            "stop": "pause_experiment",
            "explain": "explain_step",
            "describe": "explain_step",
            "hint": "hint",
            "help": "help",
            "calculate": "calculate",
            "progress": "progress",
            "safety": "safety_check"
        }
        
        for keyword, command in command_keywords.items():
            if keyword in text:
                return command
        
        return "natural_language"
    
    def start_experiment(self, context: Dict) -> Dict[str, Any]:
        experiment = context.get('current_experiment', 'general')
        return {
            "response": f"Starting {experiment} experiment. Let me guide you through each step.",
            "action": "start_experiment",
            "steps": self.get_experiment_steps(experiment),
            "zambian_context": "Like learning traditional crafts, step by step"
        }
    
    def pause_experiment(self, context: Dict) -> Dict[str, Any]:
        return {
            "response": "Experiment paused. You can resume anytime by saying 'continue'.",
            "action": "pause_experiment",
            "current_step": context.get('current_step', 1)
        }
    
    def explain_step(self, context: Dict) -> Dict[str, Any]:
        step = context.get('current_step', 1)
        experiment = context.get('current_experiment', 'general')
        
        explanations = {
            "physics": {
                1: "First, let's set up the pendulum. Measure the length from the pivot point to the center of mass.",
                2: "Now, displace the pendulum by a small angle (less than 15 degrees) and release it gently.",
                3: "Time 10 complete oscillations using a stopwatch, then calculate the period."
            },
            "chemistry": {
                1: "Measure exactly 25.0 mL of acid solution using a burette.",
                2: "Add 2-3 drops of phenolphthalein indicator to the acid.",
                3: "Slowly add base solution from the burette until a faint pink color persists."
            },
            "biology": {
                1: "Observe the cell under low magnification first to locate the nucleus.",
                2: "Switch to high magnification to see organelles clearly.",
                3: "Draw and label the cell structure in your notebook."
            }
        }
        
        explanation = explanations.get(experiment, {}).get(step, 
            f"Step {step}: Follow the on-screen instructions carefully.")
        
        return {
            "response": explanation,
            "action": "explain_step",
            "step": step
        }
    
    def provide_hint(self, context: Dict) -> Dict[str, Any]:
        experiment = context.get('current_experiment', 'general')
        level = context.get('level', 'beginner')
        
        hints = {
            "physics": {
                "pendulum": "Remember: The period depends only on length and gravity, not mass!",
                "circuit": "Voltage is like water pressure in pipes - it pushes the current."
            },
            "chemistry": {
                "titration": "The endpoint is when the color change persists for 30 seconds.",
                "reaction": "Temperature increases molecular motion, speeding up reactions."
            },
            "biology": {
                "cell": "Start with low magnification to locate the nucleus first."
            }
        }
        
        hint = hints.get(experiment, {}).get(level, "Focus on the key variables in this experiment.")
        
        return {
            "response": hint,
            "action": "provide_hint"
        }
    
    def safety_check(self, context: Dict) -> Dict[str, Any]:
        experiment = context.get('current_experiment', 'general')
        
        safety_guidelines = {
            "physics": [
                "Handle equipment carefully to avoid breakage",
                "Ensure pendulum bob is securely attached",
                "Work in a clear area to avoid obstacles"
            ],
            "chemistry": [
                "Wear safety goggles when handling chemicals",
                "Report any spills immediately",
                "Never taste or smell chemicals directly"
            ],
            "biology": [
                "Handle microscope with care",
                "Use proper staining techniques",
                "Clean slides after use"
            ]
        }
        
        guidelines = safety_guidelines.get(experiment, ["Follow all safety protocols"])
        
        return {
            "response": "Safety Guidelines for your experiment:",
            "guidelines": guidelines,
            "action": "safety_check"
        }
    
    def calculate_value(self, context: Dict) -> Dict[str, Any]:
        """Perform calculations based on experiment context"""
        experiment = context.get('current_experiment', 'general')
        parameters = context.get('parameters', {})
        
        if experiment == 'pendulum':
            g = 9.81
            L = parameters.get('length', 1.0)
            period = 2 * 3.14159 * (L / g) ** 0.5
            return {
                "response": f"The period of oscillation is {period:.2f} seconds",
                "calculation": {
                    "formula": "T = 2π√(L/g)",
                    "values": {"L": L, "g": g, "T": period}
                }
            }
        
        return {"response": "Calculation feature requires specific parameters"}
    
    def provide_help(self, context: Dict) -> Dict[str, Any]:
        return {
            "response": "I can help you with:\n" +
                       "• Start/stop experiments\n" +
                       "• Explain steps\n" +
                       "• Provide hints\n" +
                       "• Calculate values\n" +
                       "• Check safety\n" +
                       "• Show your progress\n" +
                       "Just ask me anything about your experiment!",
            "available_commands": list(self.available_commands.keys())
        }
    
    def show_progress(self, context: Dict) -> Dict[str, Any]:
        return {
            "response": "Here's your progress summary",
            "progress": {
                "experiments_completed": context.get('completed_experiments', 0),
                "current_level": context.get('level', 1),
                "total_score": context.get('total_score', 0)
            }
        }
    
    def get_experiment_steps(self, experiment: str) -> List[str]:
        steps = {
            "physics": ["Setup equipment", "Measure parameters", "Record data", "Analyze results"],
            "chemistry": ["Prepare solutions", "Set up apparatus", "Perform reaction", "Observe results"],
            "biology": ["Prepare slide", "Focus microscope", "Observe cells", "Draw conclusions"]
        }
        return steps.get(experiment, ["Step 1", "Step 2", "Step 3", "Step 4"])
    
    def handle_natural_language(self, message: str, context: Dict) -> Dict[str, Any]:
        """Handle natural language questions"""
        
        # Simple keyword-based responses for demo
        if "how" in message and "work" in message:
            return {
                "response": "This experiment demonstrates fundamental scientific principles. Would you like me to explain the theory behind it?",
                "suggestions": ["Explain the theory", "Show me the steps", "What are the variables?"]
            }
        
        return {
            "response": "I'm here to help you learn! You can ask me about experiment steps, safety, calculations, or general science concepts.",
            "suggestions": ["Explain the current step", "Give me a hint", "Calculate this value", "Safety tips"]
        }