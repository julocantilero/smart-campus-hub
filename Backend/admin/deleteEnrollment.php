<?php

header("Content-Type: application/json");

require_once "../config/cors.php";
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Enrollment ID is required."
    ]);
    exit;
}

$id = (int)$data["id"];

$stmt = $conn->prepare("
    DELETE FROM enrollments
    WHERE id = ?
");

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete enrollment."
    ]);
}