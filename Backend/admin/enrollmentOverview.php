<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$enrolled = 0;
$pending = 0;
$totalUnits = 0;

$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM enrollments
    WHERE status = 'Enrolled'
");

$enrolled = $result->fetch_assoc()["total"];

$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM enrollments
    WHERE status = 'Pending'
");

$pending = $result->fetch_assoc()["total"];

$result = $conn->query("
    SELECT COALESCE(SUM(total_units),0) AS total_units
    FROM enrollments
");

$totalUnits = $result->fetch_assoc()["total_units"];

echo json_encode([
    "success" => true,
    "data" => [
        "enrolled_students" => $enrolled,
        "pending_students" => $pending,
        "total_units" => $totalUnits
    ]
]);