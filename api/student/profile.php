<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM students
    LIMIT 1
");

$student = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $student
]);