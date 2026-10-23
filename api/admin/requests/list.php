<?php

require_once "../../config/cors.php";

header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "success" => true,
    "message" => "requests endpoint working"
]);

exit;