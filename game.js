// Глобальные переменные
let gameTimer;
let gameTime = 0;
let gameCanvas, gameCtx;
let currentTool = 'brush';
let currentColor = '#FF6B6B';
let brushSize = 5;
let isDrawing = false;
let lastX = 0, lastY = 0;
let solvedProblems = 0;
let totalProblems = 12;

// Данные ученика
let studentData = {
    firstName: '',
    lastName: '',
    className: '',
    teacherEmail: 'vadimkut9@gmail.com',
    gameTime: 0,
    solvedProblems: 0
};

// Математические задачи (как на картинке)
const MATH_PROBLEMS = [
    // Первый ряд (верхний)
    { id: 1, expression: "5½ + 2¼", answer: "7¾", color: "#FF6B6B", x: 50, y: 50, width: 180, height: 160 },
    { id: 2, expression: "3⅓ × 2", answer: "6⅔", color: "#4ECDC4", x: 250, y: 50, width: 180, height: 160 },
    { id: 3, expression: "4¾ - 1½", answer: "3¼", color: "#FFD166", x: 450, y: 50, width: 180, height: 160 },
    { id: 4, expression: "2½ ÷ ½", answer: "5", color: "#06D6A0", x: 650, y: 50, width: 180, height: 160 },
    
    // Второй ряд
    { id: 5, expression: "7⅔ + 1⅓", answer: "9", color: "#118AB2", x: 50, y: 230, width: 180, height: 160 },
    { id: 6, expression: "6¼ × ¾", answer: "4¹¹⁄₁₆", color: "#7209B7", x: 250, y: 230, width: 180, height: 160 },
    { id: 7, expression: "8½ - 3¾", answer: "4¾", color: "#EF476F", x: 450, y: 230, width: 180, height: 160 },
    { id: 8, expression: "9 ÷ 2¼", answer: "4", color: "#073B4C", x: 650, y: 230, width: 180, height: 160 },
    
    // Третий ряд (нижний)
    { id: 9, expression: "4⅔ + 3⅓", answer: "8", color: "#FF9E00", x: 50, y: 410, width: 180, height: 160 },
    { id: 10, expression: "5½ × 1½", answer: "8¼", color: "#8338EC", x: 250, y: 410, width: 180, height: 160 },
    { id: 11, expression: "7¼ - 2½", answer: "4¾", color: "#06D6A0", x: 450, y: 410, width: 180, height: 160 },
    { id: 12, expression: "6⅔ ÷ ⅔", answer: "10", color: "#FF6B6B", x: 650, y: 410, width: 180, height: 160 }
];

// Инициализация игры
function initGame() {
    console.log("Инициализация игры...");
    
    // Инициализация канваса
    initCanvas();
    
    // Создание задач
    createProblems();
    
    // Создание палитры
    createColorPalette();
    
    // Настройка инструментов
    setupTools();
    
    // Настройка обработчиков событий
    setupEventHandlers();
    
    // Рисуем начальную картинку
    drawPictureOutline();
    
    console.log("Игра инициализирована!");
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Инициализация канваса
function initCanvas() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        console.error("Canvas не найден!");
        return;
    }
    
    gameCtx = gameCanvas.getContext('2d');
    
    // Устанавливаем размеры
    gameCanvas.width = 800;
    gameCanvas.height = 600;
    
    // Обработчики событий мыши
    gameCanvas.addEventListener('mousedown', startDrawing);
    gameCanvas.addEventListener('mousemove', draw);
    gameCanvas.addEventListener('mouseup', stopDrawing);
    gameCanvas.addEventListener('mouseout', stopDrawing);
    
    // Обработчики для сенсорных устройств
    gameCanvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const rect = gameCanvas.getBoundingClientRect();
            const touch = e.touches[0];
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
            isDrawing = true;
        }
    });
    
    gameCanvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isDrawing && e.touches.length === 1) {
            const rect = gameCanvas.getBoundingClientRect();
            const touch = e.touches[0];
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;
            
            // Рисуем линию
            drawLine(lastX, lastY, currentX, currentY);
            
            lastX = currentX;
            lastY = currentY;
        }
    });
    
    gameCanvas.addEventListener('touchend', stopDrawing);
}

// Рисуем контуры картинки
function drawPictureOutline() {
    if (!gameCtx) return;
    
    // Очищаем канвас
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Белый фон
    gameCtx.fillStyle = '#FFFFFF';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Рисуем все области
    MATH_PROBLEMS.forEach(problem => {
        // Контур области
        gameCtx.strokeStyle = problem.color;
        gameCtx.lineWidth = 3;
        gameCtx.strokeRect(problem.x, problem.y, problem.width, problem.height);
        
        // Номер задачи
        gameCtx.fillStyle = problem.color;
        gameCtx.font = 'bold 24px Comic Neue';
        gameCtx.textAlign = 'center';
        gameCtx.fillText(problem.id.toString(), 
            problem.x + problem.width/2, 
            problem.y + 30);
        
        // Математическое выражение
        gameCtx.font = 'bold 28px Comic Neue';
        gameCtx.fillText(problem.expression, 
            problem.x + problem.width/2, 
            problem.y + problem.height/2 + 10);
    });
}

// Создание списка задач
function createProblems() {
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) return;
    
    problemsList.innerHTML = '';
    
    MATH_PROBLEMS.forEach(problem => {
        const problemItem = document.createElement('div');
        problemItem.className = 'problem-item';
        problemItem.dataset.problemId = problem.id;
        
        problemItem.innerHTML = `
            <div class="problem-header">
                <div class="problem-number">${problem.id}</div>
                <div class="problem-expression">${problem.expression}</div>
            </div>
            <input type="text" 
                   class="answer-input" 
                   placeholder="Ответ..."
                   data-problem="${problem.id}">
            <button class="check-btn" data-problem="${problem.id}">
                Проверить
            </button>
        `;
        
        problemsList.appendChild(problemItem);
    });
}

// Создание палитры цветов
function createColorPalette() {
    const colorPalette = document.getElementById('colorPalette');
    if (!colorPalette) return;
    
    colorPalette.innerHTML = '';
    
    // Берем уникальные цвета из задач
    const uniqueColors = [...new Set(MATH_PROBLEMS.map(p => p.color))];
    
    uniqueColors.forEach((color, index) => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item locked';
        colorItem.style.backgroundColor = color;
        colorItem.dataset.color = color;
        colorItem.dataset.problemId = index + 1;
        colorItem.title = `Цвет для задачи ${index + 1}`;
        colorItem.innerHTML = '<i class="fas fa-lock"></i>';
        
        colorItem.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                selectColor(color);
            }
        });
        
        colorPalette.appendChild(colorItem);
    });
    
    // Устанавливаем первый цвет как активный
    const currentColorEl = document.getElementById('currentColor');
    if (currentColorEl && uniqueColors.length > 0) {
        currentColorEl.style.backgroundColor = uniqueColors[0];
        currentColor = uniqueColors[0];
    }
}

// Настройка инструментов
function setupTools() {
    // Кнопки инструментов
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toolButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
            
            // Если выбран ластик, меняем цвет на белый
            if (currentTool === 'eraser') {
                gameCtx.globalCompositeOperation = 'destination-out';
            } else {
                gameCtx.globalCompositeOperation = 'source-over';
            }
        });
    });
    
    // Регулятор размера кисти
    const brushSizeInput = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    
    if (brushSizeInput && brushSizeValue) {
        brushSizeInput.addEventListener('input', function() {
            brushSize = parseInt(this.value);
            brushSizeValue.textContent = brushSize;
        });
    }
}

// Настройка обработчиков событий
function setupEventHandlers() {
    // Кнопка начала игры
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startRegistration);
    }
    
    // Кнопка очистки
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Очистить весь рисунок?')) {
                drawPictureOutline();
            }
        });
    }
    
    // Кнопка завершения игры
    const finishBtn = document.getElementById('finishGameBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', finishGame);
    }
    
    // Кнопки проверки задач
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('check-btn')) {
            const problemId = parseInt(e.target.dataset.problem);
            checkGameAnswer(problemId);
        }
    });
    
    // Обработчики ввода в поля ответов
    document.addEventListener('keypress', function(e) {
        if (e.target.classList.contains('answer-input') && e.key === 'Enter') {
            const problemId = parseInt(e.target.dataset.problem);
            checkGameAnswer(problemId);
        }
    });
    
    // Модальное окно
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('resultsModal').style.display = 'none';
        });
    }
    
    // Кнопка отправки результатов
    const sendResultsBtn = document.getElementById('sendResultsBtn');
    if (sendResultsBtn) {
        sendResultsBtn.addEventListener('click', sendResultsToEmail);
    }
    
    // Кнопка новой игры
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
}

// Начало регистрации
function startRegistration() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const className = document.getElementById('classSelect').value;
    
    if (!firstName || !lastName || !className) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }
    
    // Сохраняем данные
    studentData = {
        firstName,
        lastName,
        className: `${className} класс`,
        teacherEmail: 'vadimkut9@gmail.com',
        gameTime: 0,
        solvedProblems: 0
    };
    
    // Обновляем отображение
    document.getElementById('playerName').textContent = `${firstName} ${lastName}`;
    
    // Показываем задачи, скрываем регистрацию
    document.getElementById('registrationPanel').style.display = 'none';
    document.getElementById('tasksPanel').style.display = 'block';
    
    // Запускаем таймер
    startGameTimer();
    
    // Скрываем оверлей канваса
    document.querySelector('.canvas-overlay').style.display = 'none';
    
    console.log('Игра начата для:', studentData);
}

// Запуск таймера
function startGameTimer() {
    clearInterval(gameTimer);
    gameTime = 0;
    updateTimerDisplay();
    
    gameTimer = setInterval(() => {
        gameTime++;
        updateTimerDisplay();
    }, 1000);
}

// Обновление отображения таймера
function updateTimerDisplay() {
    const timerElement = document.getElementById('gameTimer');
    if (timerElement) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Проверка ответа
function checkGameAnswer(problemId) {
    const problem = MATH_PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;
    
    const input = document.querySelector(`input[data-problem="${problemId}"]`);
    const problemItem = input.closest('.problem-item');
    
    if (!input.value.trim()) {
        alert('Введите ответ!');
        return;
    }
    
    const userAnswer = normalizeAnswer(input.value.trim());
    const correctAnswer = normalizeAnswer(problem.answer);
    
    if (userAnswer === correctAnswer) {
        // Правильный ответ
        input.classList.add('correct');
        input.classList.remove('incorrect');
        problemItem.classList.add('solved');
        
        // Разблокируем соответствующий цвет
        unlockColor(problem.color);
        
        // Увеличиваем счетчик решенных задач
        solvedProblems++;
        document.getElementById('solvedCount').textContent = solvedProblems;
        
        // Активируем кнопку завершения, если решены все задачи
        if (solvedProblems === totalProblems) {
            document.getElementById('finishGameBtn').disabled = false;
        }
        
        console.log(`Задача ${problemId} решена правильно!`);
    } else {
        // Неправильный ответ
        input.classList.add('incorrect');
        input.classList.remove('correct');
        alert('Неверный ответ! Попробуйте еще раз.');
    }
}

// Разблокировка цвета
function unlockColor(color) {
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
        if (item.style.backgroundColor === color) {
            item.classList.remove('locked');
            item.innerHTML = '';
            
            // Если это первый разблокированный цвет, выбираем его
            if (!currentColor || currentColor === '#FF6B6B') {
                selectColor(color);
            }
        }
    });
}

// Выбор цвета
function selectColor(color) {
    currentColor = color;
    
    // Обновляем отображение текущего цвета
    const currentColorEl = document.getElementById('currentColor');
    if (currentColorEl) {
        currentColorEl.style.backgroundColor = color;
    }
    
    // Обновляем активный цвет в палитре
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.remove('active');
        if (item.style.backgroundColor === color && !item.classList.contains('locked')) {
            item.classList.add('active');
        }
    });
}

// Функции рисования
function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    
    const rect = gameCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const rect = gameCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    drawLine(lastX, lastY, currentX, currentY);
    
    lastX = currentX;
    lastY = currentY;
}

function drawLine(x1, y1, x2, y2) {
    gameCtx.beginPath();
    gameCtx.moveTo(x1, y1);
    gameCtx.lineTo(x2, y2);
    
    if (currentTool === 'eraser') {
        gameCtx.strokeStyle = 'rgba(255,255,255,1)';
    } else {
        gameCtx.strokeStyle = currentColor;
    }
    
    gameCtx.lineWidth = brushSize;
    gameCtx.lineCap = 'round';
    gameCtx.lineJoin = 'round';
    gameCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

// Завершение игры
function finishGame() {
    clearInterval(gameTimer);
    
    // Сохраняем время
    studentData.gameTime = gameTime;
    studentData.solvedProblems = solvedProblems;
    
    // Показываем модальное окно с результатами
    showResultsModal();
}

// Показ модального окна с результатами
function showResultsModal() {
    const modal = document.getElementById('resultsModal');
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    
    // Заполняем данные в модальном окне
    document.getElementById('resultStudentName').textContent = 
        `${studentData.firstName} ${studentData.lastName}, ${studentData.className}`;
    
    document.getElementById('resultTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('resultTasks').textContent = 
        `${solvedProblems}/${totalProblems}`;
    
    // Показываем модальное окно
    modal.style.display = 'flex';
}

// Отправка результатов на email
async function sendResultsToEmail() {
    const sendBtn = document.getElementById('sendResultsBtn');
    const statusElement = document.getElementById('sendStatus');
    
    // Блокируем кнопку
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    
    // Формируем данные для отправки
    const minutes = Math.floor(studentData.gameTime / 60);
    const seconds = studentData.gameTime % 60;
    
    const gameData = {
        student: `${studentData.firstName} ${studentData.lastName}`,
        class: studentData.className,
        time: `${minutes} минут ${seconds} секунд`,
        tasks: `${solvedProblems}/${totalProblems}`,
        date: new Date().toLocaleString(),
        teacherEmail: studentData.teacherEmail
    };
    
    try {
        // Отправляем данные на сервер
        const response = await fetch('save_result.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData)
        });
        
        if (response.ok) {
            // Успешная отправка
            statusElement.textContent = '✅ Результаты успешно отправлены!';
            statusElement.className = 'status-message success';
            
            // Показываем сообщение на 3 секунды
            setTimeout(() => {
                statusElement.style.display = 'none';
                // Можно закрыть модальное окно
                document.getElementById('resultsModal').style.display = 'none';
            }, 3000);
            
            console.log('Результаты отправлены на email:', studentData.teacherEmail);
        } else {
            throw new Error('Ошибка сервера');
        }
    } catch (error) {
        // Ошибка отправки
        console.error('Ошибка отправки:', error);
        statusElement.textContent = '❌ Ошибка отправки. Попробуйте еще раз.';
        statusElement.className = 'status-message error';
        statusElement.style.display = 'block';
        
        // Разблокируем кнопку
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить учителю';
    }
}

// Начало новой игры
function startNewGame() {
    // Скрываем модальное окно
    document.getElementById('resultsModal').style.display = 'none';
    
    // Сбрасываем данные
    studentData = {
        firstName: '',
        lastName: '',
        className: '',
        teacherEmail: 'vadimkut9@gmail.com',
        gameTime: 0,
        solvedProblems: 0
    };
    
    // Сбрасываем счетчики
    solvedProblems = 0;
    gameTime = 0;
    
    // Обновляем отображение
    document.getElementById('playerName').textContent = 'Не указан';
    document.getElementById('solvedCount').textContent = '0';
    document.getElementById('gameTimer').textContent = '00:00';
    
    // Сбрасываем задачи
    document.querySelectorAll('.problem-item').forEach(item => {
        item.classList.remove('solved');
        const input = item.querySelector('.answer-input');
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
    
    // Сбрасываем цвета
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.add('locked');
        item.innerHTML = '<i class="fas fa-lock"></i>';
        item.classList.remove('active');
    });
    
    // Показываем регистрацию, скрываем задачи
    document.getElementById('registrationPanel').style.display = 'block';
    document.getElementById('tasksPanel').style.display = 'none';
    
    // Показываем оверлей канваса
    document.querySelector('.canvas-overlay').style.display = 'flex';
    
    // Блокируем кнопку завершения
    document.getElementById('finishGameBtn').disabled = true;
    
    // Перерисовываем картинку
    drawPictureOutline();
    
    // Останавливаем таймер
    clearInterval(gameTimer);
    
    console.log('Новая игра начата');
}

// Вспомогательные функции
function normalizeAnswer(answer) {
    // Приводим ответы к единому формату
    return answer
        .replace(/½/g, '1/2')
        .replace(/⅓/g, '1/3')
        .replace(/⅔/g, '2/3')
        .replace(/¼/g, '1/4')
        .replace(/¾/g, '3/4')
        .replace(/¹¹⁄₁₆/g, '11/16')
        .replace(/⁄/g, '/')
        .toLowerCase()
        .trim();
}

// Экспортируем функции для глобального доступа
window.checkGameAnswer = checkGameAnswer;
window.startNewGame = startNewGame;
window.sendResultsToEmail = sendResultsToEmail;
