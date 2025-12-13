<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed", "status" => "error"]);
    exit();
}

// Basic health check
$health = [
    "status" => "healthy",
    "version" => "1.0.0",
    "timestamp" => date('c'),
    "server" => "PHP " . PHP_VERSION,
    "endpoints" => [
        "GET /api/health" => "Health check",
        "POST /auth/login.php" => "User login",
        "POST /auth/register.php" => "User registration",
        "POST /api/getExperiment.php" => "Get experiments",
        "POST /api/saveProgress.php" => "Save progress"
    ]
];

echo json_encode($health);
?>
