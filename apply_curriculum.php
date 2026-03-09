<?php
require_once 'backend-php/config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $sql = file_get_contents('database/add_curriculum_columns.sql');
    
    $db->exec($sql);
    echo "Curriculum columns added successfully.\n";
} catch(Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
