<?php
$host = "localhost";        // Database host (localhost for local)
$username = "root";         // Default XAMPP username
$password = "";             // Leave empty for default XAMPP
$database = "hotel_annapurna"; // Database name

// Connection
$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>