import os

# Lightweight Dictionary Fallback simulating Lulimi Engine / HF Local inference.
# Ideal for <5MB offline environments where full transformers cannot fit.
LOCAL_TRANSLATIONS = {
    "bemba": {
        "What is your hypothesis?": "Cinshi mwaletontonkanya kuti cilacitika?",
        "Measure the voltage across the resistor": "Pima amavolts pali resistor",
        "Observe the reaction.": "Moneni filya ifintu filealuka.",
        "What is your conclusion?": "Bushe mwasanga finshi pa numa fya kulinga?",
        "Excellent!": "Cisuma sana!",
        "Try again": "Eshani na kabili."
    },
    "nyanja": {
        "What is your hypothesis?": "Mukuganiza kuti chichitika ndi chiyani?",
        "Measure the voltage across the resistor": "Yezerani magesi (voltage) pa resistor",
        "Observe the reaction.": "Onetsetsani zomwe zikuchitika.",
        "What is your conclusion?": "Mwamaliza bwanji kapena mwapeza chiyani?",
        "Excellent!": "Zabwino kwambiri!",
        "Try again": "Yeseraninso."
    },
    "tonga": {
        "What is your hypothesis?": "Muyeeya kuti ncinzi citi cicitike?",
        "Measure the voltage across the resistor": "Pima magesi aali mu resistor",
        "Observe the reaction.": "Langa cintu cicitika.",
        "What is your conclusion?": "Mwa ciyana buti ku mamanino?",
        "Excellent!": "Cibotu kapati!",
        "Try again": "Sola alimwi."
    }
}

class MultilingualEngine:
    def __init__(self):
        self.engine_name = "Lulimi-Engine-Mock"

    def translate(self, text, target_lang):
        target_lang = target_lang.lower()
        if target_lang == "english" or target_lang not in LOCAL_TRANSLATIONS:
            return text  # Fallback to English
        
        # Exact match dictionary
        if text in LOCAL_TRANSLATIONS[target_lang]:
            return LOCAL_TRANSLATIONS[target_lang][text]
            
        # Simulate partial match or Hugging Face fallback by wrapping
        # This occurs if Lulimi dictionary fails and HF runs inference.
        return f"[{target_lang.capitalize()}] {text}"

# Singleton instance
multilingual_engine = MultilingualEngine()
