<?php
require_once('vendor/autoload.php');

use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;

$serverUrl = 'http://localhost:4444';
$driver = RemoteWebDriver::create($serverUrl, DesiredCapabilities::chrome());

function runLoginTest($driver, $email, $password, $scenarioName) {
    echo "\n--- Testing Scenario: $scenarioName ---\n";
    $driver->get('http://localhost/Hotel-Annapurna-Web/login.php');

    // Enter Credentials
    $driver->findElement(WebDriverBy::id('email'))->clear()->sendKeys($email);
    $driver->findElement(WebDriverBy::id('password'))->clear()->sendKeys($password);
    
    // Submit
    $driver->findElement(WebDriverBy::className('login-button'))->click();
    sleep(2); // Wait for PHP to process
}

try {
    // 1. SCENARIO: WRONG EMAIL (Negative Test)
    runLoginTest($driver, 'hacker@wrong.com', 'anypassword', 'Invalid Email');
    if (strpos($driver->getCurrentURL(), 'login.php') !== false) {
        echo "✅ Success: System correctly blocked invalid email.\n";
    }

    // 2. SCENARIO: WRONG PASSWORD (Negative Test)
    // Note: Use an email that actually exists in your database
    runLoginTest($driver, 'customer@example.com', 'wrongpassword', 'Invalid Password');
    if (strpos($driver->getCurrentURL(), 'login.php') !== false) {
        echo "✅ Success: System correctly blocked wrong password.\n";
    }

    // 3. SCENARIO: CORRECT LOGIN (Positive Test)
    runLoginTest($driver, 'xuanxuanteoh26@gmail.com', 'Abc1234*', 'Valid Login');
    
    // Verification: Wait for redirect to home page
    $driver->wait(10)->until(
        WebDriverExpectedCondition::urlContains('index.php')
    );
    echo "✅ Success: Correct login redirected to Home Page!\n";

} catch (Exception $e) {
    echo "❌ Test Encountered an Error: " . $e->getMessage() . "\n";
} finally {
    $driver->quit();
}
?>