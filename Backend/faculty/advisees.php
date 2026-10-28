<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

$stmt = $conn->prepare("
    SELECT
        a.id,
        a.status,
        s.student_number,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.program,
        s.year_level
    FROM advisees a
    INNER JOIN students s
        ON a.student_user_id = s.user_id
    WHERE a.faculty_user_id = ?
");

$stmt->bind_param("i", $userId);
$stmt->execute();

$result = $stmt->get_result();

$advisees = [];

while ($row = $result->fetch_assoc()) {

    $row["full_name"] = trim(
        $row["first_name"] . " " .
        $row["middle_name"] . " " .
        $row["last_name"]
    );

    $advisees[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $advisees
]);