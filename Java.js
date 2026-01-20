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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы DOM
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

    console.log("Страница загружена, элементы найдены:", {
        startGameBtn: !!startGameBtn,
        topicButtons: topicButtons.length
    });

    // Инициализация игры
    function initGame() {
        console.log("Инициализация игры");
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
        const firstTopicBtn = document.querySelector('.topic-btn[data-topic="fractions"]');
        if (firstTopicBtn) {
            topicButtons.forEach(btn => btn.classList.remove('active'));
            firstTopicBtn.classList.add('active');
            gameData.currentTopic = 'fractions';
            currentTopicElement.textContent = topicNames[gameData.currentTopic];
        }
    }

    // Показать определенную секцию
    function showSection(sectionId) {
        console.log("Показываем секцию:", sectionId);
        [topicSection, gameSection, resultSection].forEach(section => {
            if (section) section.classList.remove('active-section');
        });
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('active-section');
    }

    // Обновление информации об игре
    function updateGameInfo() {
        if (scoreElement) scoreElement.textContent = gameData.score;
        if (questionCountElement) questionCountElement.textContent = `${gameData.currentQuestion}/${gameData.totalQuestions}`;
        if (levelElement) levelElement.textContent = gameData.level;
        if (currentTopicElement) currentTopicElement.textContent = topicNames[gameData.currentTopic];
        
        // Обновление прогресс-бара
        if (progressBar) {
            const progressPercent = (gameData.currentQuestion / gameData.totalQuestions) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    }

    // Начать игру
    function startGame() {
        console.log("Начинаем игру с темой:", gameData.currentTopic);
        showSection('game-section');
        gameData.currentQuestion = 0;
        gameData.score = 0;
        gameData.correctAnswers = 0;
        gameData.level = 1;
        loadQuestion();
    }

    // Загрузить вопрос
    function loadQuestion() {
        console.log("Загружаем вопрос №", gameData.currentQuestion + 1);
        const topicQuestions = questions[gameData.currentTopic];
        
        if (!topicQuestions || topicQuestions.length === 0) {
            console.error("Нет вопросов для темы:", gameData.currentTopic);
            return;
        }
        
        // Если вопросов по теме меньше, чем нужно, используем циклически
        const questionIndex = gameData.currentQuestion % topicQuestions.length;
        const question = topicQuestions[questionIndex];
        
        // Обновить текст вопроса
        if (questionText) questionText.textContent = question.question;
        gameData.currentHint = question.hint;
        
        // Очистить контейнер ответов
        if (answersContainer) {
            answersContainer.innerHTML = '';
            
            // Создать кнопки ответов
            question.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = answer;
                button.addEventListener('click', () => checkAnswer(index, question.correct));
                answersContainer.appendChild(button);
            });
        }
        
        // Обновить информацию об игре
        updateGameInfo();
        
        // Отключить кнопку "Следующий вопрос"
        if (nextBtn) nextBtn.disabled = true;
        if (hintBtn) hintBtn.disabled = false;
    }

    // Проверить ответ
    function checkAnswer(selectedIndex, correctIndex) {
        console.log("Проверяем ответ:", selectedIndex, "Правильный:", correctIndex);
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
        if (nextBtn) nextBtn.disabled = false;
        if (hintBtn) hintBtn.disabled = true;
        
        // Обновить информацию об игре
        updateGameInfo();
    }

    // Показать подсказку
    function showHint() {
        console.log("Показываем подсказку");
        alert(gameData.currentHint);
        if (hintBtn) hintBtn.disabled = true;
    }

    // Перейти к следующему вопросу
    function nextQuestion() {
        console.log("Переходим к следующему вопросу");
        gameData.currentQuestion++;
        
        if (gameData.currentQuestion < gameData.totalQuestions) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    // Показать результаты
    function showResults() {
        console.log("Показываем результаты");
        showSection('result-section');
        
        // Обновить информацию о результатах
        if (resultTopic) resultTopic.textContent = topicNames[gameData.currentTopic];
        if (resultScore) resultScore.textContent = gameData.score;
        if (correctAnswersElement) correctAnswersElement.textContent = `${gameData.correctAnswers} из ${gameData.totalQuestions}`;
        
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
        
        if (resultMessage) resultMessage.textContent = message;
    }

    // Назначаем обработчики событий
    if (topicButtons.length > 0) {
        topicButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log("Выбрана тема:", button.dataset.topic);
                // Убрать активный класс у всех кнопок
                topicButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавить активный класс нажатой кнопке
                button.classList.add('active');
                
                // Установить текущую тему
                gameData.currentTopic = button.dataset.topic;
                if (currentTopicElement) {
                    currentTopicElement.textContent = topicNames[gameData.currentTopic] || "Тема не выбрана";
                }
            });
        });
    }

    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
        console.log("Кнопка 'Начать игру' добавлена");
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }

    if (hintBtn) {
        hintBtn.addEventListener('click', showHint);
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            console.log("Перезапуск игры");
            startGame();
        });
    }

    if (changeTopicBtn) {
        changeTopicBtn.addEventListener('click', () => {
            console.log("Возврат к выбору темы");
            initGame();
        });
    }

    // Инициализируем игру при загрузке
    initGame();
});
