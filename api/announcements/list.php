<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM announcements
    ORDER BY created_at DESC
");

$announcements = [];

while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $announcements
]);
