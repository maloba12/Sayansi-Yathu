-- Add simulation_steps table for step-by-step experiment guidance

CREATE TABLE IF NOT EXISTS simulation_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    simulation_id INT NOT NULL,
    step_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    media_url VARCHAR(500) NULL,
    config_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (simulation_id) REFERENCES experiments(id) ON DELETE CASCADE,
    INDEX idx_simulation_steps (simulation_id, step_order)
);

-- Insert sample steps for Simple Pendulum (ID=1)
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(1, 1, 'Introduction', 'Welcome to the Simple Pendulum simulation!', '{"type": "intro"}'),
(1, 2, 'Observe Pendulum Motion', 'Watch the pendulum swing and observe its motion', '{"type": "action", "visual": "pendulum"}'),
(1, 3, 'Measure Period', 'Use the timer to measure the period of one complete swing', '{"type": "observation"}'),
(1, 4, 'Record Results', 'Record your measurements in your notebook', '{"type": "result"}');

-- Insert sample steps for Ohm's Law Circuit (ID=2)
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(2, 1, 'Introduction', 'Welcome to Ohm''s Law Circuit simulation!', '{"type": "intro"}'),
(2, 2, 'Build Circuit', 'Observe the circuit with battery, resistor, and wires', '{"type": "action", "visual": "circuit"}'),
(2, 3, 'Measure Current', 'Use the voltmeter to measure voltage and current', '{"type": "observation"}'),
(2, 4, 'Calculate Resistance', 'Apply Ohm''s Law: V = IR to calculate resistance', '{"type": "calculation"}');

-- Insert sample steps for Chemistry (ID=3-4)
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(3, 1, 'Introduction', 'Welcome to the Acid-Base Titration experiment!', '{"type": "intro"}'),
(3, 2, 'Prepare Solutions', 'Set up the burette with acid and beaker with base', '{"type": "action", "visual": "pipette"}'),
(3, 3, 'Perform Titration', 'Slowly add acid and watch the color change', '{"type": "observation"}'),
(3, 4, 'Record Results', 'Note the volume of acid required for neutralization', '{"type": "result"}');

INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(4, 1, 'Introduction', 'Welcome to Chemical Reactions!', '{"type": "intro"}'),
(4, 2, 'Mix Chemicals', 'Observe the reaction when chemicals are mixed', '{"type": "action", "visual": "beaker"}'),
(4, 3, 'Observe Changes', 'Watch for color changes, gas bubbles, or temperature changes', '{"type": "observation"}'),
(4, 4, 'Record Observations', 'Document what you observed during the reaction', '{"type": "result"}');

-- Biology experiments (ID=5-6)
INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(5, 1, 'Introduction', 'Explore the structure of a cell!', '{"type": "intro"}'),
(5, 2, 'Observe Cell Parts', 'Examine the different organelles in the cell', '{"type": "action", "visual": "cell_3d"}'),
(5, 3, 'Identify Organelles', 'Can you find the nucleus, mitochondria, and cell membrane?', '{"type": "observation"}'),
(5, 4, 'Quiz', 'Test your knowledge of cell structures', '{"type": "result"}');

INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES
(6, 1, 'Introduction', 'Learn about DNA Replication!', '{"type": "intro"}'),
(6, 2, 'View DNA Structure', 'Observe the double helix structure of DNA', '{"type": "action", "visual": "dna"}'),
(6, 3, 'Watch Replication', 'See how DNA unzips and replicates itself', '{"type": "observation"}'),
(6, 4, 'Summary', 'Review the key steps of DNA replication', '{"type": "result"}');
