<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

echo json_encode([
    "success" => true,
    "data" => [
        "lecture_units" => 3,
        "laboratory_units" => 3,
        "total_units" => 6,
        "academic_year" => "2026-2027"
    ]
]);