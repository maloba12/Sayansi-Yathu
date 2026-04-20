import json
import os
import numpy as np
from typing import List, Dict

class LabAssistant:
    def __init__(self):
        self.concepts = []
        self.model = None
        self.concept_embeddings = None
        self._load_concepts()

    def _load_concepts(self):
        """Load scientific concepts from data file"""
        try:
            path = os.path.join(os.path.dirname(__file__), 'data/concepts.json')
            if os.path.exists(path):
                with open(path, 'r') as f:
                    self.concepts = json.load(f)
        except Exception as e:
            print(f"Error loading concepts: {e}")

    def _initialize_model(self):
        """Lazy load sentence-transformers model"""
        if self.model is None:
            try:
                from sentence_transformers import SentenceTransformer
                # Using a lightweight, fast model suitable for local inference
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                # Pre-calculate embeddings for concepts
                texts = [f"{c['concept']} {c['description']}" for c in self.concepts]
                if texts:
                    self.concept_embeddings = self.model.encode(texts)
            except Exception as e:
                print(f"Error initializing semantic model: {e}")

    def search(self, query: str) -> List[Dict]:
        """Perform semantic search for a user query"""
        self._initialize_model()
        
        if not self.model or not self.concepts:
            # Fallback to simple keyword search
            results = []
            q = query.lower()
            for c in self.concepts:
                if q in c['concept'].lower() or q in c['description'].lower():
                    results.append(c)
            return results[:3]

        # Semantic matching
        query_embedding = self.model.encode([query])
        
        # Calculate cosine similarity
        from sklearn.metrics.pairwise import cosine_similarity
        similarities = cosine_similarity(query_embedding, self.concept_embeddings)[0]
        
        # Get top 3 matches above a threshold
        top_indices = np.argsort(similarities)[::-1]
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.4:  # Similarity threshold
                results.append({
                    **self.concepts[idx],
                    "similarity": float(similarities[idx])
                })
        
        return results[:3]

    def get_answer(self, query: str) -> str:
        """Get a natural language answer based on semantic search results"""
        matches = self.search(query)
        if not matches:
            return "I'm not sure about that concept yet. Try asking about Pendulums, Ohm's Law, or Titration!"

        best = matches[0]
        return f"Regarding {best['concept']}: {best['description']} \n\nTip: {best['help']}"