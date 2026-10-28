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

$stmt = $conn->prepare("
    SELECT *
    FROM faculty_workloads
    WHERE faculty_user_id = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$workload = $result->fetch_assoc();

if (!$workload) {
    $workload = [
        "lecture_units" => 0,
        "laboratory_units" => 0,
        "total_units" => 0,
        "maximum_units" => 24
    ];
} else {
    $workload["total_units"] =
        $workload["lecture_units"] +
        $workload["laboratory_units"];
}

echo json_encode([
    "success" => true,
    "data" => $workload
]);