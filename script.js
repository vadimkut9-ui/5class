// Глобальные переменные
let currentSlide = 0;
let gameTimer;
let gameTime = 0;
let gameCanvas, gameCtx;
let currentTool = 'brush';
let currentColor = '#FF6B6B';
let brushSize = 15;
let isDrawing = false;
let lastX = 0, lastY = 0;

// Данные ученика
let studentData = {
    firstName: '',
    lastName: '',
    className: '',
    teacherEmail: 'vadimkut9@gmail.com',
    gameTime: 0
};

// Математические задачи
const MATH_PROBLEMS = [
    { id: 1, expression: "½ + ¼ =", answer: "¾", color: "#FF6B6B" },
    { id: 2, expression: "⅔ + ⅓ =", answer: "1", color: "#4ECDC4" },
    { id: 3, expression: "¾ - ½ =", answer: "¼", color: "#FFD166" },
    { id: 4, expression: "1½ + 2½ =", answer: "4", color: "#06D6A0" },
    { id: 5, expression: "3⅓ - 1⅓ =", answer: "2", color: "#118AB2" },
    { id: 6, expression: "¼ × 4 =", answer: "1", color: "#7209B7" },
    { id: 7, expression: "½ ÷ ¼ =", answer: "2", color: "#EF476F" },
    { id: 8, expression: "3¾ - 1¼ =", answer: "2½", color: "#073B4C" },
    { id: 9, expression: "⅔ × ¾ =", answer: "½", color: "#FF9E00" },
    { id: 10, expression: "5 ÷ ½ =", answer: "10", color: "#8338EC" }
];

// Основная функция инициализации
function initGame() {
    console.log("Инициализация игры...");
    
    // Инициализация навигации
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!prevBtn || !nextBtn) {
        console.error("Кнопки навигации не найдены!");
        return;
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide) - 1;
            showSlide(slideIndex);
        });
    });
    
    // Инициализация регистрации
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startRegistration);
    }
    
    // Инициализация канваса
    initCanvas();
    
    // Создание задач
    createProblems();
    
    // Создание палитры
    createColorPalette();
    
    // Настройка инструментов
    setupTools();
    
    // Настройка кнопок игры
    setupGameButtons();
    
    // Инициализация результатов
    initResults();
    
    console.log("Игра инициализирована!");
    
    // Показываем первый слайд
    showSlide(0);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Навигация по слайдам
function showSlide(index) {
    if (index < 0 || index > 2) return;
    
    console.log("Переключение на слайд:", index);
    
    // Обновляем текущий слайд
    currentSlide = index;
    
    // Сдвигаем контейнер
    const container = document.querySelector('.slides-container');
    if (container) {
        container.style.transform = `translateX(-${index * 100}vw)`;
    }
    
    // Обновляем индикаторы
    document.querySelectorAll('.indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
    
    // Обновляем кнопки навигации
    updateNavButtons();
    
    // Выполняем действия для слайда
    if (index === 1) { // Игра
        startGame();
    } else if (index === 2) { // Результаты
        showResults();
    }
}

function nextSlide() {
    console.log("Следующий слайд");
    if (currentSlide < 2) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    console.log("Предыдущий слайд");
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) return;
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === 2;
    
    // Меняем текст кнопки "Далее" на последнем слайде
    if (currentSlide === 2) {
        nextBtn.innerHTML = 'Завершить <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
    }
}

// Регистрация
function startRegistration() {
    console.log("Начало регистрации...");
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const className = document.getElementById('class').value;
    const teacherEmail = document.getElementById('teacherEmail').value.trim();
    
    // Проверка заполнения
    if (!firstName || !lastName || !className) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
    }
    
    if (!document.getElementById('agreement').checked) {
        alert('Необходимо согласие на обработку данных!');
        return;
    }
    
    // Сохраняем данные
    studentData = {
        firstName,
        lastName,
        className: `${className} класс`,
        teacherEmail: teacherEmail || 'vadimkut9@gmail.com',
        gameTime: 0
    };
    
    console.log("Данные сохранены:", studentData);
    
    // Обновляем отображение в игре
    updatePlayerDisplay();
    
    // Переходим к игре
    nextSlide();
}

function updatePlayerDisplay() {
    const playerName = document.getElementById('currentPlayer');
    const playerClass = document.getElementById('currentClass');
    
    if (playerName) {
        playerName.textContent = `${studentData.firstName} ${studentData.lastName}`;
    }
    
    if (playerClass) {
        playerClass.textContent = studentData.className;
    }
}

// Инициализация канваса
function initCanvas() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) {
        console.error("Canvas не найден!");
        return;
    }
    
    gameCtx = gameCanvas.getContext('2d');
    console.log("Canvas инициализирован");
    
    // Устанавливаем размеры канваса
    function resizeCanvas() {
        const container = gameCanvas.parentElement;
        if (container) {
            gameCanvas.width = container.clientWidth;
            gameCanvas.height = container.clientHeight;
            console.log("Размер canvas:", gameCanvas.width, "x", gameCanvas.height);
            drawPictureOutline();
        }
    }
    
    // Устанавливаем начальный размер
    resizeCanvas();
    
    // Обработчики событий мыши
    gameCanvas.addEventListener('mousedown', startDrawing);
    gameCanvas.addEventListener('mousemove', draw);
    gameCanvas.addEventListener('mouseup', stopDrawing);
    gameCanvas.addEventListener('mouseout', stopDrawing);
    
    // Обработчики для сенсорных устройств
    gameCanvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = gameCanvas.getBoundingClientRect();
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
            isDrawing = true;
        }
    });
    
    gameCanvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isDrawing && e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = gameCanvas.getBoundingClientRect();
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;
            
            // Рисуем линию
            gameCtx.beginPath();
            gameCtx.moveTo(lastX, lastY);
            gameCtx.lineTo(currentX, currentY);
            gameCtx.strokeStyle = currentColor;
            gameCtx.lineWidth = brushSize;
            gameCtx.lineCap = 'round';
            gameCtx.stroke();
            
            lastX = currentX;
            lastY = currentY;
        }
    });
    
    gameCanvas.addEventListener('touchend', stopDrawing);
    
    // Обновляем размер при изменении окна
    window.addEventListener('resize', resizeCanvas);
}

function drawPictureOutline() {
    if (!gameCtx || !gameCanvas) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    // Очищаем канвас
    gameCtx.clearRect(0, 0, width, height);
    
    // Фон
    gameCtx.fillStyle = '#F9F9F9';
    gameCtx.fillRect(0, 0, width, height);
    
    // Рисуем 10 областей (2 ряда по 5)
    MATH_PROBLEMS.forEach((problem, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const areaWidth = width / 5 - 10;
        const areaHeight = height / 2 - 10;
        const x = col * (width / 5) + 5;
        const y = row * (height / 2) + 5;
        
        // Контур области
        gameCtx.strokeStyle = problem.color;
        gameCtx.lineWidth = 2;
        gameCtx.strokeRect(x, y, areaWidth, areaHeight);
        
        // Номер задачи
        gameCtx.fillStyle = problem.color;
        gameCtx.font = 'bold 16px Arial';
        gameCtx.fillText(problem.id, x + 10, y + 20);
        
        // Выражение
        gameCtx.font = '14px Arial';
        gameCtx.fillText(problem.expression, x + 10, y + 40);
    });
}

function createProblems() {
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) {
        console.error("Элемент problemsList не найден!");
        return;
    }
    
    problemsList.innerHTML = '';
    
    MATH_PROBLEMS.forEach(problem => {
        const problemItem = document.createElement('div');
        problemItem.className = 'problem-item';
        problemItem.dataset.problemId = problem.id;
        
        problemItem.innerHTML = `
            <div class="problem-header">
                <div class="problem-number">${problem.id}</div>
                <div class="problem-expression">${problem.expression}</div>
                <div class="problem-status"></div>
            </div>
            <div class="problem-input">
                <input type="text" 
                       class="answer-input" 
                       placeholder="Ответ..."
                       data-problem="${problem.id}">
                <button class="btn-small check-problem-btn" data-problem="${problem.id}">
                    Проверить
                </button>
            </div>
        `;
        
        problemsList.appendChild(problemItem);
    });
    
    // Добавляем обработчики для кнопок проверки
    document.querySelectorAll('.check-problem-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const problemId = parseInt(this.dataset.problem);
            checkGameAnswer(problemId);
        });
    });
}

function createColorPalette() {
    const colorPalette = document.getElementById('colorPalette');
    if (!colorPalette) {
        console.error("Элемент colorPalette не найден!");
        return;
    }
    
    colorPalette.innerHTML = '';
    
    MATH_PROBLEMS.forEach(problem => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item locked';
        colorItem.style.backgroundColor = problem.color;
        colorItem.dataset.color = problem.color;
        colorItem.dataset.problemId = problem.id;
        colorItem.title = `Задача ${problem.id}: ${problem.expression}`;
        colorItem.innerHTML = '<i class="fas fa-lock"></i>';
        
        colorItem.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                selectColor(problem.color);
            }
        });
        
        colorPalette.appendChild(colorItem);
    });
}

function setupTools() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toolButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
            console.log("Выбран инструмент:", currentTool);
        });
    });
    
    const brushSizeInput = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    
    if (brushSizeInput && brushSizeValue) {
        brushSizeInput.addEventListener('input', function() {
            brushSize = parseInt(this.value);
            brushSizeValue.textContent = brushSize;
            console.log("Размер кисти:", brushSize);
        });
    }
}

function setupGameButtons() {
    const clearBtn = document.getElementById('clearCanvasBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Очистить рисунок?')) {
                drawPictureOutline();
            }
        });
    }
}

function startGame() {
    console.log("Начало игры...");
    
    // Сбрасываем время
    gameTime = 0;
    
    // Запускаем таймер
    startGameTimer();
    
    // Рисуем картинку
    drawPictureOutline();
    
    // Сбрасываем задачи
    resetProblems();
    
    // Сбрасываем цвета
    resetColors();
}

function startGameTimer() {
    clearInterval(gameTimer);
    updateTimerDisplay();
    
    gameTimer = setInterval(() => {
        gameTime++;
        updateTimerDisplay();
        console.log("Время игры:", gameTime, "сек");
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('gameTimer');
    if (timerElement) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function resetProblems() {
    document.querySelectorAll('.problem-item').forEach(item => {
        item.classList.remove('solved');
        const input = item.querySelector('.answer-input');
        const status = item.querySelector('.problem-status');
        
        if (input) {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        }
        
        if (status) {
            status.innerHTML = '';
        }
    });
}

function resetColors() {
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.add('locked');
        item.innerHTML = '<i class="fas fa-lock"></i>';
    });
}

function checkGameAnswer(problemId) {
    console.log("Проверка задачи:", problemId);
    
    const problem = MATH_PROBLEMS.find(p => p.id === problemId);
    if (!problem) {
        console.error("Задача не найдена:", problemId);
        return;
    }
    
    const input = document.querySelector(`input[data-problem="${problemId}"]`);
    if (!input) {
        console.error("Поле ввода не найдено для задачи:", problemId);
        return;
    }
    
    const problemItem = input.closest('.problem-item');
    const status = problemItem ? problemItem.querySelector('.problem-status') : null;
    
    const userAnswer = input.value.trim();
    
    if (!userAnswer) {
        alert('Введите ответ!');
        return;
    }
    
    if (normalizeFraction(userAnswer) === normalizeFraction(problem.answer)) {
        // Правильный ответ
        console.log("Правильный ответ!");
        input.classList.add('correct');
        input.classList.remove('incorrect');
        
        if (status) {
            status.innerHTML = '<i class="fas fa-check"></i>';
        }
        
        if (problemItem) {
            problemItem.classList.add('solved');
        }
        
        // Разблокируем цвет
        const colorItem = document.querySelector(`.color-item[data-problem-id="${problemId}"]`);
        if (colorItem) {
            colorItem.classList.remove('locked');
            colorItem.innerHTML = '<i class="fas fa-paint-brush"></i>';
            
            // Автоматически выбираем цвет
            selectColor(problem.color);
        }
    } else {
        // Неправильный ответ
        console.log("Неправильный ответ");
        input.classList.add('incorrect');
        input.classList.remove('correct');
        
        if (status) {
            status.innerHTML = '<i class="fas fa-times"></i>';
        }
    }
}

function selectColor(color) {
    currentColor = color;
    console.log("Выбран цвет:", color);
    
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.color === color) {
            item.classList.add('active');
        }
    });
}

function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    
    const rect = gameCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    
    console.log("Начало рисования:", lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const rect = gameCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // Рисуем линию
    gameCtx.beginPath();
    gameCtx.moveTo(lastX, lastY);
    gameCtx.lineTo(currentX, currentY);
    gameCtx.strokeStyle = currentColor;
    gameCtx.lineWidth = brushSize;
    gameCtx.lineCap = 'round';
    gameCtx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
    console.log("Остановка рисования");
}

// Результаты
function initResults() {
    const emailBtn = document.getElementById('emailResultsBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    
    if (emailBtn) {
        emailBtn.addEventListener('click', sendResultsByEmail);
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
}

function showResults() {
    console.log("Показ результатов...");
    
    // Сохраняем время игры
    studentData.gameTime = gameTime;
    clearInterval(gameTimer);
    
    // Обновляем отображение
    const resultTime = document.getElementById('resultTime');
    const resultStudent = document.getElementById('resultStudent');
    
    if (resultTime) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        resultTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (resultStudent) {
        resultStudent.textContent = `${studentData.firstName} ${studentData.lastName}, ${studentData.className}`;
    }
    
    console.log("Результаты обновлены");
}

function sendResultsByEmail() {
    console.log("Отправка результатов по email...");
    
    const minutes = Math.floor(studentData.gameTime / 60);
    const seconds = studentData.gameTime % 60;
    
    const subject = `Результаты игры: ${studentData.firstName} ${studentData.lastName}`;
    const body = `
Результаты математической игры "Раскрась дробями":

Ученик: ${studentData.firstName} ${studentData.lastName}
Класс: ${studentData.className}

Время игры: ${minutes} минут ${seconds} секунд

Дата: ${new Date().toLocaleDateString()}
Время: ${new Date().toLocaleTimeString()}

Игра завершена успешно!
    `.trim();
    
    const mailtoLink = `mailto:${studentData.teacherEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    alert('Результаты готовы к отправке. Проверьте вашу почтовую программу.');
}

function startNewGame() {
    console.log("Новая игра...");
    
    if (confirm('Начать новую игру?')) {
        // Сбрасываем данные
        studentData = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            className: studentData.className,
            teacherEmail: 'vadimkut9@gmail.com',
            gameTime: 0
        };
        
        // Останавливаем таймер
        clearInterval(gameTimer);
        gameTime = 0;
        
        // Переходим к началу
        showSlide(0);
        
        // Сбрасываем форму
        const emailInput = document.getElementById('teacherEmail');
        if (emailInput) {
            emailInput.value = 'vadimkut9@gmail.com';
        }
        
        console.log("Новая игра начата");
    }
}

// Вспомогательные функции
function normalizeFraction(str) {
    return str
        .replace(/½/g, '1/2')
        .replace(/⅓/g, '1/3')
        .replace(/⅔/g, '2/3')
        .replace(/¼/g, '1/4')
        .replace(/¾/g, '3/4')
        .toLowerCase()
        .trim();
}

// Добавляем обработчики клавиш для навигации
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    }
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    }
});

// Функция для отладки
function debugInfo() {
    console.log("=== ДЕБАГ ИНФОРМАЦИЯ ===");
    console.log("Текущий слайд:", currentSlide);
    console.log("Время игры:", gameTime);
    console.log("Данные ученика:", studentData);
    console.log("Canvas доступен:", !!gameCanvas);
    console.log("Context доступен:", !!gameCtx);
    console.log("=========================");
}

// Экспортируем функции для глобального доступа
window.checkGameAnswer = checkGameAnswer;
window.debugInfo = debugInfo;

console.log("JavaScript файл загружен!");
