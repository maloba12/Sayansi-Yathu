<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

$userId = $data->userId;
$experimentId = $data->experimentId;
$completedSteps = $data->completedSteps;
$score = $data->score;

$query = "INSERT INTO progress (user_id, experiment_id, completed_steps, score, last_accessed) 
          VALUES (?, ?, ?, ?, NOW()) 
          ON DUPLICATE KEY UPDATE 
          completed_steps = VALUES(completed_steps), 
          score = VALUES(score), 
          last_accessed = VALUES(last_accessed)";

$stmt = $db->prepare($query);
$stmt->execute([$userId, $experimentId, $completedSteps, $score]);

echo json_encode(["message" => "Progress saved successfully"]);
?>