<?php
require_once 'config/db.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "SELECT id, name, email, role, password FROM users";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h1>Database Users</h1>";
    if (count($users) > 0) {
        echo "<table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Password Hash</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($user['id']) . "</td>";
            echo "<td>" . htmlspecialchars($user['name']) . "</td>";
            echo "<td>" . htmlspecialchars($user['email']) . "</td>";
            echo "<td>" . htmlspecialchars($user['role']) . "</td>";
            echo "<td>" . htmlspecialchars($user['password']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No users found in database.";
    }

} catch(PDOException $e) {
    echo "Database Error: " . $e->getMessage();
} catch(Exception $e) {
    echo "General Error: " . $e->getMessage();
}
?>
