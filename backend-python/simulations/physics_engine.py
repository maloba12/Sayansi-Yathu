import numpy as np
import math

class PhysicsEngine:
    def simulate(self, experiment_type, parameters):
        if experiment_type == 'pendulum':
            return self.simulate_pendulum(parameters)
        elif experiment_type == 'circuit':
            return self.simulate_circuit(parameters)
        elif experiment_type == 'optics':
            return self.simulate_optics(parameters)
        else:
            return {"error": "Unknown experiment type"}

    def simulate_pendulum(self, params):
        g = 9.81  # gravity
        L = params.get('length', 1.0)
        theta_0 = params.get('angle', 30) * math.pi / 180
        t = np.linspace(0, 10, 1000)
        
        omega = math.sqrt(g / L)
        theta = theta_0 * np.cos(omega * t)
        
        x = L * np.sin(theta)
        y = -L * np.cos(theta)
        
        return {
            "time": t.tolist(),
            "angle": theta.tolist(),
            "position": {"x": x.tolist(), "y": y.tolist()},
            "period": 2 * math.pi * math.sqrt(L / g)
        }

    def simulate_circuit(self, params):
        V = params.get('voltage', 12)
        R = params.get('resistance', 10)
        I = V / R
        
        return {
            "voltage": V,
            "current": I,
            "resistance": R,
            "power": V * I
        }

    def simulate_optics(self, params):
        # Implement lens/mirror equations
        focal_length = params.get('focal_length', 10)
        object_distance = params.get('object_distance', 15)
        
        if object_distance == focal_length:
            return {"error": "Object at focal length"}
        
        image_distance = 1 / (1/focal_length - 1/object_distance)
        magnification = -image_distance / object_distance
        
        return {
            "focal_length": focal_length,
            "object_distance": object_distance,
            "image_distance": image_distance,
            "magnification": magnification
        }