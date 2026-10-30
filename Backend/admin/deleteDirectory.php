<?php

header("Content-Type: application/json");
require_once "../config/cors.php";
require_once "../config/database.php";

try {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = (int) ($data["id"] ?? 0);

    if ($id <= 0) {
        throw new Exception("Invalid directory entry ID.");
    }

    $sql = "DELETE FROM directory WHERE id = ?";

    $statement = $conn->prepare($sql);

    $statement->bind_param("i", $id);

    $statement->execute();

    echo json_encode([
        "success" => true,
        "message" => "Directory entry deleted successfully."
    ]);

} catch (Exception $error) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $error->getMessage()
    ]);
}