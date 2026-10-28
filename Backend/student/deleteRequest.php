<?php

session_start();

require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$userId = $_SESSION["user_id"] ?? null;

$id = $_GET["id"] ?? 0;

$stmt = $conn->prepare("
    DELETE FROM requests
    WHERE id = ?
    AND user_id = ?
");

$stmt->bind_param(
    "ii",
    $id,
    $userId
);

$stmt->execute();

echo json_encode([
    "success" => true
]);