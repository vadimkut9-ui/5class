<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Логирование для отладки
    file_put_contents('debug.log', print_r($data, true), FILE_APPEND);
    
    // Сохраняем в файл (простой вариант)
    $resultsFile = 'results.json';
    
    if (file_exists($resultsFile)) {
        $existingResults = json_decode(file_get_contents($resultsFile), true);
    } else {
        $existingResults = [];
    }
    
    $newResult = [
        'timestamp' => date('Y-m-d H:i:s'),
        'student' => $data['student'] ?? [],
        'results' => $data['gameData'] ?? []
    ];
    
    $existingResults[] = $newResult;
    file_put_contents($resultsFile, json_encode($existingResults, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    // Отправляем email учителю
    $teacherEmail = $data['student']['teacherEmail'] ?? 'teacher@example.com';
    $subject = "Новые результаты ученика";
    $message = createEmailMessage($data);
    
    // В реальном проекте используйте PHPMailer или аналогичную библиотеку
    // mail($teacherEmail, $subject, $message);
    
    echo json_encode(['success' => true, 'message' => 'Результаты сохранены']);
} else {
    echo json_encode(['success' => false, 'message' => 'Только POST запросы']);
}

function createEmailMessage($data) {
    return "
        Новые результаты по математической раскраске:
        
        Ученик: {$data['student']['firstName']} {$data['student']['lastName']}
        Класс: {$data['student']['className']}
        
        Результаты:
        - Решено задач: {$data['gameData']['problemsSolved']}/{$data['gameData']['totalProblems']}
        - Баллы: {$data['gameData']['gameScore']}
        - Раскрашено: {$data['gameData']['coloredPercentage']}%
        - Время: {$data['gameData']['timeSpent']} секунд
        
        Дата: " . date('d.m.Y H:i') . "
    ";
}
?>
