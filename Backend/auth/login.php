<?php

session_start();
require_once "../config/cors.php";
require_once "../config/database.php";

header("Content-Type: application/json");

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

$stmt = $conn->prepare("
    SELECT *
    FROM users
    WHERE email = ?
");

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (
    $user &&
    password_verify(
        $password,
        $user["password"]
    )
) {
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["role"] = $user["role"];

    echo json_encode([
        "success" => true,
        "role" => $user["role"]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password."
    ]);
}