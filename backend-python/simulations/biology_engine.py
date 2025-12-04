import json

class BiologyEngine:
    def simulate(self, experiment_type, parameters):
        if experiment_type == 'cell':
            return self.simulate_cell_structure(parameters)
        elif experiment_type == 'dna':
            return self.simulate_dna_replication(parameters)
        elif experiment_type == 'ecosystem':
            return self.simulate_ecosystem(parameters)
        else:
            return {"error": "Unknown experiment type"}

    def simulate_cell_structure(self, params):
        cell_type = params.get('cell_type', 'animal')
        
        organelles = {
            'animal': [
                {'name': 'nucleus', 'function': 'Contains DNA'},
                {'name': 'mitochondria', 'function': 'Energy production'},
                {'name': 'endoplasmic_reticulum', 'function': 'Protein synthesis'},
                {'name': 'golgi_apparatus', 'function': 'Protein modification'}
            ],
            'plant': [
                {'name': 'nucleus', 'function': 'Contains DNA'},
                {'name': 'chloroplast', 'function': 'Photosynthesis'},
                {'name': 'cell_wall', 'function': 'Structural support'},
                {'name': 'vacuole', 'function': 'Storage'}
            ]
        }
        
        return {
            "cell_type": cell_type,
            "organelles": organelles.get(cell_type, []),
            "size": "10-30 micrometers"
        }

    def simulate_dna_replication(self, params):
        sequence = params.get('sequence', 'ATCG')
        
        # Simulate DNA replication steps
        steps = [
            {"step": 1, "process": "Unwinding", "enzyme": "Helicase"},
            {"step": 2, "process": "Primer addition", "enzyme": "Primase"},
            {"step": 3, "process": "Elongation", "enzyme": "DNA Polymerase"},
            {"step": 4, "process": "Primer removal", "enzyme": "DNA Polymerase I"},
            {"step": 5, "process": "Ligation", "enzyme": "Ligase"}
        ]
        
        complementary_sequence = ''.join({
            'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'
        }[base] for base in sequence)
        
        return {
            "original_sequence": sequence,
            "complementary_sequence": complementary_sequence,
            "steps": steps
        }

    def simulate_ecosystem(self, params):
        species = params.get('species', ['grass', 'rabbit', 'fox'])
        initial_populations = params.get('populations', [1000, 100, 10])
        
        # Simple predator-prey simulation
        time_steps = 50
        populations = {
            species[i]: [initial_populations[i]] for i in range(len(species))
        }
        
        for t in range(1, time_steps):
            # Grass growth
            grass_growth = 0.1 * populations['grass'][-1] * (1 - populations['grass'][-1]/1000)
            populations['grass'].append(populations['grass'][-1] + grass_growth)
            
            # Rabbit dynamics
            rabbit_birth = 0.05 * populations['rabbit'][-1] * (populations['grass'][-1]/1000)
            rabbit_death = 0.02 * populations['rabbit'][-1]
            populations['rabbit'].append(populations['rabbit'][-1] + rabbit_birth - rabbit_death)
            
            # Fox dynamics
            fox_birth = 0.01 * populations['fox'][-1] * (populations['rabbit'][-1]/100)
            fox_death = 0.05 * populations['fox'][-1]
            populations['fox'].append(populations['fox'][-1] + fox_birth - fox_death)
        
        return {
            "time_steps": time_steps,
            "populations": populations,
            "species": species
        }