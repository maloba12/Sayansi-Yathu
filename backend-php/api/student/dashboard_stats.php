<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once '../../config/db.php';
require_once '../../utils/helpers.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;

if ($user_id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid user_id"]);
    exit();
}

try {
    // 1. Get student basic stats
    $statsQuery = "SELECT 
                    COUNT(DISTINCT experiment_id) as experiments_completed,
                    IFNULL(AVG(score), 0) as avg_score
                  FROM progress 
                  WHERE user_id = :uid AND completed_steps >= total_steps AND total_steps > 0";
    $statsStmt = $db->prepare($statsQuery);
    $statsStmt->execute([':uid' => $user_id]);
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    // 2. Get subject mastery
    $masteryQuery = "SELECT 
                        e.subject,
                        ROUND(AVG(p.score), 0) as mastery
                     FROM progress p
                     JOIN experiments e ON p.experiment_id = e.id
                     WHERE p.user_id = :uid
                     GROUP BY e.subject";
    $masteryStmt = $db->prepare($masteryQuery);
    $masteryStmt->execute([':uid' => $user_id]);
    $mastery = $masteryStmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Get recent focus (last 3 accessed but not completed, or just latest 3)
    $focusQuery = "SELECT e.title, e.subject, 'Assignment' as type, 
                          CASE WHEN p.completed_steps >= p.total_steps AND p.total_steps > 0 THEN 'Done' ELSE 'In Progress' END as due,
                          (p.completed_steps < p.total_steps OR p.total_steps = 0) as urgent
                   FROM progress p
                   JOIN experiments e ON p.experiment_id = e.id
                   WHERE p.user_id = :uid
                   ORDER BY p.last_accessed DESC
                   LIMIT 3";
    $focusStmt = $db->prepare($focusQuery);
    $focusStmt->execute([':uid' => $user_id]);
    $focus = $focusStmt->fetchAll(PDO::FETCH_ASSOC);

    // If no focus data, provide default curriculum goals
    if (empty($focus)) {
        $focus = [
            ['title' => 'Introduction to Labs', 'subject' => 'General', 'type' => 'Orientation', 'due' => 'Recommended', 'urgent' => true],
            ['title' => 'Lab Safety Rules', 'subject' => 'General', 'type' => 'Review', 'due' => 'Required', 'urgent' => false]
        ];
    }

    echo json_encode([
        "success" => true,
        "stats" => [
            "experiments_completed" => (int)$stats['experiments_completed'],
            "avg_score" => round((float)$stats['avg_score'], 1)
        ],
        "mastery" => $mastery,
        "focus" => $focus
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch dashboard stats",
        "error" => $e->getMessage()
    ]);
}
?>
