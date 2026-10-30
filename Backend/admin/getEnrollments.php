<?php

header("Content-Type: application/json");

require_once "../config/cors.php";
require_once "../config/database.php";

$result = $conn->query("
    SELECT
        e.id,
        e.user_id,
        e.semester,
        e.academic_year,
        e.total_units,
        e.status,

        s.student_number,
        s.first_name,
        s.last_name,
        s.program,
        s.year_level

    FROM enrollments e
    INNER JOIN students s
        ON e.user_id = s.id

    ORDER BY s.last_name ASC
");

if (!$result) {
    die($conn->error);
}

$enrollments = [];

while ($row = $result->fetch_assoc()) {
    $enrollments[] = $row;
}

echo json_encode([
    "success" => true,
    "count" => count($enrollments),
    "data" => $enrollments
]);