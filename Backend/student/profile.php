<?Php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

if (!$userId) {
    echo json_encode([
        "success" => false
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT *
    FROM students
    WHERE user_id = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$student = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $student
]);