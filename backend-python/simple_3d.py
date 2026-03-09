#!/usr/bin/env python3
"""
Simple 3D Simulation Launcher - Sayansi Yathu
This version focuses on reliability and clear user feedback
"""

import os
import sys
import argparse
import time

# Set display
os.environ['DISPLAY'] = ':0.0'

try:
    from ursina import *
    print("✅ Ursina imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Ursina: {e}")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Sayansi Yathu 3D Simulation')
    parser.add_argument('--type', type=str, default='pendulum', help='Experiment type')
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"🧪 SAYANSI YATHU 3D SIMULATION")
    print(f"Experiment: {args.type.upper()}")
    print(f"{'='*60}")
    
    try:
        # Create app with basic settings
        app = Ursina(title=f"Sayansi Yathu - {args.type}", fullscreen=False)
        
        # Basic window setup
        window.size = (800, 600)
        window.borderless = False
        
        print("🖥️  3D Window created")
        print("📋 Looking for the window?")
        print("   - Check your taskbar")
        print("   - Press Alt+Tab to cycle through windows")
        print("   - Look for 'Sayansi Yathu' window title")
        
        # Simple scene
        Entity(model='plane', scale=(10, 1, 10), color=color.gray)
        Entity(model='cube', color=color.red, position=(0, 1, 0), scale=1)
        Entity(model='sphere', color=color.blue, position=(2, 1, 0), scale=0.5)
        
        # Lighting
        PointLight(position=(0, 5, 0))
        AmbientLight(color=color.rgba(255, 255, 255, 0.5))
        
        # Camera
        camera.position = (0, 5, -8)
        camera.look_at((0, 0, 0))
        
        print("✅ Scene setup complete")
        print("🎮 Controls: Mouse to look, Scroll to zoom, ESC to quit")
        print(f"{'='*60}")
        
        def update():
            if held_keys['escape']:
                print("👋 Closing 3D simulation...")
                application.quit()
        
        app.run()
        
    except Exception as e:
        print(f"❌ Error running 3D simulation: {e}")
        print("💡 This might be due to:")
        print("   - No display available")
        print("   - Graphics driver issues")
        print("   - Missing OpenGL support")

if __name__ == "__main__":
    main()
