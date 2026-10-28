<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

if (!$userId) {
    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);
    exit;
}

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

$requestId = $conn->insert_id;

echo json_encode([
    "success" => true,
    "data" => [
        "id" => $requestId,
        "service" => $service,
        "details" => $details,
        "status" => "Pending"
    ]
]);