// Игровые данные
const gameData = {
    score: 0,
    answeredQuestions: 0,
    totalQuestions: 20,
    combo: 1,
    maxCombo: 1,
    currentQuestion: null,
    usedQuestions: new Set(),
    selectedCategories: new Set(),
    currentHint: '',
    correctAnswers: 0
};

// Категории и вопросы
const categories = [
    { 
        id: 'fractions', 
        name: 'Дроби', 
        color: '#3f51b5',
        icon: 'fa-divide'
    },
    { 
        id: 'comparison', 
        name: 'Сравнение дробей', 
        color: '#9c27b0',
        icon: 'fa-balance-scale'
    },
    { 
        id: 'brackets', 
        name: 'Раскрытие скобок', 
        color: '#009688',
        icon: 'fa-brackets-curly'
    },
    { 
        id: 'equations', 
        name: 'Уравнения', 
        color: '#ff9800',
        icon: 'fa-equals'
    }
];

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
    ]
};

// Баллы за вопросы
const questionPoints = [100, 200, 300, 400, 500];

// DOM элементы
const gameBoard = document.getElementById('game-board');
const questionModal = document.getElementById('question-modal');
const questionText = document.getElementById('question-text');
const questionCategory = document.getElementById('question-category');
const questionPointsElement = document.getElementById('question-points');
const answersContainer = document.getElementById('answers-container');
const scoreElement = document.getElementById('score');
const answeredElement = document.getElementById('answered');
const comboElement = document.getElementById('combo');
const maxComboDisplay = document.getElementById('max-combo-display');
const resetBtn = document.getElementById('reset-btn');
const rulesBtn = document.getElementById('rules-btn');
const closeRulesBtn = document.getElementById('close-rules-btn');
const rulesPanel = document.getElementById('rules-panel');
const hintBtn = document.getElementById('hint-btn');
const closeModalBtn = document.getElementById('close-modal');
const backToCategoriesBtn = document.getElementById('back-to-categories-btn');
const categoriesList = document.getElementById('categories-list');
const resultModal = document.getElementById('result-modal');
const finalScoreElement = document.getElementById('final-score');
const correctCountElement = document.getElementById('correct-count');
const maxComboElement = document.getElementById('max-combo');
const ratingElement = document.getElementById('rating');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');

// Инициализация игры
function initGame() {
    gameData.score = 0;
    gameData.answeredQuestions = 0;
    gameData.combo = 1;
    gameData.maxCombo = 1;
    gameData.correctAnswers = 0;
    gameData.usedQuestions.clear();
    gameData.selectedCategories.clear();
    
    updateUI();
    createGameBoard();
    updateCategoriesTracker();
    
    // Скрыть модальные окна и панель правил
    questionModal.style.display = 'none';
    resultModal.style.display = 'none';
    rulesPanel.style.display = 'none';
    
    // Сбросить состояние кнопок
    backToCategoriesBtn.disabled = true;
    hintBtn.disabled = false;
}

// Создание игрового поля
function createGameBoard() {
    gameBoard.innerHTML = '';
    
    // Заголовки категорий
    categories.forEach(category => {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `<i class="fas ${category.icon}"></i> ${category.name}`;
        categoryHeader.style.borderColor = category.color;
        gameBoard.appendChild(categoryHeader);
    });
    
    // Вопросы
    for (let i = 0; i < 5; i++) {
        categories.forEach(category => {
            const questionCell = document.createElement('div');
            questionCell.className = 'question-cell';
            questionCell.textContent = questionPoints[i];
            questionCell.dataset.category = category.id;
            questionCell.dataset.level = i;
            questionCell.style.color = category.color;
            
            // Проверяем, использован ли уже этот вопрос
            const questionKey = `${category.id}-${i}`;
            if (gameData.usedQuestions.has(questionKey)) {
                questionCell.classList.add('used');
                questionCell.style.color = '#666';
                questionCell.innerHTML = `<i class="fas fa-check"></i>`;
            } else {
                questionCell.addEventListener('click', () => openQuestion(category.id, i));
            }
            
            gameBoard.appendChild(questionCell);
        });
    }
}

// Открытие вопроса
function openQuestion(categoryId, level) {
    const questionKey = `${categoryId}-${level}`;
    
    // Проверяем, не использован ли вопрос
    if (gameData.usedQuestions.has(questionKey)) return;
    
    // Добавляем категорию в список выбранных
    gameData.selectedCategories.add(categoryId);
    updateCategoriesTracker();
    
    // Находим категорию
    const category = categories.find(c => c.id === categoryId);
    
    // Получаем вопрос
    const categoryQuestions = questions[categoryId];
    const question = categoryQuestions[level];
    gameData.currentQuestion = { 
        categoryId, 
        level, 
        question, 
        points: questionPoints[level],
        categoryName: category.name
    };
    gameData.currentHint = question.hint;
    
    // Отображаем информацию о вопросе
    questionCategory.textContent = category.name;
    questionPointsElement.textContent = `${questionPoints[level]} баллов`;
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';
    
    // Создаем кнопки ответов
    question.answers.forEach((answer, index) => {
        const answerBtn = document.createElement('button');
        answerBtn.className = 'answer-btn';
        answerBtn.textContent = answer;
        answerBtn.addEventListener('click', () => checkAnswer(index, question.correct));
        answersContainer.appendChild(answerBtn);
    });
    
    // Показываем модальное окно
    questionModal.style.display = 'flex';
    hintBtn.disabled = false;
    backToCategoriesBtn.disabled = true;
}

// Проверка ответа
function checkAnswer(selectedIndex, correctIndex) {
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    // Отключаем все кнопки
    answerButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // Показываем правильные/неправильные ответы
    answerButtons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            btn.classList.add('wrong');
        }
    });
    
    // Обработка результата
    const questionKey = `${gameData.currentQuestion.categoryId}-${gameData.currentQuestion.level}`;
    gameData.usedQuestions.add(questionKey);
    gameData.answeredQuestions++;
    
    if (selectedIndex === correctIndex) {
        // Правильный ответ
        gameData.correctAnswers++;
        const points = gameData.currentQuestion.points * gameData.combo;
        gameData.score += points;
        gameData.combo++;
        
        // Обновляем максимальное комбо
        if (gameData.combo > gameData.maxCombo) {
            gameData.maxCombo = gameData.combo;
        }
        
        // Показываем сообщение о начислении баллов
        setTimeout(() => {
            alert(`✅ Правильно! +${points} баллов! Комбо: x${gameData.combo}`);
        }, 500);
    } else {
        // Неправильный ответ
        gameData.combo = 1;
        setTimeout(() => {
            alert(`❌ Неправильно! Правильный ответ: ${gameData.currentQuestion.question.answers[correctIndex]}`);
        }, 500);
    }
    
    // Обновляем интерфейс
    updateUI();
    
    // Разрешаем возврат к категориям
    backToCategoriesBtn.disabled = false;
}

// Обновление интерфейса
function updateUI() {
    scoreElement.textContent = gameData.score;
    answeredElement.textContent = `${gameData.answeredQuestions}/${gameData.totalQuestions}`;
    comboElement.textContent = `${gameData.combo}x`;
    maxComboDisplay.textContent = `${gameData.maxCombo}x`;
    
    // Проверяем, завершена ли игра
    if (gameData.answeredQuestions >= gameData.totalQuestions) {
        setTimeout(showResults, 1000);
    }
}

// Обновление трекера категорий
function updateCategoriesTracker() {
    categoriesList.innerHTML = '';
    
    categories.forEach(category => {
        const categoryTag = document.createElement('div');
        categoryTag.className = 'category-tag';
        
        // Проверяем, была ли выбрана эта категория
        if (gameData.selectedCategories.has(category.id)) {
            categoryTag.classList.add('completed');
            
            // Проверяем, все ли вопросы в категории отвечены
            const allQuestionsAnswered = [0, 1, 2, 3, 4].every(level => 
                gameData.usedQuestions.has(`${category.id}-${level}`)
            );
            
            if (allQuestionsAnswered) {
                categoryTag.innerHTML = `<i class="fas fa-check-circle"></i> ${category.name} <span class="badge">✓</span>`;
                categoryTag.title = "Категория полностью пройдена";
            } else {
                categoryTag.innerHTML = `<i class="fas fa-play-circle"></i> ${category.name} <span class="badge">●</span>`;
                categoryTag.title = "Категория выбрана, но не все вопросы отвечены";
            }
        } else {
            categoryTag.innerHTML = `<i class="fas fa-circle"></i> ${category.name}`;
            categoryTag.title = "Категория еще не выбрана";
        }
        
        categoriesList.appendChild(categoryTag);
    });
}

// Показать подсказку
function showHint() {
    alert(gameData.currentHint);
    hintBtn.disabled = true;
}

// Вернуться к категориям
function backToCategories() {
    questionModal.style.display = 'none';
    createGameBoard(); // Обновляем игровое поле
    backToCategoriesBtn.disabled = true;
    
    // Проверяем, не завершена ли игра
    if (gameData.answeredQuestions >= gameData.totalQuestions) {
        setTimeout(showResults, 500);
    }
}

// Показать результаты
function showResults() {
    // Рассчитываем рейтинг
    let rating = "Новичок";
    const percentage = (gameData.correctAnswers / gameData.totalQuestions) * 100;
    
    if (percentage >= 90) {
        rating = "Математический гений! 🏆";
    } else if (percentage >= 75) {
        rating = "Отличник! 🌟";
    } else if (percentage >= 60) {
        rating = "Хорошист! 👍";
    } else if (percentage >= 40) {
        rating = "Нормально 👌";
    } else {
        rating = "Попробуй еще! 💪";
    }
    
    // Обновляем результаты
    finalScoreElement.textContent = gameData.score;
    correctCountElement.textContent = `${gameData.correctAnswers} из ${gameData.totalQuestions}`;
    maxComboElement.textContent = `${gameData.maxCombo}x`;
    ratingElement.textContent = rating;
    
    // Показываем модальное окно
    resultModal.style.display = 'flex';
}

// Показать/скрыть правила
function toggleRules() {
    rulesPanel.style.display = rulesPanel.style.display === 'block' ? 'none' : 'block';
}

// Поделиться результатом
function shareResult() {
    const text = `Я набрал ${gameData.score} баллов в математической игре! Правильных ответов: ${gameData.correctAnswers} из ${gameData.totalQuestions}. Максимальное комбо: ${gameData.maxCombo}x. Попробуй и ты!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Мой результат в Математическом вызове',
            text: text,
            url: window.location.href
        });
    } else {
        // Копируем в буфер обмена
        navigator.clipboard.writeText(text)
            .then(() => alert('Результат скопирован в буфер обмена! Можешь поделиться им с друзьями.'))
            .catch(() => alert('Скопируйте этот текст: ' + text));
    }
}

// Назначаем обработчики событий
resetBtn.addEventListener('click', initGame);
rulesBtn.addEventListener('click', toggleRules);
closeRulesBtn.addEventListener('click', toggleRules);
hintBtn.addEventListener('click', showHint);
closeModalBtn.addEventListener('click', () => {
    questionModal.style.display = 'none';
    createGameBoard();
});
backToCategoriesBtn.addEventListener('click', backToCategories);
playAgainBtn.addEventListener('click', initGame);
shareBtn.addEventListener('click', shareResult);

// Инициализируем игру при загрузке
document.addEventListener('DOMContentLoaded', initGame);

// Добавляем стили для бейджей
const style = document.createElement('style');
style.textContent = `
    .badge {
        background: #ffeb3b;
        color: #1a237e;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        margin-left: 8px;
        font-weight: bold;
    }
    
    .category-tag.completed .badge {
        background: #4caf50;
        color: white;
    }
`;
document.head.appendChild(style);
