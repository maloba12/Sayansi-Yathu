<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

include_once '../config/db.php';
include_once '../utils/helpers.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

$name = isset($data->fullName) ? trim($data->fullName) : '';
$email = isset($data->email) ? trim($data->email) : '';
$password = isset($data->password) ? $data->password : '';
$role = $data->role ?? 'student';

// Validation
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Full name, email, and password are required"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit();
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Password must be at least 8 characters"]);
    exit();
}

// Check if email exists
$checkQuery = "SELECT id FROM users WHERE email = ? LIMIT 1";
$checkStmt = $db->prepare($checkQuery);
$checkStmt->execute([$email]);

if ($checkStmt->fetch()) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit();
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Generate username from email
$username = explode('@', $email)[0];

$query = "INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)";
$stmt = $db->prepare($query);

try {
    $db->beginTransaction();
    
    $stmt->execute([$name, $email, $username, $hashed_password, $role]);
    $userId = $db->lastInsertId();

    $studentId = null;
    if ($role === 'student') {
        $grade = $data->grade ?? 11;
        $class = $data->class ?? 'A';
        $year = date('Y');
        
        $studentId = generateStudentId($db, $year, $grade);
        
        $studentQuery = "INSERT INTO students (linked_user_id, student_id, grade_or_form, class, enrolled_year) 
                          VALUES (?, ?, ?, ?, ?)";
        $studentStmt = $db->prepare($studentQuery);
        $studentStmt->execute([$userId, $studentId, $grade, $class, $year]);
    }

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "success" => true, 
        "message" => "Registration successful! " . ($studentId ? "Your Student ID is $studentId." : "You can now log in."),
        "user_id" => $userId,
        "student_id" => $studentId
    ]);
} catch(PDOException $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Registration failed", 
        "error" => $e->getMessage()
    ]);
}
?>