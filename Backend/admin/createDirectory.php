<?php

header("Content-Type: application/json");

require_once "../config/cors.php";
require_once "../config/database.php";
try {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("No data received.");
    }

    $name = trim($data["name"] ?? "");
    $type = trim($data["type"] ?? "");
    $email = trim($data["email"] ?? "");
    $location = trim($data["location"] ?? "");
    $service = trim($data["service"] ?? "");

    if (empty($name)) {
        throw new Exception("Office name is required.");
    }

    $sql = "
        INSERT INTO directory
        (name, type, email, location, service)
        VALUES (?, ?, ?, ?, ?)
    ";

    $statement = $conn->prepare($sql);

    $statement->bind_param(
        "sssss",
        $name,
        $type,
        $email,
        $location,
        $service
    );

    $statement->execute();

    $newId = $conn->insert_id;

    echo json_encode([
        "success" => true,
        "data" => [
            "id" => $newId,
            "name" => $name,
            "type" => $type,
            "email" => $email,
            "location" => $location,
            "service" => $service
        ]
    ]);

} catch (Exception $error) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $error->getMessage()
    ]);
}