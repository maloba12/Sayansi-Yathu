<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct()
    {
        // Prefer environment variables for security; fall back to defaults for local dev
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_NAME') ?: 'sayansi_yathu';
        $this->username = getenv('DB_USER') ?: 'sayansi_user';
        $this->password = getenv('DB_PASSWORD') ?: 'StrongPass123!';
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            http_response_code(500);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode([
                "message" => "Database connection error",
                // NOTE: include full error message for local debugging only.
                "error" => $exception->getMessage()
            ]);
            error_log('Database connection error: ' . $exception->getMessage());
            exit();
        }

        return $this->conn;
    }
}
?>
