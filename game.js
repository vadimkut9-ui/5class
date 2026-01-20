// Игровые данные
const gameData = {
    currentTopic: 'fractions',
    score: 0,
    currentQuestion: 0,
    totalQuestions: 10,
    level: 1,
    correctAnswers: 0,
    currentHint: ''
};

// Вопросы по темам
const questions = {
    fractions: [
        {
            question: "Вычисли: 1/3 + 1/6",
            answers: ["1/2", "2/9", "1/9", "2/6"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 6: 1/3 = 2/6, 2/6 + 1/6 = 3/6 = 1/2"
        },
        {
            question: "Вычисли: 3/4 - 1/8",
            answers: ["5/8", "2/4", "1/2", "3/8"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 8: 3/4 = 6/8, 6/8 - 1/8 = 5/8"
        },
        {
            question: "Вычисли: 2/5 + 3/10",
            answers: ["7/10", "5/15", "1/2", "6/10"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 10: 2/5 = 4/10, 4/10 + 3/10 = 7/10"
        },
        {
            question: "Вычисли: 5/6 - 1/3",
            answers: ["1/2", "4/3", "3/6", "2/3"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 6: 1/3 = 2/6, 5/6 - 2/6 = 3/6 = 1/2"
        },
        {
            question: "Вычисли: 1/2 + 2/7",
            answers: ["11/14", "3/9", "3/14", "9/14"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 14: 1/2 = 7/14, 2/7 = 4/14, 7/14 + 4/14 = 11/14"
        },
        {
            question: "Вычисли: 4/9 - 1/6",
            answers: ["5/18", "3/3", "3/18", "1/3"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 18: 4/9 = 8/18, 1/6 = 3/18, 8/18 - 3/18 = 5/18"
        },
        {
            question: "Вычисли: 3/8 + 1/4",
            answers: ["5/8", "4/12", "2/8", "1/2"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 8: 1/4 = 2/8, 3/8 + 2/8 = 5/8"
        },
        {
            question: "Вычисли: 7/10 - 2/5",
            answers: ["3/10", "5/5", "1/2", "5/10"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 10: 2/5 = 4/10, 7/10 - 4/10 = 3/10"
        },
        {
            question: "Вычисли: 2/3 + 3/5",
            answers: ["19/15", "5/8", "6/15", "1 4/15"],
            correct: 3,
            hint: "Приведи дроби к общему знаменателю 15: 2/3 = 10/15, 3/5 = 9/15, 10/15 + 9/15 = 19/15 = 1 4/15"
        },
        {
            question: "Вычисли: 5/12 - 1/6",
            answers: ["1/4", "4/6", "3/12", "2/12"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 12: 1/6 = 2/12, 5/12 - 2/12 = 3/12 = 1/4"
        }
    ],
    comparison: [
        {
            question: "Какая дробь больше: 3/4 или 5/8?",
            answers: ["3/4", "5/8", "Они равны", "Нельзя сравнить"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 8: 3/4 = 6/8, 6/8 > 5/8, значит 3/4 > 5/8"
        },
        {
            question: "Какая дробь меньше: 2/3 или 3/5?",
            answers: ["3/5", "2/3", "Они равны", "Нельзя сравнить"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 15: 2/3 = 10/15, 3/5 = 9/15, 9/15 < 10/15, значит 3/5 < 2/3"
        },
        {
            question: "Сравни: 7/12 и 5/8",
            answers: ["5/8 > 7/12", "7/12 > 5/8", "Они равны", "Нельзя сравнить"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 24: 7/12 = 14/24, 5/8 = 15/24, 15/24 > 14/24, значит 5/8 > 7/12"
        },
        {
            question: "Какая дробь больше: 4/9 или 3/7?",
            answers: ["4/9", "3/7", "Они равны", "Нельзя сравнить"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 63: 4/9 = 28/63, 3/7 = 27/63, 28/63 > 27/63, значит 4/9 > 3/7"
        },
        {
            question: "Сравни: 2/5 и 3/10",
            answers: ["2/5 > 3/10", "3/10 > 2/5", "Они равны", "Нельзя сравнить"],
            correct: 0,
            hint: "Приведи дроби к общему знаменателю 10: 2/5 = 4/10, 4/10 > 3/10, значит 2/5 > 3/10"
        }
    ],
    brackets: [
        {
            question: "Раскрой скобки: 6(3x - 5)",
            answers: ["18x - 30", "18x + 30", "9x - 11", "18x - 5"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 6: 6 × 3x = 18x, 6 × 5 = 30, получаем 18x - 30"
        },
        {
            question: "Раскрой скобки: 4(2x + 7)",
            answers: ["8x + 28", "8x + 7", "6x + 28", "8x + 11"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 4: 4 × 2x = 8x, 4 × 7 = 28, получаем 8x + 28"
        },
        {
            question: "Раскрой скобки: 5(3x - 4)",
            answers: ["15x - 20", "15x + 20", "8x - 20", "15x - 4"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 5: 5 × 3x = 15x, 5 × 4 = 20, получаем 15x - 20"
        },
        {
            question: "Раскрой скобки: 7(2x + 3)",
            answers: ["14x + 21", "14x + 3", "9x + 21", "14x + 10"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 7: 7 × 2x = 14x, 7 × 3 = 21, получаем 14x + 21"
        },
        {
            question: "Раскрой скобки: 8(4x - 2)",
            answers: ["32x - 16", "32x + 16", "12x - 16", "32x - 2"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 8: 8 × 4x = 32x, 8 × 2 = 16, получаем 32x - 16"
        },
        {
            question: "Раскрой скобки: 3(5x + 6)",
            answers: ["15x + 18", "15x + 6", "8x + 18", "15x + 9"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 3: 3 × 5x = 15x, 3 × 6 = 18, получаем 15x + 18"
        },
        {
            question: "Раскрой скобки: 9(2x - 3)",
            answers: ["18x - 27", "18x + 27", "11x - 27", "18x - 3"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 9: 9 × 2x = 18x, 9 × 3 = 27, получаем 18x - 27"
        },
        {
            question: "Раскрой скобки: 2(7x + 5)",
            answers: ["14x + 10", "14x + 5", "9x + 10", "14x + 7"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 2: 2 × 7x = 14x, 2 × 5 = 10, получаем 14x + 10"
        },
        {
            question: "Раскрой скобки: 10(3x - 4)",
            answers: ["30x - 40", "30x + 40", "13x - 40", "30x - 4"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 10: 10 × 3x = 30x, 10 × 4 = 40, получаем 30x - 40"
        },
        {
            question: "Раскрой скобки: 5(6x + 2)",
            answers: ["30x + 10", "30x + 2", "11x + 10", "30x + 7"],
            correct: 0,
            hint: "Умножь каждое слагаемое в скобках на 5: 5 × 6x = 30x, 5 × 2 = 10, получаем 30x + 10"
        }
    ],
    equations: [
        {
            question: "Реши уравнение: x + 7 = 15",
            answers: ["x = 8", "x = 22", "x = 9", "x = 12"],
            correct: 0,
            hint: "Чтобы найти x, нужно из 15 вычесть 7: x = 15 - 7 = 8"
        },
        {
            question: "Реши уравнение: 3x = 21",
            answers: ["x = 7", "x = 18", "x = 24", "x = 63"],
            correct: 0,
            hint: "Чтобы найти x, нужно 21 разделить на 3: x = 21 ÷ 3 = 7"
        },
        {
            question: "Реши уравнение: x - 5 = 12",
            answers: ["x = 17", "x = 7", "x = 16", "x = 60"],
            correct: 0,
            hint: "Чтобы найти x, нужно к 12 прибавить 5: x = 12 + 5 = 17"
        },
        {
            question: "Реши уравнение: 2x + 3 = 11",
            answers: ["x = 4", "x = 7", "x = 5", "x = 14"],
            correct: 0,
            hint: "Сначала вычти 3: 2x = 11 - 3 = 8, затем раздели на 2: x = 8 ÷ 2 = 4"
        },
        {
            question: "Реши уравнение: x ÷ 4 = 5",
            answers: ["x = 20", "x = 9", "x = 1", "x = 10"],
            correct: 0,
            hint: "Чтобы найти x, нужно 5 умножить на 4: x = 5 × 4 = 20"
        },
        {
            question: "Реши уравнение: 5x - 6 = 19",
            answers: ["x = 5", "x = 13", "x = 25", "x = 4"],
            correct: 0,
            hint: "Сначала прибавь 6: 5x = 19 + 6 = 25, затем раздели на 5: x = 25 ÷ 5 = 5"
        },
        {
            question: "Реши уравнение: x + 12 = 30",
            answers: ["x = 18", "x = 42", "x = 22", "x = 17"],
            correct: 0,
            hint: "Чтобы найти x, нужно из 30 вычесть 12: x = 30 - 12 = 18"
        },
        {
            question: "Реши уравнение: 4x = 36",
            answers: ["x = 9", "x = 32", "x = 40", "x = 144"],
            correct: 0,
            hint: "Чтобы найти x, нужно 36 разделить на 4: x = 36 ÷ 4 = 9"
        },
        {
            question: "Реши уравнение: x - 8 = 15",
            answers: ["x = 23", "x = 7", "x = 22", "x = 120"],
            correct: 0,
            hint: "Чтобы найти x, нужно к 15 прибавить 8: x = 15 + 8 = 23"
        },
        {
            question: "Реши уравнение: 3x + 7 = 22",
            answers: ["x = 5", "x = 15", "x = 6", "x = 29"],
            correct: 0,
            hint: "Сначала вычти 7: 3x = 22 - 7 = 15, затем раздели на 3: x = 15 ÷ 3 = 5"
        }
    ],
    history: [
        {
            question: "Кто считается отцом математики?",
            answers: ["Пифагор", "Аристотель", "Евклид", "Архимед"],
            correct: 0,
            hint: "Древнегреческий математик, создатель знаменитой теоремы о сторонах прямоугольного треугольника"
        },
        {
            question: "В какой стране изобрели цифры, которые мы используем сегодня?",
            answers: ["Индия", "Китай", "Египет", "Греция"],
            correct: 0,
            hint: "Современная десятичная система счисления была изобретена в этой древней стране"
        },
        {
            question: "Кто создал геометрию как науку?",
            answers: ["Евклид", "Пифагор", "Архимед", "Ньютон"],
            correct: 0,
            hint: "Древнегреческий математик, автор знаменитых «Начал» — основного учебника по геометрии"
        },
        {
            question: "Как называется знак «+»?",
            answers: ["Плюс", "Сложение", "Прибавление", "Добавление"],
            correct: 0,
            hint: "Этот знак обозначает операцию сложения"
        },
        {
            question: "Кто открыл число π (пи)?",
            answers: ["Архимед", "Пифагор", "Евклид", "Ньютон"],
            correct: 0,
            hint: "Древнегреческий ученый, который приблизительно вычислил значение этого числа"
        },
        {
            question: "Что означает слово «математика» в переводе с греческого?",
            answers: ["Знание", "Наука", "Искусство", "Число"],
            correct: 0,
            hint: "В переводе с древнегреческого это слово означает «наука», «знание»"
        },
        {
            question: "Кто создал таблицу умножения?",
            answers: ["Пифагор", "Евклид", "Архимед", "Вавилоняне"],
            correct: 0,
            hint: "Древнегреческий математик, именем которого названа знаменитая таблица"
        },
        {
            question: "В какой древней стране использовали дробные числа при расчетах?",
            answers: ["Египет", "Греция", "Рим", "Вавилон"],
            correct: 0,
            hint: "Древние египтяне использовали дроби в строительстве пирамид"
        },
        {
            question: "Кто ввел понятие «ноль» в математику?",
            answers: ["Индийские математики", "Арабы", "Греки", "Китайцы"],
            correct: 0,
            hint: "Концепция нуля как числа была разработана в Древней Индии"
        },
        {
            question: "Какой математик сказал: «Дайте мне точку опоры, и я переверну мир»?",
            answers: ["Архимед", "Пифагор", "Евклид", "Ньютон"],
            correct: 0,
            hint: "Древнегреческий ученый, знаменитый своими открытиями в механике"
        }
    ]
};

// Названия тем для отображения
const topicNames = {
    fractions: "Сложение и вычитание дробей",
    comparison: "Сравнение дробей",
    brackets: "Раскрытие скобок",
    equations: "Уравнения",
    history: "История математики"
};

// Элементы DOM
const topicSection = document.getElementById('topic-section');
const gameSection = document.getElementById('game-section');
const resultSection = document.getElementById('result-section');
const topicButtons = document.querySelectorAll('.topic-btn');
const startGameBtn = document.getElementById('start-game');
const nextBtn = document.getElementById('next-btn');
const hintBtn = document.getElementById('hint-btn');
const restartBtn = document.getElementById('restart-btn');
const changeTopicBtn = document.getElementById('change-topic-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const scoreElement = document.getElementById('score');
const questionCountElement = document.getElementById('question-count');
const levelElement = document.getElementById('level');
const currentTopicElement = document.getElementById('current-topic');
const progressBar = document.getElementById('progress-bar');
const resultTopic = document.getElementById('result-topic');
const resultScore = document.getElementById('result-score');
const correctAnswersElement = document.getElementById('correct-answers');
const resultMessage = document.getElementById('result-message');

// Инициализация игры
function initGame() {
    // Сброс данных игры
    gameData.score = 0;
    gameData.currentQuestion = 0;
    gameData.correctAnswers = 0;
    gameData.level = 1;
    
    // Обновление отображения
    updateGameInfo();
    
    // Показать выбор темы
    showSection('topic-section');
    
    // Активировать первую тему по умолчанию
    document.querySelector('.topic-btn.active').classList.remove('active');
    topicButtons[0].classList.add('active');
    gameData.currentTopic = topicButtons[0].dataset.topic;
    
    // Обновить название текущей темы
    currentTopicElement.textContent = topicNames[gameData.currentTopic];
}

// Показать определенную секцию
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
}

// Обновление информации об игре
function updateGameInfo() {
    scoreElement.textContent = gameData.score;
    questionCountElement.textContent = `${gameData.currentQuestion}/${gameData.totalQuestions}`;
    levelElement.textContent = gameData.level;
    currentTopicElement.textContent = topicNames[gameData.currentTopic];
    
    // Обновление прогресс-бара
    const progressPercent = (gameData.currentQuestion / gameData.totalQuestions) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Начать игру
function startGame() {
    showSection('game-section');
    gameData.currentQuestion = 0;
    gameData.score = 0;
    gameData.correctAnswers = 0;
    loadQuestion();
}

// Загрузить вопрос
function loadQuestion() {
    const topicQuestions = questions[gameData.currentTopic];
    
    // Если вопросов по теме меньше, чем нужно, дополняем первыми вопросами
    const questionIndex = gameData.currentQuestion % topicQuestions.length;
    const question = topicQuestions[questionIndex];
    
    // Обновить текст вопроса
    questionText.textContent = question.question;
    gameData.currentHint = question.hint;
    
    // Очистить контейнер ответов
    answersContainer.innerHTML = '';
    
    // Создать кнопки ответов
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => checkAnswer(index, question.correct));
        answersContainer.appendChild(button);
    });
    
    // Обновить информацию об игре
    updateGameInfo();
    
    // Отключить кнопку "Следующий вопрос"
    nextBtn.disabled = true;
    hintBtn.disabled = false;
}

// Проверить ответ
function checkAnswer(selectedIndex, correctIndex) {
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    // Отключить все кнопки
    answerButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // Показать правильный и неправильный ответы
    answerButtons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            btn.classList.add('wrong');
        }
    });
    
    // Проверить, правильный ли ответ
    if (selectedIndex === correctIndex) {
        gameData.score += 10 * gameData.level;
        gameData.correctAnswers++;
        
        // Повысить уровень после каждых 3 правильных ответов
        if (gameData.correctAnswers % 3 === 0 && gameData.level < 3) {
            gameData.level++;
        }
    }
    
    // Включить кнопку "Следующий вопрос"
    nextBtn.disabled = false;
    hintBtn.disabled = true;
    
    // Обновить информацию об игре
    updateGameInfo();
}

// Показать подсказку
function showHint() {
    alert(gameData.currentHint);
    hintBtn.disabled = true;
}

// Перейти к следующему вопросу
function nextQuestion() {
    gameData.currentQuestion++;
    
    if (gameData.currentQuestion < gameData.totalQuestions) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Показать результаты
function showResults() {
    showSection('result-section');
    
    // Обновить информацию о результатах
    resultTopic.textContent = topicNames[gameData.currentTopic];
    resultScore.textContent = gameData.score;
    correctAnswersElement.textContent = `${gameData.correctAnswers} из ${gameData.totalQuestions}`;
    
    // Определить сообщение в зависимости от результата
    let message = "";
    const percentage = (gameData.correctAnswers / gameData.totalQuestions) * 100;
    
    if (percentage >= 90) {
        message = "Отлично! Ты настоящий математический гений!";
    } else if (percentage >= 70) {
        message = "Хорошо! Ты хорошо разбираешься в математике!";
    } else if (percentage >= 50) {
        message = "Неплохо, но есть куда стремиться!";
    } else {
        message = "Попробуй еще раз, у тебя обязательно получится!";
    }
    
    resultMessage.textContent = message;
}

// События
topicButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Убрать активный класс у всех кнопок
        topicButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавить активный класс нажатой кнопке
        button.classList.add('active');
        
        // Установить текущую тему
        gameData.currentTopic = button.dataset.topic;
        currentTopicElement.textContent = topicNames[gameData.currentTopic];
    });
});

startGameBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
hintBtn.addEventListener('click', showHint);
restartBtn.addEventListener('click', () => {
    startGame();
});
changeTopicBtn.addEventListener('click', () => {
    initGame();
});

// Инициализировать игру при загрузке страницы
window.addEventListener('DOMContentLoaded', initGame);
