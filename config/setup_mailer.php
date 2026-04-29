<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

function getMailer() {
    $mail = new PHPMailer(true);

    // Gmail SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.mailtrap.io';
    $mail->SMTPAuth   = true;
    $mail->Username   = '9f6ca7e7801a85';
    $mail->Password   = '111029d84a124f';  
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 2525;

    $mail->setFrom('thebcatu@gmail.com', 'Annapurna Hotel - No Reply');

    return $mail;
}

function sendMail($to, $subject, $body, $from = 'thebcatu@gmail.com', $fromName = 'Annapurna Hotel - No Reply') {
    $mail = new PHPMailer(true);

    try {
        // Gmail SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.mailtrap.io';
        $mail->SMTPAuth   = true;
        $mail->Username   = '9f6ca7e7801a85';
        $mail->Password   = '111029d84a124f';  
        $mail->SMTPSecure = 'tls';
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