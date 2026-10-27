<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM faculty
    LIMIT 1
");

$faculty = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $faculty
]);