<?php
require_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT s.student_id, u.name, u.email 
          FROM students s 
          JOIN users u ON s.linked_user_id = u.id";
$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    echo "<h1>Registered Students</h1>";
    echo "<table border='1'>";
    echo "<tr><th>Student ID</th><th>Name</th><th>Email</th></tr>";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['student_id']) . "</td>";
        echo "<td>" . htmlspecialchars($row['name']) . "</td>";
        echo "<td>" . htmlspecialchars($row['email']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No students found.";
}
?>
