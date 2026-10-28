<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");
echo json_encode([
    "session" => $_SESSION
]);


$userId = $_SESSION["user_id"] ?? null;

if (!$userId) {
    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT
        id,
        email,
        role
    FROM users
    WHERE id = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$admin = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $admin
]);