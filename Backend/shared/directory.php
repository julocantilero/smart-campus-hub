<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM directory
    ORDER BY name ASC
");

$directory = [];

while ($row = $result->fetch_assoc()) {
    $directory[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $directory
]);