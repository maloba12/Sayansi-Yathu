<?php
/**
 * Gamification Sync Endpoint
 * POST /api/gamification/sync.php
 *
 * Syncs localStorage gamification data (XP, badges, level, streak) to MySQL.
 * Allows progress to persist across devices and browser sessions.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once '../../config/db.php';

$database = new Database();
$db = $database->getConnection();

// ---- POST: Save gamification data from frontend ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $userId     = isset($data['user_id'])     ? (int)$data['user_id']     : null;
    $xp         = isset($data['xp'])          ? (int)$data['xp']          : 0;
    $level      = isset($data['level'])       ? (int)$data['level']       : 1;
    $streak     = isset($data['streak'])      ? (int)$data['streak']      : 0;
    $badges     = isset($data['badges'])      ? $data['badges']           : [];
    $experiments = isset($data['experiments_completed'])
                    ? (int)$data['experiments_completed'] : 0;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "user_id is required"]);
        exit();
    }

    // Encode badges as JSON string for storage
    $badgesJson = json_encode($badges);

    $query = "
        INSERT INTO gamification (user_id, xp, level, streak, badges, experiments_completed, updated_at)
        VALUES (:user_id, :xp, :level, :streak, :badges, :experiments, NOW())
        ON DUPLICATE KEY UPDATE
            xp                   = GREATEST(xp, VALUES(xp)),
            level                = GREATEST(level, VALUES(level)),
            streak               = VALUES(streak),
            badges               = VALUES(badges),
            experiments_completed = GREATEST(experiments_completed, VALUES(experiments_completed)),
            updated_at           = NOW()
    ";

    try {
        $stmt = $db->prepare($query);
        $stmt->execute([
            ':user_id'     => $userId,
            ':xp'          => $xp,
            ':level'       => $level,
            ':streak'      => $streak,
            ':badges'      => $badgesJson,
            ':experiments' => $experiments,
        ]);
        echo json_encode(["success" => true, "message" => "Gamification data synced"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }

// ---- GET: Retrieve gamification data for a user ----
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "user_id is required"]);
        exit();
    }

    $query = "SELECT xp, level, streak, badges, experiments_completed, updated_at
              FROM gamification WHERE user_id = :user_id LIMIT 1";

    try {
        $stmt = $db->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        $row = $stmt->fetch();

        if ($row) {
            $row['badges'] = json_decode($row['badges'], true) ?: [];
            echo json_encode(["success" => true, "gamification" => $row]);
        } else {
            echo json_encode([
                "success" => true,
                "gamification" => [
                    "xp" => 0, "level" => 1, "streak" => 0,
                    "badges" => [], "experiments_completed" => 0
                ]
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
}
?>
