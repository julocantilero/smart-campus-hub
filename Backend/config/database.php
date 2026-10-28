<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "smart_campus_hub";

$conn = new mysqli(
    $host,
    $username,
    $password,
    $database
);

if ($conn->connect_error) {
    die("Connection failed");
}