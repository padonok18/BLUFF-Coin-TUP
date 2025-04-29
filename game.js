// Переменные мини-игры
let gameActive = false;
let gameScore = 0;
let gameTimeLeft = 30;
let gameInterval = null;
let coinInterval = null;

function initMiniGame() {
    if (lastDailyClaim && isSameDay(lastDailyClaim, new Date())) {
        alert('Вы уже проходили челлендж сегодня!');
        return;
    }

    // Создаем контейнер для мини-игры
    const gameContainer = document.createElement('div');
    gameContainer.id = 'daily-challenge-container';
    gameContainer.style.position = 'fixed';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    gameContainer.style.zIndex = '1000';
    gameContainer.style.display = 'flex';
    gameContainer.style.flexDirection = 'column';
    gameContainer.style.alignItems = 'center';
    gameContainer.style.justifyContent = 'center';
    
    // Добавляем элементы интерфейса
    gameContainer.innerHTML = `
        <h2>Ежедневный челлендж</h2>
        <div id="timer" style="font-size: 24px; margin: 20px 0;">30</div>
        <div>Счет: <span id="score">0</span></div>
        <div id="game-area" style="position: relative; width: 100%; height: 80%; overflow: hidden;"></div>
        <button id="close-challenge" style="margin-top: 20px; padding: 10px 20px;">Закрыть</button>
    `;
    
    document.body.appendChild(gameContainer);
    
    // Устанавливаем переменные игры
    gameActive = true;
    gameScore = 0;
    gameTimeLeft = 30;
    
    // Обновляем таймер
    document.getElementById('timer').textContent = gameTimeLeft;
    document.getElementById('score').textContent = gameScore;
    
    // Запускаем таймер
    gameInterval = setInterval(updateGame, 1000);
    
    // Запускаем генерацию монет
    generateCoin();
    
    // Обработчик закрытия
    document.getElementById('close-challenge').addEventListener('click', endMiniGame);
}

function updateGame() {
    gameTimeLeft--;
    const timer = document.getElementById('timer');
    if (timer) timer.textContent = gameTimeLeft;
    
    if (gameTimeLeft <= 0) {
        endMiniGame();
    }
}

function generateCoin() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    const coinSize = 40;
    const xPos = Math.random() * (gameArea.offsetWidth - coinSize);
    
    const coin = document.createElement('div');
    coin.className = 'falling-coin';
    coin.style.position = 'absolute';
    coin.style.left = `${xPos}px`;
    coin.style.top = '0';
    coin.style.width = `${coinSize}px`;
    coin.style.height = `${coinSize}px`;
    coin.style.backgroundImage = 'url("coin.png")';
    coin.style.backgroundSize = 'contain';
    coin.style.cursor = 'pointer';
    
    coin.addEventListener('click', () => {
        gameScore += 20; // Даем x20 токенов за клик
        const score = document.getElementById('score');
        if (score) score.textContent = gameScore;
        gameArea.removeChild(coin);
    });
    
    gameArea.appendChild(coin);
    
    // Анимация падения
    let fallInterval = setInterval(() => {
        const currentTop = parseInt(coin.style.top) || 0;
        coin.style.top = `${currentTop + 5}px`;
        
        // Если монета достигла низа
        if (currentTop > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            if (gameArea.contains(coin)) {
                gameArea.removeChild(coin);
            }
        }
    }, 50);
    
    // Генерируем следующую монету через случайный интервал
    setTimeout(generateCoin, Math.random() * 800 + 200);
}

function endMiniGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(coinInterval);
    
    // Начисляем награду
    tokens += gameScore;
    lastDailyClaim = new Date();
    
    // Удаляем контейнер
    const container = document.getElementById('daily-challenge-container');
    if (container) container.remove();
    
    // Сохраняем и обновляем UI
    saveGameData();
    updateUI();
    
    alert(`Челлендж завершен! Вы заработали ${gameScore} токенов.`);
}