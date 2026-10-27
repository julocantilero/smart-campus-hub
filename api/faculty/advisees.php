<?php

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$result = $conn->query("
    SELECT
        students.student_number,
        CONCAT(
            students.first_name,
            ' ',
            students.last_name
        ) AS full_name
    FROM advisees
    INNER JOIN students
        ON advisees.student_id = students.id
");

$advisees = [];

while ($row = $result->fetch_assoc()) {
    $advisees[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $advisees
]);