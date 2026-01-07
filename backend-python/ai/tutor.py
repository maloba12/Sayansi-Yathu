import openai
import os
from typing import Dict, List

class AITutor:
    def __init__(self):
        # Initialize with local model or OpenAI API
        self.context_memory = {}
    
    def get_response(self, question: str, context: Dict) -> str:
        """Provide intelligent tutoring response"""
        
        # Context-based response generation
        subject = context.get('subject', 'general')
        level = context.get('level', 'secondary')
        
        # Try OpenAI API if key is available
        api_key = os.getenv('OPENAI_API_KEY')
        
        if api_key:
            try:
                # Initialize client (handling different versions if needed, assume v1.0+)
                client = openai.OpenAI(api_key=api_key)
                
                system_prompt = (
                    "You are 'Sayansi Yathu', an intelligent virtual science tutor for Zambian secondary school students. "
                    "Your goal is to explain complex physics, chemistry, and biology concepts in simple, relatable terms. "
                    "Use local Zambian examples where possible. Be encouraging and patient."
                )
                
                user_content = f"Subject: {subject}, Level: {level}. Question: {question}"
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    max_tokens=150,
                    temperature=0.7
                )
                
                return response.choices[0].message.content.strip()
                
            except Exception as e:
                print(f"OpenAI API Error (falling back to offline mode): {e}")
                # Fall through to offline mode
        
        # OFF-LINE MODE / FALLBACK
        # Simple rule-based responses for demo
        responses = {
            'physics': {
                'pendulum': "The period of a pendulum depends on its length and gravity. Use T = 2π√(L/g). Try changing the length in the simulation!",
                'circuit': "Ohm's Law states V = IR. If you increase resistance while keeping voltage constant, current decreases."
            },
            'chemistry': {
                'titration': "In a titration, the equivalence point is where the amount of acid equals the amount of base. The indicator changes color to signal this.",
                'reaction': "Reaction rates are affected by temperature, concentration, and surface area. Heating particles makes them move faster and collide more often."
            },
            'biology': {
                'cell': "Cells are the building blocks of life. The Nucleus controls the cell, like a brain. Mitochondria are the powerhouses.",
                'dna': "DNA carries genetic instructions. During replication, the helix unwinds and new complementary strands are built."
            }
        }
        
        # Find relevant response
        for key in responses.get(subject, {}):
            if key in question.lower():
                return responses[subject][key]
        
        # Default response
        return "I am currently in offline mode. Please connect to the internet or ask about specific topics like 'pendulum', 'titration', or 'cell'."

    def analyze_progress(self, user_data: Dict) -> Dict:
        """Analyze student progress and provide recommendations"""
        
        recommendations = {
            'strengths': [],
            'improvements': [],
            'next_steps': []
        }
        
        # Simple analysis logic
        if user_data.get('physics_score', 0) > 80:
            recommendations['strengths'].append("Physics concepts")
        else:
            recommendations['improvements'].append("Focus on physics fundamentals")
        
        if user_data.get('experiments_completed', 0) < 5:
            recommendations['next_steps'].append("Complete more experiments")
        
        return recommendations