<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT *
    FROM enrollments
    LIMIT 1
");

$enrollment = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $enrollment
]);