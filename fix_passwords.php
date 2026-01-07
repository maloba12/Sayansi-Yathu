<?php
require_once 'backend-php/config/db.php';

$database = new Database();
$db = $database->getConnection();

$password = 'password';
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare("UPDATE users SET password = :hash WHERE email IN ('admin@sayansi-yathu.zm', 'phiri.physics@school.zm')");
$stmt->bindParam(':hash', $hash);

if ($stmt->execute()) {
    echo "Passwords updated successfully for admin and physics teacher.\n";
} else {
    echo "Error updating passwords.\n";
}
?>
