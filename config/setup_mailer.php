<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

function getMailer() {
    $mail = new PHPMailer(true);

    // Gmail SMTP
    $mail->isSMTP();
    $mail->Host       = 'sandbox.smtp.mailtrap.io';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'e20ccdb2df0e67';
    $mail->Password   = '661615619aba9a';  
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 2525;

    $mail->setFrom('noreply@annapurna.test', 'Annapurna Hotel - No Reply');

    return $mail;
}

function sendMail($to, $subject, $body, $from = 'noreply@annapurna.test', $fromName = 'Annapurna Hotel - No Reply') {
    $mail = new PHPMailer(true);

    try {
        // Gmail SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.mailtrap.io';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'e20ccdb2df0e67';
        $mail->Password   = '661615619aba9a';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 2525;

        // Sender
        $mail->setFrom($from, $fromName);
        $mail->addAddress($to);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        return true;

    } catch (Exception $e) {
        return "Mail could not be sent. Error: {$mail->ErrorInfo}";
    }
}
?>