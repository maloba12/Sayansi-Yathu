from ursina import *
import sys
import argparse
from lab_scene import LabScene
from simulation import SimulationLogic

def main():
    parser = argparse.ArgumentParser(description='Sayansi Yathu 3D Simulation Engine')
    parser.add_argument('--type', type=str, default='pendulum', help='Experiment type (pendulum, chemistry_mix)')
    args = parser.parse_args()

    app = Ursina(title=f"Sayansi Yathu - {args.type.capitalize()}", vsync=True, fullscreen=False)

    # Force window to be visible and focused
    window.borderless = False
    window.size = (1024, 768)
    window.position = (200, 200)  # More visible position
    window.make_render_queue = True
    
    # Bring window to front
    window.focus()
    
    # Add a delay to ensure window is ready
    import time
    time.sleep(0.5)
    
    # Setup Scene
    lab = LabScene()
    
    # Setup Camera with better initial position
    camera.position = (0, 5, -15)
    camera.look_at((0, 3, 0))
    camera.fov = 60  # Field of view
    
    EditorCamera() # Allow free movement for debug/exploration

    # Setup Simulation
    sim = SimulationLogic(args.type)
    sim.setup_experiment(lab)
    sim.running = True

    # Show startup message
    print(f"\n{'='*50}")
    print(f"🧪 SAYANSI YATHU 3D SIMULATION")
    print(f"Experiment: {args.type.upper()}")
    print(f"{'='*50}")
    print("📋 CONTROLS:")
    print("  Mouse: Look around")
    print("  WASD: Move camera")
    print("  Scroll: Zoom in/out")
    print("  H: Show help")
    print("  ESC: Quit simulation")
    print(f"{'='*50}")
    print("🔍 TIP: The 3D window should appear separately.")
    print("If you don't see it, check your taskbar or alt+tab.")
    print(f"{'='*50}\n")

    # Main Loop Hook
    def update():
        sim.update(time.dt)
        
        # Quit on Escape
        if held_keys['escape']:
            application.quit()

    # Add instructions overlay
    def input(key):
        if key == 'h':
            print("=== Sayansi Yathu 3D Controls ===")
            print("Mouse: Look around")
            print("WASD: Move camera")
            print("Scroll: Zoom in/out")
            print("ESC: Quit")
            print("H: Show this help")

    app.run()

if __name__ == "__main__":
    main()
