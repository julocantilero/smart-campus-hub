<?php

session_start();

require_once "../config/cors.php";

header("Content-Type: application/json");

echo json_encode([
    "logged_in" => isset($_SESSION["user_id"]),
    "role" => $_SESSION["role"] ?? null
]);