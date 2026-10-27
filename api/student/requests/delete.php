<?php

require_once "../../config/cors.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$id = intval($data["request_id"] ?? 0);

$stmt = $conn->prepare(
    "DELETE FROM requests
     WHERE id = ?"
);

$stmt->bind_param(
    "i",
    $id
);

$stmt->execute();

echo json_encode([
    "success" => true
]);