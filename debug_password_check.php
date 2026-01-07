<?php
require_once 'backend-php/config/db.php';

$email = 'admin@sayansi-yathu.zm';
$input_password = 'password';

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo "User not found.\n";
    exit;
}

echo "User ID: " . $user['id'] . "\n";
echo "Stored Hash: " . $user['password'] . "\n";
echo "Input Password: " . $input_password . "\n";

if (password_verify($input_password, $user['password'])) {
    echo "Password MATCHES!\n";
} else {
    echo "Password DOES NOT match.\n";
    // Debug: hash the input and compare
    echo "New Hash of input: " . password_hash($input_password, PASSWORD_BCRYPT) . "\n";
}
?>
