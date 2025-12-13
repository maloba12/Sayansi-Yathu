<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$sim_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($sim_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid simulation ID"
    ]);
    exit();
}

try {
    // Get simulation details
    $simQuery = "SELECT id, title, subject, description, thumbnail_url, difficulty 
                 FROM simulations WHERE id = :id LIMIT 1";
    $simStmt = $db->prepare($simQuery);
    $simStmt->execute([':id' => $sim_id]);
    $simulation = $simStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$simulation) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Simulation not found"
        ]);
        exit();
    }
    
    // Get simulation steps
    $stepsQuery = "SELECT id, step_order, title, instructions, media_url, config_json 
                   FROM simulation_steps 
                   WHERE simulation_id = :sim_id 
                   ORDER BY step_order ASC";
    $stepsStmt = $db->prepare($stepsQuery);
    $stepsStmt->execute([':sim_id' => $sim_id]);
    $steps = $stepsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode JSON config for each step
    foreach ($steps as &$step) {
        if ($step['config_json']) {
            $step['config'] = json_decode($step['config_json'], true);
            unset($step['config_json']);
        }
    }
    
    $simulation['steps'] = $steps;
    $simulation['total_steps'] = count($steps);
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "simulation" => $simulation
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch simulation details",
        "error" => $e->getMessage()
    ]);
}
?>
