<?php

header("Content-Type: application/json");
require_once "../config/cors.php";
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["id"]) ||
    !isset($data["status"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);

    exit;
}

$id = (int)$data["id"];
$status = trim($data["status"]);

$allowedStatuses = [
    "Pending",
    "Enrolled",
    "Rejected"
];

if (!in_array($status, $allowedStatuses)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid status."
    ]);

    exit;
}

$stmt = $conn->prepare("
    UPDATE enrollments
    SET status = ?
    WHERE id = ?
");

$stmt->bind_param(
    "si",
    $status,
    $id
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Enrollment status updated."
    ]);
} else {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update enrollment."
    ]);
}

$stmt->close();
$conn->close();