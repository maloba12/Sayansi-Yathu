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
$current_step = isset($data['current_step']) ? (int)$data['current_step'] : 0;
$completed = isset($data['completed']) ? (bool)$data['completed'] : false;
$score = isset($data['score']) ? (int)$data['score'] : 0;

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
    $checkQuery = "SELECT id FROM student_progress 
                   WHERE user_id = :uid AND simulation_id = :sid LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([':uid' => $user_id, ':sid' => $simulation_id]);
    $existing = $checkStmt->fetch();
    
    if ($existing) {
        // Update existing progress
        $updateQuery = "UPDATE student_progress 
                        SET current_step = :step, completed = :completed, score = :score, 
                            last_played_at = CURRENT_TIMESTAMP 
                        WHERE user_id = :uid AND simulation_id = :sid";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->execute([
            ':step' => $current_step,
            ':completed' => $completed ? 1 : 0,
            ':score' => $score,
            ':uid' => $user_id,
            ':sid' => $simulation_id
        ]);
        $message = "Progress updated";
    } else {
        // Insert new progress
        $insertQuery = "INSERT INTO student_progress 
                        (user_id, simulation_id, current_step, completed, score) 
                        VALUES (:uid, :sid, :step, :completed, :score)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->execute([
            ':uid' => $user_id,
            ':sid' => $simulation_id,
            ':step' => $current_step,
            ':completed' => $completed ? 1 : 0,
            ':score' => $score
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
