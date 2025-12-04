<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/db.php';
include_once '../utils/helpers.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$email = $data->email;
<<<<<<< HEAD
$password = password_hash($data->password, PASSWORD_BCRYPT, ['cost' => 12]);
=======
$password = password_hash($data->password, PASSWORD_BCRYPT);
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
$role = $data->role ?? 'student';

$query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
$stmt = $db->prepare($query);

try {
    $stmt->execute([$name, $email, $password, $role]);
    http_response_code(201);
    echo json_encode(["message" => "User registered successfully"]);
} catch(PDOException $e) {
    http_response_code(400);
    echo json_encode(["message" => "Registration failed", "error" => $e->getMessage()]);
}
?>