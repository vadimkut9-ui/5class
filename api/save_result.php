<?php
header('Content-Type: application/json; charset=utf-8');

// Разрешаем CORS (для тестирования)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается']);
    exit;
}

// Получаем данные из POST запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// Проверяем обязательные поля
$requiredFields = ['firstName', 'lastName', 'className', 'gameTime'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Не заполнено поле: $field"]);
        exit;
    }
}

// Подготавливаем данные
$firstName = htmlspecialchars(trim($input['firstName']));
$lastName = htmlspecialchars(trim($input['lastName']));
$className = htmlspecialchars(trim($input['className']));
$teacherEmail = !empty($input['teacherEmail']) ? 
    htmlspecialchars(trim($input['teacherEmail'])) : 'vadimkut9@gmail.com';
$gameTime = intval($input['gameTime']);

// Форматируем время
$minutes = floor($gameTime / 60);
$seconds = $gameTime % 60;
$timeFormatted = sprintf("%02d:%02d", $minutes, $seconds);

// Создаем данные для сохранения
$resultData = [
    'student' => "$firstName $lastName",
    'class' => $className,
    'time' => $timeFormatted,
    'date' => date('Y-m-d H:i:s'),
    'email' => $teacherEmail
];

// Сохраняем в файл (для простоты используем JSON)
$filename = 'game_results.json';

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

// Сохраняем обратно в файл
if (file_put_contents($filename, json_encode($allResults, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Отправляем email (если настроен сервер)
    sendEmailNotification($resultData);
    
    echo json_encode([
        'success' => true,
        'message' => 'Результаты сохранены успешно',
        'data' => $resultData
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при сохранении результатов']);
}

// Функция отправки email
function sendEmailNotification($data) {
    $to = $data['email'];
    $subject = "Результаты игры: {$data['student']}";
    
    $message = "
    <html>
    <head>
        <title>Результаты математической игры</title>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 20px; }
            .result-item { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Математическая раскраска</h1>
                <p>Результаты игры</p>
            </div>
            <div class='content'>
                <h2>Данные ученика:</h2>
                <div class='result-item'>
                    <strong>Ученик:</strong> {$data['student']}<br>
                    <strong>Класс:</strong> {$data['class']}<br>
                    <strong>Время игры:</strong> {$data['time']}<br>
                    <strong>Дата:</strong> {$data['date']}
                </div>
                <p>Игра была успешно завершена. Ученик провел в игре {$data['time']}.</p>
                <p>Это письмо отправлено автоматически.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: Математическая игра <noreply@mathgame.ru>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Раскомментируйте для отправки email (нужно настроить сервер)
    // mail($to, $subject, $message, implode("\r\n", $headers));
}

// Также можно сохранить в CSV для удобства
function saveToCSV($data) {
    $csvFile = 'game_results.csv';
    $fileExists = file_exists($csvFile);
    
    $fp = fopen($csvFile, 'a');
    
    // Добавляем заголовок, если файл новый
    if (!$fileExists) {
        fputcsv($fp, ['ФИО', 'Класс', 'Время', 'Дата', 'Email'], ';');
    }
    
    fputcsv($fp, [
        $data['student'],
        $data['class'],
        $data['time'],
        $data['date'],
        $data['email']
    ], ';');
    
    fclose($fp);
}

// Сохраняем в CSV
saveToCSV($resultData);
?>
