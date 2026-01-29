from ursina import *

class LabScene(Entity):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.materials = {}
        self.setup_room()
        self.setup_lighting()
        self.setup_table()

    def setup_room(self):
        # Floor
        Entity(model='plane', scale=(20, 1, 20), color=color.gray, texture='white_cube', texture_scale=(20, 20))
        # Walls
        Entity(model='cube', scale=(20, 10, 1), position=(0, 5, 10), color=color.light_gray)
        Entity(model='cube', scale=(20, 10, 1), position=(0, 5, -10), color=color.light_gray)
        Entity(model='cube', scale=(1, 10, 20), position=(10, 5, 0), color=color.light_gray)
        Entity(model='cube', scale=(1, 10, 20), position=(-10, 5, 0), color=color.light_gray)

    def setup_lighting(self):
        # Brighter lights for better object visibility
        self.light = PointLight(parent=self, position=(0, 10, 0), color=color.white)
        self.ambient = AmbientLight(color=color.hsv(0, 0, 0.8))


    def setup_table(self):
        # Lab table
        table_top = Entity(parent=self, model='cube', scale=(8, 0.2, 4), position=(0, 2, 0), color=color.dark_gray, texture='white_cube')
        # Legs
        Entity(parent=self, model='cube', scale=(0.2, 2, 0.2), position=(3.8, 1, 1.8), color=color.black)
        Entity(parent=self, model='cube', scale=(0.2, 2, 0.2), position=(-3.8, 1, 1.8), color=color.black)
        Entity(parent=self, model='cube', scale=(0.2, 2, 0.2), position=(3.8, 1, -1.8), color=color.black)
        Entity(parent=self, model='cube', scale=(0.2, 2, 0.2), position=(-3.8, 1, -1.8), color=color.black)

    def load_asset(self, name, position=(0,0,0)):
        # Try to load generated model, fallback to cube
        base_dir = os.path.dirname(os.path.dirname(__file__))
        model_path = os.path.join(base_dir, 'assets', 'models', f"{name}.stl")
        
        try:
            if not os.path.exists(model_path):
                 raise FileNotFoundError(f"{model_path} not found")
                 
            # Note: Entity(model=...) can take absolute path but sometimes 
            # Ursina prefers relative to project root. We'll try absolute.
            e = Entity(parent=self, model=model_path, position=position, scale=0.5)
            e.y += 2.1 # On top of table
            return e
        except Exception as e:
            print(f"Could not load {name}: {e}. Using placeholder.")
            e = Entity(parent=self, model='cube', position=position, scale=0.5, color=color.blue)
            e.y += 2.25
            return e

