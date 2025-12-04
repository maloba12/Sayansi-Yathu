<?php
<<<<<<< HEAD

function getJwtSecret(): string {
    $env = getenv('JWT_SECRET');
    if ($env && strlen($env) >= 32) {
        return $env;
    }
    // Fallback for local dev – replace in production
    return 'change_this_dev_secret_to_a_strong_random_value';
}

function generateJWT($userId, $role = null) {
    $secret_key = getJwtSecret();
    $issued_at = time();
    // Short-lived access token (30 minutes)
    $expiration_time = $issued_at + (60 * 30);

=======
function generateJWT($userId) {
    $secret_key = "your_secret_key_here";
    $issued_at = time();
    $expiration_time = $issued_at + (60 * 60 * 24); // 24 hours
    
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
    $payload = [
        "iss" => "sayansi_yathu",
        "iat" => $issued_at,
        "exp" => $expiration_time,
<<<<<<< HEAD
        "user_id" => $userId,
        "role" => $role
    ];

    $header = [
        "alg" => "HS256",
        "typ" => "JWT"
    ];

    $base64Header = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
    $base64Payload = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $secret_key, true);
    $base64Signature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

function validateJWT($token) {
    $secret_key = getJwtSecret();
    $parts = explode('.', $token);

    if (count($parts) !== 3) {
        return false;
    }

    [$base64Header, $base64Payload, $base64Signature] = $parts;

    $payload = json_decode(base64_decode(strtr($base64Payload, '-_', '+/')), true);
    if (!$payload || !isset($payload['exp']) || !isset($payload['user_id'])) {
        return false;
    }

    $expectedSignature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $secret_key, true);
    $expectedBase64Signature = rtrim(strtr(base64_encode($expectedSignature), '+/', '-_'), '=');

    if (!hash_equals($expectedBase64Signature, $base64Signature)) {
        return false;
    }

    if ($payload['exp'] < time()) {
        return false;
    }

    return $payload;
}

/**
 * Map a role to its default dashboard route.
 */
function getDashboardRouteForRole(string $role): string {
    switch ($role) {
        case 'admin':
        case 'head_teacher':
            return '/dashboard/admin';
        case 'hod':
            return '/dashboard/hod';
        case 'teacher':
        case 'senior_teacher':
            return '/dashboard/teacher';
        case 'student':
        default:
            return '/dashboard/student';
    }
}

/**
 * Validate and parse a Student ID of the form: STU-2025-G10-001
 */
function parseStudentId(string $studentId): ?array {
    $pattern = '/^STU-(\d{4})-(G9|G10|G11|G12|F1|F2)-(\d{3,5})$/';
    if (!preg_match($pattern, strtoupper($studentId), $matches)) {
        return null;
    }

    $year = (int) $matches[1];
    $code = $matches[2];
    $index = $matches[3];

    $gradeOrForm = null;
    $type = null;

    if ($code[0] === 'G') {
        $type = 'grade';
        $gradeOrForm = (int) substr($code, 1);
    } else {
        $type = 'form';
        $gradeOrForm = $code;
    }

    return [
        'year' => $year,
        'code' => $code,
        'type' => $type,
        'grade_or_form' => $gradeOrForm,
        'index' => $index,
    ];
}

/**
 * Simple helper to get client IP.
 */
function getClientIp(): string {
    foreach (['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ipList = explode(',', $_SERVER[$key]);
            return trim($ipList[0]);
        }
    }
    return 'unknown';
}

?>
=======
        "user_id" => $userId
    ];
    
    return base64_encode(json_encode($payload)) . '.' . 
           base64_encode(hash_hmac('sha256', json_encode($payload), $secret_key, true));
}

function validateJWT($token) {
    $secret_key = "your_secret_key_here";
    $parts = explode('.', $token);
    
    if (count($parts) !== 2) return false;
    
    $payload = json_decode(base64_decode($parts[0]), true);
    $signature = $parts[1];
    
    $expected_signature = base64_encode(hash_hmac('sha256', json_encode($payload), $secret_key, true));
    
    if ($signature !== $expected_signature) return false;
    
    if ($payload['exp'] < time()) return false;
    
    return $payload;
}
?>
>>>>>>> 8d55e11c3f6378e3c87f07534019d51e74c77b66
