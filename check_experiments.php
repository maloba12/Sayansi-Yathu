<?php
require_once 'backend-php/config/db.php';
try {
    $database = new Database();
    $db = $database->getConnection();
    $stmt = $db->query("SELECT count(*) as count FROM experiments");
    $row = $stmt->fetch();
    echo "Experiment Count: " . $row['count'] . "\n";
    
    if ($row['count'] > 0) {
        $stmt = $db->query("SELECT title, subject FROM experiments");
        while ($row = $stmt->fetch()) {
            echo "- " . $row['title'] . " (" . $row['subject'] . ")\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
