-- Add all FORM 1 Chemistry Experiments from Sayansi_Yathu_Form1_Chemistry_Experiments.txt

INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type) VALUES
('Identification of Laboratory Apparatus', 'chemistry', 'To identify common laboratory apparatus and state their uses.', 'beginner', 'ursina'),
('Laboratory Safety Rules', 'chemistry', 'To learn basic laboratory safety rules.', 'beginner', 'ursina'),
('Change of State (Melting and Boiling)', 'chemistry', 'To observe changes of state.', 'beginner', 'ursina'),
('Diffusion in Liquids', 'chemistry', 'To demonstrate diffusion in liquids.', 'beginner', 'ursina'),
('Filtration', 'chemistry', 'To separate sand from water.', 'intermediate', 'ursina'),
('Evaporation', 'chemistry', 'To obtain salt from salt solution.', 'intermediate', 'ursina'),
('Air Supports Combustion', 'chemistry', 'To show that air supports burning.', 'beginner', 'ursina'),
('Properties of Carbon Dioxide', 'chemistry', 'To test for carbon dioxide.', 'intermediate', 'ursina'),
('Water as a Solvent', 'chemistry', 'To show that water dissolves substances.', 'beginner', 'ursina'),
('Simple Water Filtration', 'chemistry', 'To demonstrate water purification.', 'intermediate', 'ursina'),
('Litmus Test', 'chemistry', 'To identify acids and bases.', 'beginner', 'ursina'),
('Natural Indicators', 'chemistry', 'To prepare a natural indicator.', 'intermediate', 'ursina');

-- Add steps for these new experiments (IDs will start from 7 assuming current IDs are 1-6)
-- We'll use a procedure to insert steps for flexibility or just plain SQL.
-- Simulating ID mapping: ID 7 (Apparatus), ID 8 (Safety), etc.

-- Note: We already have IDs 1-6. So 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18.

-- Experiment 7: Apparatus ID
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(7, 1, 'Introduction', 'Observe each apparatus carefully.', '{"type": "intro"}'),
(7, 2, 'Identify', 'Identify the name and shape.', '{"type": "action", "visual": "beaker"}'),
(7, 3, 'Use', 'Discuss its use in the laboratory.', '{"type": "observation"}'),
(7, 4, 'Conclusion', 'Laboratory apparatus are designed for specific purposes.', '{"type": "result"}');

-- Experiment 9: Change of State
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(9, 1, 'Heat Ice', 'Heat ice gently until it melts.', '{"type": "action", "visual": "beaker"}'),
(9, 2, 'Observe Water', 'Continue heating until it boils.', '{"type": "observation"}'),
(9, 3, 'Observation', 'Ice melts to water; water boils to steam.', '{"type": "result"}');

-- Experiment 10: Diffusion
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(10, 1, 'Setup', 'Place water in a beaker.', '{"type": "intro"}'),
(10, 2, 'Add Crystal', 'Add a crystal of potassium permanganate.', '{"type": "action", "visual": "beaker"}'),
(10, 3, 'Observe', 'Colour spreads through water.', '{"type": "observation"}');

-- (Continuing for others simplified)
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(11, 1, 'Filtration', 'Filter the mixture of sand and water.', '{"type": "action", "visual": "beaker"}'),
(12, 1, 'Evaporation', 'Heat the salt solution gently.', '{"type": "action", "visual": "beaker"}'),
(13, 1, 'Combustion', 'Cover the candle with a glass jar.', '{"type": "action", "visual": "beaker"}'),
(14, 1, 'CO2 Test', 'Bubble gas through limewater.', '{"type": "action", "visual": "beaker"}'),
(15, 1, 'Solvent', 'Add salt to water and stir.', '{"type": "action", "visual": "beaker"}'),
(16, 1, 'Water Filtration', 'Pour dirty water through layers.', '{"type": "action", "visual": "beaker"}'),
(17, 1, 'Litmus Test', 'Dip litmus paper into substances.', '{"type": "action", "visual": "beaker"}'),
(18, 1, 'Natural Indicators', 'Use solution to test substances.', '{"type": "action", "visual": "beaker"}');
