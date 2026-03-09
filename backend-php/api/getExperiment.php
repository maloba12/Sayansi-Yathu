<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

$userId = $_GET['userId'] ?? null;
$curriculum = $_GET['curriculum'] ?? null;
$grade = $_GET['grade'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["message" => "User ID required"]);
    exit();
}

$query = "SELECT e.*, p.completed_steps, p.score
          FROM experiments e
          LEFT JOIN progress p ON e.id = p.experiment_id AND p.user_id = :userId
          WHERE 1=1";

$params = [':userId' => $userId];

if ($curriculum) {
    $query .= " AND e.curriculum = :curriculum";
    $params[':curriculum'] = $curriculum;
}

if ($grade) {
    $query .= " AND e.grade_or_form = :grade";
    $params[':grade'] = $grade;
}

$query .= " ORDER BY e.subject, e.difficulty_level";

$stmt = $db->prepare($query);
$stmt->execute($params);

$experiments = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $experiments[] = $row;
}

echo json_encode($experiments);
?>