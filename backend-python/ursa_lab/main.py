from ursina import *
import sys
import argparse
from lab_scene import LabScene
from simulation import SimulationLogic

def main():
    parser = argparse.ArgumentParser(description='Sayansi Yathu 3D Simulation Engine')
    parser.add_argument('--type', type=str, default='pendulum', help='Experiment type (pendulum, chemistry_mix)')
    args = parser.parse_args()

    app = Ursina(title=f"Sayansi Yathu - {args.type.capitalize()}")

    # Setup Scene
    lab = LabScene()
    
    # Setup Camera
    camera.position = (0, 5, -12)
    camera.look_at((0, 3, 0))
    EditorCamera() # Allow free movement for debug/exploration

    # Setup Simulation
    sim = SimulationLogic(args.type)
    sim.setup_experiment(lab)
    sim.running = True

    # Main Loop Hook
    def update():
        sim.update(time.dt)
        
        # Quit on Escape
        if held_keys['escape']:
            application.quit()

    app.run()

if __name__ == "__main__":
    main()
