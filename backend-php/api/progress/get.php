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

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$simulation_id = isset($_GET['simulation_id']) ? (int)$_GET['simulation_id'] : null;

if ($user_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid user_id"
    ]);
    exit();
}

try {
    if ($simulation_id) {
        // Get progress for specific simulation
        $query = "SELECT sp.*, s.title, s.subject 
                  FROM student_progress sp
                  JOIN simulations s ON sp.simulation_id = s.id
                  WHERE sp.user_id = :uid AND sp.simulation_id = :sid LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute([':uid' => $user_id, ':sid' => $simulation_id]);
        $progress = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "progress" => $progress ?: null
        ]);
    } else {
        // Get all progress for user
        $query = "SELECT sp.*, s.title, s.subject, s.thumbnail_url 
                  FROM student_progress sp
                  JOIN simulations s ON sp.simulation_id = s.id
                  WHERE sp.user_id = :uid
                  ORDER BY sp.last_played_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute([':uid' => $user_id]);
        $progress = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "count" => count($progress),
            "progress" => $progress
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch progress",
        "error" => $e->getMessage()
    ]);
}
?>
