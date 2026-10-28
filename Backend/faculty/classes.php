<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

$stmt = $conn->prepare("
    SELECT *
    FROM classes
    WHERE faculty_user_id = ?
    ORDER BY subject_code
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$classes = [];

while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $classes
]);