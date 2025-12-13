-- Seed Data: Sample Experiments
-- Date: 2025-12-12
-- Description: Insert 3 demo simulations with steps

-- 1. Biology: Enzyme Activity (Effect of Temperature)
INSERT INTO simulations (title, subject, description, difficulty) VALUES
('Enzyme Activity: Effect of Temperature', 'Biology', 'Investigate how temperature affects enzyme catalase activity. Learn about optimal temperature conditions and enzyme denaturation.', 'Easy');

SET @bio_id = LAST_INSERT_ID();

INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@bio_id, 1, 'Introduction', 'Welcome to the Enzyme Activity experiment! In this lab, you will observe how temperature affects the rate of enzymatic reactions. Enzyme catalase breaks down hydrogen peroxide into water and oxygen. Click Next to begin.', '{"type":"intro"}'),
(@bio_id, 2, 'Set Temperature', 'Use the temperature control to set your experimental temperature. Try values between 0°C and 100°C. Typical body temperature is 37°C. Record your chosen temperature.', '{"type":"slider","min":0,"max":100,"unit":"°C","default":37}'),
(@bio_id, 3, 'Mix Enzyme and Substrate', 'Add 5mL of catalase enzyme to the test tube containing hydrogen peroxide. Observe the reaction. You should see bubbles forming as oxygen is released.', '{"type":"action","visual":"bubbles"}'),
(@bio_id, 4, 'Observe Reaction Rate', 'Measure the reaction rate by counting the bubbles produced per minute. At optimal temperature (37°C), you should observe maximum activity. Record your observations.', '{"type":"observation","target_rate":50}'),
(@bio_id, 5, 'Record Results', 'Complete your data table with temperature and reaction rate. Compare results: Low temperature = slow reaction, Optimal (37°C) = fast reaction, High temperature (>60°C) = denatured enzyme, no reaction.', '{"type":"result"}');

-- 2. Chemistry: Acid-Base Titration
INSERT INTO simulations (title, subject, description, difficulty) VALUES
('Acid-Base Titration', 'Chemistry', 'Learn the technique of titration to determine the concentration of an unknown acid using a standard base solution.', 'Medium');

SET @chem_id = LAST_INSERT_ID();

INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@chem_id, 1, 'Select Acid and Base', 'Choose your acid (HCl) and base (NaOH). For this experiment, you will titrate 25mL of unknown HCl with 0.1M NaOH. Safety first: wear goggles and lab coat!', '{"type":"selection","acid":"HCl","base":"NaOH"}'),
(@chem_id, 2, 'Prepare Burette', 'Fill the burette with 0.1M NaOH solution. Record the initial burette reading (should be 0.0 mL). Ensure there are no air bubbles in the burette tip.', '{"type":"setup","volume":50}'),
(@chem_id, 3, 'Add Indicator', 'Add 2-3 drops of phenolphthalein indicator to your acid solution. The solution should remain colorless in acidic conditions. The endpoint will be indicated by a permanent pink color.', '{"type":"action","indicator":"phenolphthalein"}'),
(@chem_id, 4, 'Drip Until Color Change', 'Slowly add NaOH from the burette while swirling the flask. The pink color will appear and disappear. Continue dripping until the solution turns a permanent faint pink. This is your endpoint!', '{"type":"titration","target_volume":25}'),
(@chem_id, 5, 'Record Volume', 'Record the final burette reading. Calculate the volume of NaOH used. Use the formula: M₁V₁ = M₂V₂ to calculate the concentration of the unknown HCl. Expected result: ~0.1M HCl.', '{"type":"calculation"}');

-- 3. Physics: Ohm\'s Law
INSERT INTO simulations (title, subject, description, difficulty) VALUES
('Ohm\'s Law: Voltage, Current, and Resistance', 'Physics', 'Explore the relationship between voltage, current, and resistance in an electrical circuit. Verify Ohm\'s Law: V = IR.', 'Easy');

SET @phys_id = LAST_INSERT_ID();

INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@phys_id, 1, 'Set Voltage', 'Use the power supply to set the circuit voltage. Start with 3V. You can adjust from 0V to 12V. Higher voltage will produce higher current (if resistance stays constant).', '{"type":"slider","min":0,"max":12,"unit":"V","default":3}'),
(@phys_id, 2, 'Add Resistor', 'Select a resistor for your circuit. Try a 10Ω resistor first. Resistors limit current flow. Color codes help identify resistance values.', '{"type":"component","resistance":10,"unit":"Ω"}'),
(@phys_id, 3, 'Measure Current', 'Close the circuit and read the ammeter. Current (I) is measured in Amperes (A). With 3V and 10Ω, you should measure approximately 0.3A. Record your measurement.', '{"type":"measurement","expected_current":0.3}'),
(@phys_id, 4, 'Plot V-I Relation', 'Repeat steps 1-3 with different voltages (3V, 6V, 9V, 12V). Plot a graph of Voltage (V) vs Current (I). You should get a straight line through the origin.', '{"type":"graph","points":4}'),
(@phys_id, 5, 'Calculate Resistance', 'From your graph, calculate the slope (V/I). This equals resistance R. Verify: R = V/I = 10Ω. Conclusion: Ohm\'s Law states V = IR, where voltage is proportional to current for a constant resistance.', '{"type":"result","target_resistance":10}');
