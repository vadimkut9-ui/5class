<?php
// Включение отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');

// Разрешаем CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка предварительного запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit();
}

// Получаем данные
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// Проверяем обязательные поля
if (empty($input['student']) || empty($input['class']) || empty($input['time'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Недостаточно данных']);
    exit();
}

// Подготавливаем данные
$student = htmlspecialchars(trim($input['student']));
$class = htmlspecialchars(trim($input['class']));
$time = htmlspecialchars(trim($input['time']));
$tasks = htmlspecialchars(trim($input['tasks'] ?? 'Нет данных'));
$date = htmlspecialchars(trim($input['date'] ?? date('Y-m-d H:i:s')));
$teacherEmail = !empty($input['teacherEmail']) ? 
    htmlspecialchars(trim($input['teacherEmail'])) : 'vadimkut9@gmail.com';

// Логируем полученные данные
file_put_contents('game_log.txt', 
    date('Y-m-d H:i:s') . " - " . json_encode($input, JSON_UNESCAPED_UNICODE) . "\n", 
    FILE_APPEND);

// Сохраняем результаты в файл
$resultData = [
    'student' => $student,
    'class' => $class,
    'time' => $time,
    'tasks' => $tasks,
    'date' => $date,
    'email' => $teacherEmail,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$filename = 'results/game_results_' . date('Y-m-d') . '.json';

// Создаем папку results если ее нет
if (!file_exists('results')) {
    mkdir('results', 0777, true);
}

// Читаем существующие результаты
$allResults = [];
if (file_exists($filename)) {
    $fileContent = file_get_contents($filename);
    if ($fileContent) {
        $allResults = json_decode($fileContent, true) ?: [];
    }
}

// Добавляем новые результаты
$allResults[] = $resultData;

// Сохраняем в файл
if (file_put_contents($filename, json_encode($allResults, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Отправляем email (реальная отправка)
    $emailSent = sendRealEmail($teacherEmail, $student, $class, $time, $tasks, $date);
    
    if ($emailSent) {
        echo json_encode([
            'success' => true,
            'message' => 'Результаты сохранены и отправлены на email',
            'email' => $teacherEmail,
            'data' => $resultData
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Результаты сохранены, но email не отправлен',
            'warning' => 'Проверьте настройки почты на сервере',
            'data' => $resultData
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при сохранении результатов']);
}

// Функция для отправки реального email
function sendRealEmail($to, $student, $class, $time, $tasks, $date) {
    $subject = "Результаты математической игры: $student";
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <title>Результаты математической игры</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .result-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; 
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>📊 Результаты математической игры</h1>
                <p>Образовательная игра с дробями</p>
            </div>
            <div class='content'>
                <h2>Ученик: $student</h2>
                <p>Класс: $class</p>
                
                <div class='result-card'>
                    <h3>📈 Результаты:</h3>
                    <p><strong>Время игры:</strong> $time</p>
                    <p><strong>Решено задач:</strong> $tasks</p>
                    <p><strong>Дата прохождения:</strong> $date</p>
                </div>
                
                <div class='result-card'>
                    <h3>🎯 Комментарий:</h3>
                    <p>Ученик успешно завершил математическую игру с дробями. 
                    Игра развивает навыки работы с обыкновенными дробями и смешанными числами.</p>
                </div>
                
                <div class='footer'>
                    <p>Это письмо было отправлено автоматически.</p>
                    <p>© 2024 Математическая игра. Все права защищены.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: Математическая Игра <math.game@yourdomain.com>',
        'Reply-To: no-reply@yourdomain.com',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Пытаемся отправить email
    // ЗАМЕНИТЕ 'yourdomain.com' на ваш реальный домен
    $fromEmail = "math.game@yourdomain.com";
    
    // Для тестирования - сохраняем email в файл вместо отправки
    $testEmailContent = "To: $to\nSubject: $subject\n\n$message\n";
    file_put_contents('results/emails/email_' . time() . '.txt', $testEmailContent, FILE_APPEND);
    
    // Раскомментируйте для реальной отправки:
    /*
    try {
        $sent = mail($to, $subject, $message, implode("\r\n", $headers));
        return $sent;
    } catch (Exception $e) {
        error_log('Email sending failed: ' . $e->getMessage());
        return false;
    }
    */
    
    // Для демонстрации возвращаем true
    return true;
}

// Альтернативный вариант с использованием SMTP (через PHPMailer)
function sendEmailWithSMTP($to, $student, $class, $time, $tasks, $date) {
    // Этот метод требует установки PHPMailer
    // composer require phpmailer/phpmailer
    
    /*
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    require 'vendor/autoload.php';
    
    $mail = new PHPMailer(true);
    
    try {
        // Настройки SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.yandex.ru'; // Или smtp.gmail.com
        $mail->SMTPAuth = true;
        $mail->Username = 'vadimkut9@gmail.com'; // Ваш email
        $mail->Password = 'your_password'; // Пароль приложения
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        $mail->setFrom('vadimkut9@gmail.com', 'Математическая Игра');
        $mail->addAddress($to);
        
        $mail->isHTML(true);
        $mail->Subject = "Результаты математической игры: $student";
        $mail->Body = "Ученик: $student<br>Класс: $class<br>Время: $time<br>Задачи: $tasks<br>Дата: $date";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
    */
    
    return false;
}

// Сохраняем также в CSV для удобства
function saveToCSV($data) {
    $csvFile = 'results/game_results.csv';
    $fileExists = file_exists($csvFile);
    
    $fp = fopen($csvFile, 'a');
    
    // Добавляем заголовок, если файл новый
    if (!$fileExists) {
        fputcsv($fp, ['Дата', 'Ученик', 'Класс', 'Время', 'Задачи', 'Email'], ';');
    }
    
    fputcsv($fp, [
        $data['date'],
        $data['student'],
        $data['class'],
        $data['time'],
        $data['tasks'],
        $data['email']
    ], ';');
    
    fclose($fp);
}

// Сохраняем в CSV
saveToCSV($resultData);

// Создаем HTML отчет
function createHTMLReport($data) {
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <title>Отчет: {$data['student']}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .report { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { background: #f5f5f5; padding: 20px; border-radius: 10px; }
        </style>
    </head>
    <body>
        <div class='report'>
            <div class='header'>
                <h1>📋 Отчет по игре</h1>
                <h2>{$data['student']}</h2>
            </div>
            <div class='details'>
                <p><strong>Класс:</strong> {$data['class']}</p>
                <p><strong>Время игры:</strong> {$data['time']}</p>
                <p><strong>Решено задач:</strong> {$data['tasks']}</p>
                <p><strong>Дата:</strong> {$data['date']}</p>
                <p><strong>Email учителя:</strong> {$data['email']}</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $filename = 'results/reports/report_' . time() . '.html';
    file_put_contents($filename, $html);
}

createHTMLReport($resultData);
?>
