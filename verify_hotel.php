<?php
require_once('vendor/autoload.php');


use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;


$serverUrl = 'http://localhost:4444'; // Selenium's default address
$driver = RemoteWebDriver::create($serverUrl, DesiredCapabilities::chrome());


try {
    // 1. Open the Rooms page automatically
    $driver->get('http://localhost/Hotel-Annapurna-Web/rooms.php');
    echo "Verification: Opened " . $driver->getTitle() . "\n";


    // 2. Wait 3 seconds to watch the automated browser
    sleep(3);
} finally {
    // 3. Close the browser automatically
    $driver->quit();
}

$title = $driver->getTitle();

if ($title != "") {
    echo "TEST PASSED: Rooms page opened successfully. Title: " . $title . "\n";
} else {
    echo "TEST FAILED: Page title is empty.\n";
}
?>

