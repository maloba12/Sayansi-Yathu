import speech_recognition as sr
import pyttsx3

class VoiceAssistant:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)
    
    def listen(self) -> str:
        """Listen to user voice input"""
        with sr.Microphone() as source:
            print("Listening...")
            audio = self.recognizer.listen(source)
            
            try:
                text = self.recognizer.recognize_google(audio)
                return text
            except sr.UnknownValueError:
                return "Could not understand audio"
            except sr.RequestError:
                return "Could not request results"
    
    def speak(self, text: str):
        """Convert text to speech"""
        self.engine.say(text)
        self.engine.runAndWait()
    
    def process_command(self, command: str) -> str:
        """Process voice commands"""
        command = command.lower()
        
        if "start experiment" in command:
            return "Which experiment would you like to start? Physics, chemistry, or biology?"
        elif "help" in command:
            return "I'm here to help! You can ask me about any science concept or experiment."
        elif "explain" in command:
            return "I'll explain the current experiment step by step."
        else:
            return "Let me help you with that science question."