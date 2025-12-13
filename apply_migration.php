<?php
require_once 'backend-php/config/db.php';

try {
    // Environment variables removed, relying on config/db.php defaults
    $database = new Database();
    $db = $database->getConnection();
    
    $sql = file_get_contents('backend-php/migrations/20251212_create_device_fingerprints.sql');
    
    $db->exec($sql);
    echo "Migration applied successfully.\n";
} catch(Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
