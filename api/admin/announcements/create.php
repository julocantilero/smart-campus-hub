<?php

require_once "../../config/cors.php";
require_once "../../config/database.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$title = trim($data["title"] ?? "");
$description = trim($data["description"] ?? "");

$stmt = $conn->prepare(
    "INSERT INTO announcements (title, description)
     VALUES (?, ?)"
);

$stmt->bind_param(
    "ss",
    $title,
    $description
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "data" => [
        "id" => $conn->insert_id,
        "title" => $title,
        "description" => $description
    ]
]);