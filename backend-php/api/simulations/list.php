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

try {
    // Optional filters
    $subject = isset($_GET['subject']) ? $_GET['subject'] : null;
    $difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : null;
    
    $query = "SELECT id, title, subject, description, thumbnail_url, difficulty 
              FROM simulations WHERE 1=1";
    
    $params = [];
    
    if ($subject) {
        $query .= " AND subject = :subject";
        $params[':subject'] = $subject;
    }
    
    if ($difficulty) {
        $query .= " AND difficulty = :difficulty";
        $params[':difficulty'] = $difficulty;
    }
    
    $query .= " ORDER BY subject, title";
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    
    $simulations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "count" => count($simulations),
        "simulations" => $simulations
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch simulations",
        "error" => $e->getMessage()
    ]);
}
?>
