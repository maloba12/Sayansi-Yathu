<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT id, COALESCE(name, 'Unknown') as name, email, role, created_at 
              FROM users 
              ORDER BY created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format dates nicely
    foreach ($users as &$user) {
        if ($user['created_at']) {
            $user['created_at'] = date('Y-m-d', strtotime($user['created_at']));
        } else {
            $user['created_at'] = 'N/A';
        }
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $users,
        'count' => count($users)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch users',
        'error' => $e->getMessage()
    ]);
}
