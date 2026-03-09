#!/usr/bin/env python3
import os
os.environ['DISPLAY'] = ':0.0'

from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina(title='Test Window', size=(800, 600), borderless=False, fullscreen=False)

# Set window position to be more visible
window.position = (200, 200)

# Create some visible objects
Entity(model='cube', color=color.red, position=(0, 0, 0), scale=2)
Entity(model='sphere', color=color.blue, position=(3, 0, 0), scale=1)
Entity(model='plane', color=color.green, position=(0, -2, 0), scale=10)

# Add lighting
PointLight(position=(2, 4, 0))

# Camera setup
camera.position = (0, 5, -10)
camera.look_at((0, 0, 0))

print("🧪 TEST WINDOW LAUNCHED")
print("You should see a window with red cube and blue sphere")
print("Press ESC to quit")

def update():
    if held_keys['escape']:
        application.quit()

app.run()
