// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let studentData = {
    firstName: '',
    lastName: '',
    className: '',
    teacherEmail: 'vadimkut9@gmail.com',
    score: 0,
    solved: 0,
    timeSpent: 0
};

// ДАННЫЕ ИГРЫ
let gameScore = 0;
let solvedProblems = 0;
let gameTimer;
let timeLeft = 300; // 5 минут
let gameCanvas, gameCtx;
let currentTool = 'brush';
let currentColor = '#FF6B6B';
let brushSize = 15;
let isDrawing = false;
let lastX = 0, lastY = 0;

// МАССИВ ЗАДАЧ И ЦВЕТОВ
const PROBLEMS = [
    { id: 1, expression: "½ + ¼ =", answer: "¾", color: "#FF6B6B", hint: "½ = 2/4, поэтому 2/4 + 1/4 = 3/4" },
    { id: 2, expression: "⅔ + ⅓ =", answer: "1", color: "#4ECDC4", hint: "Сложи числители: 2 + 1 = 3, 3/3 = 1" },
    { id: 3, expression: "¾ - ½ =", answer: "¼", color: "#FFD166", hint: "½ = 2/4, поэтому 3/4 - 2/4 = 1/4" },
    { id: 4, expression: "1½ + 2½ =", answer: "4", color: "#06D6A0", hint: "Сложи целые: 1 + 2 = 3, сложи дроби: ½ + ½ = 1, всего 4" },
    { id: 5, expression: "3⅓ - 1⅓ =", answer: "2", color: "#118AB2", hint: "Вычти целые: 3 - 1 = 2, дроби одинаковые" },
    { id: 6, expression: "¼ × 4 =", answer: "1", color: "#7209B7", hint: "¼ × 4 = 4/4 = 1" },
    { id: 7, expression: "½ ÷ ¼ =", answer: "2", color: "#EF476F", hint: "½ ÷ ¼ = ½ × 4/1 = 2" },
    { id: 8, expression: "3¾ - 1¼ =", answer: "2½", color: "#073B4C", hint: "3¾ - 1¼ = (3-1) + (¾-¼) = 2 + ½" },
    { id: 9, expression: "⅔ × ¾ =", answer: "½", color: "#FF9E00", hint: "2/3 × 3/4 = 6/12 = 1/2" },
    { id: 10, expression: "5 ÷ ½ =", answer: "10", color: "#8338EC", hint: "5 ÷ ½ = 5 × 2 = 10" }
];

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    initRegistration();
    initGame();
    showSlide(0);
    startMathAnimation();
});

// ФУНКЦИИ ДЛЯ НАВИГАЦИИ
function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    // Скрываем текущий слайд
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');
    
    // Показываем новый слайд
    slides[index].classList.add('active');
    document.querySelectorAll('.indicator')[index].classList.add('active');
    currentSlide = index;
    
    // Обновляем кнопки навигации
    updateNavButtons();
    
    // Выполняем действия для конкретного слайда
    onSlideChanged(index);
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function updateNavButtons() {
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === slides.length - 1;
}

function onSlideChanged(slideIndex) {
    switch(slideIndex) {
        case 2: // Игра
            if (!gameCanvas) initCanvas();
            startGame();
            break;
        case 3: // Результаты
            showResults();
            break;
        case 4: // Подтверждение
            showConfirmation();
            break;
    }
}

// СЛАЙД 1: РЕГИСТРАЦИЯ
function initRegistration() {
    document.getElementById('startGameBtn').addEventListener('click', function() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const className = document.getElementById('class').value;
        const teacherEmail = document.getElementById('teacherEmail').value.trim();
        
        if (!firstName || !lastName || !className) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        // Сохраняем данные ученика
        studentData = {
            firstName,
            lastName,
            className: `${className} класс`,
            teacherEmail,
            score: 0,
            solved: 0,
            timeSpent: 0
        };
        
        // Обновляем отображение в игре
        document.getElementById('playerName').textContent = `${firstName} ${lastName}`;
        document.getElementById('playerClass').textContent = `${className} класс`;
        
        // Переходим к следующему слайду
        nextSlide();
    });
}

// СЛАЙД 2: ОБУЧЕНИЕ
function checkPractice(problemId) {
    const input = document.getElementById('practice1');
    const answer = '¾';
    
    if (normalizeFraction(input.value) === normalizeFraction(answer)) {
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#d4edda';
        alert('Правильно! 🎉');
    } else {
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#f8d7da';
        alert('Попробуй еще раз! Правильный ответ: ¾');
    }
}

// СЛАЙД 3: ИГРА
function initGame() {
    // Создаем задачи
    createProblems();
    
    // Создаем палитру цветов
    createColorPalette();
    
    // Инициализируем канвас
    initCanvas();
}

function createProblems() {
    const problemsList = document.getElementById('problemsList');
    problemsList.innerHTML = '';
    
    PROBLEMS.forEach(problem => {
        const problemItem = document.createElement('div');
        problemItem.className = 'problem-item';
        problemItem.innerHTML = `
            <div class="problem-header">
                <span class="problem-number">${problem.id}</span>
                <span class="problem-expression">${problem.expression}</span>
                <div class="problem-status"></div>
            </div>
            <div class="problem-input">
                <input type="text" 
                       class="answer-input" 
                       placeholder="Ответ..."
                       data-problem="${problem.id}"
                       data-answer="${problem.answer}">
                <button class="check-problem-btn" onclick="checkProblem(${problem.id})">Проверить</button>
            </div>
        `;
        problemsList.appendChild(problemItem);
    });
}

function createColorPalette() {
    const colorPalette = document.getElementById('colorPalette');
    colorPalette.innerHTML = '';
    
    PROBLEMS.forEach(problem => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item locked';
        colorItem.style.backgroundColor = problem.color;
        colorItem.dataset.color = problem.color;
        colorItem.dataset.problem = problem.id;
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

function initCanvas() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    
    gameCtx = gameCanvas.getContext('2d');
    
    // Адаптивный размер
    function resizeCanvas() {
        const container = gameCanvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        gameCanvas.width = rect.width;
        gameCanvas.height = rect.height;
        drawPictureOutline();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // События мыши
    gameCanvas.addEventListener('mousedown', startDrawing);
    gameCanvas.addEventListener('mousemove', draw);
    gameCanvas.addEventListener('mouseup', stopDrawing);
    gameCanvas.addEventListener('mouseout', stopDrawing);
    
    // События касания
    gameCanvas.addEventListener('touchstart', handleTouchStart);
    gameCanvas.addEventListener('touchmove', handleTouchMove);
    gameCanvas.addEventListener('touchend', stopDrawing);
}

function drawPictureOutline() {
    if (!gameCtx) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    gameCtx.clearRect(0, 0, width, height);
    
    // Фон
    gameCtx.fillStyle = '#E3F2FD';
    gameCtx.fillRect(0, 0, width, height);
    
    // Рисуем 10 областей для раскраски
    PROBLEMS.forEach((problem, index) => {
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

function startGame() {
    // Сбрасываем счет
    gameScore = 0;
    solvedProblems = 0;
    timeLeft = 300;
    
    // Обновляем отображение
    updateGameStats();
    
    // Запускаем таймер
    startTimer();
    
    // Рисуем картинку
    drawPictureOutline();
}

function updateGameStats() {
    document.getElementById('solvedCount').textContent = solvedProblems;
    document.getElementById('scoreCount').textContent = gameScore;
}

function startTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            finishGame();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function checkProblem(problemId) {
    const input = document.querySelector(`[data-problem="${problemId}"]`);
    const correctAnswer = input.dataset.answer;
    const userAnswer = input.value.trim();
    const problemItem = input.closest('.problem-item');
    const status = problemItem.querySelector('.problem-status');
    
    if (!userAnswer) {
        alert('Введите ответ!');
        return;
    }
    
    if (normalizeFraction(userAnswer) === normalizeFraction(correctAnswer)) {
        // Правильный ответ
        input.classList.add('correct');
        status.innerHTML = '<i class="fas fa-check"></i>';
        status.className = 'problem-status correct';
        
        // Добавляем баллы
        gameScore += 20;
        solvedProblems++;
        
        // Разблокируем цвет
        unlockColor(problemId);
        
        // Рисуем область
        drawColoredArea(problemId - 1, PROBLEMS[problemId - 1].color);
        
        // Обновляем статистику
        updateGameStats();
        
        // Проверяем завершение
        if (solvedProblems === PROBLEMS.length) {
            finishGame();
        }
    } else {
        // Неправильный ответ
        input.classList.add('incorrect');
        status.innerHTML = '<i class="fas fa-times"></i>';
        status.className = 'problem-status incorrect';
        
        // Штраф
        gameScore = Math.max(0, gameScore - 5);
        updateGameStats();
        
        setTimeout(() => {
            input.classList.remove('incorrect');
            input.focus();
        }, 2000);
    }
}

function unlockColor(problemId) {
    const colorItem = document.querySelector(`[data-problem="${problemId}"]`);
    if (colorItem && colorItem.classList.contains('locked')) {
        colorItem.classList.remove('locked');
        colorItem.innerHTML = '';
        colorItem.style.cursor = 'pointer';
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

function selectTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function updateBrushSize(size) {
    brushSize = parseInt(size);
    document.getElementById('brushSizeValue').textContent = size;
}

function clearCanvas() {
    if (confirm('Очистить весь рисунок?')) {
        drawPictureOutline();
    }
}

// ФУНКЦИИ РИСОВАНИЯ
function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    [lastX, lastY] = [pos.x, pos.y];
    
    if (currentTool === 'bucket') {
        floodFill(pos.x, pos.y);
        isDrawing = false;
    }
}

function draw(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    const pos = getMousePos(e);
    
    gameCtx.beginPath();
    gameCtx.globalCompositeOperation = 'source-over';
    
    if (currentTool === 'eraser') {
        gameCtx.strokeStyle = '#E3F2FD';
        gameCtx.lineWidth = brushSize * 2;
    } else {
        gameCtx.strokeStyle = currentColor;
        gameCtx.lineWidth = brushSize;
    }
    
    gameCtx.lineCap = 'round';
    gameCtx.lineJoin = 'round';
    
    gameCtx.moveTo(lastX, lastY);
    gameCtx.lineTo(pos.x, pos.y);
    gameCtx.stroke();
    
    [lastX, lastY] = [pos.x, pos.y];
}

function stopDrawing() {
    isDrawing = false;
}

function getMousePos(e) {
    const rect = gameCanvas.getBoundingClientRect();
    let x, y;
    
    if (e.type.includes('touch')) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    
    x = (x / rect.width) * gameCanvas.width;
    y = (y / rect.height) * gameCanvas.height;
    
    return { x, y };
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        gameCanvas.dispatchEvent(mouseEvent);
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        gameCanvas.dispatchEvent(mouseEvent);
    }
    e.preventDefault();
}

function floodFill(startX, startY) {
    // Упрощенная заливка
    gameCtx.fillStyle = currentColor;
    gameCtx.fillRect(startX - 20, startY - 20, 40, 40);
}

function drawColoredArea(areaIndex, color) {
    if (!gameCtx) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    const row = Math.floor(areaIndex / 5);
    const col = areaIndex % 5;
    const areaWidth = width / 5 - 10;
    const areaHeight = height / 2 - 10;
    const x = col * (width / 5) + 5;
    const y = row * (height / 2) + 5;
    
    gameCtx.fillStyle = color;
    gameCtx.fillRect(x, y, areaWidth, areaHeight);
    
    // Номер и выражение поверх заливки
    gameCtx.fillStyle = 'white';
    gameCtx.font = 'bold 16px Arial';
    gameCtx.fillText(PROBLEMS[areaIndex].id, x + 10, y + 20);
    gameCtx.fillText(PROBLEMS[areaIndex].expression, x + 10, y + 40);
}

function showHint() {
    const unsolved = PROBLEMS.find(p => 
        !document.querySelector(`[data-problem="${p.id}"]`).classList.contains('correct')
    );
    
    if (unsolved) {
        document.getElementById('hintText').innerHTML = 
            `<strong>Задача ${unsolved.id}:</strong> ${unsolved.hint}`;
        
        // Штраф за подсказку
        gameScore = Math.max(0, gameScore - 10);
        updateGameStats();
    } else {
        document.getElementById('hintText').innerHTML = 
            'Все задачи решены! 🎉';
    }
}

function finishGame() {
    clearInterval(gameTimer);
    studentData.score = gameScore;
    studentData.solved = solvedProblems;
    studentData.timeSpent = 300 - timeLeft;
    
    setTimeout(() => {
        nextSlide();
    }, 1000);
}

// СЛАЙД 4: РЕЗУЛЬТАТЫ
function showResults() {
    document.getElementById('resultName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('resultClass').textContent = studentData.className;
    
    document.getElementById('resultSolved').textContent = 
        `${studentData.solved}/${PROBLEMS.length}`;
    document.getElementById('resultScore').textContent = studentData.score;
    
    // Процент раскраски (упрощенно)
    const coloredPercent = Math.round((studentData.solved / PROBLEMS.length) * 100);
    document.getElementById('resultColored').textContent = `${coloredPercent}%`;
    
    // Уровень
    const level = getLevel(studentData.score);
    document.getElementById('resultLevel').textContent = level;
    
    // Время
    const minutes = Math.floor(studentData.timeSpent / 60);
    const seconds = studentData.timeSpent % 60;
    document.getElementById('resultTime').textContent = 
        `Время: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Копируем рисунок
    copyCanvasToResults();
}

function getLevel(score) {
    if (score >= 180) return 'Гений 🏆';
    if (score >= 150) return 'Отличник ★★★';
    if (score >= 120) return 'Хорошист ★★';
    if (score >= 90) return 'Ученик ★';
    if (score >= 60) return 'Начинающий';
    return 'Новичок';
}

function copyCanvasToResults() {
    const resultCanvas = document.getElementById('resultCanvas');
    const resultCtx = resultCanvas.getContext('2d');
    
    if (gameCanvas) {
        resultCtx.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, 
                           0, 0, resultCanvas.width, resultCanvas.height);
    }
}

async function saveResults() {
    const teacherEmail = studentData.teacherEmail || 'teacher@school.ru';
    
    try {
        // Готовим данные для отправки
        const resultData = {
            student: studentData,
            gameResults: {
                score: studentData.score,
                solved: studentData.solved,
                time: studentData.timeSpent,
                date: new Date().toISOString()
            }
        };
        
        // Сохраняем в localStorage (для тестирования)
        saveToLocalStorage(resultData);
        
        // Отправляем email через mailto
        const emailBody = `
Ученик: ${studentData.firstName} ${studentData.lastName}
Класс: ${studentData.className}
Дата: ${new Date().toLocaleDateString('ru-RU')}

Результаты:
✅ Решено задач: ${studentData.solved}/${PROBLEMS.length}
⭐ Баллы: ${studentData.score}
🎨 Уровень: ${getLevel(studentData.score)}
⏱️ Время: ${Math.floor(studentData.timeSpent/60)}:${(studentData.timeSpent%60).toString().padStart(2,'0')}
        `;
        
        const mailtoLink = `mailto:${teacherEmail}?subject=Результаты ученика&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
        
        // Переходим к подтверждению
        setTimeout(() => {
            nextSlide();
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка сохранения результатов. Данные сохранены локально.');
        nextSlide();
    }
}

function saveToLocalStorage(data) {
    const existing = JSON.parse(localStorage.getItem('mathGameResults') || '[]');
    existing.push(data);
    localStorage.setItem('mathGameResults', JSON.stringify(existing));
}

function restartGame() {
    // Сбрасываем игру
    gameScore = 0;
    solvedProblems = 0;
    
    // Сбрасываем задачи
    document.querySelectorAll('.problem-item').forEach(item => {
        const input = item.querySelector('.answer-input');
        const status = item.querySelector('.problem-status');
        
        input.value = '';
        input.classList.remove('correct', 'incorrect');
        status.innerHTML = '';
        status.className = 'problem-status';
    });
    
    // Сбрасываем цвета
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.add('locked');
        item.innerHTML = '<i class="fas fa-lock"></i>';
    });
    
    // Возвращаемся к игре
    showSlide(2);
    startGame();
}

// СЛАЙД 5: ПОДТВЕРЖДЕНИЕ
function showConfirmation() {
    document.getElementById('teacherEmailText').textContent = 
        `На адрес: ${studentData.teacherEmail || 'teacher@school.ru'}`;
    document.getElementById('certName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('certScore').textContent = studentData.score;
    document.getElementById('certDate').textContent = 
        new Date().toLocaleDateString('ru-RU');
}

function downloadCertificate() {
    alert('Сертификат сохранен! Вы можете сделать скриншот этой страницы.');
    // В реальном проекте можно использовать библиотеку для создания PDF
}

function newStudent() {
    // Сбрасываем форму
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('class').value = '';
    document.getElementById('teacherEmail').value = '';
    
    // Возвращаемся к началу
    showSlide(0);
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function normalizeFraction(str) {
    const fractions = {
        '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4',
        '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5', '⅙': '1/6',
        '⅚': '5/6', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8'
    };
    
    let normalized = str;
    for (const [symbol, fraction] of Object.entries(fractions)) {
        normalized = normalized.replace(new RegExp(symbol, 'g'), fraction);
    }
    
    return normalized.replace(/\s+/g, '');
}

function startMathAnimation() {
    const symbols = document.querySelectorAll('.math-symbols span');
    symbols.forEach((symbol, index) => {
        symbol.style.animationDelay = `${index * 0.2}s`;
    });
}
