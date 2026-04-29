<?php
require_once('vendor/autoload.php');

use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;

$serverUrl = 'http://localhost:4444';
$driver = RemoteWebDriver::create($serverUrl, DesiredCapabilities::chrome());

try {
    // 1. Navigate to your login page
    $driver->get('http://localhost/Hotel-Annapurna-Web/login.php');
    echo "Verification Started: Testing Login Page...\n";

    // 2. Identify and interact with elements from your login.php
    // Entering Email
    $driver->findElement(WebDriverBy::id('email'))->sendKeys('customer@example.com');
    
    // Entering Password
    $driver->findElement(WebDriverBy::id('password'))->sendKeys('password123');
    
    // Clicking the "Sign In" button (using its class name)
    $driver->findElement(WebDriverBy::className('login-button'))->click();

    // 3. Verify Success: Check if we redirected away from login.php
    // We wait up to 10 seconds for the URL to change to index.php
    $driver->wait(10)->until(
        WebDriverExpectedCondition::urlContains('index.php')
    );

    echo "✅ Success: System authenticated user and redirected to Home Page.\n";
    echo "Final URL: " . $driver->getCurrentURL() . "\n";

} catch (Exception $e) {
    echo "❌ Test Failed: " . $e->getMessage() . "\n";
} finally {
    // Close the automated browser
    $driver->quit();
}
?>