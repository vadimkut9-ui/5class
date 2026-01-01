// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let studentData = {
    firstName: '',
    lastName: '',
    className: '',
    teacherEmail: 'vadimkut9@gmail.com', // Измените на свой email
    score: 0,
    solved: 0,
    timeSpent: 0,
    startTime: null
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
let coloredAreas = 0;

// МАССИВ ЗАДАЧ
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

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    initSlidesNavigation();
    initRegistration();
    initGame();
    initResults();
    initConfirmation();
    
    // Запускаем анимации
    startMathAnimation();
    
    // Показываем первый слайд
    showSlide(0);
});

// НАВИГАЦИЯ ПО СЛАЙДАМ
function initSlidesNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator-dot');
    
    // Кнопки навигации
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Индикаторы слайдов
    indicators.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide) - 1;
            showSlide(slideIndex);
        });
    });
    
    // Клавиши клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
        }
    });
}

function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    // Скрываем текущий слайд
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator-dot')[currentSlide].classList.remove('active');
    
    // Показываем новый слайд
    slides[index].classList.add('active');
    document.querySelectorAll('.indicator-dot')[index].classList.add('active');
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
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === slides.length - 1;
    }
}

function onSlideChanged(slideIndex) {
    switch(slideIndex) {
        case 2: // Игра (слайд 3)
            startGame();
            break;
        case 3: // Результаты (слайд 4)
            showResults();
            break;
        case 4: // Подтверждение (слайд 5)
            showConfirmation();
            break;
    }
}

// СЛАЙД 1: РЕГИСТРАЦИЯ
function initRegistration() {
    const startBtn = document.getElementById('startGameBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const className = document.getElementById('class').value;
            const teacherEmail = document.getElementById('teacherEmail').value.trim();
            
            // Проверяем заполнение полей
            if (!firstName || !lastName || !className) {
                alert('Пожалуйста, заполните все обязательные поля!');
                return;
            }
            
            if (!document.getElementById('agreement').checked) {
                alert('Необходимо согласие на обработку данных!');
                return;
            }
            
            // Сохраняем данные ученика
            studentData = {
                firstName,
                lastName,
                className: `${className} класс`,
                teacherEmail: teacherEmail || 'vadimkut9@gmail.com',
                score: 0,
                solved: 0,
                timeSpent: 0,
                startTime: new Date()
            };
            
            // Обновляем отображение в игре
            updatePlayerInfo();
            
            // Переходим к следующему слайду
            nextSlide();
        });
    }
}

function updatePlayerInfo() {
    document.getElementById('playerName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('playerClass').textContent = studentData.className;
}

// СЛАЙД 2: ОБУЧЕНИЕ
function checkPracticeAnswer() {
    const input = document.getElementById('practiceAnswer');
    const feedback = document.getElementById('practiceFeedback');
    const userAnswer = input.value.trim();
    const correctAnswer = '¾';
    
    if (!userAnswer) {
        alert('Введите ответ!');
        return;
    }
    
    if (normalizeFraction(userAnswer) === normalizeFraction(correctAnswer)) {
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#d4edda';
        feedback.textContent = 'Правильно! 🎉 Молодец!';
        feedback.className = 'feedback correct';
        
        // Анимация успеха
        feedback.classList.add('pulse');
        setTimeout(() => {
            feedback.classList.remove('pulse');
        }, 1000);
    } else {
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#f8d7da';
        feedback.textContent = 'Попробуй еще! Подсказка: ½ = 2/4';
        feedback.className = 'feedback incorrect';
    }
}

// СЛАЙД 3: ИГРА
function initGame() {
    // Инициализируем канвас
    initCanvas();
    
    // Создаем задачи
    createProblems();
    
    // Создаем палитру цветов
    createColorPalette();
    
    // Настраиваем инструменты
    setupTools();
    
    // Настраиваем кнопки
    setupGameButtons();
}

function initCanvas() {
    gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;
    
    gameCtx = gameCanvas.getContext('2d');
    
    // Адаптивный размер канваса
    function resizeCanvas() {
        const container = gameCanvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        gameCanvas.width = rect.width;
        gameCanvas.height = rect.height;
        
        // Перерисовываем картинку
        if (currentSlide === 2) { // Если на слайде игры
            drawPictureOutline();
        }
    }
    
    // Инициализируем размер
    resizeCanvas();
    
    // Обработчики событий мыши
    gameCanvas.addEventListener('mousedown', startDrawing);
    gameCanvas.addEventListener('mousemove', draw);
    gameCanvas.addEventListener('mouseup', stopDrawing);
    gameCanvas.addEventListener('mouseout', stopDrawing);
    
    // Обработчики для сенсорных устройств
    gameCanvas.addEventListener('touchstart', handleTouchStart);
    gameCanvas.addEventListener('touchmove', handleTouchMove);
    gameCanvas.addEventListener('touchend', stopDrawing);
    gameCanvas.addEventListener('touchcancel', stopDrawing);
    
    // Предотвращаем скролл при касании канваса
    gameCanvas.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Обновляем размер при изменении окна
    window.addEventListener('resize', resizeCanvas);
}

function drawPictureOutline() {
    if (!gameCtx) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    // Очищаем канвас
    gameCtx.clearRect(0, 0, width, height);
    
    // Фон
    gameCtx.fillStyle = '#E3F2FD';
    gameCtx.fillRect(0, 0, width, height);
    
    // Рисуем 10 областей для раскраски (2 ряда по 5)
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
                       placeholder="Введите ответ..."
                       data-problem="${problem.id}"
                       data-answer="${problem.answer}">
                <button class="check-btn-small" onclick="checkGameAnswer(${problem.id})">
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
        colorItem.title = `Задача ${problem.id}: ${problem.expression}`;
        
        // Иконка замка для заблокированных цветов
        colorItem.innerHTML = '<i class="fas fa-lock"></i>';
        
        // Обработчик клика
        colorItem.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                selectColor(problem.color);
            }
        });
        
        colorPalette.appendChild(colorItem);
    });
}

function setupTools() {
    // Инструменты
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            toolButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Устанавливаем текущий инструмент
            currentTool = this.dataset.tool;
        });
    });
    
    // Размер кисти
    const brushSizeInput = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    
    if (brushSizeInput && brushSizeValue) {
        brushSizeInput.addEventListener('input', function() {
            brushSize = parseInt(this.value);
            brushSizeValue.textContent = brushSize;
        });
    }
}

function setupGameButtons() {
    // Кнопка очистки
    const clearBtn = document.getElementById('clearCanvasBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Очистить весь рисунок?')) {
                drawPictureOutline();
                coloredAreas = 0;
            }
        });
    }
    
    // Кнопка подсказки
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
        hintBtn.addEventListener('click', showGameHint);
    }
}

function startGame() {
    // Сбрасываем игровые данные
    gameScore = 0;
    solvedProblems = 0;
    coloredAreas = 0;
    timeLeft = 300;
    
    // Обновляем отображение
    updateGameStats();
    
    // Запускаем таймер
    startGameTimer();
    
    // Рисуем картинку
    drawPictureOutline();
    
    // Сбрасываем задачи
    resetProblems();
    
    // Сбрасываем цвета
    resetColors();
}

function updateGameStats() {
    document.getElementById('solvedCount').textContent = `${solvedProblems}/${MATH_PROBLEMS.length}`;
    document.getElementById('scoreCount').textContent = gameScore;
}

function startGameTimer() {
    clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            finishGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
        status.className = 'problem-status correct';
        problemItem.classList.add('solved');
        
        // Разблокируем цвет
        const colorItem = document.querySelector(`.color-item[data-problem-id="${problemId}"]`);
        if (colorItem) {
            colorItem.classList.remove('locked');
            colorItem.innerHTML = '<i class="fas fa-paint-brush"></i>';
            
            // Автоматически выбираем этот цвет
            if (solvedProblems === 0) {
                selectColor(problem.color);
            }
        }
        
        // Начисляем очки
        gameScore += 10;
        solvedProblems++;
        
        // Проверяем, все ли задачи решены
        if (solvedProblems === MATH_PROBLEMS.length) {
            finishGame();
        }
        
        // Обновляем статистику
        updateGameStats();
        
        // Анимация успеха
        animateSuccess(problemItem);
        
    } else {
        // Неправильный ответ
        input.classList.add('incorrect');
        input.classList.remove('correct');
        status.innerHTML = '<i class="fas fa-times"></i>';
        status.className = 'problem-status incorrect';
        
        // Минус очки за неправильный ответ
        gameScore = Math.max(0, gameScore - 2);
        updateGameStats();
        
        // Анимация ошибки
        animateError(problemItem);
    }
}

function animateSuccess(element) {
    element.classList.add('success-animation');
    setTimeout(() => {
        element.classList.remove('success-animation');
    }, 1000);
}

function animateError(element) {
    element.classList.add('error-animation');
    setTimeout(() => {
        element.classList.remove('error-animation');
    }, 500);
}

function selectColor(color) {
    currentColor = color;
    
    // Обновляем активный цвет в палитре
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.color === color) {
            item.classList.add('active');
        }
    });
    
    // Обновляем отображение текущего цвета
    const currentColorEl = document.getElementById('currentColor');
    if (currentColorEl) {
        currentColorEl.style.backgroundColor = color;
    }
}

function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    
    if (e.type.includes('touch')) {
        const touch = e.touches[0];
        lastX = (touch.clientX - rect.left) * scaleX;
        lastY = (touch.clientY - rect.top) * scaleY;
    } else {
        lastX = (e.clientX - rect.left) * scaleX;
        lastY = (e.clientY - rect.top) * scaleY;
    }
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    
    let currentX, currentY;
    
    if (e.type.includes('touch')) {
        const touch = e.touches[0];
        currentX = (touch.clientX - rect.left) * scaleX;
        currentY = (touch.clientY - rect.top) * scaleY;
    } else {
        currentX = (e.clientX - rect.left) * scaleX;
        currentY = (e.clientY - rect.top) * scaleY;
    }
    
    // Рисуем в зависимости от инструмента
    if (currentTool === 'brush') {
        drawLine(lastX, lastY, currentX, currentY);
    } else if (currentTool === 'fill') {
        fillArea(currentX, currentY);
    }
    
    lastX = currentX;
    lastY = currentY;
}

function drawLine(x1, y1, x2, y2) {
    gameCtx.beginPath();
    gameCtx.moveTo(x1, y1);
    gameCtx.lineTo(x2, y2);
    gameCtx.strokeStyle = currentColor;
    gameCtx.lineWidth = brushSize;
    gameCtx.lineCap = 'round';
    gameCtx.lineJoin = 'round';
    gameCtx.stroke();
}

function fillArea(x, y) {
    // Получаем цвет пикселя в точке клика
    const pixel = gameCtx.getImageData(x, y, 1, 1).data;
    const targetColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    
    // Если кликнули на область с контуром
    if (targetColor !== 'rgb(227, 242, 253)') { // Не фон
        gameCtx.fillStyle = currentColor;
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
}

function stopDrawing() {
    isDrawing = false;
    gameCtx.beginPath();
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        startDrawing(e);
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        draw(e);
    }
}

function showGameHint() {
    const unsolvedProblems = MATH_PROBLEMS.filter((_, index) => {
        const problemItem = document.querySelectorAll('.problem-item')[index];
        return !problemItem.classList.contains('solved');
    });
    
    if (unsolvedProblems.length === 0) {
        alert('Все задачи уже решены!');
        return;
    }
    
    const randomProblem = unsolvedProblems[Math.floor(Math.random() * unsolvedProblems.length)];
    alert(`Подсказка для задачи ${randomProblem.id}:\n${randomProblem.expression}\n${randomProblem.hint}`);
    
    // Минус очки за подсказку
    gameScore = Math.max(0, gameScore - 5);
    updateGameStats();
}

function finishGame() {
    clearInterval(gameTimer);
    
    // Сохраняем результаты
    studentData.score = gameScore;
    studentData.solved = solvedProblems;
    studentData.timeSpent = 300 - timeLeft;
    
    // Показываем сообщение об окончании игры
    let message = '';
    if (solvedProblems === MATH_PROBLEMS.length) {
        message = `🎉 Поздравляем! Вы решили все задачи!\nВаш результат: ${gameScore} очков`;
    } else if (timeLeft <= 0) {
        message = `⏰ Время вышло!\nРешено задач: ${solvedProblems}/${MATH_PROBLEMS.length}\nВаш результат: ${gameScore} очков`;
    } else {
        message = `🏁 Игра завершена!\nРешено задач: ${solvedProblems}/${MATH_PROBLEMS.length}\nВаш результат: ${gameScore} очков`;
    }
    
    alert(message);
    
    // Переходим к результатам
    setTimeout(() => {
        nextSlide();
    }, 1000);
}

// СЛАЙД 4: РЕЗУЛЬТАТЫ
function initResults() {
    const retryBtn = document.getElementById('retryBtn');
    const finishBtn = document.getElementById('finishBtn');
    
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            if (confirm('Начать игру заново? Текущие результаты будут потеряны.')) {
                showSlide(2); // Переходим к слайду игры
            }
        });
    }
    
    if (finishBtn) {
        finishBtn.addEventListener('click', function() {
            nextSlide(); // Переходим к подтверждению
        });
    }
}

function showResults() {
    // Обновляем данные на слайде результатов
    document.getElementById('finalScore').textContent = gameScore;
    document.getElementById('finalSolved').textContent = `${solvedProblems}/${MATH_PROBLEMS.length}`;
    
    // Рассчитываем время
    const minutes = Math.floor(studentData.timeSpent / 60);
    const seconds = studentData.timeSpent % 60;
    document.getElementById('finalTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Оценка
    const grade = calculateGrade();
    document.getElementById('finalGrade').textContent = grade.text;
    document.getElementById('finalGrade').className = `grade ${grade.class}`;
    
    // Мотивационное сообщение
    document.getElementById('motivationalMessage').textContent = getMotivationalMessage();
    
    // Обновляем статистику ученика
    studentData.score = gameScore;
    studentData.solved = solvedProblems;
}

function calculateGrade() {
    const percentage = (solvedProblems / MATH_PROBLEMS.length) * 100;
    
    if (percentage === 100) {
        return { text: '5 (Отлично!)', class: 'excellent' };
    } else if (percentage >= 80) {
        return { text: '4 (Хорошо)', class: 'good' };
    } else if (percentage >= 60) {
        return { text: '3 (Удовлетворительно)', class: 'average' };
    } else {
        return { text: '2 (Нужно повторить)', class: 'poor' };
    }
}

function getMotivationalMessage() {
    const percentage = (solvedProblems / MATH_PROBLEMS.length) * 100;
    
    if (percentage === 100) {
        return 'Потрясающий результат! Ты отлично разбираешься в дробях!';
    } else if (percentage >= 80) {
        return 'Хорошая работа! Продолжай в том же духе!';
    } else if (percentage >= 60) {
        return 'Неплохо! Есть куда стремиться!';
    } else {
        return 'Попробуй еще раз! У тебя обязательно получится!';
    }
}

// СЛАЙД 5: ПОДТВЕРЖДЕНИЕ
function initConfirmation() {
    const emailBtn = document.getElementById('emailResultsBtn');
    const downloadBtn = document.getElementById('downloadResultsBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    
    if (emailBtn) {
        emailBtn.addEventListener('click', sendResultsByEmail);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadResults);
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
}

function showConfirmation() {
    // Обновляем информацию на слайде
    document.getElementById('confirmName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('confirmClass').textContent = studentData.className;
    document.getElementById('confirmScore').textContent = studentData.score;
    document.getElementById('confirmSolved').textContent = 
        `${studentData.solved}/${MATH_PROBLEMS.length}`;
    
    // Время
    const minutes = Math.floor(studentData.timeSpent / 60);
    const seconds = studentData.timeSpent % 60;
    document.getElementById('confirmTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function sendResultsByEmail() {
    const subject = `Результаты игры: ${studentData.firstName} ${studentData.lastName}`;
    const body = `
Результаты математической игры "Раскрась дробями":

Ученик: ${studentData.firstName} ${studentData.lastName}
Класс: ${studentData.className}

Результаты:
- Набрано очков: ${studentData.score}
- Решено задач: ${studentData.solved}/${MATH_PROBLEMS.length}
- Затраченное время: ${Math.floor(studentData.timeSpent/60)}:${studentData.timeSpent%60}

Дата: ${new Date().toLocaleDateString()}
Время: ${new Date().toLocaleTimeString()}
    `.trim();
    
    const mailtoLink = `mailto:${studentData.teacherEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    // Показываем подтверждение
    alert('Результаты готовы к отправке. Проверьте вашу почтовую программу.');
}

function downloadResults() {
    const results = {
        student: studentData,
        date: new Date().toISOString(),
        problems: MATH_PROBLEMS.map(problem => ({
            expression: problem.expression,
            answer: problem.answer,
            solved: document.querySelector(`.problem-item[data-problem-id="${problem.id}"]`).classList.contains('solved')
        }))
    };
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `результаты_${studentData.lastName}_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Результаты сохранены в файл!');
}

function startNewGame() {
    if (confirm('Начать новую игру? Все данные текущей игры будут сброшены.')) {
        // Сбрасываем данные
        studentData = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            className: studentData.className,
            teacherEmail: studentData.teacherEmail,
            score: 0,
            solved: 0,
            timeSpent: 0,
            startTime: new Date()
        };
        
        // Переходим к началу
        showSlide(0);
    }
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function normalizeFraction(str) {
    // Приводим дробь к стандартному виду
    return str
        .replace(/½/g, '1/2')
        .replace(/⅓/g, '1/3')
        .replace(/⅔/g, '2/3')
        .replace(/¼/g, '1/4')
        .replace(/¾/g, '3/4')
        .toLowerCase()
        .trim();
}

function startMathAnimation() {
    const mathElements = document.querySelectorAll('.math-animation');
    mathElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate');
        }, index * 200);
    });
}

// АВТОСОХРАНЕНИЕ ПРИ ПЕРЕЗАГРУЗКЕ
window.addEventListener('beforeunload', function(e) {
    if (currentSlide > 0 && currentSlide < 4) {
        e.preventDefault();
        e.returnValue = 'Ваши данные будут потеряны. Вы уверены, что хотите покинуть страницу?';
        return e.returnValue;
    }
});

// АВТОМАТИЧЕСКОЕ СОХРАНЕНИЕ В LOCALSTORAGE
function saveGameState() {
    const gameState = {
        studentData,
        gameScore,
        solvedProblems,
        timeLeft,
        currentSlide
    };
    localStorage.setItem('mathGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('mathGameState');
    if (saved) {
        const gameState = JSON.parse(saved);
        Object.assign(studentData, gameState.studentData);
        gameScore = gameState.gameScore;
        solvedProblems = gameState.solvedProblems;
        timeLeft = gameState.timeLeft;
        currentSlide = gameState.currentSlide;
        return true;
    }
    return false;
}

// Автосохранение каждые 30 секунд
setInterval(saveGameState, 30000);

// Проверяем сохраненную игру при загрузке
if (loadGameState()) {
    if (confirm('Найдена сохраненная игра. Продолжить?')) {
        showSlide(currentSlide);
    } else {
        localStorage.removeItem('mathGameState');
    }
}
