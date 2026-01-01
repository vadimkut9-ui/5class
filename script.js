// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ХРАНЕНИЯ ДАННЫХ УЧЕНИКА
let studentData = {
    firstName: '',
    lastName: '',
    className: '',
    teacherEmail: '',
    startTime: null,
    endTime: null,
    gameResults: {
        trainingScore: 0,
        gameScore: 0,
        problemsSolved: 0,
        totalProblems: 10,
        coloredPercentage: 0,
        timeSpent: 0
    }
};

// НАСТРОЙКИ ДЛЯ ОТПРАВКИ РЕЗУЛЬТАТОВ
const CONFIG = {
    // ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ:
    GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/ВАШ_ID_ТАБЛИЦЫ/edit',
    TEACHER_EMAIL: 'ваш_email@gmail.com',
    
    // Используем бесплатный сервис для отправки
    WEBHOOK_URL: 'https://hooks.zapier.com/hooks/catch/ВАШ_WEBHOOK/', // Для Zapier
    // или
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/ВАШ_SCRIPT_ID/exec'
};

// МАССИВ ЗАДАЧ ДЛЯ ИГРЫ
const MATH_PROBLEMS = [
    { id: 1, expression: "½ + ¼ =", answer: "¾", color: "#FF6B6B", hint: "Приведи к общему знаменателю 4" },
    { id: 2, expression: "⅔ + ⅓ =", answer: "1", color: "#4ECDC4", hint: "Сложи числители" },
    { id: 3, expression: "¾ - ½ =", answer: "¼", color: "#FFD166", hint: "½ = 2/4" },
    { id: 4, expression: "1½ + 2½ =", answer: "4", color: "#06D6A0", hint: "Сложи целые части отдельно" },
    { id: 5, expression: "3⅓ - 1⅓ =", answer: "2", color: "#118AB2", hint: "Вычти целые части отдельно" },
    { id: 6, expression: "¼ × 4 =", answer: "1", color: "#7209B7", hint: "Умножь на 4" },
    { id: 7, expression: "½ ÷ ¼ =", answer: "2", color: "#EF476F", hint: "Деление на дробь = умножение на обратную" },
    { id: 8, expression: "3¾ - 1¼ =", answer: "2½", color: "#073B4C", hint: "3¾ - 1¼ = (3-1) + (¾-¼)" },
    { id: 9, expression: "⅔ × ¾ =", answer: "½", color: "#FF9E00", hint: "Умножь числители и знаменатели" },
    { id: 10, expression: "5 ÷ ½ =", answer: "10", color: "#8338EC", hint: "5 ÷ ½ = 5 × 2" }
];

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    initRegistration();
    initSlidesNavigation();
    initTraining();
    initGame();
    initResults();
    initConfirmation();
    
    // Устанавливаем email учителя по умолчанию
    document.getElementById('teacherEmail').value = CONFIG.TEACHER_EMAIL;
    
    // Запускаем анимации
    setTimeout(animateMathSymbols, 500);
});

// 1. РЕГИСТРАЦИЯ УЧЕНИКА
function initRegistration() {
    const startBtn = document.getElementById('startGameBtn');
    const agreement = document.getElementById('agreement');
    
    startBtn.addEventListener('click', function() {
        // Собираем данные ученика
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const className = document.getElementById('class').value;
        const teacherEmail = document.getElementById('teacherEmail').value.trim();
        
        // Проверяем заполнение
        if (!firstName || !lastName || !className) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        if (!agreement.checked) {
            alert('Необходимо согласие на обработку данных!');
            return;
        }
        
        // Сохраняем данные ученика
        studentData = {
            firstName,
            lastName,
            className: `${className} класс`,
            teacherEmail,
            startTime: new Date(),
            gameResults: {
                trainingScore: 0,
                gameScore: 0,
                problemsSolved: 0,
                totalProblems: 10,
                coloredPercentage: 0,
                timeSpent: 0
            }
        };
        
        // Обновляем отображение имени
        updatePlayerInfo();
        
        // Переходим к следующему слайду
        showSlide(1);
    });
}

// 2. НАВИГАЦИЯ ПО СЛАЙДАМ
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function initSlidesNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator-dot');
    
    // Кнопки навигации
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    
    // Индикаторы
    indicators.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide) - 1;
            showSlide(slideIndex);
        });
    });
    
    // Клавиши клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowLeft': navigate(-1); break;
            case 'ArrowRight': navigate(1); break;
        }
    });
}

function navigate(direction) {
    const newIndex = currentSlide + direction;
    if (newIndex >= 0 && newIndex < totalSlides) {
        showSlide(newIndex);
    }
}

function showSlide(index) {
    // Скрываем текущий слайд
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator-dot')[currentSlide].classList.remove('active');
    
    // Показываем новый слайд
    slides[index].classList.add('active');
    document.querySelectorAll('.indicator-dot')[index].classList.add('active');
    currentSlide = index;
    
    // Обновляем кнопки навигации
    updateNavigationButtons();
    
    // Выполняем специфичные действия для слайда
    onSlideChange(index);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

function onSlideChange(slideIndex) {
    switch(slideIndex) {
        case 1: // Обучение
            initPieCharts();
            break;
        case 2: // Тренировка
            resetTraining();
            break;
        case 3: // Игра
            startGame();
            break;
        case 4: // Результаты
            showGameResults();
            break;
        case 5: // Подтверждение
            showConfirmation();
            break;
    }
}

// 3. ОБУЧЕНИЕ (Слайд 2)
function initPieCharts() {
    // Анимированные круговые диаграммы
    const pie1 = document.getElementById('pie1');
    if (pie1) {
        pie1.style.setProperty('--percentage', '50%');
    }
}

// 4. ТРЕНИРОВКА (Слайд 3)
function initTraining() {
    const optionButtons = document.querySelectorAll('.option-btn');
    const toGameBtn = document.getElementById('toGameBtn');
    
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const exampleCard = this.closest('.example-card');
            const correctAnswer = exampleCard.dataset.answer;
            const userAnswer = this.dataset.value;
            const feedback = exampleCard.querySelector('.feedback');
            
            // Проверяем ответ
            if (userAnswer === correctAnswer) {
                this.classList.add('correct');
                feedback.innerHTML = '<i class="fas fa-check"></i> Правильно!';
                feedback.className = 'feedback correct';
                
                // Увеличиваем счет
                updateTrainingScore(10);
            } else {
                this.classList.add('incorrect');
                feedback.innerHTML = '<i class="fas fa-times"></i> Попробуй еще!';
                feedback.className = 'feedback incorrect';
            }
            
            // Отключаем все кнопки в этом примере
            exampleCard.querySelectorAll('.option-btn').forEach(b => {
                b.disabled = true;
            });
            
            // Проверяем, все ли примеры решены
            checkTrainingCompletion();
        });
    });
    
    toGameBtn.addEventListener('click', () => showSlide(3));
}

function updateTrainingScore(points) {
    studentData.gameResults.trainingScore += points;
    
    const correctCount = document.querySelectorAll('.feedback.correct').length;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('trainingScore').textContent = studentData.gameResults.trainingScore;
}

function checkTrainingCompletion() {
    const correctCount = document.querySelectorAll('.feedback.correct').length;
    const toGameBtn = document.getElementById('toGameBtn');
    
    if (correctCount >= 2) { // Минимум 2 из 3 правильно
        toGameBtn.disabled = false;
        toGameBtn.innerHTML = '<i class="fas fa-gamepad"></i> Начать основную игру';
    }
}

function resetTraining() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
    });
    
    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.innerHTML = '';
        feedback.className = 'feedback';
    });
    
    document.getElementById('correctCount').textContent = '0';
    document.getElementById('trainingScore').textContent = '0';
    document.getElementById('toGameBtn').disabled = true;
}

// 5. ОСНОВНАЯ ИГРА (Слайд 4)
let gameCanvas, gameCtx;
let gameTimer;
let timeLeft = 300; // 5 минут в секундах
let solvedInGame = 0;
let gameScore = 0;

function initGame() {
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    
    // Инициализация канваса
    setupCanvas();
    
    // Создание задач
    createGameProblems();
    
    // Создание палитры цветов
    createGamePalette();
    
    // Таймер игры
    initGameTimer();
    
    // Кнопка подсказки
    document.getElementById('getHintBtn').addEventListener('click', showHintModal);
}

function startGame() {
    // Сбрасываем игровые данные
    solvedInGame = 0;
    gameScore = studentData.gameResults.trainingScore;
    timeLeft = 300;
    
    // Обновляем отображение
    updateGameStats();
    
    // Запускаем таймер
    startGameTimer();
    
    // Рисуем начальную картинку
    drawGamePicture();
}

function setupCanvas() {
    // Адаптивный размер канваса
    function resizeCanvas() {
        const container = gameCanvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        gameCanvas.width = rect.width;
        gameCanvas.height = rect.height;
        drawGamePicture();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function drawGamePicture() {
    if (!gameCtx) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    // Очищаем канвас
    gameCtx.clearRect(0, 0, width, height);
    
    // Рисуем картинку с областями для раскраски
    // (Упрощенная версия, можно добавить больше деталей)
    
    // Фон
    gameCtx.fillStyle = '#E3F2FD';
    gameCtx.fillRect(0, 0, width, height);
    
    // Области для разных задач
    MATH_PROBLEMS.forEach((problem, index) => {
        const x = (index % 5) * (width / 5);
        const y = Math.floor(index / 5) * (height / 2);
        const areaWidth = width / 5 - 10;
        const areaHeight = height / 2 - 10;
        
        // Область для раскраски
        gameCtx.strokeStyle = problem.color;
        gameCtx.lineWidth = 2;
        gameCtx.strokeRect(x + 5, y + 5, areaWidth, areaHeight);
        
        // Номер задачи
        gameCtx.fillStyle = problem.color;
        gameCtx.font = 'bold 20px Arial';
        gameCtx.fillText(problem.id, x + 15, y + 30);
    });
}

function createGameProblems() {
    const problemsList = document.getElementById('problemsList');
    problemsList.innerHTML = '';
    
    MATH_PROBLEMS.forEach(problem => {
        const problemElement = document.createElement('div');
        problemElement.className = 'problem-item';
        problemElement.dataset.problemId = problem.id;
        problemElement.innerHTML = `
            <div class="problem-header">
                <span class="problem-number">${problem.id}</span>
                <span class="problem-expression">${problem.expression}</span>
                <span class="problem-status"></span>
            </div>
            <div class="problem-input">
                <input type="text" 
                       class="answer-input" 
                       placeholder="Введите ответ..."
                       data-correct="${problem.answer}"
                       data-color="${problem.color}"
                       data-hint="${problem.hint}">
                <button class="check-btn"><i class="fas fa-check"></i></button>
            </div>
        `;
        
        // Обработчик проверки ответа
        const checkBtn = problemElement.querySelector('.check-btn');
        const answerInput = problemElement.querySelector('.answer-input');
        
        checkBtn.addEventListener('click', () => checkGameAnswer(answerInput, problem.id));
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkGameAnswer(answerInput, problem.id);
        });
        
        problemsList.appendChild(problemElement);
    });
}

function checkGameAnswer(input, problemId) {
    const userAnswer = input.value.trim();
    const correctAnswer = input.dataset.correct;
    const color = input.dataset.color;
    const problemElement = input.closest('.problem-item');
    const status = problemElement.querySelector('.problem-status');
    
    if (!userAnswer) {
        alert('Введите ответ!');
        return;
    }
    
    // Нормализуем ответ
    const normalizedUser = normalizeFraction(userAnswer);
    const normalizedCorrect = normalizeFraction(correctAnswer);
    
    if (normalizedUser === normalizedCorrect) {
        // Правильный ответ
        input.classList.add('correct');
        status.innerHTML = '<i class="fas fa-check-circle"></i>';
        status.className = 'problem-status correct';
        
        // Разблокируем цвет
        unlockColor(color, problemId);
        
        // Добавляем баллы
        gameScore += 20;
        solvedInGame++;
        
        // Обновляем статистику
        updateGameStats();
        
        // Рисуем область на канвасе
        drawColoredArea(problemId - 1, color);
        
        // Проверяем завершение игры
        if (solvedInGame === MATH_PROBLEMS.length) {
            finishGame();
        }
    } else {
        // Неправильный ответ
        input.classList.add('incorrect');
        status.innerHTML = '<i class="fas fa-times-circle"></i>';
        status.className = 'problem-status incorrect';
        
        // Меньше баллов за неправильный ответ
        gameScore = Math.max(0, gameScore - 5);
        updateGameStats();
        
        // Через 2 секунды снимаем класс ошибки
        setTimeout(() => {
            input.classList.remove('incorrect');
            input.focus();
        }, 2000);
    }
}

function createGamePalette() {
    const colorsGrid = document.getElementById('colorsGrid');
    colorsGrid.innerHTML = '';
    
    MATH_PROBLEMS.forEach(problem => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item locked';
        colorItem.style.backgroundColor = problem.color;
        colorItem.dataset.color = problem.color;
        colorItem.dataset.problemId = problem.id;
        colorItem.title = `Задача ${problem.id}: ${problem.expression}`;
        
        // Блокируем цвет до решения задачи
        colorItem.innerHTML = '<i class="fas fa-lock"></i>';
        
        colorsGrid.appendChild(colorItem);
    });
}

function unlockColor(color, problemId) {
    const colorItem = document.querySelector(`[data-color="${color}"]`);
    if (colorItem && colorItem.classList.contains('locked')) {
        colorItem.classList.remove('locked');
        colorItem.innerHTML = '';
        colorItem.style.cursor = 'pointer';
        
        // Добавляем возможность выбора цвета
        colorItem.addEventListener('click', function() {
            selectColor(color);
        });
    }
}

function selectColor(color) {
    // Здесь можно добавить логику выбора цвета для рисования
    alert(`Выбран цвет для задачи. Используйте его для раскраски!`);
}

function drawColoredArea(areaIndex, color) {
    if (!gameCtx) return;
    
    const width = gameCanvas.width;
    const height = gameCanvas.height;
    
    // Координаты области
    const x = (areaIndex % 5) * (width / 5);
    const y = Math.floor(areaIndex / 5) * (height / 2);
    const areaWidth = width / 5 - 10;
    const areaHeight = height / 2 - 10;
    
    // Закрашиваем область
    gameCtx.fillStyle = color;
    gameCtx.fillRect(x + 5, y + 5, areaWidth, areaHeight);
    
    // Обновляем процент раскраски
    updateColoredPercentage();
}

function updateColoredPercentage() {
    const coloredCount = solvedInGame;
    const percentage = Math.round((coloredCount / MATH_PROBLEMS.length) * 100);
    studentData.gameResults.coloredPercentage = percentage;
}

function initGameTimer() {
    // Инициализация таймера
}

function startGameTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        timeLeft--;
        updateGameTimer();
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            finishGame();
        }
    }, 1000);
}

function updateGameTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('gameTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateGameStats() {
    document.getElementById('gameSolved').textContent = `${solvedInGame}/${MATH_PROBLEMS.length}`;
    document.getElementById('gameScore').textContent = gameScore;
    
    // Сохраняем в данные ученика
    studentData.gameResults.gameScore = gameScore;
    studentData.gameResults.problemsSolved = solvedInGame;
    studentData.gameResults.timeSpent = 300 - timeLeft;
}

function finishGame() {
    clearInterval(gameTimer);
    
    // Сохраняем время завершения
    studentData.endTime = new Date();
    
    // Переходим к результатам
    setTimeout(() => showSlide(4), 1000);
}

// 6. РЕЗУЛЬТАТЫ (Слайд 5)
function initResults() {
    document.getElementById('saveResultsBtn').addEventListener('click', saveResults);
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
}

function showGameResults() {
    // Обновляем данные на слайде
    document.getElementById('resultName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('resultClass').textContent = studentData.className;
    
    document.getElementById('resultSolved').textContent = 
        `${studentData.gameResults.problemsSolved}/${studentData.gameResults.totalProblems}`;
    document.getElementById('resultScore').textContent = studentData.gameResults.gameScore;
    document.getElementById('resultColored').textContent = 
        `${studentData.gameResults.coloredPercentage}%`;
    
    // Определяем уровень
    const level = getLevel(studentData.gameResults.gameScore);
    document.getElementById('resultLevel').textContent = level;
    
    // Время прохождения
    const timeSpent = studentData.gameResults.timeSpent;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById('completionTime').textContent = 
        `Время: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Копируем рисунок
    copyCanvasToResults();
}

function getLevel(score) {
    if (score >= 180) return 'Гений математики 🏆';
    if (score >= 150) return 'Отличник ★★★';
    if (score >= 120) return 'Хорошист ★★';
    if (score >= 90) return 'Ученик ★';
    if (score >= 60) return 'Начинающий';
    return 'Новичок';
}

function copyCanvasToResults() {
    const resultCanvas = document.getElementById('resultCanvas');
    const resultCtx = resultCanvas.getContext('2d');
    
    // Копируем из игрового канваса
    resultCtx.drawImage(gameCanvas, 0, 0, gameCanvas.width, gameCanvas.height, 
                       0, 0, resultCanvas.width, resultCanvas.height);
}

// 7. СОХРАНЕНИЕ РЕЗУЛЬТАТОВ
async function saveResults() {
    const saveBtn = document.getElementById('saveResultsBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
    
    try {
        // Готовим данные для отправки
        const resultData = {
            student: studentData,
            timestamp: new Date().toISOString(),
            gameData: studentData.gameResults
        };
        
        // Способ 1: Отправка через Google Apps Script (рекомендуется)
        await sendToGoogleSheets(resultData);
        
        // Способ 2: Отправка на email через EmailJS (альтернатива)
        await sendEmailToTeacher(resultData);
        
        // Способ 3: Сохранение в localStorage (для тестирования)
        saveToLocalStorage(resultData);
        
        // Переходим к подтверждению
        showSlide(5);
        
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Ошибка сохранения результатов. Попробуйте еще раз.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить результаты';
    }
}

async function sendToGoogleSheets(data) {
    // Формат данных для Google Sheets
    const sheetData = [
        new Date().toLocaleString('ru-RU'),
        data.student.firstName,
        data.student.lastName,
        data.student.className,
        data.gameData.problemsSolved,
        data.gameData.gameScore,
        data.gameData.coloredPercentage + '%',
        data.gameData.timeSpent + ' сек'
    ];
    
    // Используем Google Apps Script для записи
    const scriptUrl = CONFIG.GOOGLE_APPS_SCRIPT_URL;
    
    if (scriptUrl.includes('ВАШ_SCRIPT_ID')) {
        console.warn('Google Apps Script не настроен. Используем тестовый режим.');
        return Promise.resolve(); // Для тестирования
    }
    
    const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sheetData)
    });
    
    return response;
}

async function sendEmailToTeacher(data) {
    const teacherEmail = studentData.teacherEmail || CONFIG.TEACHER_EMAIL;
    
    // Формируем текст письма
    const emailBody = `
        Новые результаты ученика:
        
        Ученик: ${data.student.firstName} ${data.student.lastName}
        Класс: ${data.student.className}
        Дата: ${new Date().toLocaleDateString('ru-RU')}
        
        Результаты игры:
        - Решено задач: ${data.gameData.problemsSolved}/${data.gameData.totalProblems}
        - Набрано баллов: ${data.gameData.gameScore}
        - Раскрашено: ${data.gameData.coloredPercentage}%
        - Время прохождения: ${data.gameData.timeSpent} секунд
        
        Общий уровень: ${getLevel(data.gameData.gameScore)}
    `;
    
    // Используем mailto для отправки
    const mailtoLink = `mailto:${teacherEmail}?subject=Результаты ученика&body=${encodeURIComponent(emailBody)}`;
    
    // Открываем почтовый клиент
    window.location.href = mailtoLink;
    
    return Promise.resolve();
}

function saveToLocalStorage(data) {
    // Получаем существующие результаты
    const existingResults = JSON.parse(localStorage.getItem('mathGameResults') || '[]');
    
    // Добавляем новые результаты
    existingResults.push(data);
    
    // Сохраняем обратно
    localStorage.setItem('mathGameResults', JSON.stringify(existingResults));
    
    console.log('Результаты сохранены в localStorage:', data);
}

// 8. ПОДТВЕРЖДЕНИЕ (Слайд 6)
function initConfirmation() {
    document.getElementById('downloadCertBtn').addEventListener('click', downloadCertificate);
    document.getElementById('newPlayerBtn').addEventListener('click', startNewPlayer);
}

function showConfirmation() {
    // Обновляем информацию на слайде
    document.getElementById('teacherEmailDisplay').textContent = 
        `На email: ${studentData.teacherEmail || CONFIG.TEACHER_EMAIL}`;
    
    document.getElementById('certName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('certScore').textContent = studentData.gameResults.gameScore;
    document.getElementById('certDate').textContent = 
        new Date().toLocaleDateString('ru-RU');
}

function downloadCertificate() {
    // Создаем PDF сертификат
    const certificateData = {
        name: `${studentData.firstName} ${studentData.lastName}`,
        class: studentData.className,
        score: studentData.gameResults.gameScore,
        date: new Date().toLocaleDateString('ru-RU'),
        level: getLevel(studentData.gameResults.gameScore)
    };
    
    // Используем библиотеку jsPDF или создаем изображение
    createCertificateImage(certificateData);
}

function createCertificateImage(data) {
    alert(`Сертификат для ${data.name} создан!\nВы можете сделать скриншот этого экрана.`);
    
    // Здесь можно реализовать создание PDF через jsPDF
    // Для простоты предлагаем сделать скриншот
}

function startNewPlayer() {
    // Сбрасываем все данные
    studentData = {
        firstName: '',
        lastName: '',
        className: '',
        teacherEmail: '',
        startTime: null,
        endTime: null,
        gameResults: {
            trainingScore: 0,
            gameScore: 0,
            problemsSolved: 0,
            totalProblems: 10,
            coloredPercentage: 0,
            timeSpent: 0
        }
    };
    
    // Сбрасываем форму
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('class').value = '';
    document.getElementById('agreement').checked = false;
    
    // Возвращаемся к началу
    showSlide(0);
}

// 9. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function updatePlayerInfo() {
    document.getElementById('playerName').textContent = 
        `${studentData.firstName} ${studentData.lastName}`;
    document.getElementById('playerClass').textContent = studentData.className;
}

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

function showHintModal() {
    const modal = document.getElementById('hintModal');
    const hintText = document.getElementById('modalHintText');
    
    // Находим первую нерешенную задачу
    const unsolvedProblem = MATH_PROBLEMS.find(problem => 
        !document.querySelector(`[data-problem-id="${problem.id}"] .problem-status.correct`)
    );
    
    if (unsolvedProblem) {
        hintText.textContent = `Задача ${unsolvedProblem.id}: ${unsolvedProblem.hint}`;
        modal.style.display = 'block';
    } else {
        alert('Все задачи решены! 🎉');
    }
}

function animateMathSymbols() {
    const symbols = document.querySelectorAll('.math-symbols span');
    symbols.forEach((symbol, index) => {
        symbol.style.animationDelay = `${index * 0.2}s`;
    });
}

// Закрытие модального окна
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('hintModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    const modal = document.getElementById('hintModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Кнопка "Использовать подсказку"
document.getElementById('useHintBtn').addEventListener('click', function() {
    // Штраф за использование подсказки
    gameScore = Math.max(0, gameScore - 10);
    updateGameStats();
    
    document.getElementById('hintModal').style.display = 'none';
    alert('Подсказка использована! -10 баллов');
});

function restartGame() {
    // Сбрасываем игровые данные
    solvedInGame = 0;
    gameScore = 0;
    timeLeft = 300;
    
    // Сбрасываем отображение
    document.querySelectorAll('.problem-item').forEach(item => {
        const input = item.querySelector('.answer-input');
        const status = item.querySelector('.problem-status');
        
        input.value = '';
        input.classList.remove('correct', 'incorrect');
        status.innerHTML = '';
        status.className = 'problem-status';
    });
    
    // Сбрасываем палитру
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.add('locked');
        item.innerHTML = '<i class="fas fa-lock"></i>';
    });
    
    // Перерисовываем канвас
    drawGamePicture();
    
    // Возвращаемся к игре
    showSlide(3);
}
