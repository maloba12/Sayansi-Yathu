-- ============================================================
-- Migration 008: Physics Experiments (Grades 10, 11, 12)
-- Sayansi Yathu Virtual Science Lab
-- ============================================================

-- Prevent duplicates on re-run
DELETE FROM experiments WHERE subject = 'physics' AND curriculum = 'new' AND grade_or_form IN ('Grade 10', 'Grade 11', 'Grade 12');

-- ============================================================
-- GRADE 10 PHYSICS (9 experiments)
-- ============================================================
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type, curriculum, grade_or_form) VALUES

-- Measurement
('Measuring Length Using Vernier Calipers and Micrometer Screw Gauge',
 'physics',
 'Measure length and diameter accurately using precision instruments (Vernier calipers and micrometer screw gauge) and compare their accuracy to a standard ruler.',
 'beginner', 'measure_length', 'new', 'Grade 10'),

-- Mechanics – Time & Motion
('Determining the Period of a Simple Pendulum',
 'physics',
 'Investigate how factors such as string length, mass, and angle affect the period of a simple pendulum oscillating under gravity.',
 'beginner', 'pendulum', 'new', 'Grade 10'),

-- Mass & Weight
('Measuring Mass and Weight',
 'physics',
 'Distinguish between mass and weight by measuring the same object with a beam balance (mass) and a spring balance (weight).',
 'beginner', 'measure_mass', 'new', 'Grade 10'),

-- Equilibrium / Centre of Mass
('Locating the Centre of Mass of an Irregular Lamina',
 'physics',
 'Determine the centre of gravity of an irregular cardboard shape by suspending it from different points and drawing plumb lines.',
 'intermediate', 'cog', 'new', 'Grade 10'),

-- Forces / Elasticity
('Verification of Hooke\'s Law',
 'physics',
 'Investigate how the extension of a spring is directly proportional to the applied force, and identify the elastic limit.',
 'intermediate', 'hookes_law', 'new', 'Grade 10'),

-- Forces / Friction
('Investigating Friction on Different Surfaces',
 'physics',
 'Compare the frictional forces produced when a wooden block is pulled across rough and smooth surfaces using a spring balance.',
 'beginner', 'friction', 'new', 'Grade 10'),

-- Moments
('Principle of Moments Using a Metre Rule',
 'physics',
 'Verify that for a body in equilibrium, the sum of clockwise moments equals the sum of anticlockwise moments about any pivot.',
 'intermediate', 'moments', 'new', 'Grade 10'),

-- Energy / Work / Power
('Work Done and Power Calculation',
 'physics',
 'Determine the work done and power output by lifting objects through a measured height over a timed interval.',
 'beginner', 'energy', 'new', 'Grade 10'),

-- Simple Machines
('Mechanical Advantage of Simple Machines',
 'physics',
 'Calculate the Mechanical Advantage (MA), Velocity Ratio (VR), and efficiency of pulleys and levers by comparing load and effort forces.',
 'intermediate', 'machines', 'new', 'Grade 10');

-- ============================================================
-- GRADE 11 PHYSICS (9 experiments)
-- ============================================================
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type, curriculum, grade_or_form) VALUES

-- Thermal Physics / Kinetic Theory
('Brownian Motion Demonstration',
 'physics',
 'Observe random particle movement of smoke particles under a microscope to provide evidence for the kinetic theory of matter.',
 'intermediate', 'brownian', 'new', 'Grade 11'),

-- Temperature / Thermometry
('Calibration of a Thermometer',
 'physics',
 'Construct a temperature scale by identifying the lower fixed point (ice point) and upper fixed point (steam point) on a liquid-in-glass thermometer.',
 'intermediate', 'thermometer', 'new', 'Grade 11'),

-- Heat / Expansion
('Linear Expansion of Solids',
 'physics',
 'Demonstrate that solid materials expand when heated by testing whether a heated metal ball can pass through a ring it originally fitted.',
 'beginner', 'thermal_expansion', 'new', 'Grade 11'),

-- Gas Laws / Boyle's Law
('Verification of Boyle\'s Law',
 'physics',
 'Show that the pressure of a fixed mass of gas at constant temperature is inversely proportional to its volume (PV = constant).',
 'advanced', 'pressure', 'new', 'Grade 11'),

-- Thermal Physics / Conduction
('Heat Transfer by Conduction',
 'physics',
 'Compare the thermal conductivity of different metals by heating rods coated with wax and observing the order in which the wax melts.',
 'beginner', 'heat_flow', 'new', 'Grade 11'),

-- Waves
('Wave Motion on a Rope',
 'physics',
 'Generate and observe transverse wave motion on a rope to demonstrate wavelength, amplitude, frequency, and wave speed.',
 'beginner', 'wave_motion', 'new', 'Grade 11'),

-- Light / Reflection
('Reflection of Light Using Plane Mirror',
 'physics',
 'Verify the laws of reflection (angle of incidence equals angle of reflection) using a plane mirror, ray box, and protractor.',
 'beginner', 'light_reflection', 'new', 'Grade 11'),

-- Light / Refraction
('Refraction Through a Glass Block',
 'physics',
 'Determine the refractive index of glass by tracing refracted ray paths through a rectangular glass block and applying Snell\'s Law.',
 'intermediate', 'light_refraction', 'new', 'Grade 11'),

-- Magnetism
('Magnetic Field Lines Around a Magnet',
 'physics',
 'Plot the magnetic field pattern around a bar magnet using iron filings and a plotting compass to reveal field lines from North to South.',
 'beginner', 'magnetic_field', 'new', 'Grade 11');

-- ============================================================
-- GRADE 12 PHYSICS (5 experiments)
-- ============================================================
INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type, curriculum, grade_or_form) VALUES

-- Static Electricity
('Charging by Friction and Electroscope Detection',
 'physics',
 'Detect and identify different types of electric charge by charging objects through friction and testing them with a gold leaf electroscope.',
 'beginner', 'electrostatics', 'new', 'Grade 12'),

-- Current Electricity
('Measuring Current and Voltage in a Circuit',
 'physics',
 'Use an ammeter and voltmeter correctly in series and parallel configurations to measure current and voltage in a simple DC circuit.',
 'beginner', 'circuit', 'new', 'Grade 12'),

-- Resistance / Ohm's Law
('Verification of Ohm\'s Law',
 'physics',
 'Show that the current through a metallic conductor is directly proportional to the voltage across it at constant temperature, producing a straight-line graph.',
 'intermediate', 'ohms_law', 'new', 'Grade 12'),

-- Electromagnetic Induction
('Electromagnetic Induction',
 'physics',
 'Generate an induced EMF by moving a permanent magnet through a coil of wire and observe the deflection on a galvanometer, verifying Faraday\'s law.',
 'advanced', 'em_induction', 'new', 'Grade 12'),

-- Transformers
('Transformer Principle',
 'physics',
 'Demonstrate the step-up and step-down action of a transformer by comparing input and output voltages and relating them to the turns ratio.',
 'advanced', 'transformer', 'new', 'Grade 12');

-- ============================================================
-- END OF MIGRATION 008
-- ============================================================
