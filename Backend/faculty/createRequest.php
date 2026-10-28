<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$service = trim($data["service"] ?? "");
$details = trim($data["details"] ?? "");

$stmt = $conn->prepare("
    INSERT INTO requests (
        user_id,
        service,
        details
    )
    VALUES (?, ?, ?)
");

$stmt->bind_param(
    "iss",
    $userId,
    $service,
    $details
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "data" => [
        "id" => $conn->insert_id,
        "service" => $service,
        "details" => $details,
        "status" => "Pending"
    ]
]);