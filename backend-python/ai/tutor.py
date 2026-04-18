import openai
import os
from typing import Dict, List

# ---------------------------------------------------------------------------
# Session-based conversation memory (REC-02)
# Key: session_id (str)  Value: list of OpenAI message dicts (max 10 pairs)
# ---------------------------------------------------------------------------
_session_memory: Dict[str, List[Dict]] = {}

SYSTEM_PROMPT = (
    "You are 'Sayansi Yathu', an intelligent virtual science tutor for Zambian "
    "secondary school students (Form 1–4). "
    "Your goal is to explain Physics, Chemistry, and Biology concepts in simple, "
    "relatable terms aligned with the ECZ and CBC curriculum. "
    "Use local Zambian examples where possible (e.g. copper mining in Copperbelt, "
    "Zambezi River, maize farming). Be encouraging, patient, and concise."
)

MAX_HISTORY = 10  # maximum number of user+assistant message pairs to retain


class AITutor:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')

    # ------------------------------------------------------------------
    # Public: get a tutoring response (with optional session memory)
    # ------------------------------------------------------------------
    def get_response(self, question: str, context: Dict,
                     session_id: str = None) -> str:
        """Return a tutoring response, maintaining per-session chat history."""

        subject = context.get('subject', 'general')
        level   = context.get('level', 'secondary')

        if self.api_key:
            try:
                client = openai.OpenAI(api_key=self.api_key)

                # ---- Build the messages list for this API call ----
                # Start with the system prompt (always present)
                messages = [{"role": "system", "content": SYSTEM_PROMPT}]

                # Append rolling history so GPT can follow up
                if session_id:
                    messages += _session_memory.get(session_id, [])

                # Add the current user question with subject context
                user_content = (
                    f"[Subject: {subject} | Level: {level}]\n{question}"
                )
                messages.append({"role": "user", "content": user_content})

                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    max_tokens=300,
                    temperature=0.7
                )

                ai_text = response.choices[0].message.content.strip()

                # ---- Persist this exchange to session memory ----
                if session_id:
                    history = _session_memory.setdefault(session_id, [])
                    history.append({"role": "user",      "content": user_content})
                    history.append({"role": "assistant",  "content": ai_text})
                    # Keep only the last MAX_HISTORY pairs (2 messages per pair)
                    if len(history) > MAX_HISTORY * 2:
                        _session_memory[session_id] = history[-(MAX_HISTORY * 2):]

                return ai_text

            except Exception as e:
                print(f"OpenAI API Error (falling back to offline mode): {e}")

        # ---- OFFLINE / FALLBACK (no API key or API error) ----
        return self._offline_response(question, subject)

    # ------------------------------------------------------------------
    # Clear session memory (e.g. on logout or new experiment)
    # ------------------------------------------------------------------
    def clear_session(self, session_id: str) -> None:
        _session_memory.pop(session_id, None)

    # ------------------------------------------------------------------
    # Analyse student progress (unchanged logic, kept for compatibility)
    # ------------------------------------------------------------------
    def analyze_progress(self, user_data: Dict) -> Dict:
        """Analyse student progress and provide simple recommendations."""
        recommendations = {'strengths': [], 'improvements': [], 'next_steps': []}

        if user_data.get('physics_score', 0) > 80:
            recommendations['strengths'].append("Physics concepts")
        else:
            recommendations['improvements'].append("Focus on physics fundamentals")

        if user_data.get('experiments_completed', 0) < 5:
            recommendations['next_steps'].append("Complete more experiments")

        return recommendations

    # ------------------------------------------------------------------
    # Internal: keyword-based offline fallback
    # ------------------------------------------------------------------
    def _offline_response(self, question: str, subject: str) -> str:
        responses = {
            'physics': {
                'pendulum':   "The period of a pendulum depends on its length and gravity. Use T = 2π√(L/g). Try changing the length in the simulation!",
                'circuit':    "Ohm's Law states V = IR. If you increase resistance while keeping voltage constant, current decreases.",
                'free fall':  "In free fall, an object falls under gravity alone. Distance: h = ½gt². All objects fall at the same rate (g ≈ 9.81 m/s²)!",
                'gravity':    "Gravity pulls objects toward each other. On Earth g ≈ 9.81 m/s².",
                'force':      "Newton's Second Law: F = ma. Force equals mass times acceleration.",
            },
            'chemistry': {
                'titration':  "In a titration, the equivalence point is where acid equals base. The indicator changes colour to signal this.",
                'reaction':   "Reaction rates depend on temperature, concentration, and surface area.",
                'acid':       "Acids have pH < 7. They turn blue litmus red and react with bases to form salt + water.",
                'base':       "Bases have pH > 7. They turn red litmus blue and feel slippery.",
            },
            'biology': {
                'cell':       "Cells are the building blocks of life. The nucleus controls the cell; mitochondria produce energy.",
                'dna':        "DNA carries genetic instructions. During replication the helix unwinds and new strands are built.",
                'osmosis':    "Osmosis is the movement of water from high to low concentration through a semi-permeable membrane.",
            },
        }

        q = question.lower()
        for key, answer in responses.get(subject, {}).items():
            if key in q:
                return answer
        for sub in responses:
            for key, answer in responses[sub].items():
                if key in q:
                    return answer

        return (
            "I am currently in offline mode. Ask about specific topics like "
            "'pendulum', 'titration', 'cell', or any ECZ science topic."
        )

class ECZContentGenerator:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.client = openai.OpenAI(api_key=self.api_key) if self.api_key else None

    def generate(self, content_type: str, topic: str, grade: str) -> str:
        """Generate ECZ-aligned educational content"""
        
        prompts = {
            'exam_questions': f"Generate 5 multiple-choice exam questions about '{topic}' for {grade} level, strictly following the Examinations Council of Zambia (ECZ) format and standards. Include an answer key.",
            'worksheet': f"Create a structured laboratory experiment worksheet for '{topic}' suitable for {grade} students in Zambia. Include Objectives, Materials, Procedure, and Observation questions.",
            'lab_report': f"Provide a sample lab report template and a completed example for a {grade} level experiment on '{topic}'.",
            'explanation': f"Explain the concept of '{topic}' for a {grade} student using local Zambian analogies (e.g. comparing electrical circuits to water flow in a village or market trading)."
        }

        prompt = prompts.get(content_type, f"Explain '{topic}' for {grade} level.")

        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are 'Sayansi AI', a specialist in the Zambian Science Curriculum (ECZ). Your goal is to help teachers generate high-quality, relevant educational materials."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=800,
                    temperature=0.7
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                return f"AI Error: {str(e)}\n\n(Fallback: Please ensure your OPENAI_API_KEY is configured.)"
        
        # Fallback for demo without API key
        return f"""--- DEMO CONTENT: {content_type.upper()} ---
Topic: {topic}
Grade: {grade}

[This is a placeholder response because no OpenAI API key was found.]
1. Define {topic} in the context of the ECZ syllabus.
2. Explain one industrial application of {topic} in Zambia (e.g., mining or agriculture).
3. Draw a labeled diagram illustrating {topic}.

(To see real AI generation, please provide an OpenAI API key in the environment variables.)"""