from typing import Dict, List
import random

class ChemistryEngine:
    def simulate(self, experiment_type, parameters):
        if experiment_type == 'titration':
            return self.simulate_titration(parameters)
        elif experiment_type == 'reaction':
            return self.simulate_reaction(parameters)
        elif experiment_type == 'molecular':
            return self.simulate_molecular_structure(parameters)
        else:
            return {"error": "Unknown experiment type"}

    def simulate_titration(self, params):
        acid_conc = params.get('acid_concentration', 0.1)
        acid_vol = params.get('acid_volume', 25.0)
        base_conc = params.get('base_concentration', 0.1)
        
        equivalence_point = (acid_conc * acid_vol) / base_conc
        
        # Simulate pH curve
        volumes = []
        pH_values = []
        
        for vol in range(0, int(equivalence_point * 2), 1):
            volumes.append(vol)
            if vol < equivalence_point:
                moles_acid = (acid_conc * acid_vol - base_conc * vol) / 1000
                pH = -math.log10(moles_acid / (acid_vol + vol))
            else:
                moles_base = (base_conc * vol - acid_conc * acid_vol) / 1000
                pOH = -math.log10(moles_base / (acid_vol + vol))
                pH = 14 - pOH
            
            pH_values.append(max(0, min(14, pH)))
        
        return {
            "volumes": volumes,
            "pH_values": pH_values,
            "equivalence_point": equivalence_point
        }

    def simulate_reaction(self, params):
        reactants = params.get('reactants', [])
        temperature = params.get('temperature', 298)
        
        # Simplified reaction simulation
        reaction_rate = 0.1 * (temperature / 298)  # Temperature effect
        
        return {
            "reactants": reactants,
            "temperature": temperature,
            "reaction_rate": reaction_rate,
            "products": [f"{r}_product" for r in reactants]
        }

    def simulate_molecular_structure(self, params):
        molecule = params.get('molecule', 'H2O')
        
        # Simple molecular structure data
        structures = {
            'H2O': {
                'atoms': ['O', 'H', 'H'],
                'bonds': [{'from': 0, 'to': 1}, {'from': 0, 'to': 2}],
                'geometry': 'bent'
            },
            'CO2': {
                'atoms': ['C', 'O', 'O'],
                'bonds': [{'from': 0, 'to': 1}, {'from': 0, 'to': 2}],
                'geometry': 'linear'
            }
        }
        
        return structures.get(molecule, {"error": "Molecule not found"})