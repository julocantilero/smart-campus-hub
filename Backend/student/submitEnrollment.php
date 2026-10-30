<?php

session_start();

header("Content-Type: application/json");

require_once "../config/cors.php";
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["semester"]) ||
    !isset($data["academic_year"])
) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

$userId = $_SESSION["user_id"];