<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$requestId = $data["requestId"] ?? 0;
$status = $data["status"] ?? "Pending";

$stmt = $conn->prepare("
    UPDATE requests
    SET status = ?
    WHERE id = ?
");

$stmt->bind_param(
    "si",
    $status,
    $requestId
);

$stmt->execute();

echo json_encode([
    "success" => true
]);