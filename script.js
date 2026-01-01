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
    teacherEmail: 'vadimkut9@gmail.com', // ВАШ EMAIL
    gameTime: 0
};

// Математические задачи
const MATH_PROBLEMS = [
    { id: 1, expression: "½ + ¼ =", answer: "¾", color: "#FF6B6B", hint: "½ = 2/4, поэтому 2/4 + 1/4 = 3/4" },
    { id: 2, expression: "⅔ + ⅓ =", answer: "1", color: "#4ECDC4", hint: "2/3 + 1/3 = 3/3 = 1" },
    { id: 3, expression: "¾ - ½ =", answer: "¼", color: "#FFD166", hint: "¾ = 3/4, ½ = 2/4, поэтому 3/4 - 2/4 = 1/4" },
    { id: 4, expression: "1½ + 2½ =", answer: "4", color: "#06D6A0", hint: "1½ = 1 + ½, 2½ = 2 + ½, сумма = 3 + 1 = 4" },
    { id: 5, expression: "3⅓ - 1⅓ =", answer: "2", color: "#118AB2", hint: "3⅓ = 3 + ⅓, 1⅓ = 1 + ⅓, разница = 2" },
    { id: 6, expression: "¼ × 4 =", answer: "1", color: "#7209B7", hint: "¼ × 4 = 4/4 = 1" },
    { id: 7, expression: "½ ÷ ¼ =", answer: "2", color: "#EF476F", hint: "½ ÷ ¼ = ½ × 4 = 2" },
    { id: 8, expression: "3¾ - 1¼ =", answer: "2½", color: "#073B4C", hint: "3¾ = 3 + ¾, 1¼ = 1 + ¼, разница = 2 + ½" },
    { id: 9, expression: "⅔ × ¾ =", answer: "½", color: "#FF9E00", hint: "2/3 × 3/4 = 6/12 = 1/2" },
    { id: 10, expression: "5 ÷ ½ =", answer: "10", color: "#8338EC", hint: "5 ÷ ½ = 5 × 2 = 10" }
];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initRegistration();
    initGame();
    initResults();
    
    // Показываем первый слайд
    showSlide(0);
});

// Навигация по слайдам
function initNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    // Кнопки навигации
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Индикаторы
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide) - 1;
            showSlide(slideIndex);
        });
    });
    
    // Клавиши клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT') return;
        
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

function showSlide(index) {
    if (index < 0 || index > 2) return;
    
    // Обновляем текущий слайд
    currentSlide = index;
    
    // Сдвигаем контейнер
    const container = document.querySelector('.slides-container');
    container.style.transform = `translateX(-${index * 100}vw)`;
    
    // Обновляем индикаторы
    document.querySelectorAll('.indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
    
    // Обновляем кнопки навигации
    updateNavButtons();
    
    // Выполняем действия для слайда
    onSlideChange(index);
}

function nextSlide() {
    if (currentSlide < 2) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === 2;
    
    // Меняем текст кнопки "Далее" на последнем слайде
    if (currentSlide === 2) {
        nextBtn.innerHTML = 'Завершить <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
    }
}

function onSlideChange(index) {
    switch(index) {
        case 1: // Игра
            startGame();
            break;
        case 2: // Результаты
            showResults();
            break;
    }
}

// Слайд 1: Регистрация
function initRegistration() {
    const startBtn = document.getElementById('startGameBtn');
    
    startBtn.addEventListener('click', function() {
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
        
        // Обновляем отображение в игре
        updatePlayerDisplay();
        
        // Переходим к игре
        nextSlide();
    });
}

function updatePlayerDisplay() {
    document.getElementById('currentPlayer').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('currentClass').textContent = studentData.className;
}

// Слайд 2: Игра
function initGame() {
    initCanvas();
    createProblems();
    createColorPalette();
    setupTools();
    setupGameButtons();
}

function initCanvas() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    
    gameCtx = gameCanvas.getContext('2d');
    
    // Размеры канваса
    function resizeCanvas() {
        const container = gameCanvas.parentElement;
        gameCanvas.width = container.clientWidth;
        gameCanvas.height = container.clientHeight;
        drawPictureOutline();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // События мыши
    gameCanvas.addEventListener('mousedown', startDrawing);
    gameCanvas.addEventListener('mousemove', draw);
    gameCanvas.addEventListener('mouseup', stopDrawing);
    gameCanvas.addEventListener('mouseout', stopDrawing);
}

function drawPictureOutline() {
    if (!gameCtx) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    gameCtx.clearRect(0, 0, width, height);
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
        
        // Контур
        gameCtx.strokeStyle = problem.color;
        gameCtx.lineWidth = 2;
        gameCtx.strokeRect(x, y, areaWidth, areaHeight);
        
        // Номер
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
                <div class="problem-status"></div>
            </div>
            <div class="problem-input">
                <input type="text" 
                       class="answer-input" 
                       placeholder="Ответ..."
                       data-problem="${problem.id}">
                <button class="btn-small" onclick="checkGameAnswer(${problem.id})">
                    Проверить
                </button>
            </div>
        `;
        
        problemsList.appendChild(problemItem);
    });
}

function createColorPalette() {
    const colorPalette = document.getElementById('colorPalette');
    if (!colorPalette) return;
    
    colorPalette.innerHTML = '';
    
    MATH_PROBLEMS.forEach(problem => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item locked';
        colorItem.style.backgroundColor = problem.color;
        colorItem.dataset.color = problem.color;
        colorItem.dataset.problemId = problem.id;
        colorItem.title = `Задача ${problem.id}`;
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
        });
    });
    
    const brushSizeInput = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    
    brushSizeInput.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        brushSizeValue.textContent = brushSize;
    });
}

function setupGameButtons() {
    document.getElementById('clearCanvasBtn').addEventListener('click', function() {
        if (confirm('Очистить рисунок?')) {
            drawPictureOutline();
        }
    });
}

function startGame() {
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
    gameTime = 0;
    updateTimerDisplay();
    
    gameTimer = setInterval(() => {
        gameTime++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('gameTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetProblems() {
    document.querySelectorAll('.problem-item').forEach(item => {
        item.classList.remove('solved');
        const input = item.querySelector('.answer-input');
        const status = item.querySelector('.problem-status');
        
        if (input) input.value = '';
        if (status) status.innerHTML = '';
    });
}

function resetColors() {
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.add('locked');
        item.innerHTML = '<i class="fas fa-lock"></i>';
    });
}

function checkGameAnswer(problemId) {
    const problem = MATH_PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;
    
    const input = document.querySelector(`input[data-problem="${problemId}"]`);
    const problemItem = input.closest('.problem-item');
    const status = problemItem.querySelector('.problem-status');
    
    if (!input.value.trim()) {
        alert('Введите ответ!');
        return;
    }
    
    if (normalizeFraction(input.value.trim()) === normalizeFraction(problem.answer)) {
        // Правильный ответ
        input.classList.add('correct');
        input.classList.remove('incorrect');
        status.innerHTML = '<i class="fas fa-check"></i>';
        problemItem.classList.add('solved');
        
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
        input.classList.add('incorrect');
        input.classList.remove('correct');
        status.innerHTML = '<i class="fas fa-times"></i>';
    }
}

function selectColor(color) {
    currentColor = color;
    
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
}

// Слайд 3: Результаты
function initResults() {
    document.getElementById('emailResultsBtn').addEventListener('click', sendResultsByEmail);
    document.getElementById('newGameBtn').addEventListener('click', startNewGame);
}

function showResults() {
    // Сохраняем время игры
    studentData.gameTime = gameTime;
    clearInterval(gameTimer);
    
    // Обновляем отображение
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('resultTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('resultStudent').textContent = 
        `${studentData.firstName} ${studentData.lastName}, ${studentData.className}`;
}

function sendResultsByEmail() {
    const subject = `Результаты игры: ${studentData.firstName} ${studentData.lastName}`;
    
    const minutes = Math.floor(studentData.gameTime / 60);
    const seconds = studentData.gameTime % 60;
    
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
}

function startNewGame() {
    if (confirm('Начать новую игру?')) {
        // Сбрасываем данные
        studentData = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            className: studentData.className,
            teacherEmail: 'vadimkut9@gmail.com',
            gameTime: 0
        };
        
        // Переходим к началу
        showSlide(0);
        
        // Сбрасываем форму
        document.getElementById('teacherEmail').value = 'vadimkut9@gmail.com';
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
