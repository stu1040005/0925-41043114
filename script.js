let cardValues = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchedCards = 0;
let timerInterval;
let seconds = 0;

function getCardValues(type) {
    let values = [];
    if (type === 'animals') {
        values = [...Array(8).keys()]; // 动物类 0-7
    } else if (type === 'plants') {
        values = [...Array(8).keys()].map(i => i + 9); // 植物类 9-16
    }
    return [...values, ...values]; // 每个值成对
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCards() {
    const cardType = document.getElementById('cardType').value; // 获取当前选择的卡牌类型
    cardValues = getCardValues(cardType);
    shuffle(cardValues);
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        const imgFront = document.createElement('img');
        imgFront.src = 'images/9.png';
        cardFront.appendChild(imgFront);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        const imgBack = document.createElement('img');
        imgBack.src = `images/${value + 1}.png`; // 使用当前类型的图片
        cardBack.appendChild(imgBack);

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        cardContainer.appendChild(card);

        card.addEventListener('click', flipCard);
    });

    // 创建卡牌时，默认所有卡牌为背面状态
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped'); // 确保初始状态为背面
    });
}

function startGame() {
    seconds = 0; // 重置计时器
    matchedCards = 0;
    hasFlippedCard = false;
    lockBoard = false;
    document.getElementById('timer').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';

    createCards(); // 创建卡牌
    startTimer();

    // 游戏开始时显示所有卡牌为背面
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped'); // 确保初始状态为背面
    });

    // 设置定时器，10秒后翻转所有卡牌
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.add('flipped'); // 翻转所有卡牌正面
        });
    }, 10000); // 10秒后翻到正面

    document.getElementById('startButton').disabled = true; // 禁用开始按钮
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('time').innerText = seconds;
    }, 1000);
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-back img').src === secondCard.querySelector('.card-back img').src;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    matchedCards += 2;
    resetBoard();

    if (matchedCards === cardValues.length) {
        clearInterval(timerInterval);
        document.getElementById('timer').style.display = 'block';
        document.getElementById('restartButton').style.display = 'block';
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    firstCard = null;
    secondCard = null;
}

function restartGame() {
    startGame();
    document.getElementById('startButton').disabled = false; // 重新启用开始按钮
}

function showAllFront() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('flipped'); // 翻转所有卡牌正面
    });
}

function showAllBack() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped'); // 翻转所有卡牌背面
    });
}

// 页面加载时创建并显示卡牌
window.onload = createCards;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('showFrontButton').addEventListener('click', showAllFront);
document.getElementById('showBackButton').addEventListener('click', showAllBack);
