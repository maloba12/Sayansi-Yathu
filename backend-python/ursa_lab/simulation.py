import numpy as np
from ursina import *

class SimulationLogic:
    def __init__(self, experiment_type):
        self.experiment_type = experiment_type
        self.entities = {}
        self.running = False
        self.time = 0
        
    def setup_experiment(self, scene_manager):
        if self.experiment_type == "pendulum":
            self.setup_pendulum(scene_manager)
        elif self.experiment_type == "chemistry_mix":
            self.setup_chemistry(scene_manager)
        elif self.experiment_type == "circuit":
            self.setup_circuit(scene_manager)
        elif self.experiment_type == "titration":
            self.setup_titration(scene_manager)
        elif self.experiment_type == "reaction":
            self.setup_chemical_reaction(scene_manager)
        elif self.experiment_type == "cell":
            self.setup_cell(scene_manager)
        elif self.experiment_type == "dna":
            self.setup_dna(scene_manager)
        elif self.experiment_type == "melting_boiling":
            self.setup_melting_boiling(scene_manager)
        elif self.experiment_type == "diffusion":
            self.setup_diffusion(scene_manager)
        elif self.experiment_type == "filtration":
            self.setup_filtration(scene_manager)
        elif self.experiment_type == "evaporation":
            self.setup_evaporation(scene_manager)
        elif self.experiment_type == "combustion":
            self.setup_combustion(scene_manager)
        elif self.experiment_type == "co2_test":
            self.setup_co2_test(scene_manager)
        elif self.experiment_type == "solvent":
            self.setup_solvent(scene_manager)
        elif self.experiment_type == "water_filtration":
            self.setup_water_filtration(scene_manager)
        elif self.experiment_type == "litmus":
            self.setup_litmus(scene_manager)
        elif self.experiment_type == "indicators":
            self.setup_indicators(scene_manager)
        elif self.experiment_type == "apparatus_id":
            self.setup_apparatus_id(scene_manager)
        elif self.experiment_type == "safety":
            self.setup_safety(scene_manager)
        elif self.experiment_type == "workflow":
            self.setup_workflow(scene_manager)
        elif self.experiment_type == "length":
            self.setup_length(scene_manager)
        elif self.experiment_type == "mass":
            self.setup_mass(scene_manager)
        elif self.experiment_type == "volume":
            self.setup_volume(scene_manager)
        elif self.experiment_type == "time_meas":
            self.setup_time_meas(scene_manager)
        elif self.experiment_type == "weight":
            self.setup_weight(scene_manager)
        elif self.experiment_type == "density":
            self.setup_density(scene_manager)
        elif self.experiment_type == "precision":
            self.setup_precision(scene_manager)
        elif self.experiment_type == "com":
            self.setup_com(scene_manager)
        elif self.experiment_type == "equilibrium":
            self.setup_equilibrium_types(scene_manager)
        elif self.experiment_type == "linear_motion":
            self.setup_linear_motion(scene_manager)
        elif self.experiment_type == "free_fall":
            self.setup_free_fall(scene_manager)
        elif self.experiment_type == "force_effect":
            self.setup_force_effect(scene_manager)
        elif self.experiment_type == "friction":
            self.setup_friction(scene_manager)
        elif self.experiment_type == "hookes_law":
            self.setup_hookes_law(scene_manager)
        elif self.experiment_type == "circular_motion":
            self.setup_circular_motion(scene_manager)
        elif self.experiment_type == "moments_lever":
            self.setup_moments_lever(scene_manager)
        elif self.experiment_type == "principle_moments":
            self.setup_principle_moments(scene_manager)
        elif self.experiment_type == "solar_system":
            self.setup_solar_system(scene_manager)
        elif self.experiment_type == "earth_structure":
            self.setup_earth_structure(scene_manager)
        elif self.experiment_type == "atmosphere":
            self.setup_atmosphere(scene_manager)
            
    def setup_pendulum(self, scene_manager):
        # Create Pivot
        pivot = Entity(parent=scene_manager, model='sphere', scale=0.2, position=(0, 6, 0), color=color.black)
        # Rod and Bob will be updated in update()
        self.entities['bob'] = Entity(parent=scene_manager, model='sphere', scale=0.5, color=color.red)
        self.entities['rod'] = Entity(parent=scene_manager, model='cube', scale=(0.05, 1, 0.05), color=color.black)
        
        # Initial Physics State
        self.length = 3.0
        self.angle = np.pi / 4 # 45 degrees
        self.angular_velocity = 0
        self.gravity = 9.81
        self.pivot_pos = Vec3(0, 6, 0)
        
        self.update_pendulum_visuals()

    def setup_chemistry(self, scene_manager):
        # Beaker
        self.entities['beaker'] = scene_manager.load_asset('beaker', position=(0, 0, 0))
        self.entities['beaker'].color = color.white.with_alpha(0.5)
        
        # Fluid inside
        self.entities['fluid'] = Entity(parent=self.entities['beaker'], model='cube', scale=(0.8, 0.1, 0.8), position=(0, 0.1, 0), color=color.cyan)
        
        self.reaction_progress = 0

    def setup_circuit(self, scene_manager):
        # Battery
        self.entities['battery'] = Entity(parent=scene_manager, model='cube', scale=(0.5, 1, 0.2), position=(-2, 2.5, 0), color=color.red)
        
        # Resistor
        self.entities['resistor'] = Entity(parent=scene_manager, model='cylinder', scale=(0.2, 0.5, 0.2), position=(2, 2.5, 0), color=color.orange)
        
        # Wires (simplified as thin cubes)
        self.entities['wire1'] = Entity(parent=scene_manager, model='cube', scale=(2, 0.05, 0.05), position=(0, 3, 0), color=color.black)
        self.entities['wire2'] = Entity(parent=scene_manager, model='cube', scale=(2, 0.05, 0.05), position=(0, 2, 0), color=color.black)
        
        # Circuit state
        self.voltage = 5.0  # Volts
        self.resistance = 10.0  # Ohms
        self.current = self.voltage / self.resistance  # Amperes (Ohm's Law)

    def setup_titration(self, scene_manager):
        # Beaker (Conical Flask)
        self.entities['beaker'] = scene_manager.load_asset('flask', position=(0, 0, 0))
        self.entities['beaker'].color = color.white.with_alpha(0.3)
        
        # Burette (Stand + Tube)
        self.entities['burette_stand'] = Entity(parent=scene_manager, model='cube', scale=(0.1, 8, 0.1), position=(-1, 4, 0), color=color.gray)
        self.entities['burette'] = Entity(parent=scene_manager, model='cylinder', scale=(0.1, 4, 0.1), position=(0, 5, 0), color=color.white.with_alpha(0.5))
        
        # Fluid in Flask (Initially Base + Indicator)
        self.entities['fluid'] = Entity(parent=self.entities['beaker'], model='cube', scale=(2, 0.5, 2), position=(0, 0.25, 0), color=color.magenta)
        
        self.titration_progress = 0

    def setup_chemical_reaction(self, scene_manager):
        # Two Beakers
        self.entities['beaker1'] = scene_manager.load_asset('beaker', position=(-1, 0, 0))
        self.entities['beaker2'] = scene_manager.load_asset('beaker', position=(1, 0, 0))
        
        # Reactants
        self.entities['reactant1'] = Entity(parent=self.entities['beaker1'], model='cube', scale=(0.8, 0.5, 0.8), position=(0, 0.3, 0), color=color.blue)
        self.entities['reactant2'] = Entity(parent=self.entities['beaker2'], model='cube', scale=(0.8, 0.5, 0.8), position=(0, 0.3, 0), color=color.yellow)
        
        self.reaction_time = 0
        self.mixed = False

    def setup_cell(self, scene_manager):
        # Cell Membrane
        self.entities['membrane'] = Entity(parent=scene_manager, model='sphere', scale=5, position=(0, 4.5, 0), color=color.azure.with_alpha(0.2))
        
        # Nucleus
        self.entities['nucleus'] = Entity(parent=self.entities['membrane'], model='sphere', scale=0.4, position=(0, 0, 0), color=color.magenta)
        
        # Mitochondria
        for i in range(3):
            self.entities[f'mitochondrion_{i}'] = Entity(parent=self.entities['membrane'], model='sphere', scale=0.15, position=(np.random.uniform(-0.4, 0.4), np.random.uniform(-0.4, 0.4), np.random.uniform(-0.4, 0.4)), color=color.orange)

    def setup_dna(self, scene_manager):
        # DNA Double Helix center
        helix_center = Entity(parent=scene_manager, position=(0, 4.5, 0))
        self.entities['helix_center'] = helix_center
        
        self.dna_segments = []
        for i in range(20):
            y = i * 0.4 - 4
            angle = i * 0.5
            
            # Strand 1
            s1 = Entity(parent=helix_center, model='sphere', scale=0.2, position=(np.cos(angle), y, np.sin(angle)), color=color.blue)
            # Strand 2
            s2 = Entity(parent=helix_center, model='sphere', scale=0.2, position=(np.cos(angle + np.pi), y, np.sin(angle + np.pi)), color=color.red)
            # Link
            link = Entity(parent=helix_center, model='cube', scale=(2, 0.05, 0.05), position=(0, y, 0), color=color.white)
            link.rotation_y = -np.degrees(angle)
            
            self.dna_segments.extend([s1, s2, link])
        
        self.dna_rotation_speed = 30

    def setup_melting_boiling(self, scene_manager):
        # Beaker on Tripod
        self.entities['beaker'] = scene_manager.load_asset('beaker', position=(0, 0, 0))
        self.entities['tripod'] = Entity(parent=scene_manager, model='cube', scale=(2, 2, 2), position=(0, 1, 0), color=color.gray)
        self.entities['burner'] = Entity(parent=scene_manager, model='cylinder', scale=(0.5, 1, 0.5), position=(0, 0.5, 0), color=color.blue)
        
        # Ice/Water
        self.entities['content'] = Entity(parent=self.entities['beaker'], model='cube', scale=(0.8, 0.4, 0.8), position=(0, 0.2, 0), color=color.white)
        self.temp = 0
        self.state = 'solid'

    def setup_diffusion(self, scene_manager):
        # Beaker of water
        self.entities['beaker'] = scene_manager.load_asset('beaker', position=(0, 0, 0))
        self.entities['water'] = Entity(parent=self.entities['beaker'], model='cube', scale=(0.9, 0.8, 0.9), position=(0, 0.4, 0), color=color.azure.with_alpha(0.3))
        
        # Crystal
        self.entities['crystal'] = Entity(parent=self.entities['beaker'], model='sphere', scale=0.1, position=(0, 0.1, 0), color=color.purple)
        self.diffusion_progress = 0

    def setup_filtration(self, scene_manager):
        # Beaker below
        self.entities['beaker_bottom'] = scene_manager.load_asset('beaker', position=(0, 0, 0))
        # Funnel above
        self.entities['funnel'] = Entity(parent=scene_manager, model='cone', scale=(1.5, 1.5, 1.5), position=(0, 3.5, 0), color=color.white.with_alpha(0.5))
        self.entities['funnel'].rotation_x = 180
        
        # Filter Paper
        self.entities['filter'] = Entity(parent=self.entities['funnel'], model='cone', scale=(0.95, 0.95, 0.95), position=(0, 0, 0), color=color.white)

    def setup_evaporation(self, scene_manager):
        # Evaporating dish on tripod
        self.entities['dish'] = Entity(parent=scene_manager, model='sphere', scale=(2, 0.5, 2), position=(0, 2.5, 0), color=color.white)
        self.entities['tripod'] = Entity(parent=scene_manager, model='cube', scale=(2, 2, 2), position=(0, 1, 0), color=color.gray)
        
        # Salt solution
        self.entities['solution'] = Entity(parent=self.entities['dish'], model='cube', scale=(0.8, 0.1, 0.8), position=(0, 0.05, 0), color=color.azure.with_alpha(0.5))
        self.evap_progress = 0

    def setup_combustion(self, scene_manager):
        # Candle on table
        self.entities['candle'] = Entity(parent=scene_manager, model='cylinder', scale=(0.5, 2, 0.5), position=(0, 3, 0), color=color.white)
        self.entities['flame'] = Entity(parent=self.entities['candle'], model='sphere', scale=0.3, position=(0, 0.6, 0), color=color.orange)
        # Glass jar (hidden initially)
        self.entities['jar'] = Entity(parent=scene_manager, model='cylinder', scale=(2, 4, 2), position=(0, 10, 0), color=color.white.with_alpha(0.2))
        self.jar_lowered = False

    def setup_co2_test(self, scene_manager):
        # Test tube with limewater
        self.entities['test_tube'] = scene_manager.load_asset('test_tube', position=(0, 0, 0))
        self.entities['limewater'] = Entity(parent=self.entities['test_tube'], model='cube', scale=(0.4, 3, 0.4), position=(0, 1.5, 0), color=color.white.with_alpha(0.1))
        self.co2_progress = 0

    def setup_solvent(self, scene_manager):
        # Beaker of water
        self.entities['beaker'] = scene_manager.load_asset('beaker', position=(0, 0, 0))
        self.entities['water'] = Entity(parent=self.entities['beaker'], model='cube', scale=(0.9, 0.8, 0.9), position=(0, 0.4, 0), color=color.azure.with_alpha(0.3))
        # Salt/Sugar particles
        self.particles = []
        for i in range(10):
            p = Entity(parent=self.entities['water'], model='cube', scale=0.05, position=(np.random.uniform(-0.4, 0.4), 0.4, np.random.uniform(-0.4, 0.4)), color=color.white)
            self.particles.append(p)
        self.dissolve_progress = 0

    def setup_water_filtration(self, scene_manager):
        # Large container
        self.entities['container'] = Entity(parent=scene_manager, model='cylinder', scale=(2, 6, 2), position=(0, 5, 0), color=color.white.with_alpha(0.3))
        # Layers (Charcoal, Gravel, Sand)
        self.entities['charcoal'] = Entity(parent=self.entities['container'], model='cube', scale=(0.9, 0.1, 0.9), position=(0, -0.3, 0), color=color.black)
        self.entities['gravel'] = Entity(parent=self.entities['container'], model='cube', scale=(0.9, 0.1, 0.9), position=(0, -0.1, 0), color=color.gray)
        self.entities['sand'] = Entity(parent=self.entities['container'], model='cube', scale=(0.9, 0.1, 0.9), position=(0, 0.1, 0), color=color.yellow)
        # Dirty water
        self.entities['dirty_water'] = Entity(parent=self.entities['container'], model='cube', scale=(0.9, 0.2, 0.9), position=(0, 0.3, 0), color=color.brown)
        self.filter_progress = 0

    def setup_litmus(self, scene_manager):
        # Two beakers with solutions
        self.entities['beaker_acid'] = scene_manager.load_asset('beaker', position=(-1, 0, 0))
        self.entities['beaker_base'] = scene_manager.load_asset('beaker', position=(1, 0, 0))
        # Solutions
        self.entities['acid'] = Entity(parent=self.entities['beaker_acid'], model='cube', scale=(0.8, 0.5, 0.8), position=(0, 0.25, 0), color=color.white.with_alpha(0.3))
        self.entities['base'] = Entity(parent=self.entities['beaker_base'], model='cube', scale=(0.8, 0.5, 0.8), position=(0, 0.25, 0), color=color.white.with_alpha(0.3))
        # Litmus papers
        self.entities['litmus_blue'] = Entity(parent=scene_manager, model='cube', scale=(0.2, 1, 0.01), position=(-0.5, 4, 0), color=color.blue)
        self.entities['litmus_red'] = Entity(parent=scene_manager, model='cube', scale=(0.2, 1, 0.01), position=(0.5, 4, 0), color=color.red)

    def setup_indicators(self, scene_manager):
        # Beaker of cabbage indicator
        self.entities['beaker'] = scene_manager.load_asset('beaker', position=(0, 0, 0))
        self.entities['indicator'] = Entity(parent=self.entities['beaker'], model='cube', scale=(0.8, 0.5, 0.8), position=(0, 0.25, 0), color=color.purple)

    def setup_apparatus_id(self, scene_manager):
        # Array of apparatus on the table
        self.entities['beaker'] = scene_manager.load_asset('beaker', position=(-3, 0, 0))
        self.entities['flask'] = scene_manager.load_asset('flask', position=(-1, 0, 0))
        self.entities['test_tube'] = scene_manager.load_asset('test_tube', position=(1, 0, 0))
        # Add labels in next step or via instructions

    def setup_safety(self, scene_manager):
        # Fire extinguisher, goggles, bin
        self.entities['extinguisher'] = Entity(parent=scene_manager, model='cylinder', scale=(0.3, 0.8, 0.3), position=(-2, 2.5, 0), color=color.red)
        self.entities['goggles'] = Entity(parent=scene_manager, model='cube', scale=(0.5, 0.3, 0.2), position=(0, 2.3, 0), color=color.azure)
        self.entities['bin'] = Entity(parent=scene_manager, model='cube', scale=(1, 1, 1), position=(2, 0.5, 0), color=color.dark_gray)
        self.safety_score = 100

    def setup_workflow(self, scene_manager):
        # Notebook and steps
        self.entities['notebook'] = Entity(parent=scene_manager, model='cube', scale=(1.5, 0.1, 2), position=(0, 2, 0), color=color.white)
        self.workflow_step = 0

    def setup_length(self, scene_manager):
        # Meter rule and calipers
        self.entities['rule'] = Entity(parent=scene_manager, model='cube', scale=(10, 0.1, 0.5), position=(0, 2, 1), color=color.yellow)
        self.entities['caliper_main'] = Entity(parent=scene_manager, model='cube', scale=(5, 0.5, 0.1), position=(0, 2.2, 0), color=color.gray)
        self.entities['caliper_jaw'] = Entity(parent=self.entities['caliper_main'], model='cube', scale=(0.1, 1, 1), position=(-2.5, 0, 0), color=color.light_gray)
        self.measurement_val = 0

    def setup_mass(self, scene_manager):
        # Electronic balance
        self.entities['balance'] = Entity(parent=scene_manager, model='cube', scale=(2, 0.5, 2), position=(0, 2.25, 0), color=color.white)
        self.entities['plate'] = Entity(parent=self.entities['balance'], model='cylinder', scale=(1.8, 0.1, 1.8), position=(0, 0.3, 0), color=color.light_gray)
        self.entities['object'] = Entity(parent=scene_manager, model='sphere', scale=0.5, position=(0, 3, 0), color=color.orange)
        self.mass_val = 500 # grams

    def setup_volume(self, scene_manager):
        # Cylinder and overflow can
        self.entities['cylinder'] = Entity(parent=scene_manager, model='cylinder', scale=(1, 5, 1), position=(-2, 4.5, 0), color=color.azure.with_alpha(0.3))
        self.entities['water'] = Entity(parent=self.entities['cylinder'], model='cube', scale=(0.9, 0.4, 0.9), position=(0, -0.1, 0), color=color.blue.with_alpha(0.5))
        self.entities['stone'] = Entity(parent=scene_manager, model='sphere', scale=0.3, position=(-2, 8, 0), color=color.gray, collider='sphere')
        self.volume_val = 0

    def setup_time_meas(self, scene_manager):
        # Digital and analog clock
        self.entities['clock_face'] = Entity(parent=scene_manager, model='cylinder', scale=(2, 0.1, 2), position=(0, 4, 0), rotation_x=90, color=color.white)
        self.entities['hand'] = Entity(parent=self.entities['clock_face'], model='cube', scale=(0.05, 0.8, 0.05), position=(0, 0.1, 0), color=color.red)
        self.counting = False
        self.elapsed = 0

    def setup_weight(self, scene_manager):
        # Spring balance
        self.entities['stand'] = Entity(parent=scene_manager, model='cube', scale=(0.1, 8, 0.1), position=(-2, 4, 0), color=color.gray)
        self.entities['arm'] = Entity(parent=self.entities['stand'], model='cube', scale=(2, 0.1, 0.1), position=(1, 4, 0), color=color.gray)
        self.entities['spring'] = Entity(parent=self.entities['arm'], model='cylinder', scale=(0.2, 2, 0.2), position=(1, -1, 0), color=color.orange)
        self.entities['hook'] = Entity(parent=self.entities['spring'], model='sphere', scale=0.1, position=(0, -0.6, 0), color=color.black)
        self.gravity = 9.81

    def setup_density(self, scene_manager):
        # Scale and cylinder
        self.setup_mass(scene_manager)
        self.setup_volume(scene_manager)

    def setup_precision(self, scene_manager):
        # Targets and marks
        self.entities['target'] = Entity(parent=scene_manager, model='cylinder', scale=(3, 0.1, 3), position=(0, 5, 0), rotation_x=90, color=color.white)
        self.shots = []

    def setup_com(self, scene_manager):
        # Center of Mass cutout
        self.entities['cutout'] = Entity(parent=scene_manager, model='cube', scale=(2, 2, 0.1), position=(0, 4, 0), color=color.orange)
        self.entities['pivot_pin'] = Entity(parent=scene_manager, model='cylinder', scale=(0.05, 0.2, 0.05), position=(0, 4.8, 0), color=color.black)
        self.com_point = Vec3(0, 0, 0)

    def setup_equilibrium_types(self, scene_manager):
        # Stable, Unstable, Neutral
        self.entities['stable_cone'] = Entity(parent=scene_manager, model='cone', scale=(1, 1.5, 1), position=(-2, 2, 0), color=color.green)
        self.entities['unstable_cone'] = Entity(parent=scene_manager, model='cone', scale=(1, 1.5, 1), position=(0, 2, 0), rotation_x=180, color=color.red)
        self.entities['neutral_sphere'] = Entity(parent=scene_manager, model='sphere', scale=1, position=(2, 2, 0), color=color.blue)

    def setup_linear_motion(self, scene_manager):
        # Track and cart
        self.entities['track'] = Entity(parent=scene_manager, model='cube', scale=(10, 0.1, 1), position=(0, 2, 0), color=color.gray)
        self.entities['cart'] = Entity(parent=scene_manager, model='cube', scale=(0.5, 0.3, 0.5), position=(-4.5, 2.2, 0), color=color.red)
        self.velocity = 0
        self.acceleration = 1.0 # m/s^2

    def setup_free_fall(self, scene_manager):
        # Tower and ball
        self.entities['tower'] = Entity(parent=scene_manager, model='cube', scale=(0.2, 10, 0.2), position=(-2, 5, 0), color=color.gray)
        self.entities['ball'] = Entity(parent=scene_manager, model='sphere', scale=0.3, position=(-2, 10, 0), color=color.white)
        self.falling = False
        self.fall_time = 0

    def setup_force_effect(self, scene_manager):
        # Foam block
        self.entities['foam'] = Entity(parent=scene_manager, model='cube', scale=(2, 2, 2), position=(0, 3, 0), color=color.white)
        self.force_applied = 0

    def setup_friction(self, scene_manager):
        # Surface and block
        self.entities['surface'] = Entity(parent=scene_manager, model='cube', scale=(10, 0.1, 1), position=(0, 2, 0), color=color.gray)
        self.entities['block'] = Entity(parent=scene_manager, model='cube', scale=(0.5, 0.5, 0.5), position=(-4.5, 2.3, 0), color=color.brown)
        self.mu = 0.5 # friction coefficient

    def setup_hookes_law(self, scene_manager):
        # Spring on stand
        self.setup_weight(scene_manager)
        self.k = 10.0 # spring constant

    def setup_circular_motion(self, scene_manager):
        # Whirling bung
        self.entities['bung'] = Entity(parent=scene_manager, model='sphere', scale=0.3, position=(2, 5, 0), color=color.red)
        self.angle_rot = 0
        self.radius = 2.0

    def setup_moments_lever(self, scene_manager):
        # Spanner and bolt
        self.entities['bolt'] = Entity(parent=scene_manager, model='cylinder', scale=(0.5, 0.2, 0.5), position=(0, 3, 0), rotation_x=90, color=color.gray)
        self.entities['spanner'] = Entity(parent=self.entities['bolt'], model='cube', scale=(0.2, 4, 0.1), position=(0, 2, 0), color=color.light_gray)

    def setup_principle_moments(self, scene_manager):
        # Balanced rule
        self.entities['fulcrum'] = Entity(parent=scene_manager, model='cone', scale=(0.5, 1, 0.5), position=(0, 2.5, 0), color=color.gray)
        self.entities['rule'] = Entity(parent=scene_manager, model='cube', scale=(10, 0.1, 0.5), position=(0, 3.05, 0), color=color.yellow)

    def setup_solar_system(self, scene_manager):
        # Sun, Earth, Moon
        self.entities['sun'] = Entity(parent=scene_manager, model='sphere', scale=2, position=(0, 5, 0), color=color.yellow)
        self.entities['sun_light'] = PointLight(parent=self.entities['sun'], position=(0,0,0), color=color.white)
        
        self.entities['earth_pivot'] = Entity(parent=scene_manager, position=(0, 5, 0))
        self.entities['earth'] = Entity(parent=self.entities['earth_pivot'], model='sphere', scale=0.8, position=(5, 0, 0), color=color.blue)
        
        self.entities['moon_pivot'] = Entity(parent=self.entities['earth'], position=(0, 0, 0))
        self.entities['moon'] = Entity(parent=self.entities['moon_pivot'], model='sphere', scale=0.2, position=(1.5, 0, 0), color=color.gray)

    def setup_earth_structure(self, scene_manager):
        # Nested spheres for cross-section
        self.entities['crust'] = Entity(parent=scene_manager, model='sphere', scale=5, position=(0, 5, 0), color=color.brown.with_alpha(0.5))
        self.entities['mantle'] = Entity(parent=self.entities['crust'], model='sphere', scale=0.8, color=color.orange)
        self.entities['outer_core'] = Entity(parent=self.entities['mantle'], model='sphere', scale=0.6, color=color.red)
        self.entities['inner_core'] = Entity(parent=self.entities['outer_core'], model='sphere', scale=0.3, color=color.yellow)

    def setup_atmosphere(self, scene_manager):
        # Atmospheric layers
        self.entities['earth_surface'] = Entity(parent=scene_manager, model='sphere', scale=10, position=(0, -6, 0), color=color.green)
        self.entities['balloon'] = Entity(parent=scene_manager, model='sphere', scale=0.5, position=(0, 0, 0), color=color.white)
        self.altitude = 0








    def update(self, dt):
        if not self.running:
            return

        self.time += dt
        
        if self.experiment_type == "pendulum":
            # Physics Calculation (Simple Harmonic Motion approximation for small angles, or full logic)
            # alpha = - (g/L) * sin(theta)
            angular_acceleration = - (self.gravity / self.length) * np.sin(self.angle)
            self.angular_velocity += angular_acceleration * dt
            self.angle += self.angular_velocity * dt
            
            # Dampening
            self.angular_velocity *= 0.999 
            
            self.update_pendulum_visuals()
            
        elif self.experiment_type == "chemistry_mix":
            # Simple color change simulation
            self.reaction_progress += dt * 0.5
            if self.reaction_progress > 1: self.reaction_progress = 1
            
            # Interpolate color from Cyan to Purple
            start_col = Vec3(0, 1, 1) # Cyan
            end_col = Vec3(0.5, 0, 0.5) # Purple
            current = start_col + (end_col - start_col) * self.reaction_progress
            
            self.entities['fluid'].color = color.rgb(current.x, current.y, current.z)
            self.entities['fluid'].scale_y = 0.1 + self.reaction_progress * 1.5 # Expand
            self.entities['fluid'].y = self.entities['fluid'].scale_y / 2

        elif self.experiment_type == "titration":
            # Simulation of adding acid to base
            self.titration_progress += dt * 0.2
            if self.titration_progress > 1: self.titration_progress = 1
            
            # Fluid color changes from Magenta (Base+Phenolphthalein) to Clear (Neutral/Acid)
            current_alpha = 1.0 - self.titration_progress
            self.entities['fluid'].color = color.magenta.with_alpha(max(0.1, current_alpha))
            
            # Level rises slightly
            self.entities['fluid'].scale_y = 0.5 + self.titration_progress * 0.5
            self.entities['fluid'].y = 0.25 + (self.entities['fluid'].scale_y - 0.5) / 2

        elif self.experiment_type == "reaction":
            # Simulation of mixing and reacting
            if not self.mixed:
                # Slowly move beaker 1 towards beaker 2
                self.entities['beaker1'].x += dt * 0.5
                if self.entities['beaker1'].x >= 0:
                    self.entities['beaker1'].x = 0
                    self.mixed = True
            else:
                self.reaction_time += dt
                # Change color from Blue to Green
                progress = min(1, self.reaction_time / 3)
                start_col = Vec3(0, 0, 1) # Blue
                end_col = Vec3(0, 1, 0) # Green
                current = start_col + (end_col - start_col) * progress
                self.entities['reactant1'].color = color.rgb(current.x, current.y, current.z)
                # Hide reactant 2 (poured in)
                self.entities['reactant2'].enabled = False

        elif self.experiment_type == "cell":
            # Subtle animation of organelles
            for i in range(3):
                self.entities[f'mitochondrion_{i}'].rotation_y += dt * 20
                self.entities[f'mitochondrion_{i}'].position += Vec3(np.sin(self.time + i) * 0.001, 0, np.cos(self.time + i) * 0.001)

        elif self.experiment_type == "dna":
            # Rotate helix
            self.entities['helix_center'].rotation_y += dt * self.dna_rotation_speed

        elif self.experiment_type == "melting_boiling":
            self.temp += dt * 5
            if self.state == 'solid' and self.temp > 50:
                self.state = 'liquid'
                self.entities['content'].color = color.azure.with_alpha(0.3)
                self.entities['content'].scale_y = 0.3
            elif self.state == 'liquid' and self.temp > 100:
                # Boiling (Bubbles)
                self.entities['content'].y += np.sin(self.time * 20) * 0.01
            
        elif self.experiment_type == "diffusion":
            self.diffusion_progress += dt * 0.1
            if self.diffusion_progress < 1:
                # Color water
                col = color.azure.with_alpha(0.3).lerp(color.purple.with_alpha(0.5), self.diffusion_progress)
                self.entities['water'].color = col
                # Shrink crystal
                self.entities['crystal'].scale = max(0, 0.1 * (1 - self.diffusion_progress))

        elif self.experiment_type == "filtration":
            # Drop water from funnel to beaker
            pass # Visual logic

        elif self.experiment_type == "evaporation":
            self.evap_progress += dt * 0.1
            if self.evap_progress < 1:
                # Shrink solution
                self.entities['solution'].scale_y = 0.1 * (1 - self.evap_progress)
                self.entities['solution'].y = 0.05 * (1 - self.evap_progress)

        elif self.experiment_type == "combustion":
            if self.time > 5 and not self.jar_lowered:
                self.entities['jar'].y = 4.5
                self.jar_lowered = True
            
            if self.jar_lowered:
                # Extinguish flame
                self.entities['flame'].scale *= (1 - dt * 0.5)
                if self.entities['flame'].scale_x < 0.01:
                    self.entities['flame'].enabled = False

        elif self.experiment_type == "co2_test":
            self.co2_progress += dt * 0.1
            if self.co2_progress < 1:
                # Limewater turns milky (White with increasing opacity)
                self.entities['limewater'].color = color.white.with_alpha(0.1 + self.co2_progress * 0.8)

        elif self.experiment_type == "solvent":
            self.dissolve_progress += dt * 0.2
            for i, p in enumerate(self.particles):
                if self.dissolve_progress > (i / 10):
                    p.enabled = False
            if self.dissolve_progress > 1:
                self.entities['water'].color = color.white.with_alpha(0.5)

        elif self.experiment_type == "litmus":
            # Dip litmus red into base, dip litmus blue into acid
            if self.time > 3:
                # Dip litmus
                self.entities['litmus_blue'].y = 2.5
                self.entities['litmus_red'].y = 2.5
            if self.time > 6:
                # Change colors
                self.entities['litmus_blue'].color = color.red
                self.entities['litmus_red'].color = color.blue

        elif self.experiment_type == "indicators":
            self.reaction_progress += dt * 0.2
            if self.reaction_progress < 1:
                # Change cabbage color based on "simulated" acid addition
                self.entities['indicator'].color = color.purple.lerp(color.pink, self.reaction_progress)

        elif self.experiment_type == "length":
            # Animate caliper jaw
            self.entities['caliper_jaw'].x = -2.5 + (np.sin(self.time) + 1) * 2.5

        elif self.experiment_type == "mass":
            # Drop object onto plate
            if self.entities['object'].y > 2.7:
                self.entities['object'].y -= dt * 5
            else:
                self.entities['object'].y = 2.7 # Settled

        elif self.experiment_type == "volume":
            # Stone falling into water
            if self.entities['stone'].y > 4.5:
                self.entities['stone'].y -= dt * 2
            else:
                # Water rises
                if self.entities['water'].scale_y < 0.6:
                    self.entities['water'].scale_y += dt * 0.1
                    self.entities['water'].y += dt * 0.05

        elif self.experiment_type == "time_meas":
            if self.counting:
                self.elapsed += dt
                self.entities['hand'].rotation_z = -self.elapsed * 6 # 360 deg per minute

        elif self.experiment_type == "weight":
            # Oscillate spring under gravity
            extension = (self.gravity / 10.0) * 0.5
            self.entities['spring'].scale_y = 2 + extension
            self.entities['spring'].y = -1 - (extension / 2)

        elif self.experiment_type == "com":
            # Rock back and forth until settled
            angle = np.sin(self.time * 2) * 5 * max(0, 1 - self.time/5)
            self.entities['cutout'].rotation_z = angle

        elif self.experiment_type == "linear_motion":
            if self.entities['cart'].x < 4.5:
                self.velocity += self.acceleration * dt
                self.entities['cart'].x += self.velocity * dt
            else:
                self.entities['cart'].x = -4.5 # Reset
                self.velocity = 0

        elif self.experiment_type == "free_fall":
            if self.falling:
                self.fall_time += dt
                # s = 0.5 g t^2
                dist = 0.5 * self.gravity * self.fall_time**2
                self.entities['ball'].y = 10 - dist
                if self.entities['ball'].y < 2:
                    self.entities['ball'].y = 2
                    self.falling = False

        elif self.experiment_type == "force_effect":
            # Squash foam
            self.force_applied = np.sin(self.time) * 1.5
            val = max(0.5, 2 - self.force_applied)
            self.entities['foam'].scale_y = val

        elif self.experiment_type == "friction":
            # Constant speed pull
            if self.entities['block'].x < 4.5:
                self.entities['block'].x += dt * 2
            else:
                self.entities['block'].x = -4.5

        elif self.experiment_type == "circular_motion":
            self.angle_rot += dt * 5
            self.entities['bung'].x = np.cos(self.angle_rot) * self.radius
            self.entities['bung'].z = np.sin(self.angle_rot) * self.radius

        elif self.experiment_type == "moments_lever":
            # Rotate spanner
            self.entities['bolt'].rotation_z += dt * 30

        elif self.experiment_type == "principle_moments":
            # Oscillate slightly
            self.entities['rule'].rotation_z = np.sin(self.time) * 2

        elif self.experiment_type == "solar_system":
            self.entities['earth_pivot'].rotation_y += dt * 10
            self.entities['moon_pivot'].rotation_y += dt * 50

        elif self.experiment_type == "earth_structure":
            # Pulse layers
            s = 1 + np.sin(self.time) * 0.05
            self.entities['inner_core'].scale = 0.3 * s

        elif self.experiment_type == "atmosphere":
            # Balloon rises
            if self.altitude < 10:
                self.altitude += dt * 0.5
                self.entities['balloon'].y = self.altitude







    def update_pendulum_visuals(self):
        # Polar to Cartesian
        x = self.length * np.sin(self.angle)
        y = -self.length * np.cos(self.angle)
        
        bob_pos = self.pivot_pos + Vec3(x, y, 0)
        self.entities['bob'].position = bob_pos
        
        # Update Rod
        rod_vec = bob_pos - self.pivot_pos
        rod_len = rod_vec.length()
        self.entities['rod'].scale_y = rod_len
        self.entities['rod'].position = self.pivot_pos + rod_vec / 2
        self.entities['rod'].look_at(bob_pos)
        self.entities['rod'].rotation_x += 90 # Adjust for cylinder default orientation if needed
