<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

$stmt = $conn->prepare("
    SELECT s.*
    FROM subjects s
    INNER JOIN student_subjects ss
    ON s.id = ss.subject_id
    WHERE ss.user_id = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$subjects = [];

while ($row = $result->fetch_assoc()) {
    $subjects[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $subjects
]);