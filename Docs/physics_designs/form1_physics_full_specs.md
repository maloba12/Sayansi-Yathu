# Form 1 Physics Virtual Lab Designs (Part 1: Measurements & Intro)

Strictly aligned with the Zambia O-Level Physics Syllabus (Form 1).

---

## 1. Virtual Laboratory Safety and Waste Management

**Learning Objective:** Correctly identify laboratory hazards and demonstrate proper disposal of virtual waste materials to ensure a safe workspace.
**Virtual Apparatus:**

- Digital fire extinguisher (Red Entity)
- Sand bucket (Cylinder Entity)
- PPE Kit (Goggles, Lab coat models)
- Radioactive/Chemical/General waste bins (Color-coded Cubes)
- Hazard signs (Textured planes)
  **Scene Setup Description:**
- **Room:** A sterile virtual lab with white tiled walls and a grey floor.
- **Placement:** Workbench in the center; safety equipment on a wall rack; waste bins in the corner.
- **Camera:** First-person "Fly" camera or fixed orbiting view.
  **Student Interaction Steps:**
- **Action:** Drag and drop goggles onto the "Player" icon before starting.
- **Action:** Select a spilled "Virtual Chemical" and click the appropriate waste bin to dispose.
- **Action:** Use a crosshair to aim a fire extinguisher at a "Simulated Fire" and hold the mouse button to spray.
  **Physics Behavior to Simulate:**
- Particle effects for fire suppression and liquid spills.
- Simple collision detection between waste items and bins.
  **Data Display & Measurement:**
- "Safety Meter" (Health bar style) that decreases if rules are broken.
- "Protocol Checklist" with tick boxes.
  **Expected Observations:**
- Fire goes out when base is targeted.
- Incorrect bin choice triggers a "Contamination" warning.
  **Conclusion / Concept Reinforced:** Laboratory safety protocols prevent accidents; categorization of waste is critical.
  **Safety & Good Practice:** Virtual rule: Always wear PPE before interacting with chemicals.

## 2. Identification and Use of Physics Apparatus

**Learning Objective:** Familiarize students with common physics measuring instruments and their specific use cases.
**Virtual Apparatus:** Ruler, Vernier Calipers, Micrometer, Stopwatch, Triple-beam balance, Spring balance.
**Scene Setup Description:**

- **Room:** A high-tech "Exhibition Hall" style room.
- **Placement:** Six pedestals, each holding one instrument.
- **Camera:** Dynamic camera that "zooms in" and orbits the selected pedestal.
  **Student Interaction Steps:**
- **Click:** Select an instrument to highlight it.
- **Drag:** Rotate the 3D model to inspect markings.
- **Adjust:** Use a slider to slide the Vernier jaw or click the Stopwatch button.
  **Physics Behavior to Simulate:**
- Sliding interpolation for mechanical parts (smooth motion using `Time.dt`).
  **Data Display & Measurement:**
- Popup info cards (`Text` entities) showing the instrument's name, range, and least count (precision).
  **Expected Observations:**
- Micrometer gives much smaller divisions than a standard ruler.
  **Conclusion / Concept Reinforced:** Different scales of measurement require specialized instruments.
  **Safety & Good Practice:** Virtual rule: Handle sensitive instruments gently to maintain calibration.

## 3. Scientific Investigation Workflow Simulation

**Learning Objective:** Apply the steps of scientific inquiry to solve a simple virtual physics problem.
**Virtual Apparatus:** Notebook entity, Draggable "Step" blocks (Aim, Hypothesis, Method, Result, Conclusion).
**Scene Setup Description:**

- **Room:** Minimalist study area with a large whiteboard.
- **Placement:** Whiteboard displays the "Problem Statement". Blocks are scrambled on the table.
- **Camera:** Fixed front-view of the whiteboard.
  **Student Interaction Steps:**
- **Drag:** Arrange "Step" blocks into a vertical flow chart on the board.
- **Click:** When order is correct, click "Execute Experiment" to trigger a mini-simulation.
  **Physics Behavior:**
- None (Logic-focused interaction).
  **Data Display & Measurement:**
- Green/Red highlight on blocks to indicate correct sequence.
  **Expected Observations:**
- A logical flow (Hypothesis must come before Result) is required to proceed.
  **Conclusion / Concept Reinforced:** Systematic approach reduces bias and error in physics.
  **Safety & Good Practice:** Always record observations immediately in the virtual notebook.

## 4. Measurement of Length (Precision Tools)

**Learning Objective:** Use a Meter Rule, Vernier Calipers, and Micrometer Screw Gauge to measure objects of various sizes.
**Virtual Apparatus:** Steel block (large), Marble (medium), Wire (thin).
**Scene Setup Description:**

- **Room:** Desktop workspace.
- **Placement:** Instrument and object aligned on a measuring line.
- **Camera:** "Magnifying Lens" camera (Split screen) showing extreme close-up of scales.
  **Student Interaction Steps:**
- **Slider:** Move the Vernier jaw to touch the marble's edges.
- **Button:** Toggle between "Main Scale" and "Vernier Scale" views.
  **Physics Behavior:**
- Constraints to prevent the jaw from moving through the object (Collision logic).
  **Data Display & Measurement:**
- Ruler markings scaled to high-resolution textures.
  **Expected Observations:**
- The wire is too thin for a ruler; the Micrometer is needed for accuracy.
  **Conclusion / Concept Reinforced:** Precision depends on the instrument's smallest division.
  **Safety & Good Practice:** Avoid "parallax error" by looking perpendicular to the virtual scale.

## 5. Measurement of Mass vs. Weight

**Learning Objective:** Distinguish between mass (amount of matter) and weight (force of gravity) by changing local gravity.
**Virtual Apparatus:** Electronic scale, 1kg standard mass, spring balance.
**Scene Setup Description:**

- **Room:** "Gravity Lab" with a moon/earth switcher.
- **Placement:** Scale on the floor; spring balance hanging from a stand.
- **Camera:** Eye-level view.
  **Student Interaction Steps:**
- **Dropdown:** Switch location between Earth (g=9.8), Moon (g=1.6), and Space (g=0).
- **Drag:** Place the mass on the scale.
  **Physics Behavior:**
- Weight = mg. Visual extension of spring is proportional to the local 'g'.
  **Data Display & Measurement:**
- Digital mass display (kg) vs. Analog Newton scale (N).
  **Expected Observations:**
- Mass (kg) remains 1.0 everywhere; Weight (N) decreases on the Moon and is 0 in Space.
  **Conclusion / Concept Reinforced:** Weight is a force that depends on gravity; mass is constant.
  **Safety & Good Practice:** Do not exceed the maximum load (red zone) of the virtual spring balance.
# Form 1 Physics Virtual Lab Designs (Part 2: Quantities & Density)

---

## 6. Volume Measurement (Regular and Irregular Objects)

**Learning Objective:** Use mathematical formulas for regular shapes and the water displacement method for irregular objects.
**Virtual Apparatus:** Graduated cylinder, displacement can (eureka can), stone, wooden block, beaker, thread.
**Scene Setup Description:**

- **Room:** Wet-lab area with a sink and level workbench.
- **Placement:** A half-filled graduated cylinder for the stone; a measuring tape next to the block.
- **Camera:** Perspective view with "Straight-on" toggle for reading scales.
  **Student Interaction Steps:**
- **Slider:** Adjust the dimensions (L, W, H) of the wooden block to see volume change.
- **Drag:** Tie a virtual thread to the stone and lower it slowly into the cylinder.
- **Button:** Pour water into the displacement can until it overflows into a beaker.
  **Physics Behavior to Simulate:**
- Fluid level animation: `Entity` (water) increases in `scale_y` as objects are submerged.
- Floating/Sinking logic based on object density vs. water.
  **Data Display & Measurement:**
- Ruler for block dimensions.
- Graduation marks on cylinder (mL/cm³).
  **Expected Observations:**
- The volume of water displaced is exactly equal to the volume of the stone.
  **Conclusion / Concept Reinforced:** Immersion method is for irregular solids; V = L × W × H is for regular.
  **Safety & Good Practice:** Zero the displacement can (wait for dripping to stop) before immersion.

## 7. Measurement of Time (Reaction and Intervals)

**Learning Objective:** Accurately measure time intervals using digital and analog stopwatches.
**Virtual Apparatus:** Pendulum (slow swinging), stopwatch, stop clock, metronome.
**Scene Setup Description:**

- **Room:** Darkened lab for focus.
- **Placement:** Stopwatch in the student's "virtual hand" (overlay); a moving object in the scene.
- **Camera:** Split view (Stopwatch close-up + Motion track).
  **Student Interaction Steps:**
- **Click:** "Start" button as the pendulum passes through the center.
- **Click:** "Lap" button to record consecutive oscillations.
- **Reset:** Use the reset button to zero the digit display.
  **Physics Behavior:**
- High-precision timing sync using `time.time()` and `Time.dt`.
  **Data Display & Measurement:**
- Digital HH:MM:SS text.
- Analog rotating hand.
  **Expected Observations:**
- Difficulty in manually timing single fast events (human reaction time).
  **Conclusion / Concept Reinforced:** Timing multiple cycles and averaging reduces error.
  **Safety & Good Practice:** Start timing after the first few "warm-up" swings for consistency.

## 8. Weight Measurement (Force and the Newton)

**Learning Objective:** Measure force (weight) and understand the Newton as the SI unit of weight.
**Virtual Apparatus:** Vertical stand, spring balance (calibrated in Newtons), various gravity pods.
**Scene Setup Description:**

- **Room:** Force & Motion lab.
- **Placement:** Hanging balance. Palette of weights (0.1N to 10N).
- **Camera:** Close-up of the spring balance scale.
  **Student Interaction Steps:**
- **Drag:** Hang different weights onto the hook.
- **Slider:** Change the "Planet" to see weight on Earth (9.8N/kg) vs Jupiter (25N/kg).
  **Physics Behavior:**
- Elastic spring extension (Hooke's Law visualization).
- Oscillatory "settling" animation when a mass is first hung.
  **Data Display & Measurement:**
- Visible pointer on the balance scale.
  **Expected Observations:**
- The pointer moves down further for heavier masses.
  **Conclusion / Concept Reinforced:** Weight is a vector quantity measured in Newtons.
  **Safety & Good Practice:** Do not "overstretch" the spring (limit to 10N).

## 9. Density Determination (Solid and Liquid)

**Learning Objective:** Determine density of an unknown substance by findings its mass and volume.
**Virtual Apparatus:** Triple beam balance, measuring cylinder, unknown liquid (beaker), unknown metal nugget.
**Scene Setup Description:**

- **Room:** General Workbench.
- **Placement:** Scale on left, cylinder on right. Notebook in front.
- **Camera:** Static overview.
  **Student Interaction Steps:**
- **Click-Sequence:** First, measure mass of dry cylinder. Add liquid. Measure mass of cylinder + liquid.
- **Input:** Student types the difference (Liquid Mass) into a virtual form.
- **Calculation:** Divide Mass by Volume (Volume from cylinder reading).
  **Physics Behavior:**
- Parent-child mass inheritance logic.
  **Data Display & Measurement:**
- On-screen calculator.
- Progress bar through the measurement steps.
  **Expected Observations:**
- Different substances have unique MASS for the same VOLUME.
  **Conclusion / Concept Reinforced:** Density is a characteristic property (ρ = m/V).
  **Safety & Good Practice:** Handle the "nugget" carefully to avoid splashing water during displacement.

## 10. Precision and Accuracy Comparison

**Learning Objective:** Distinguish between accurate results (close to true value) and precise results (close to each other).
**Virtual Apparatus:** "True Mass" 100g weight (invisible but known), 3 different scales (Cheap, High-End, and Miscalibrated).
**Scene Setup Description:**

- **Room:** Calibration Lab.
- **Placement:** Three scales on a row. One test weight.
- **Camera:** Orbiting view.
  **Student Interaction Steps:**
- **Action:** Place the same 100g weight on each scale 5 times.
- **Record:** Note the variations in the displayed value.
  **Physics Behavior:**
- RNG (Random Number Generation) added to the Cheap scale.
- Consistent offset (Systematic Error) added to the Miscalibrated scale.
  **Data Display & Measurement:**
- A "Scatter Plot" auto-generated showing the 5 trial points.
  **Expected Observations:**
- Cheap scale values are scattered (Low precision).
- Miscalibrated scale is consistent but wrong (Low accuracy, high precision).
  **Conclusion / Concept Reinforced:** Accuracy is proximity to truth; Precision is consistency.
  **Safety & Good Practice:** Always check for "zero error" before taking measurements.
# Form 1 Physics Virtual Lab Designs (Part 3: Statics & Motion)

---

## 11. Simple Pendulum (Time Period vs Length)

**Learning Objective:** Investigate how the length of a pendulum affects its time period.
**Virtual Apparatus:** Pivot, heavy bob (Sphere), string (Line/Cylinder), protractor, stopwatch, meter rule.
**Scene Setup Description:**

- **Room:** Physics lab corner.
- **Placement:** Pendulum hanging from a fixed wall arm.
- **Camera:** Fixed front-view with an "Angle Gauge" overlay.
  **Student Interaction Steps:**
- **Slider:** Change string length (L) from 10cm to 100cm.
- **Drag-Release:** Pull the bob back to 10 degrees and let go (Physics starts on mouse up).
- **Control:** Press 'Start' on the digital stopwatch as it passes the mean position.
  **Physics Behavior to Simulate:**
- Angular SHM (Simple Harmonic Motion). Period $T = 2\pi\sqrt{L/g}$.
- Air resistance (damping) can be toggled on/off to see "Ideal" vs "Real".
  **Data Display & Measurement:**
- On-screen graph plotting T² vs L in real-time.
- Digital counter for "Number of Swings".
  **Expected Observations:**
- A longer string results in a slower swing; Mass of the bob does not change the period.
  **Conclusion / Concept Reinforced:** T depends only on Length and Gravity.
  **Safety & Good Practice:** Keep the angle of displacement small (< 10°) for SHM accuracy.

## 12. Centre of Mass Simulation

**Learning Objective:** Locate the center of mass for various 2D and 3D shapes.
**Virtual Apparatus:** Irregular cardboard cutout (Polygon shape), plumb line (Thread + Weight), pivot pin.
**Scene Setup Description:**

- **Room:** General shop floor.
- **Placement:** Shape mounted on a pin on a vertical board.
- **Camera:** High-definition close-up.
  **Student Interaction Steps:**
- **Action:** Select a hole on the edge of the shape to hang it from.
- **Click:** "Drop Plumb Line" to see a visual vertical line over the shape.
- **Draw:** Click "Mark Line" to leave a permanent chalk line on the virtual cutout.
- **Repeat:** Use 3 different pivot points.
  **Physics Behavior:**
- Rotational equilibrium (Object rotates until its CoM is directly below the pivot).
  **Data Display & Measurement:**
- "Balance Point" crosshair that appears when the user finds the intersection.
  **Expected Observations:**
- All marked lines intersect at one specific point inside (or outside) the object.
  **Conclusion / Concept Reinforced:** The entire weight of an object acts through its center of mass.
  **Safety & Good Practice:** Wait for the object to stop oscillating before marking the line.

## 13. Stable, Unstable, and Neutral Equilibrium

**Learning Objective:** Identify state of equilibrium based on the behavior of the center of mass when tilted.
**Virtual Apparatus:** Geometric cone, cylinder, ball, flat surface, "Force Finger" (Mouse cursor).
**Scene Setup Description:**

- **Room:** Demonstration table.
- **Placement:** Cone on its base (stable), cone on its apex (unstable), cone on its side (neutral).
- **Camera:** Dynamic Side-view.
  **Student Interaction Steps:**
- **Action:** Click and nudge the object slightly with a variable force.
- **Observe:** Check the "Transparency View" to see the CoM position relative to the base.
  **Physics Behavior:**
- Gravity and Torque logic. If the vertical from CoM falls outside the base, the object topples.
  **Data Display & Measurement:**
- Red/Green status light: "Equilibrium Maintained" or "Toppled".
  **Expected Observations:**
- Stable: CoM rises when tilted. Unstable: CoM falls immediately. Neutral: CoM height is constant.
  **Conclusion / Concept Reinforced:** Stability depends on CoM height and base area.
  **Safety & Good Practice:** Use small "nudge" forces to see the recovery behavior.

## 14. Linear Motion (Distance, Speed, Velocity)

**Learning Objective:** Distinguish between scalar and vector quantities and calculate motion parameters.
**Virtual Apparatus:** Motorized cart, linear track (2 meters), motion sensor (Laser), strobe light.
**Scene Setup Description:**

- **Room:** Long corridor/track.
- **Placement:** Track with distance markings every 10cm. Cart at the start.
- **Camera:** "Follow Camera" attached to the cart.
  **Student Interaction Steps:**
- **Adjust:** Set initial "Velocity" and "Acceleration" using sliders.
- **Click:** "Run" and watch the cart travel.
- **Control:** Toggle between "Linear" and "Return" trip to see Displacement vs Distance.
  **Physics Behavior:**
- Constant acceleration equations ($v = u + at$; $s = ut + 0.5at²$).
  **Data Display & Measurement:**
- Real-time speedometer and odometer.
- Live-drawn graph: s-t, v-t, and a-t.
  **Expected Observations:**
- Straight line on s-t graph means constant velocity. Curvilinear means acceleration.
  **Conclusion / Concept Reinforced:** Acceleration is the rate of change of velocity.
  **Safety & Good Practice:** Reset parameters before each run for comparative trials.

## 15. Free Fall and Gravitational Acceleration (g)

**Learning Objective:** Estimate the value of 'g' by timing an object falling through a known height.
**Virtual Apparatus:** Vacuum tube (tower), steel marble, electromagnet, trapdoor sensor, millisecond timer.
**Scene Setup Description:**

- **Room:** High-ceiling laboratory.
- **Placement:** Vertical tower from floor to ceiling.
- **Camera:** Zoomed view on the release point and the landing point.
  **Student Interaction Steps:**
- **Slider:** Change the height (h) of the drop between 0.5m and 5m.
- **Button:** Click "Release Electromagnet" to drop the ball.
- **Toggle:** Toggle "Vacuum Mode" (Air resistance = 0) vs "Air Mode".
  **Physics Behavior:**
- Kinematics: $h = 0.5gt²$. Correct gravitational fall including air drag if selected.
  **Data Display & Measurement:**
- Digital timer (精度 ms).
- Result box: Displaying $2h/t²$.
  **Expected Observations:**
- In a vacuum, heavier and lighter balls fall at the same rate.
  **Conclusion / Concept Reinforced:** All objects have the same value of 'g' regardless of mass in absence of air.
  **Safety & Good Practice:** Virtual rule: Clear the trapdoor area before releasing the next ball.
# Form 1 Physics Virtual Lab Designs (Part 4: Dynamics & Moments)

---

## 16. Effect of Force on Motion and Shape

**Learning Objective:** Observe how applying force changes an object's velocity (speed/direction) or its physical dimensions.
**Virtual Apparatus:** Foam block (Flexible Entity), tennis ball, soccer ball, smooth floor, wall.
**Scene Setup Description:**

- **Room:** Open sports-floor lab.
- **Placement:** Blocks and balls lined up for interaction.
- **Camera:** Dynamic "Impact View" that triggers during force application.
  **Student Interaction Steps:**
- **Action:** Click and hold to charge up "Force" then release to kick/push the ball.
- **Action:** Click a "Foam Cube" to apply compressive force with a virtual hand.
  **Physics Behavior:**
- Deformation: `Entity` scale modification on the axis of force.
- Acceleration: $F=ma$ (Balls of different masses accelerate differently with the same force).
  **Data Display & Measurement:**
- "Force Vector" (Arrow logic) showing direction and magnitude.
- Deform-meter (%) showing compression.
  **Expected Observations:**
- Small force = small speed; Large force = deformation or high speed.
  **Conclusion / Concept Reinforced:** Forces cause acceleration or change in shape.
  **Safety & Good Practice:** Do not exceed the "Elastic Limit" of the virtual foam (visual tearing effect).

## 17. Friction Simulation (Rough vs Smooth Surfaces)

**Learning Objective:** Compare the resistive force of different material pairings and identify factors affecting friction.
**Virtual Apparatus:** Wood block, glass surface, sandpaper surface, carpet surface, spring balance (tractive).
**Scene Setup Description:**

- **Room:** Materials testing lab.
- **Placement:** Four parallel tracks of different materials.
- **Camera:** Low-angle side view (Profile).
  **Student Interaction Steps:**
- **Drag:** Use the spring balance to pull the block across the surface.
- **Slider:** Add "Loads" (Weights) on top of the moving block.
  **Physics Behavior:**
- Static vs. Kinetic friction logic ($F_f = \mu F_n$).
- Jerk animation when "Limiting Friction" is overcome.
  **Data Display & Measurement:**
- Tension reading on the spring balance (N).
- Surface roughness coefficient (visible info toast).
  **Expected Observations:**
- Sandpaper requires much more force to move the block than glass.
  **Conclusion / Concept Reinforced:** Friction depends on surface nature and normal force.
  **Safety & Good Practice:** Pull at a steady, slow speed for accurate kinetic friction readings.

## 18. Hooke’s Law (Spring Extension vs Load)

**Learning Objective:** Verify the relationship between force and the extension of a spring.
**Virtual Apparatus:** Helical spring (Coiled Entity), hanger, 20g slotted weights, ruler on stand.
**Scene Setup Description:**

- **Room:** Elasticity station.
- **Placement:** Spring hanging vertically next to a millimeter scale.
- **Camera:** Fixed zoom on the pointer/scale interface.
  **Student Interaction Steps:**
- **Click:** Add weights sequentially (1 to 10 weights).
- **Control:** Click "Equilibrate" to stop spring oscillations.
- **Draw:** Click "Plot Point" after reading the extension.
  **Physics Behavior:**
- Hooke's Law ($F = kx$).
- Visual realistic "stretch" where model scale increases for each weight.
  **Data Display & Measurement:**
- Auto-updating Force-Extension graph ($y=mx$).
- Digital reading of "pointer position".
  **Expected Observations:**
- Constant increase in extension for every 10g added until yield point.
  **Conclusion / Concept Reinforced:** Extension is directly proportional to applied force.
  **Safety & Good Practice:** Reset if the "Elastic Limit Warning" appears (Permanent deformation).

## 19. Circular Motion (Centripetal Force)

**Learning Objective:** Understand the center-seeking force required to keep an object moving in a circle.
**Virtual Apparatus:** Whirling bung (Sphere), string, hollow glass tube, varied weights (Center load).
**Scene Setup Description:**

- **Room:** Outdoor physics patio.
- **Placement:** First-person view of the whirling motion.
- **Camera:** Overhead "Plan" view to see the orbit clearly.
  **Student Interaction Steps:**
- **Slider:** Adjust the "Rotation Speed" (RPM).
- **Slider:** Change "Orbit Radius".
- **Toggle:** "Cut String" button to see tangential escape.
  **Physics Behavior:**
- Centripetal force logic ($F = mv^2/r$).
- Tangential velocity vector visualization ($v \perp r$).
  **Data Display & Measurement:**
- Tension gauge (N) representing the central weight.
- Velocity vector arrows (red).
  **Expected Observations:**
- Higher speed requires a larger central weight to maintain radius.
  **Conclusion / Concept Reinforced:** Force is needed to change direction even at constant speed.
  **Safety & Good Practice:** Clear the "Hazard Zone" (Virtual circle) before starting rotation.

## 20. Moment of a Force (Lever System)

**Learning Objective:** Define the moment of a force and identify the factors affecting its magnitude.
**Virtual Apparatus:** Spanner (Lever), pivot (Bolt), virtual "Hand" applicator, protractor.
**Scene Setup Description:**

- **Room:** Workshop floor.
- **Placement:** A large rusty bolt that requires a specific "Turning Effect" to loosen.
- **Camera:** Front-on view of the nut and spanner.
  **Student Interaction Steps:**
- **Drag:** Move the point of application of force along the spanner handle.
- **Button:** Change the angle of the applied force (90° vs 45°).
- **Click:** "Apply Effort" and watch the "Tightness Bar".
  **Physics Behavior:**
- Moment Calculation ($M = F \times d \times \sin(\theta)$).
  **Data Display & Measurement:**
- Torque Gauge (N·m).
- Distance indicator (meters from pivot).
  **Expected Observations:**
- It is easiest to turn the bolt when pushing at the far end of the handle at 90°.
  **Conclusion / Concept Reinforced:** Moment increases with distance and perpendicularity.
  **Safety & Good Practice:** Use "Virtual Gloves" to prevent slipping when applying high torque.
# Form 1 Physics Virtual Lab Designs (Part 5: Equilibrium & Space)

---

## 21. Principle of Moments and Equilibrium

**Learning Objective:** Verify that for a body in equilibrium, the sum of clockwise moments equals the sum of anticlockwise moments.
**Virtual Apparatus:** Uniform meter rule, knife-edge fulcrum, stand, slotted weights (50g units), thread.
**Scene Setup Description:**

- **Room:** Statics Laboratory.
- **Placement:** Meter rule balanced on the fulcrum at the 50cm mark.
- **Camera:** Panoramic view of the rule's length (Side-on).
  **Student Interaction Steps:**
- **Drag:** Place weights on the left side (anticlockwise) at specific distances.
- **Drag:** Place weights on the right side (clockwise) to restore the horizontal position.
- **Click:** "Level Check" button to confirm if equilibrium is mathematically perfect.
  **Physics Behavior to Simulate:**
- Seesaw physics (Rotation about the fulcrum based on net torque).
- Gravity-alignment logic (The rule tilts if moments are unbalanced).
  **Data Display & Measurement:**
- Moment Table ($F \times d$ left, $F \times d$ right).
- Spirit level indicator on the rule.
  **Expected Observations:**
- A small weight far from the fulcrum can balance a large weight near the fulcrum.
  **Conclusion / Concept Reinforced:** $\sum M_{\text{clockwise}} = \sum M_{\text{anticlockwise}}$.
  **Safety & Good Practice:** Place weights one by one to avoid sudden tip-over of the virtual rule.

## 22. Solar System and Eclipse Simulation

**Learning Objective:** Explain the relative positions of the Sun, Earth, and Moon during solar and lunar eclipses.
**Virtual Apparatus:** Sun (Point light source), Earth (Textured Sphere), Moon (Grey Sphere), Orbit paths.
**Scene Setup Description:**

- **Room:** Deep space view.
- **Placement:** Sun at (0,0,0); Earth and Moon at relative scaled distances.
- **Camera:** Toggle between "God's Eye" (Top-down) and "View from Earth" (Observer).
  **Student Interaction Steps:**
- **Button:** "Start Orbits" (Time-lapse mode).
- **Interaction:** Manually drag the Moon along its orbit to position it for an eclipse.
- **Toggle:** "Umbra/Penumbra Visualization" to see shadow cones.
  **Physics Behavior:**
- Keplerian orbits (Circular approximation for Form 1 level).
- Ray-casting shadow projection from the Sun through the Moon/Earth.
  **Data Display & Measurement:**
- Current Phase (text).
- Distance labels ($km$).
  **Expected Observations:**
- Solar Eclipse: Earth-Moon-Sun alignment. Lunar Eclipse: Moon-Earth-Sun alignment.
  **Conclusion / Concept Reinforced:** Light travels in straight lines; shadows form where light is blocked.
  **Safety & Good Practice:** Never look directly at the virtual Sun without the "Virtual Filter" toggled on.

## 23. Structure of the Earth (Layered 3D Model)

**Learning Objective:** Identify and describe the physical properties of the Earth's Crust, Mantle, and Core.
**Virtual Apparatus:** Interactive nested spheres (Cross-section model), labels, temperature probes.
**Scene Setup Description:**

- **Room:** Geophysics Hall.
- **Placement:** A cutout globe in the center.
- **Camera:** Orbiting zoom cam.
  **Student Interaction Steps:**
- **Click:** Select a layer (e.g., Core) to expand it or see detail.
- **Action:** Click and drag the "Depth Probe" to see data change from 0km to 6400km depth.
  **Physics Behavior:**
- Logic-based data updates (Temperature and Pressure increase with depth).
- Nested transparency effects.
  **Data Display & Measurement:**
- Depth (km), Temperature (°C), and Pressure (Pa/atm) gauges.
  **Expected Observations:**
- The Inner Core is solid despite high temperatures; the Outer Core is liquid.
  **Conclusion / Concept Reinforced:** The Earth has a layered chemical and physical structure.
  **Safety & Good Practice:** Warning info appearing for unrealistic probe depths (e.g., "Mantle reached").

## 24. Structure of the Earth’s Atmosphere

**Learning Objective:** Identify the layers of the atmosphere and understand how pressure and temperature change with altitude.
**Virtual Apparatus:** High-altitude weather balloon, Rocket probe, Barometer, Thermometer.
**Scene Setup Description:**

- **Room:** Horizon view (from edge of space).
- **Placement:** Vertical "Atmosphere Tube" showing colored layers (Troposphere, Stratosphere, etc.).
- **Camera:** Vertical tracking camera following the balloon.
  **Student Interaction Steps:**
- **Click:** "Launch Balloon" to begin ascent.
- **Toggle:** View "Oxygen Levels" indicator.
- **Click:** High altitude "Parachute Release" to return to surface.
  **Physics Behavior:**
- Aerodynamics: Balloon lift decreases as density drops.
- Gradient logic: Temp falls in Troposphere, rises in Stratosphere (Ozone heating).
  **Data Display & Measurement:**
- Altitude Altimeter (meters).
- Altitude vs. Temperature and Altitude vs. Pressure live graphs.
  **Expected Observations:**
- Pressure drops exponentially with altitude; air becomes too thin for the balloon at high altitudes.
  **Conclusion / Concept Reinforced:** The atmosphere is thinner and colder at higher altitudes (mostly).
  **Safety & Good Practice:** Ensure the "Beacon" is active for virtual recovery of the probe.
