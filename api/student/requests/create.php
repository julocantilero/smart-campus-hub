<?php

require_once "../../config/cors.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$service = trim($data["service"] ?? "");
$details = trim($data["details"] ?? "");

if (!$service || !$details) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO requests (service, details)
     VALUES (?, ?)"
);

$stmt->bind_param(
    "ss",
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