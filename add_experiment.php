<?php
require_once 'backend-php/config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $title = "Convex Lens Optics";
    $subject = "physics";
    $desc = "Explore image formation with convex lenses and focal points.";
    $diff = "intermediate";
    $type = "threejs";

    // Check if exists
    $check = $db->prepare("SELECT id FROM experiments WHERE title = ?");
    $check->execute([$title]);
    if($check->rowCount() > 0) {
        die("Experiment '$title' already exists.\n");
    }

    $sql = "INSERT INTO experiments (title, subject, description, difficulty_level, simulation_type) VALUES (?, ?, ?, ?, ?)";
    $stmt = $db->prepare($sql);
    if($stmt->execute([$title, $subject, $desc, $diff, $type])) {
        echo "Successfully added new experiment: $title\n";
    } else {
        echo "Failed to add experiment.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
