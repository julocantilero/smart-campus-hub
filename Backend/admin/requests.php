<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM requests
    ORDER BY created_at DESC
");

$requests = [];

while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $requests
]);