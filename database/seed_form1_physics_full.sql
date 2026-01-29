-- Add all 24 FORM 1 Physics Experiments aligned with Zambia O-Level Physics Syllabus

INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type) VALUES
('Virtual Laboratory Safety and Waste Management', 'physics', 'Identify hazards and follow safety protocols in the virtual lab.', 'beginner', 'ursina'),
('Identification and Use of Physics Apparatus', 'physics', 'Explore common measuring instruments and learn their uses.', 'beginner', 'ursina'),
('Scientific Investigation Workflow', 'physics', 'Follow the scientific method to solve physics problems.', 'beginner', 'ursina'),
('Measurement of Length', 'physics', 'Practice using rulers, calipers, and micrometer screw gauges.', 'beginner', 'ursina'),
('Measurement of Mass', 'physics', 'Determine the mass of various objects using a virtual balance.', 'beginner', 'ursina'),
('Measurement of Volume', 'physics', 'Measure volume of regular and irregular objects using displacement.', 'beginner', 'ursina'),
('Measurement of Time', 'physics', 'Use stopwatch and timers to measure intervals accurately.', 'beginner', 'ursina'),
('Measurement of Weight', 'physics', 'Measure gravitational force and compare weight on different planets.', 'beginner', 'ursina'),
('Density Determination', 'physics', 'Calculate density using mass and volume measurements.', 'intermediate', 'ursina'),
('Precision and Accuracy Comparison', 'physics', 'Differentiate between precise and accurate measurements.', 'intermediate', 'ursina'),
-- Already have Simple Pendulum (Ex 11) from previous seed
('Centre of Mass Simulation', 'physics', 'Find the balance point of various 2D and 3D shapes.', 'intermediate', 'ursina'),
('Stable, Unstable, and Neutral Equilibrium', 'physics', 'Categorize equilibrium states through tilting simulations.', 'intermediate', 'ursina'),
('Linear Motion Simulation', 'physics', 'Analyze displacement, velocity, and acceleration on a track.', 'intermediate', 'ursina'),
('Free Fall and Gravitational Acceleration', 'physics', 'Estimate g by timing falling objects in a vacuum.', 'advanced', 'ursina'),
('Effect of Force on Motion and Shape', 'physics', 'See how forces cause acceleration or physical deformation.', 'beginner', 'ursina'),
('Friction Simulation', 'physics', 'Compare resistive forces on different surface textures.', 'intermediate', 'ursina'),
('Hookes Law Simulation', 'physics', 'Investigate the extension of springs under various loads.', 'intermediate', 'ursina'),
('Circular Motion Simulation', 'physics', 'Understand centripetal force and tangential escape.', 'advanced', 'ursina'),
('Moment of a Force (Lever System)', 'physics', 'Experiment with the turning effect of forces on a wrench.', 'intermediate', 'ursina'),
('Principle of Moments and Equilibrium', 'physics', 'Balance a meter rule using clockwise and anticlockwise moments.', 'advanced', 'ursina'),
('Solar System and Eclipse Simulation', 'physics', 'Model shadows and orbits to explain eclipses.', 'beginner', 'ursina'),
('Structure of the Earth', 'physics', 'Explore the layers of the Earth from Crust to Core.', 'beginner', 'ursina'),
('Structure of the Earths Atmosphere', 'physics', 'Monitor pressure and temperature changes in atmospheric layers.', 'beginner', 'ursina');

-- Add steps for new experiments (assuming next ID starts around 19)
-- (Simplified for batch implementation)
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) 
SELECT id, 1, 'Start Experiment', CONCAT('Follow instructions for ', title), '{"type": "action"}' 
FROM experiments WHERE id > :max_prev_id;

