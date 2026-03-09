<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

require_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data['user_id']) ? (int)$data['user_id'] : 0;
$simulation_id = isset($data['simulation_id']) ? (int)$data['simulation_id'] : 0;
$completed_steps = isset($data['completed_steps']) ? (int)$data['completed_steps'] : 0;
$total_steps = isset($data['total_steps']) ? (int)$data['total_steps'] : 0;
$score = isset($data['score']) ? (float)$data['score'] : 0;
$time_spent = isset($data['time_spent']) ? (int)$data['time_spent'] : 0;

if ($user_id <= 0 || $simulation_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid user_id or simulation_id"
    ]);
    exit();
}

try {
    // Check if progress exists
    $checkQuery = "SELECT id FROM progress 
                   WHERE user_id = :uid AND experiment_id = :eid LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([':uid' => $user_id, ':eid' => $simulation_id]);
    $existing = $checkStmt->fetch();
    
    if ($existing) {
        // Update existing progress
        $updateQuery = "UPDATE progress 
                        SET completed_steps = :completed_steps, total_steps = :total_steps, score = :score, 
                            time_spent = :time_spent, last_accessed = CURRENT_TIMESTAMP 
                        WHERE user_id = :uid AND experiment_id = :eid";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->execute([
            ':completed_steps' => $completed_steps,
            ':total_steps' => $total_steps,
            ':score' => $score,
            ':time_spent' => $time_spent,
            ':uid' => $user_id,
            ':eid' => $simulation_id
        ]);
        $message = "Progress updated";
    } else {
        // Insert new progress
        $insertQuery = "INSERT INTO progress 
                        (user_id, experiment_id, completed_steps, total_steps, score, time_spent) 
                        VALUES (:uid, :eid, :completed_steps, :total_steps, :score, :time_spent)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->execute([
            ':uid' => $user_id,
            ':eid' => $simulation_id,
            ':completed_steps' => $completed_steps,
            ':total_steps' => $total_steps,
            ':score' => $score,
            ':time_spent' => $time_spent
        ]);
        $message = "Progress saved";
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => $message
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to save progress",
        "error" => $e->getMessage()
    ]);
}
?>
