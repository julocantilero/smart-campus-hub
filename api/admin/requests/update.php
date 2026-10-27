<?php

require_once "../../config/cors.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$id = intval($data["id"] ?? 0);

$status = trim(
    $data["status"] ?? "Pending"
);

$stmt = $conn->prepare(
    "UPDATE requests
     SET status = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "si",
    $status,
    $id
);

$stmt->execute();

echo json_encode([
    "success" => true
]);