-- Seed: Simulation Steps for Chemistry G10-12 Experiments
-- Runs AFTER seed_chemistry_grades10_12.sql
USE sayansi_yathu;

-- Helper: Get experiment IDs by code
SET @g10_001 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-001');
SET @g10_002 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-002');
SET @g10_003 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-003');
SET @g10_004 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-004');
SET @g10_005 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-005');
SET @g10_006 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-006');
SET @g10_007 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-007');
SET @g10_008 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G10-008');
SET @g11_001 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-001');
SET @g11_002 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-002');
SET @g11_003 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-003');
SET @g11_004 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-004');
SET @g11_005 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-005');
SET @g11_006 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-006');
SET @g11_007 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-007');
SET @g11_008 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-008');
SET @g11_009 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-009');
SET @g11_010 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-010');
SET @g11_011 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-011');
SET @g11_012 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G11-012');
SET @g12_001 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-001');
SET @g12_002 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-002');
SET @g12_003 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-003');
SET @g12_004 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-004');
SET @g12_005 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-005');
SET @g12_006 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-006');
SET @g12_007 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-007');
SET @g12_008 = (SELECT id FROM experiments WHERE experiment_code = 'CHE-G12-008');

-- CHE-G10-001: Atomic Structure
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g10_001,1,'Introduction','Study the periodic table and identify the element you want to model.','{\"type\":\"intro\",\"sim\":\"3d_atom_builder\"}'),
(@g10_001,2,'Select Element','Choose an element from the selector. Notice its atomic number.','{\"type\":\"action\",\"visual\":\"atom_selector\"}'),
(@g10_001,3,'Build Electron Shells','Drag electrons into their correct energy shells: 2, 8, 8...','{\"type\":\"action\",\"visual\":\"electron_shells\"}'),
(@g10_001,4,'Verify Configuration','Check your electron arrangement matches the element\'s atomic number.','{\"type\":\"observation\"}'),
(@g10_001,5,'Conclusion','Record the electronic configuration and explain what it means.','{\"type\":\"result\"}');

-- CHE-G10-002: Ionic Bonds
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g10_002,1,'Select Atoms','Choose a metal atom (e.g. Na) and a non-metal atom (e.g. Cl).','{\"type\":\"intro\",\"sim\":\"bond_formation\"}'),
(@g10_002,2,'Electron Transfer','Observe the metal losing its outer electron to the non-metal.','{\"type\":\"action\",\"visual\":\"electron_transfer\"}'),
(@g10_002,3,'Ion Formation','Notice the positive cation and negative anion that form.','{\"type\":\"observation\"}'),
(@g10_002,4,'Ionic Bond','The oppositely charged ions attract — an ionic bond forms.','{\"type\":\"action\",\"visual\":\"ion_pair\"}'),
(@g10_002,5,'Conclusion','Record the formula of the ionic compound formed.','{\"type\":\"result\"}');

-- CHE-G10-003: Covalent Bonds
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g10_003,1,'Select Molecule','Choose a molecule to build: H2O, CH4 or NH3.','{\"type\":\"intro\",\"sim\":\"molecular_builder\"}'),
(@g10_003,2,'Share Electrons','Drag electrons into the shared bonding region between atoms.','{\"type\":\"action\",\"visual\":\"electron_sharing\"}'),
(@g10_003,3,'Build the Molecule','Complete all bonds until each atom has a full outer shell.','{\"type\":\"action\",\"visual\":\"molecule_3d\"}'),
(@g10_003,4,'Observe Shape','Rotate the 3D molecule and note its shape.','{\"type\":\"observation\"}'),
(@g10_003,5,'Conclusion','Explain how sharing electrons satisfies the octet rule.','{\"type\":\"result\"}');

-- CHE-G10-006: Balancing Equations
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g10_006,1,'Reactants','Identify the reactants and products in the unbalanced equation.','{\"type\":\"intro\",\"sim\":\"equation_balancer\"}'),
(@g10_006,2,'Count Atoms','Count the atoms of each element on both sides.','{\"type\":\"action\",\"visual\":\"atom_counter\"}'),
(@g10_006,3,'Add Coefficients','Adjust coefficients to balance each element in turn.','{\"type\":\"action\",\"visual\":\"coefficient_slider\"}'),
(@g10_006,4,'Verify','Confirm atom counts are equal on both sides.','{\"type\":\"observation\"}'),
(@g10_006,5,'Conclusion','State the law of conservation of mass demonstrated.','{\"type\":\"result\"}');

-- CHE-G11-001: Indicators
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g11_001,1,'Prepare Indicators','Set up litmus paper and universal indicator solution.','{\"type\":\"intro\",\"sim\":\"indicator_lab\"}'),
(@g11_001,2,'Test Acidic Substance','Dip indicator into lemon juice. Observe the colour change.','{\"type\":\"action\",\"visual\":\"indicator_dip\"}'),
(@g11_001,3,'Test Alkaline Substance','Dip indicator into soap solution. Observe the colour change.','{\"type\":\"action\",\"visual\":\"indicator_dip\"}'),
(@g11_001,4,'Test Neutral Substance','Test distilled water. Record your observation.','{\"type\":\"observation\"}'),
(@g11_001,5,'Record Results','Complete the results table for all substances tested.','{\"type\":\"result\"}');

-- CHE-G11-006: Titration
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g11_006,1,'Setup','Fill the burette with NaOH solution to the 0.00 mL mark.','{\"type\":\"intro\",\"sim\":\"titration\"}'),
(@g11_006,2,'Prepare Flask','Pipette 25.0 mL of HCl into the conical flask. Add 3 drops of phenolphthalein.','{\"type\":\"action\",\"visual\":\"pipette\"}'),
(@g11_006,3,'Titrate','Open the burette tap slowly. Add NaOH drop by drop near the endpoint.','{\"type\":\"action\",\"visual\":\"burette_drip\"}'),
(@g11_006,4,'Endpoint','Stop when the solution turns permanently pink. Record the volume used.','{\"type\":\"observation\"}'),
(@g11_006,5,'Calculate','Use C1V1 = C2V2 to calculate the concentration of HCl.','{\"type\":\"result\"}');

-- CHE-G11-009: Reaction Rates
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g11_009,1,'Setup','Place marble chips in a flask. Add dilute HCl.','{\"type\":\"intro\",\"sim\":\"reaction_rate_sim\"}'),
(@g11_009,2,'Measure Rate','Start the stopwatch. Record mass lost every 30 seconds.','{\"type\":\"action\",\"visual\":\"mass_loss_graph\"}'),
(@g11_009,3,'Change Temperature','Repeat with heated acid. Compare the rate of gas production.','{\"type\":\"action\",\"visual\":\"temperature_slider\"}'),
(@g11_009,4,'Change Concentration','Use more concentrated acid. Observe the change in rate.','{\"type\":\"action\",\"visual\":\"concentration_slider\"}'),
(@g11_009,5,'Conclusion','Explain your results using collision theory.','{\"type\":\"result\"}');

-- CHE-G12-002: Electrolysis
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g12_002,1,'Setup Cell','Connect the electrolysis cell to the power supply. Add molten lead bromide.','{\"type\":\"intro\",\"sim\":\"electrolysis_sim\"}'),
(@g12_002,2,'Switch On','Turn on the power supply. Observe what happens at each electrode.','{\"type\":\"action\",\"visual\":\"electrode_view\"}'),
(@g12_002,3,'Cathode','Record what is deposited at the cathode (negative electrode).','{\"type\":\"observation\"}'),
(@g12_002,4,'Anode','Record what is produced at the anode (positive electrode).','{\"type\":\"observation\"}'),
(@g12_002,5,'Conclusion','Write the half-equations for each electrode reaction.','{\"type\":\"result\"}');

-- CHE-G12-007: Corrosion
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g12_007,1,'Setup','Place iron nails in 5 different test tubes with different conditions.','{\"type\":\"intro\",\"sim\":\"corrosion_sim\"}'),
(@g12_007,2,'Conditions','Tube 1: air+water. Tube 2: oil. Tube 3: dry air. Tube 4: boiled water. Tube 5: salt water.','{\"type\":\"action\",\"visual\":\"test_tube_setup\"}'),
(@g12_007,3,'Observe','After 7 days, observe each nail for rust formation.','{\"type\":\"observation\"}'),
(@g12_007,4,'Analyse','Identify which conditions caused the most/least rusting.','{\"type\":\"action\",\"visual\":\"results_table\"}'),
(@g12_007,5,'Conclusion','State the conditions required for rusting and ways to prevent it.','{\"type\":\"result\"}');

-- CHE-G12-008: Hydrogen Gas
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(@g12_008,1,'Setup','Place zinc granules in a flask. Connect delivery tube.','{\"type\":\"intro\",\"sim\":\"gas_prep_lab\"}'),
(@g12_008,2,'Add Acid','Add dilute hydrochloric acid to the zinc. Observe gas production.','{\"type\":\"action\",\"visual\":\"reaction_flask\"}'),
(@g12_008,3,'Collect Gas','Collect gas by displacement of water in an inverted test tube.','{\"type\":\"action\",\"visual\":\"gas_collection\"}'),
(@g12_008,4,'Test Gas','Apply a burning splint to the mouth of the test tube.','{\"type\":\"observation\"}'),
(@g12_008,5,'Conclusion','A squeaky pop confirms hydrogen. Write the equation for the reaction.','{\"type\":\"result\"}');

SELECT 'Simulation steps seeded successfully for Chemistry G10-12.' AS status;
