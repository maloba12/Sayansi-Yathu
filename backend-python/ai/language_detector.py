# language_detector.py
import re

class LocalLanguageDetector:
    def __init__(self):
        # Basic offline heuristic dictionary mapping for fast detection
        self.dictionaries = {
            'bemba': set(['shani', 'mulishani', 'bwino', 'mukwai', 'icintu', 'ifyakucita', 'ndeya', 'ebo', 'e', 'iyo', 'kuti', 'cinshi']),
            'nyanja': set(['bwanji', 'muli', 'bwino', 'pangono', 'ziya', 'nchito', 'ife', 'ine', 'kodi', 'chiani', 'ndiri']),
            'tonga': set(['mbuti', 'kabotu', 'ndapota', 'makani', 'sunu', 'mebo', 'pe', 'ayi', 'buti', 'kuli'])
        }
        
    def detect(self, text):
        """
        Tokenizes text and checks word frequencies against local dictionaries.
        Returns 'english' by default if no significant local traits are found.
        """
        words = set(re.findall(r'\b\w+\b', text.lower()))
        
        scores = {lang: 0 for lang in self.dictionaries.keys()}
        
        for lang, vocab in self.dictionaries.items():
            intersection = words.intersection(vocab)
            scores[lang] = len(intersection)
            
        # Get the language with max recognized words
        best_match = max(scores, key=scores.get)
        
        # Threshold: if it matches at least 1 specific local word, classify it
        if scores[best_match] > 0:
            return best_match
            
        return 'english'

# Global Singleton
detector_instance = LocalLanguageDetector()
