<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

$userId = $_GET['user'];
$experimentId = $_GET['experiment'];

// Get experiment details
$query = "SELECT e.*, p.score, p.completed_steps, p.time_spent, 
          u.name as student_name
          FROM experiments e
          JOIN progress p ON e.id = p.experiment_id
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = ? AND e.id = ?";

$stmt = $db->prepare($query);
$stmt->execute([$userId, $experimentId]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

// Get detailed experiment data
$data = [
    'student_name' => $result['student_name'],
    'experiment_name' => $result['title'],
    'subject' => $result['subject'],
    'score' => $result['score'],
    'completed_steps' => $result['completed_steps'],
    'time_spent' => $result['time_spent'],
    'date' => date('Y-m-d'),
    'results' => $this->getDetailedResults($experimentId, $userId)
];

echo json_encode($data);
?>