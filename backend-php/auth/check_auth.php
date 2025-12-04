<?php
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';
include_once '../utils/helpers.php';

$database = new Database();
$db = $database->getConnection();

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = null;

if (preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
    $token = trim($matches[1]);
} elseif (!empty($_COOKIE['sy_auth'])) {
    $token = $_COOKIE['sy_auth'];
}

if (!$token) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$payload = validateJWT($token);
if (!$payload) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$requiredRole = $_GET['role'] ?? null;

try {
    $stmt = $db->prepare("SELECT id, name, email, role FROM users WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $payload['user_id']]);
    $user = $stmt->fetch();
} catch (Exception $e) {
    error_log('Auth check failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Server error']);
    exit();
}

if (!$user) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

if ($requiredRole && $user['role'] !== $requiredRole) {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit();
}

echo json_encode([
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ]
]);

?>


