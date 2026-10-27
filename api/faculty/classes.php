<?php

require_once "../config/cors.php";
require_once "../config/database.php";

$result = $conn->query("
    SELECT *
    FROM faculty_classes
");

$classes = [];

while ($row = $result->fetch_assoc()) {
    $classes[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $classes
]);