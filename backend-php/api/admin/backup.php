<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../../config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $tables = ['users', 'experiments', 'user_progress'];
    $backup = [];
    
    foreach ($tables as $table) {
        try {
            $query = "SELECT * FROM $table";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $backup[$table] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $backup[$table] = "Error fetching table: " . $e->getMessage();
        }
    }
    
    $filename = "sayansi_yathu_backup_" . date('Y-m-d_H-i-s') . ".json";
    
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    echo json_encode($backup, JSON_PRETTY_PRINT);
    exit();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create backup',
        'error' => $e->getMessage()
    ]);
}
