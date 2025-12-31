let currentSlideIndex = 0;
let isAnimating = false;
let slides = [];

// Переменные для раскраски
let canvas, ctx;
let isDrawing = false;
let currentTool = 'brush';
let currentColor = '#FF6B6B';
let brushSize = 10;
let lastX = 0;
let lastY = 0;
let solvedProblems = 0;
let totalProblems = 5;

document.addEventListener('DOMContentLoaded', function() {
    initSlides();
    initColoring();
    initMathProblems();
    
    // Инициализация первого слайда
    setTimeout(() => {
        document.querySelector('.math-symbols').style.animationPlayState = 'running';
    }, 100);
});

function initSlides() {
    slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.querySelectorAll('.indicator-dot');
    
    // Показываем первый слайд
    slides[0].classList.add('active');
    
    // Обработчики для кнопок навигации
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigate(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigate(1));
    }
    
    // Обработчики для индикаторов слайдов
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isAnimating) {
                showSlide(index);
            }
        });
    });
    
    // Навигация клавишами
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                navigate(-1);
                break;
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                navigate(1);
                break;
            case 'Home':
                e.preventDefault();
                showSlide(0);
                break;
            case 'End':
                e.preventDefault();
                showSlide(slides.length - 1);
                break;
        }
    });
}

function navigate(direction) {
    if (isAnimating) return;
    
    const newIndex = currentSlideIndex + direction;
    
    if (newIndex >= 0 && newIndex < slides.length) {
        showSlide(newIndex);
    }
}

function showSlide(index) {
    if (isAnimating || index === currentSlideIndex) return;
    
    isAnimating = true;
    const direction = index > currentSlideIndex ? 'next' : 'prev';
    
    // Скрываем текущий слайд
    slides[currentSlideIndex].classList.remove('active');
    slides[currentSlideIndex].classList.add(direction === 'next' ? 'prev' : 'next');
    
    // Показываем новый слайд
    slides[index].classList.add('active');
    slides[index].style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
    
    setTimeout(() => {
        slides[index].style.transform = 'translateX(0)';
    }, 10);
    
    // Обновляем индикаторы
    updateIndicators(index);
    
    // Если переходим на слайд с раскраской, инициализируем канвас
    if (index === 2) {
        setTimeout(() => {
            drawOutline();
            updateProgress();
        }, 600);
    }
    
    setTimeout(() => {
        slides[currentSlideIndex].classList.remove('prev', 'next');
        currentSlideIndex = index;
        isAnimating = false;
    }, 600);
}

function updateIndicators(index) {
    const indicators = document.querySelectorAll('.indicator-dot');
    indicators.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function initColoring() {
    canvas = document.getElementById('coloring-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Настройка сглаживания
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Обработчики событий мыши
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Обработчики для сенсорных устройств
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Инструменты
    document.querySelectorAll('.tool-btn').forEach(btn => {
        if (btn.id !== 'clear-btn') {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentTool = this.dataset.tool;
            });
        }
    });
    
    // Очистка
    document.getElementById('clear-btn').addEventListener('click', clearCanvas);
    
    // Цвета
    document.querySelectorAll('.color').forEach(color => {
        color.addEventListener('click', function() {
            document.querySelectorAll('.color').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.dataset.color;
            document.getElementById('custom-color').value = currentColor;
        });
    });
    
    // Пользовательский цвет
    document.getElementById('custom-color').addEventListener('input', function() {
        currentColor = this.value;
    });
    
    // Размер кисти
    const brushSizeInput = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    
    brushSizeInput.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        brushSizeValue.textContent = `${brushSize}px`;
    });
    
    // Рисуем контур при загрузке
    drawOutline();
}

function drawOutline() {
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем контур для раскраски
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#ffffff';
    
    // Рисуем большой дом
    // Основа дома
    ctx.beginPath();
    ctx.rect(100, 250, 400, 200);
    ctx.fill();
    ctx.stroke();
    
    // Крыша
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(300, 100);
    ctx.lineTo(550, 250);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Дверь
    ctx.beginPath();
    ctx.rect(250, 350, 100, 100);
    ctx.fill();
    ctx.stroke();
    
    // Окно 1
    ctx.beginPath();
    ctx.rect(150, 300, 80, 80);
    ctx.fill();
    ctx.stroke();
    
    // Окно 2
    ctx.beginPath();
    ctx.rect(370, 300, 80, 80);
    ctx.fill();
    ctx.stroke();
    
    // Солнце
    ctx.beginPath();
    ctx.arc(650, 100, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Лучи солнца
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = 650 + Math.cos(angle) * 60;
        const y1 = 100 + Math.sin(angle) * 60;
        const x2 = 650 + Math.cos(angle) * 90;
        const y2 = 100 + Math.sin(angle) * 90;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    // Дерево
    // Ствол
    ctx.beginPath();
    ctx.rect(600, 300, 40, 150);
    ctx.fill();
    ctx.stroke();
    
    // Крона
    ctx.beginPath();
    ctx.arc(620, 250, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Облако 1
    drawCloud(200, 80, 80);
    
    // Облако 2
    drawCloud(450, 60, 60);
    
    // Трава
    ctx.beginPath();
    ctx.rect(0, 450, canvas.width, 50);
    ctx.fillStyle = '#90EE90';
    ctx.fill();
    ctx.stroke();
    
    // Цветы
    drawFlower(150, 430);
    drawFlower(300, 420);
    drawFlower(500, 425);
    drawFlower(700, 430);
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

function drawFlower(x, y) {
    // Стебель
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 40);
    ctx.stroke();
    
    // Листья
    ctx.beginPath();
    ctx.ellipse(x - 10, y - 20, 15, 8, Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(x + 10, y - 30, 15, 8, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Цветок
    ctx.beginPath();
    ctx.arc(x, y - 40, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Центр цветка
    ctx.beginPath();
    ctx.arc(x, y - 40, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
}

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
    
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    
    if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
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
    
    // Масштабируем координаты относительно размера канваса
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
    if (colorsMatch(targetColor, fillColor)) return;
    
    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set();
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const pos = (y * canvas.width + x) * 4;
        
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
        if (visited.has(`${x},${y}`)) continue;
        
        const pixelColor = {
            r: data[pos],
            g: data[pos + 1],
            b: data[pos + 2],
            a: data[pos + 3]
        };
        
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

function clearCanvas() {
    if (confirm('Вы уверены, что хотите очистить весь рисунок?')) {
        drawOutline();
    }
}

function initMathProblems() {
    const answerInputs = document.querySelectorAll('.answer-input');
    
    answerInputs.forEach(input => {
        input.addEventListener('input', function() {
            checkAnswer(this);
        });
        
        // Автоподстановка дробей при вводе
        input.addEventListener('keydown', function(e) {
            if (e.key === '/') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                const value = this.value;
                
                this.value = value.substring(0, start) + '½' + value.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
                
                checkAnswer(this);
            }
        });
    });
}

function checkAnswer(input) {
    const userAnswer = input.value.trim();
    const correctAnswer = input.dataset.answer;
    const resultIcon = input.nextElementSibling;
    
    // Очищаем предыдущие классы
    input.classList.remove('correct', 'incorrect');
    resultIcon.classList.remove('correct', 'incorrect');
    
    if (!userAnswer) {
        resultIcon.textContent = '';
        return;
    }
    
    // Нормализуем ответы для сравнения
    const normalizedUser = userAnswer
        .replace(/½/g, '1/2')
        .replace(/⅓/g, '1/3')
        .replace(/⅔/g, '2/3')
        .replace(/¼/g, '1/4')
        .replace(/¾/g, '3/4')
        .replace(/⅕/g, '1/5')
        .replace(/⅖/g, '2/5')
        .replace(/⅗/g, '3/5')
        .replace(/⅘/g, '4/5')
        .replace(/⅙/g, '1/6')
        .replace(/⅚/g, '5/6')
        .replace(/⅛/g, '1/8')
        .replace(/⅜/g, '3/8')
        .replace(/⅝/g, '5/8')
        .replace(/⅞/g, '7/8');
    
    const normalizedCorrect = correctAnswer
        .replace(/½/g, '1/2')
        .replace(/⅓/g, '1/3')
        .replace(/⅔/g, '2/3')
        .replace(/¼/g, '1/4')
        .replace(/¾/g, '3/4')
        .replace(/⅕/g, '1/5')
        .replace(/⅖/g, '2/5')
        .replace(/⅗/g, '3/5')
        .replace(/⅘/g, '4/5')
        .replace(/⅙/g, '1/6')
        .replace(/⅚/g, '5/6')
        .replace(/⅛/g, '1/8')
        .replace(/⅜/g, '3/8')
        .replace(/⅝/g, '5/8')
        .replace(/⅞/g, '7/8');
    
    // Простое сравнение строк
    if (normalizedUser === normalizedCorrect) {
        input.classList.add('correct');
        resultIcon.classList.add('correct');
        resultIcon.textContent = '✓';
        
        // Проверяем, была ли задача уже решена
        if (!input.dataset.solved) {
            input.dataset.solved = 'true';
            solvedProblems++;
            updateProgress();
            
            // Разблокируем дополнительные цвета при решении всех задач
            if (solvedProblems === totalProblems) {
                unlockAllColors();
            }
        }
    } else {
        input.classList.add('incorrect');
        resultIcon.classList.add('incorrect');
        resultIcon.textContent = '✗';
        
        // Если задача была решена, но теперь ответ неверный
        if (input.dataset.solved) {
            input.dataset.solved = 'false';
            solvedProblems = Math.max(0, solvedProblems - 1);
            updateProgress();
        }
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const solvedCount = document.getElementById('solved-count');
    
    const percentage = (solvedProblems / totalProblems) * 100;
    
    progressFill.style.width = `${percentage}%`;
    solvedCount.textContent = solvedProblems;
    
    // Меняем цвет прогресс-бара в зависимости от прогресса
    if (percentage < 33) {
        progressFill.style.background = 'linear-gradient(90deg, #FF6B6B, #FF8E8E)';
    } else if (percentage < 66) {
        progressFill.style.background = 'linear-gradient(90deg, #FFD166, #FFE8A5)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #06D6A0, #4ECDC4)';
    }
}

function unlockAllColors() {
    // Анимация для разблокировки цветов
    const colors = document.querySelectorAll('.color');
    colors.forEach((color, index) => {
        setTimeout(() => {
            color.style.animation = 'unlock 0.5s ease';
            color.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
        }, index * 100);
    });
    
    // Показываем сообщение
    setTimeout(() => {
        alert('🎉 Поздравляем! Вы решили все задачи! Теперь все цвета разблокированы!');
    }, colors.length * 100 + 300);
}

// Добавляем CSS анимацию для разблокировки
const style = document.createElement('style');
style.textContent = `
@keyframes unlock {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(style);
