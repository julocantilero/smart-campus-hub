<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$studentCount = 0;
$facultyCount = 0;
$requestCount = 0;
$announcementCount = 0;

$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'student'
");
$studentCount = $result->fetch_assoc()["total"];

$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'faculty'
");
$facultyCount = $result->fetch_assoc()["total"];

$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM requests
");
$requestCount = $result->fetch_assoc()["total"];

$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM announcements
");
$announcementCount = $result->fetch_assoc()["total"];

echo json_encode([
    "success" => true,
    "data" => [
        [
            "title" => "Students",
            "value" => $studentCount,
            "description" => "Registered students",
            "color" => "blue"
        ],
        [
            "title" => "Faculty",
            "value" => $facultyCount,
            "description" => "Faculty members",
            "color" => "green"
        ],
        [
            "title" => "Requests",
            "value" => $requestCount,
            "description" => "Service requests",
            "color" => "orange"
        ],
        [
            "title" => "Announcements",
            "value" => $announcementCount,
            "description" => "Published announcements",
            "color" => "purple"
        ]
    ]
]);