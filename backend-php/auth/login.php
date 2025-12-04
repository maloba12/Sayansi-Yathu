<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// In production, restrict origin to trusted frontends
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: " . $origin);
header("Vary: Origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit();
}

include_once '../config/db.php';
include_once '../utils/helpers.php';

$database = new Database();
$db = $database->getConnection();

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Always respond with a generic error for invalid credentials
$genericError = 'Invalid login credentials. Please check your email, Student ID, or password and try again.';

if (!is_array($data) || empty($data['identifier']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => $genericError]);
    exit();
}

$identifier = trim($data['identifier']);
$password = (string) $data['password'];
$rememberDevice = !empty($data['remember_device']);
$deviceFingerprint = isset($data['device_fingerprint']) ? substr((string)$data['device_fingerprint'], 0, 255) : null;
$clientIp = getClientIp();

// Normalize identifier for search
$identifierUpper = strtoupper($identifier);

// Check for account lock based on recent failed attempts
$lockMinutes = 5;
$maxFailedAttempts = 5;

// Simple per-identifier lock using users.failed_attempts and users.locked_until
try {
    $lockQuery = "SELECT id, failed_attempts, locked_until FROM users 
                  WHERE email = :identifier 
                     OR username = :identifier 
                     OR id IN (
                        SELECT linked_user_id FROM students WHERE student_id = :identifier
                     )
                  LIMIT 1";
    $lockStmt = $db->prepare($lockQuery);
    $lockStmt->execute([':identifier' => $identifier]);
    $lockRow = $lockStmt->fetch();

    if ($lockRow && !empty($lockRow['locked_until']) && strtotime($lockRow['locked_until']) > time()) {
        http_response_code(429);
        echo json_encode([
            "message" => "Too many failed attempts. Please try again after a few minutes.",
            "locked" => true
        ]);
        exit();
    }
} catch (Exception $e) {
    error_log('Lock check failed: ' . $e->getMessage());
}

// Find user by email, username, or student_id
$user = null;
$studentMeta = null;

try {
    // Attempt to parse as student ID first
    $studentParsed = parseStudentId($identifierUpper);

    if ($studentParsed !== null) {
        $studentQuery = "SELECT s.student_id, s.grade_or_form, s.class, s.enrolled_year, 
                                u.id, u.name, u.email, u.password, u.role
                         FROM students s
                         JOIN users u ON s.linked_user_id = u.id
                         WHERE s.student_id = :student_id
                         LIMIT 1";
        $stmt = $db->prepare($studentQuery);
        $stmt->execute([':student_id' => $identifierUpper]);
        $row = $stmt->fetch();
        if ($row) {
            $user = [
                'id' => $row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'password' => $row['password'],
                'role' => $row['role'],
            ];
            $studentMeta = [
                'student_id' => $row['student_id'],
                'grade_or_form' => $row['grade_or_form'],
                'class' => $row['class'],
                'enrolled_year' => $row['enrolled_year'],
            ];
        }
    }

    // If not a student ID match, search users by email/username
    if ($user === null) {
        $userQuery = "SELECT id, name, email, username, password, role 
                      FROM users 
                      WHERE email = :identifier OR username = :identifier
                      LIMIT 1";
        $stmt = $db->prepare($userQuery);
        $stmt->execute([':identifier' => $identifier]);
        $user = $stmt->fetch() ?: null;
    }
} catch (Exception $e) {
    error_log('User lookup failed: ' . $e->getMessage());
}

$loginSuccess = false;
$responseUser = null;

if ($user && password_verify($password, $user['password'])) {
    $loginSuccess = true;

    // Reset failed attempts
    try {
        $resetQuery = "UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = :id";
        $resetStmt = $db->prepare($resetQuery);
        $resetStmt->execute([':id' => $user['id']]);
    } catch (Exception $e) {
        error_log('Failed to reset failed_attempts: ' . $e->getMessage());
    }

    $dashboardRoute = getDashboardRouteForRole($user['role']);

    $responseUser = [
        "id" => (int) $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role'],
        "dashboard_route" => $dashboardRoute,
    ];

    if ($studentMeta) {
        $responseUser['profile'] = [
            "student_id" => $studentMeta['student_id'],
            "grade_or_form" => $studentMeta['grade_or_form'],
            "class" => $studentMeta['class'],
            "enrolled_year" => $studentMeta['enrolled_year'],
        ];
    }

    // Generate JWT
    $token = generateJWT($user['id'], $user['role']);

    // Set HTTP-only, Secure cookie (Secure should be true when using HTTPS)
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    setcookie(
        'sy_auth',
        $token,
        [
            'expires' => time() + 60 * 30,
            'path' => '/',
            'domain' => '',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]
    );

    // Basic device fingerprint hook – in a full implementation we would verify and possibly require OTP
    $requiresVerification = false;
    if ($deviceFingerprint && $rememberDevice) {
        // Placeholder: mark device as trusted (table not implemented here)
        // Future: store device fingerprint + user id, and compare on next login
    }

    // Log successful login
    try {
        $logStmt = $db->prepare("INSERT INTO security_logs (user_id, event_type, ip_address, user_agent, details) 
                                 VALUES (:user_id, 'login_success', :ip, :ua, :details)");
        $logStmt->execute([
            ':user_id' => $user['id'],
            ':ip' => $clientIp,
            ':ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
            ':details' => json_encode(['identifier_used' => $identifier]),
        ]);
    } catch (Exception $e) {
        error_log('Security log insert failed: ' . $e->getMessage());
    }

    http_response_code(200);
    echo json_encode([
        "message" => "Login successful",
        "token" => $token,
        "user" => $responseUser,
        "dashboard_route" => $dashboardRoute,
        "requires_verification" => $requiresVerification,
    ]);
    exit();
}

// Handle failed login: increment counters and possibly lock
if ($lockRow) {
    $failedAttempts = (int) $lockRow['failed_attempts'] + 1;
    $lockedUntil = null;
    if ($failedAttempts >= $maxFailedAttempts) {
        $lockedUntil = date('Y-m-d H:i:s', time() + ($lockMinutes * 60));
    }

    try {
        $update = "UPDATE users SET failed_attempts = :attempts, locked_until = :locked_until WHERE id = :id";
        $updateStmt = $db->prepare($update);
        $updateStmt->execute([
            ':attempts' => $failedAttempts,
            ':locked_until' => $lockedUntil,
            ':id' => $lockRow['id'],
        ]);
    } catch (Exception $e) {
        error_log('Failed to update failed_attempts: ' . $e->getMessage());
    }
}

// Log failed attempt (generic)
try {
    $logStmt = $db->prepare("INSERT INTO security_logs (user_id, event_type, ip_address, user_agent, details) 
                             VALUES (NULL, 'login_failure', :ip, :ua, :details)");
    $logStmt->execute([
        ':ip' => $clientIp,
        ':ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
        ':details' => json_encode([
            'identifier_used' => $identifier,
        ]),
    ]);
} catch (Exception $e) {
    error_log('Security log insert failed: ' . $e->getMessage());
}

// If account was just locked, return lock message, else generic invalid credentials
if (!empty($lockedUntil) && strtotime($lockedUntil) > time()) {
    http_response_code(429);
    echo json_encode([
        "message" => "Too many failed attempts. Please try again after a few minutes.",
        "locked" => true
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "message" => $genericError
    ]);
}

?>
