<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM subjects
    ORDER BY subject_code
");

$subjects = [];

while ($row = $result->fetch_assoc()) {
    $subjects[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $subjects
]);