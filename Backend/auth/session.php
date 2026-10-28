<?php

session_start();
require_once "../config/cors.php";
require_once "../config/database.php";


header("Content-Type: application/json");

echo json_encode([
    "session_id" => session_id(),
    "logged_in" => isset($_SESSION["user_id"]),
    "user_id" => $_SESSION["user_id"] ?? null,
    "role" => $_SESSION["role"] ?? null
]);
