# backend-python/ai/lab_assistant.py
class LabAssistant:
    def __init__(self):
        self.commands = {
            "start": self.start_experiment,
            "pause": self.pause_experiment,
            "explain": self.explain_step,
            "hint": self.provide_hint,
            "safety": self.safety_check
        }

    def process_command(self, text, context):
        command = self.extract_command(text)
        return self.commands.get(command, self.default_response)(context)