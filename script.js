// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// ПЕРЕМЕННЫЕ ДЛЯ КАНВАСА
let canvas, ctx;
let isDrawing = false;
let currentTool = 'brush';
let currentColor = '#FF6B6B';
let brushSize = 15;
let lastX = 0;
let lastY = 0;

// ДАННЫЕ ИГРЫ
let solvedProblems = 0;
let totalProblems = 10;
let score = 0;
let coloredAreas = 0;
let totalAreas = 20;

// ЗАДАЧИ И ЦВЕТА
const problems = [
    { expression: "½ + ¼ =", answer: "¾", color: "#FF6B6B", id: 1 },
    { expression: "⅔ + ⅓ =", answer: "1", color: "#4ECDC4", id: 2 },
    { expression: "¾ - ½ =", answer: "¼", color: "#FFD166", id: 3 },
    { expression: "1½ + 2½ =", answer: "4", color: "#06D6A0", id: 4 },
    { expression: "3⅓ - 1⅓ =", answer: "2", color: "#118AB2", id: 5 },
    { expression: "¼ × 4 =", answer: "1", color: "#7209B7", id: 6 },
    { expression: "½ ÷ ¼ =", answer: "2", color: "#EF476F", id: 7 },
    { expression: "3¾ - 1¼ =", answer: "2½", color: "#073B4C", id: 8 },
    { expression: "⅔ × ¾ =", answer: "½", color: "#FF9E00", id: 9 },
    { expression: "5 ÷ ½ =", answer: "10", color: "#8338EC", id: 10 }
];

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    initSlides();
    initGame();
    initCanvas();
    createProblems();
    createColorLegend();
    drawPictureOutline();
    
    // Запуск начальной анимации
    setTimeout(() => {
        document.querySelectorAll('.fraction-anim').forEach((el, i) => {
            el.style.animationDelay = `${i * 0.2}s`;
        });
    }, 100);
});

// НАВИГАЦИЯ СЛАЙДОВ
function initSlides() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again');
    const slideDots = document.querySelectorAll('.slide-dot');
    
    // Кнопка "Начать игру"
    if (startBtn) {
        startBtn.addEventListener('click', () => showSlide(1));
    }
    
    // Кнопка "Играть снова"
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', resetGame);
    }
    
    // Кнопка "Поделиться"
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
    
    // Стрелки навигации
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigate(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigate(1));
    }
    
    // Точки навигации
    slideDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide) - 1;
            showSlide(slideIndex);
        });
    });
    
    // Клавиши клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigate(-1);
                break;
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                navigate(1);
                break;
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
    document.querySelectorAll('.slide-dot')[currentSlide].classList.remove('active');
    
    // Показываем новый слайд
    slides[index].classList.add('active');
    document.querySelectorAll('.slide-dot')[index].classList.add('active');
    currentSlide = index;
    
    // Обновляем кнопки навигации
    updateNavButtons();
    
    // Если перешли на игровой слайд, обновляем прогресс
    if (index === 1) {
        updateProgress();
        
        // Перерисовываем картинку для мобильных
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                drawPictureOutline();
            }, 100);
        }
    }
    
    // Если перешли на слайд с результатами, показываем статистику
    if (index === 2) {
        showResults();
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
}

// ИНИЦИАЛИЗАЦИЯ ИГРЫ
function initGame() {
    const clearBtn = document.getElementById('clear-btn');
    const hintBtn = document.getElementById('hint-btn');
    const brushSizeInput = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    
    // Очистка канваса
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Очистить весь рисунок?')) {
                drawPictureOutline();
                coloredAreas = 0;
                updateProgress();
            }
        });
    }
    
    // Подсказка
    if (hintBtn) {
        hintBtn.addEventListener('click', showHint);
    }
    
    // Размер кисти
    if (brushSizeInput) {
        brushSizeInput.addEventListener('input', function() {
            brushSize = parseInt(this.value);
            brushSizeValue.textContent = brushSize;
        });
    }
    
    // Создание палитры цветов
    createColorPalette();
}

// СОЗДАНИЕ ЦВЕТОВОЙ ПАЛИТРЫ
function createColorPalette() {
    const colorsGrid = document.querySelector('.colors-grid');
    colorsGrid.innerHTML = '';
    
    problems.forEach((problem, index) => {
        const colorItem = document.createElement('div');
        colorItem.className = `color-item ${index === 0 ? 'active' : 'locked'}`;
        colorItem.style.backgroundColor = problem.color;
        colorItem.dataset.color = problem.color;
        colorItem.dataset.problemId = problem.id;
        
        colorItem.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                document.querySelectorAll('.color-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                currentColor = this.dataset.color;
                
                // Показываем, к какой задаче относится цвет
                const problemElement = document.querySelector(`[data-problem-id="${this.dataset.problemId}"]`);
                if (problemElement) {
                    problemElement.classList.add('pulse');
                    setTimeout(() => {
                        problemElement.classList.remove('pulse');
                    }, 1000);
                }
            }
        });
        
        colorsGrid.appendChild(colorItem);
    });
    
    // Добавляем инструмент выбора своего цвета
    const customColor = document.createElement('input');
    customColor.type = 'color';
    customColor.value = '#FF6B6B';
    customColor.className = 'color-item';
    customColor.style.width = '50px';
    customColor.style.height = '50px';
    customColor.title = 'Выбрать свой цвет';
    
    customColor.addEventListener('input', function() {
        currentColor = this.value;
        document.querySelectorAll('.color-item').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    colorsGrid.appendChild(customColor);
}

// СОЗДАНИЕ ЗАДАЧ
function createProblems() {
    const problemsGrid = document.querySelector('.problems-grid');
    problemsGrid.innerHTML = '';
    
    problems.forEach((problem, index) => {
        const problemCard = document.createElement('div');
        problemCard.className = 'problem-card';
        problemCard.dataset.problemId = problem.id;
        
        problemCard.innerHTML = `
            <div class="expression">${problem.expression}</div>
            <div class="input-group">
                <input type="text" 
                       class="answer-input" 
                       data-answer="${problem.answer}"
                       data-color="${problem.color}"
                       placeholder="Ответ..."
                       maxlength="10">
                <div class="result-indicator"></div>
            </div>
        `;
        
        // Обработчик ввода
        const input = problemCard.querySelector('.answer-input');
        input.addEventListener('input', function() {
            checkAnswer(this);
        });
        
        // Автоподстановка дробей
        input.addEventListener('keydown', function(e) {
            if (e.key === '/') {
                e.preventDefault();
                const start = this.selectionStart;
                const value = this.value;
                
                const fractions = {
                    '1/2': '½',
                    '1/3': '⅓',
                    '2/3': '⅔',
                    '1/4': '¼',
                    '3/4': '¾',
                    '1/5': '⅕',
                    '2/5': '⅖',
                    '3/5': '⅗',
                    '4/5': '⅘',
                    '1/6': '⅙',
                    '5/6': '⅚',
                    '1/8': '⅛',
                    '3/8': '⅜',
                    '5/8': '⅝',
                    '7/8': '⅞'
                };
                
                // Проверяем, есть ли дробь перед курсором
                const textBefore = value.substring(0, start);
                for (const [fraction, symbol] of Object.entries(fractions)) {
                    if (textBefore.endsWith(fraction)) {
                        const newValue = value.substring(0, start - fraction.length) + symbol + 
                                       value.substring(start);
                        this.value = newValue;
                        this.selectionStart = this.selectionEnd = start - fraction.length + 1;
                        checkAnswer(this);
                        return;
                    }
                }
            }
        });
        
        problemsGrid.appendChild(problemCard);
    });
}

// СОЗДАНИЕ ЛЕГЕНДЫ ЦВЕТОВ
function createColorLegend() {
    const legendItems = document.querySelector('.legend-items');
    legendItems.innerHTML = '';
    
    problems.forEach(problem => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${problem.color};"></div>
            <div class="legend-text">${problem.expression} → ${problem.answer}</div>
        `;
        legendItems.appendChild(legendItem);
    });
}

// КАНВАС И РИСОВАНИЕ
function initCanvas() {
    canvas = document.getElementById('drawing-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Адаптивный размер канваса
    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        
        // Устанавливаем размеры канваса
        canvas.width = rect.width * 0.95;
        canvas.height = rect.height * 0.95;
        
        // Перерисовываем картинку
        drawPictureOutline();
    }
    
    // Инициализируем размер
    resizeCanvas();
    
    // Обработчики событий мыши
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Обработчики для сенсорных устройств
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
    
    // Предотвращаем скролл при касании канваса
    canvas.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Инструменты
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
        });
    });
    
    // Обновляем размер при изменении окна
    window.addEventListener('resize', resizeCanvas);
}

// РИСОВАНИЕ КАРТИНКИ
function drawPictureOutline() {
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Очищаем канвас
    ctx.clearRect(0, 0, width, height);
    
    // Фон
    ctx.fillStyle = '#E3F2FD';
    ctx.fillRect(0, 0, width, height);
    
    // Настройки линий
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#ffffff';
    
    // ОБЛАСТЬ 1: Солнце (задача 1: ½ + ¼ = ¾)
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.15, width * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Лучи солнца
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = width * 0.85 + Math.cos(angle) * width * 0.08;
        const y1 = height * 0.15 + Math.sin(angle) * width * 0.08;
        const x2 = width * 0.85 + Math.cos(angle) * width * 0.12;
        const y2 = height * 0.15 + Math.sin(angle) * width * 0.12;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    // ОБЛАСТЬ 2: Облако 1 (задача 2: ⅔ + ⅓ = 1)
    drawCloud(width * 0.2, height * 0.2, width * 0.1);
    
    // ОБЛАСТЬ 3: Облако 2 (задача 3: ¾ - ½ = ¼)
    drawCloud(width * 0.4, height * 0.15, width * 0.08);
    
    // ОБЛАСТЬ 4: Облако 3 (задача 4: 1½ + 2½ = 4)
    drawCloud(width * 0.7, height * 0.25, width * 0.09);
    
    // ОБЛАСТЬ 5-6: Горы (задачи 5-6)
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(width * 0.3, height * 0.4);
    ctx.lineTo(width * 0.6, height * 0.5);
    ctx.lineTo(width, height * 0.6);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = '#81C784';
    ctx.fill();
    ctx.stroke();
    
    // ОБЛАСТЬ 7-8: Дом (задачи 7-8)
    // Основа дома
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(width * 0.1, height * 0.55, width * 0.25, height * 0.25);
    ctx.fill();
    ctx.stroke();
    
    // Крыша
    ctx.beginPath();
    ctx.moveTo(width * 0.08, height * 0.55);
    ctx.lineTo(width * 0.225, height * 0.4);
    ctx.lineTo(width * 0.37, height * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // ОБЛАСТЬ 9: Окно (задача 9: ⅔ × ¾ = ½)
    ctx.beginPath();
    ctx.rect(width * 0.15, height * 0.6, width * 0.08, width * 0.08);
    ctx.fill();
    ctx.stroke();
    
    // ОБЛАСТЬ 10: Дверь (задача 10: 5 ÷ ½ = 10)
    ctx.beginPath();
    ctx.rect(width * 0.25, height * 0.65, width * 0.07, height * 0.15);
    ctx.fill();
    ctx.stroke();
    
    // ОБЛАСТЬ 11-12: Деревья (дополнительные области)
    drawTree(width * 0.5, height * 0.65, width * 0.05);
    drawTree(width * 0.6, height * 0.7, width * 0.04);
    
    // ОБЛАСТЬ 13-15: Цветы (дополнительные области)
    drawFlower(width * 0.3, height * 0.8, width * 0.02);
    drawFlower(width * 0.4, height * 0.85, width * 0.02);
    drawFlower(width * 0.5, height * 0.82, width * 0.02);
    
    // ОБЛАСТЬ 16-20: Трава и детали
    ctx.beginPath();
    ctx.rect(0, height * 0.85, width, height * 0.15);
    ctx.fillStyle = '#A5D6A7';
    ctx.fill();
    ctx.stroke();
    
    // Озера
    ctx.beginPath();
    ctx.ellipse(width * 0.75, height * 0.75, width * 0.1, height * 0.05, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#4FC3F7';
    ctx.fill();
    ctx.stroke();
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.9, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y + size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawTree(x, y, size) {
    // Ствол
    ctx.beginPath();
    ctx.rect(x - size * 0.2, y, size * 0.4, size * 1.5);
    ctx.fillStyle = '#8D6E63';
    ctx.fill();
    ctx.stroke();
    
    // Крона
    ctx.beginPath();
    ctx.arc(x, y - size * 0.5, size * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#81C784';
    ctx.fill();
    ctx.stroke();
}

function drawFlower(x, y, size) {
    // Стебель
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - size * 4);
    ctx.strokeStyle = '#388E3C';
    ctx.stroke();
    
    // Лепестки
    ctx.fillStyle = '#FFEB3B';
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const petalX = x + Math.cos(angle) * size * 2;
        const petalY = y - size * 4 + Math.sin(angle) * size * 2;
        
        ctx.beginPath();
        ctx.arc(petalX, petalY, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    
    // Центр
    ctx.beginPath();
    ctx.arc(x, y - size * 4, size, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9800';
    ctx.fill();
    ctx.stroke();
}

// ФУНКЦИИ РИСОВАНИЯ
function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    [lastX, lastY] = [pos.x, pos.y];
    
    if (currentTool === 'bucket') {
        floodFill(pos.x, pos.y);
        isDrawing = false;
        coloredAreas++;
        updateProgress();
    }
}

function draw(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    const pos = getMousePos(e);
    
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    
    if (currentTool === 'eraser') {
        ctx.strokeStyle = '#E3F2FD';
        ctx.lineWidth = brushSize * 2;
    } else {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    [lastX, lastY] = [pos.x, pos.y];
}

function stopDrawing() {
    isDrawing = false;
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (e.type.includes('touch')) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    
    // Масштабируем относительно размеров канваса
    x = (x / rect.width) * canvas.width;
    y = (y / rect.height) * canvas.height;
    
    return { x, y };
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    } else if (e.touches.length === 2) {
        // Двойное касание для заливки
        currentTool = 'bucket';
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        currentTool = 'brush';
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    e.preventDefault();
}

function floodFill(startX, startY) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const startPos = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    
    const targetColor = {
        r: data[startPos],
        g: data[startPos + 1],
        b: data[startPos + 2],
        a: data[startPos + 3]
    };
    
    const fillColor = hexToRgb(currentColor);
    
    // Если цвет уже совпадает, выходим
    if (colorsMatch(targetColor, fillColor)) return;
    
    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set();
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const pos = (y * canvas.width + x) * 4;
        
        // Проверяем границы
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
        if (visited.has(`${x},${y}`)) continue;
        
        const pixelColor = {
            r: data[pos],
            g: data[pos + 1],
            b: data[pos + 2],
            a: data[pos + 3]
        };
        
        // Проверяем, совпадает ли цвет с целевым
        if (!colorsMatch(pixelColor, targetColor)) continue;
        
        // Закрашиваем пиксель
        data[pos] = fillColor.r;
        data[pos + 1] = fillColor.g;
        data[pos + 2] = fillColor.b;
        data[pos + 3] = fillColor.a;
        
        visited.add(`${x},${y}`);
        
        // Добавляем соседние пиксели
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
    } : { r: 0, g: 0, b: 0, a: 255 };
}

function colorsMatch(c1, c2) {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
}

// ПРОВЕРКА ОТВЕТОВ
function checkAnswer(input) {
    const userAnswer = input.value.trim();
    const correctAnswer = input.dataset.answer;
    const color = input.dataset.color;
    const problemCard = input.closest('.problem-card');
    const resultIndicator = input.nextElementSibling;
    
    // Очищаем предыдущие состояния
    input.classList.remove('correct', 'incorrect');
    resultIndicator.className = 'result-indicator';
    
    if (!userAnswer) {
        resultIndicator.innerHTML = '';
        return;
    }
    
    // Нормализуем ответы для сравнения
    const normalizedUser = normalizeFraction(userAnswer);
    const normalizedCorrect = normalizeFraction(correctAnswer);
    
    if (normalizedUser === normalizedCorrect) {
        // Правильный ответ
        input.classList.add('correct');
        resultIndicator.className = 'result-indicator correct';
        resultIndicator.innerHTML = '✓';
        problemCard.classList.add('solved');
        
        // Проверяем, был ли ответ уже засчитан
        if (!input.dataset.solved) {
            input.dataset.solved = 'true';
            solvedProblems++;
            score += 10;
            
            // Разблокируем цвет
            const colorItem = document.querySelector(`[data-color="${color}"]`);
            if (colorItem) {
                colorItem.classList.remove('locked');
                colorItem.title = `Цвет для: ${correctAnswer}`;
            }
            
            // Обновляем прогресс
            updateProgress();
            
            // Проверяем, решены ли все задачи
            if (solvedProblems === totalProblems) {
                setTimeout(() => {
                    showCompletionMessage();
                }, 500);
            }
        }
    } else {
        // Неправильный ответ
        input.classList.add('incorrect');
        resultIndicator.className = 'result-indicator incorrect';
        resultIndicator.innerHTML = '✗';
        
        // Если ответ был засчитан, но стал неправильным
        if (input.dataset.solved) {
            input.dataset.solved = 'false';
            solvedProblems = Math.max(0, solvedProblems - 1);
            score = Math.max(0, score - 10);
            updateProgress();
        }
    }
}

function normalizeFraction(str) {
    const fractions = {
        '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4',
        '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5', '⅙': '1/6',
        '⅚': '5/6', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8'
    };
    
    // Заменяем символы дробей
    let normalized = str;
    for (const [symbol, fraction] of Object.entries(fractions)) {
        normalized = normalized.replace(new RegExp(symbol, 'g'), fraction);
    }
    
    // Убираем пробелы
    normalized = normalized.replace(/\s+/g, '');
    
    // Конвертируем смешанные числа
    normalized = normalized.replace(/(\d+)(\d+\/\d+)/g, (match, whole, fraction) => {
        const [num, den] = fraction.split('/');
        return `${(parseInt(whole) * parseInt(den) + parseInt(num))}/${den}`;
    });
    
    return normalized;
}

// ОБНОВЛЕНИЕ ПРОГРЕССА
function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const solvedElement = document.getElementById('solved');
    const scoreElement = document.getElementById('score');
    
    const progressPercent = (solvedProblems / totalProblems) * 100;
    const coloredPercent = (coloredAreas / totalAreas) * 100;
    const totalPercent = Math.min(100, (progressPercent + coloredPercent) / 2);
    
    if (progressFill) {
        progressFill.style.width = `${totalPercent}%`;
        progressFill.textContent = `${Math.round(totalPercent)}%`;
    }
    
    if (solvedElement) {
        solvedElement.textContent = solvedProblems;
    }
    
    if (scoreElement) {
        scoreElement.textContent = score;
    }
    
    // Меняем цвет прогресс-бара
    if (progressFill) {
        if (totalPercent < 33) {
            progressFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E8E)';
        } else if (totalPercent < 66) {
            progressFill.style.background = 'linear-gradient(90deg, #FFD166, #FFE8A5)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #06D6A0, #4ECDC4)';
        }
    }
}

// ПОКАЗ РЕЗУЛЬТАТОВ
function showResults() {
    const finalSolved = document.getElementById('final-solved');
    const finalScore = document.getElementById('final-score');
    const finalColored = document.getElementById('final-colored');
    const resultCanvas = document.getElementById('result-canvas');
    
    if (finalSolved) {
        finalSolved.textContent = `${solvedProblems}/${totalProblems}`;
    }
    
    if (finalScore) {
        finalScore.textContent = score;
    }
    
    if (finalColored) {
        const coloredPercent = Math.round((coloredAreas / totalAreas) * 100);
        finalColored.textContent = `${coloredPercent}%`;
    }
    
    // Копируем рисунок на канвас результатов
    if (resultCanvas && canvas) {
        const resultCtx = resultCanvas.getContext('2d');
        resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
        
        // Масштабируем изображение
        resultCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 
                           0, 0, resultCanvas.width, resultCanvas.height);
    }
}

// СБРОС ИГРЫ
function resetGame() {
    solvedProblems = 0;
    score = 0;
    coloredAreas = 0;
    
    // Сбрасываем задачи
    document.querySelectorAll('.problem-card').forEach(card => {
        card.classList.remove('solved');
        const input = card.querySelector('.answer-input');
        input.value = '';
        input.classList.remove('correct', 'incorrect');
        input.dataset.solved = '';
        
        const indicator = card.querySelector('.result-indicator');
        indicator.className = 'result-indicator';
        indicator.innerHTML = '';
    });
    
    // Сбрасываем цвета
    document.querySelectorAll('.color-item').forEach((item, index) => {
        if (index === 0) {
            item.classList.remove('locked');
            item.classList.add('active');
        } else {
            item.classList.add('locked');
            item.classList.remove('active');
        }
    });
    
    // Перерисовываем картинку
    drawPictureOutline();
    
    // Обновляем прогресс
    updateProgress();
    
    // Возвращаемся к первому слайду
    showSlide(0);
}

// ПОДСКАЗКИ
function showHint() {
    const unsolvedProblems = Array.from(document.querySelectorAll('.problem-card'))
        .filter(card => !card.classList.contains('solved'));
    
    if (unsolvedProblems.length > 0) {
        const randomProblem = unsolvedProblems[Math.floor(Math.random() * unsolvedProblems.length)];
        const answer = randomProblem.querySelector('.answer-input').dataset.answer;
        
        alert(`Подсказка: Ответ на один из примеров — ${answer}`);
        
        // Минус 5 баллов за подсказку
        score = Math.max(0, score - 5);
        updateProgress();
    } else {
        alert('Все задачи уже решены! 🎉');
    }
}

function showCompletionMessage() {
    if (solvedProblems === totalProblems) {
        setTimeout(() => {
            alert('🎉 Поздравляем! Ты решил все задачи!\nТеперь можешь раскрасить все области любыми цветами!');
        }, 300);
    }
}

// ПОДЕЛИТЬСЯ РЕЗУЛЬТАТОМ
function shareResult() {
    if (navigator.share) {
        navigator.share({
            title: 'Математическая раскраска: Дроби',
            text: `Я решил ${solvedProblems} из ${totalProblems} задач и набрал ${score} баллов!`,
            url: window.location.href
        });
    } else {
        // Копируем в буфер обмена
        const text = `Я решил ${solvedProblems} из ${totalProblems} задач по математике и набрал ${score} баллов!\nПопробуй и ты: ${window.location.href}`;
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Результат скопирован в буфер обмена! Можешь поделиться им в любом мессенджере.');
        }).catch(() => {
            prompt('Скопируйте этот текст:', text);
        });
    }
}
