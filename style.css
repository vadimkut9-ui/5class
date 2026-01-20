/* Основные стили */
* {
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container {
    width: 100%;
    max-width: 900px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    padding: 40px;
    margin-top: 20px;
    animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Заголовок */
header {
    text-align: center;
    margin-bottom: 30px;
}

h1 {
    color: #2c3e50;
    font-size: 2.7rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
    color: #7f8c8d;
    font-size: 1.3rem;
    margin-bottom: 30px;
}

/* Информация об игре */
.game-info {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 40px;
    flex-wrap: wrap;
    border: 3px solid #e0e0e0;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.info-item {
    text-align: center;
    flex: 1;
    min-width: 150px;
    margin: 10px;
    padding: 15px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.info-item:hover {
    transform: translateY(-5px);
}

.info-label {
    font-size: 1rem;
    color: #7f8c8d;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.info-value {
    font-size: 2.2rem;
    font-weight: bold;
    color: #2c3e50;
}

/* Секции */
.section {
    margin-bottom: 30px;
    display: none;
    animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}

.active-section {
    display: block;
}

/* Кнопки выбора темы */
.topic-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    margin-bottom: 40px;
}

.topic-btn {
    padding: 18px 25px;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    flex: 1;
    min-width: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
}

.topic-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #2980b9 0%, #2573a7 100%);
}

.topic-btn.active {
    background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.topic-btn i {
    font-size: 1.3rem;
}

/* Контейнер вопроса */
.question-container {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 30px;
    text-align: center;
    border: 3px solid #e0e0e0;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.question {
    font-size: 1.8rem;
    margin-bottom: 30px;
    color: #2c3e50;
    font-weight: 600;
    line-height: 1.4;
}

/* Контейнер ответов */
.answers {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.answer-btn {
    padding: 18px 25px;
    background-color: white;
    border: 3px solid #dfe6e9;
    border-radius: 12px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s;
    flex: 1;
    min-width: 200px;
    max-width: 250px;
    font-weight: 500;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.answer-btn:hover {
    border-color: #3498db;
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(52, 152, 219, 0.2);
    background-color: #f8fafc;
}

.answer-btn.correct {
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    color: white;
    border-color: #27ae60;
    box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
}

.answer-btn.wrong {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
    border-color: #c0392b;
    box-shadow: 0 6px 12px rgba(231, 76, 60, 0.3);
}

.answer-btn:disabled {
    cursor: not-allowed;
    opacity: 0.8;
}

/* Прогресс бар */
.progress-bar {
    width: 100%;
    height: 25px;
    background-color: #ecf0f1;
    border-radius: 12px;
    margin: 30px 0;
    overflow: hidden;
    border: 2px solid #d5dbdb;
}

.progress {
    height: 100%;
    background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
    width: 0%;
    transition: width 0.5s;
    border-radius: 10px;
}

/* Кнопки управления */
.controls {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    gap: 20px;
}

.control-btn {
    padding: 16px 35px;
    background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex: 1;
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.control-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    background: linear-gradient(135deg, #1a252f 0%, #0d1318 100%);
}

.control-btn:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Результаты */
.result {
    text-align: center;
    padding: 40px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    margin-top: 20px;
    border: 3px solid #e0e0e0;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    animation: resultAppear 0.8s ease-out;
}

@keyframes resultAppear {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

.result h3 {
    color: #2c3e50;
    margin-bottom: 25px;
    font-size: 2.2rem;
}

.result p {
    font-size: 1.3rem;
    margin: 15px 0;
    color: #34495e;
}

.result p i {
    color: #3498db;
    width: 25px;
}

#result-message {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 30px 0;
    padding: 20px;
    background-color: white;
    border-radius: 12px;
    border-left: 5px solid #3498db;
}

/* Адаптивность */
@media (max-width: 768px) {
    .container {
        padding: 20px;
        margin-top: 10px;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .subtitle {
        font-size: 1.1rem;
    }
    
    .game-info {
        flex-direction: column;
        align-items: center;
        padding: 15px;
    }
    
    .info-item {
        min-width: 100%;
    }
    
    .topic-btn, .answer-btn {
        min-width: 100%;
        max-width: 100%;
    }
    
    .controls {
        flex-direction: column;
    }
    
    .question {
        font-size: 1.5rem;
    }
    
    .result {
        padding: 25px;
    }
    
    .result h3 {
        font-size: 1.8rem;
    }
    
    .result p {
        font-size: 1.1rem;
    }
}

/* Иконки */
.fa-fraction {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.fa-brackets-curly:before {
    content: "{ }";
    font-weight: bold;
}
