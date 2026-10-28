<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

$stmt = $conn->prepare("
    SELECT *
    FROM enrollments
    WHERE user_id = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$enrollment = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $enrollment
]);
