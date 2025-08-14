<?php
function generateJWT($userId) {
    $secret_key = "your_secret_key_here";
    $issued_at = time();
    $expiration_time = $issued_at + (60 * 60 * 24); // 24 hours
    
    $payload = [
        "iss" => "sayansi_yathu",
        "iat" => $issued_at,
        "exp" => $expiration_time,
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