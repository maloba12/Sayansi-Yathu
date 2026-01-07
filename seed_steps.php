<?php
require_once 'backend-php/config/db.php';
// This script populates 'simulation_steps' for the existing 'experiments'.
// It assumes experiments table has IDs 1..6 (Pendulum, Ohm, Titration, Reaction, Cell, DNA)

try {
    $database = new Database();
    $db = $database->getConnection();

    // Disable FK checks to allow linking to 'experiments' ids even if 'simulations' table is empty/different
    $db->exec("SET FOREIGN_KEY_CHECKS=0");

    // Check if simulation_steps exists
    $db->exec("CREATE TABLE IF NOT EXISTS simulation_steps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        simulation_id INT NOT NULL,
        step_order INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        instructions TEXT NOT NULL,
        media_url VARCHAR(500),
        config_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $steps_data = [
        // Physics: Simple Pendulum (ID 1)
        1 => [
            ['order'=>1, 'title'=>'Introduction', 'instr'=>'Welcome to the Simple Pendulum experiment.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Set Length', 'instr'=>'Adjust the length of the pendulum string.', 'type'=>'slider', 'config'=>['type'=>'slider', 'min'=>10, 'max'=>100, 'default'=>50, 'unit'=>'cm']],
            ['order'=>3, 'title'=>'Observe Period', 'instr'=>'Watch how the period changes with length.', 'type'=>'observation', 'config'=>['type'=>'observation', 'visual'=>'pendulum']]
        ],
        // Physics: Ohm's Law (ID 2)
        2 => [
            ['order'=>1, 'title'=>'Introduction', 'instr'=>'Welcome to Ohm\'s Law Circuit.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Adjust Voltage', 'instr'=>'Change the voltage of the source.', 'type'=>'slider', 'config'=>['type'=>'slider', 'min'=>0, 'max'=>12, 'default'=>5, 'unit'=>'V']],
            ['order'=>3, 'title'=>'Measure Current', 'instr'=>'Observe the current on the Ammeter.', 'type'=>'result', 'config'=>['type'=>'result']]
        ],
        // Chemistry: Titration (ID 3)
        3 => [
            ['order'=>1, 'title'=>'Setup', 'instr'=>'Prepare the burette with acid and flask with base.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Add Indicator', 'instr'=>'Add Phenolphthalein to the flask.', 'type'=>'action', 'config'=>['type'=>'action', 'visual'=>'pipette']],
            ['order'=>3, 'title'=>'Titrate', 'instr'=>'Slowly add acid until color changes.', 'type'=>'slider', 'config'=>['type'=>'slider', 'min'=>0, 'max'=>50, 'default'=>0, 'unit'=>'mL']]
        ],
        // Chemistry: Reactions (ID 4)
        4 => [
            ['order'=>1, 'title'=>'Select Reactants', 'instr'=>'Choose two chemicals to mix.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Mix', 'instr'=>'Combine them in the beaker.', 'type'=>'action', 'config'=>['type'=>'action', 'visual'=>'beaker']],
            ['order'=>3, 'title'=>'Observation', 'instr'=>'Note color change or gas bubbles.', 'type'=>'observation', 'config'=>['type'=>'observation', 'visual'=>'bubbles']]
        ],
        // Biology: Cell Structure (ID 5)
        5 => [
            ['order'=>1, 'title'=>'Animal Cell', 'instr'=>'Explore the structure of an animal cell.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Nucleus', 'instr'=>'Identify the control center of the cell.', 'type'=>'observation', 'config'=>['type'=>'observation', 'visual'=>'cell_3d']],
            ['order'=>3, 'title'=>'Mitochondria', 'instr'=>'Locate the powerhouse of the cell.', 'type'=>'observation', 'config'=>['type'=>'observation', 'visual'=>'cell_3d']]
        ],
        // Biology: DNA (ID 6)
        6 => [
            ['order'=>1, 'title'=>'DNA Helix', 'instr'=>'Observe the double helix structure.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Unzip', 'instr'=>'Start the replication process.', 'type'=>'action', 'config'=>['type'=>'action', 'visual'=>'dna_unzip']],
            ['order'=>3, 'title'=>'Replicate', 'instr'=>'Watch new strands form.', 'type'=>'observation', 'config'=>['type'=>'observation', 'visual'=>'dna_replication']]
        ],
        // Physics: Optics (ID 7) - New
        7 => [
            ['order'=>1, 'title'=>'Optical Bench', 'instr'=>'Setup the convex lens and screen.', 'type'=>'intro'],
            ['order'=>2, 'title'=>'Move Object', 'instr'=>'Change object distance.', 'type'=>'slider', 'config'=>['type'=>'slider', 'min'=>10, 'max'=>100, 'default'=>30, 'unit'=>'cm']],
            ['order'=>3, 'title'=>'Focus', 'instr'=>'Adjust screen to find clear image.', 'type'=>'result', 'config'=>['type'=>'result']]
        ]
    ];

    $insertStmt = $db->prepare("INSERT INTO simulation_steps (simulation_id, step_order, title, instructions, config_json) VALUES (?, ?, ?, ?, ?)");

    foreach ($steps_data as $sim_id => $steps) {
        // Clear existing steps for this sim to avoid duplicates
        $db->prepare("DELETE FROM simulation_steps WHERE simulation_id = ?")->execute([$sim_id]);
        
        foreach ($steps as $step) {
            $config = isset($step['config']) ? json_encode($step['config']) : json_encode(['type'=>$step['type']]);
            $insertStmt->execute([$sim_id, $step['order'], $step['title'], $step['instr'], $config]);
        }
        echo "Seeded steps for Simulation ID $sim_id\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
