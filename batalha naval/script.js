const boardeasy = document.getElementById('boardeasy');
const boardhard = document.getElementById('boardhard');
const resultDisplay = document.getElementById('result');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('score');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const historyList = document.getElementById('historyList');
const playerHitsDisplay = document.getElementById('playerHits');
const playerMissesDisplay = document.getElementById('playerMisses');

let computerShips = [];
let playerHits = 0;
let playerMisses = 0; 
let computerHits = 0;
let playerBoard = [];
let computerGuesses = new Set();
let totalShips = 3; 
let playerScore = 0;
let computerScore = 0;
let gameActive = true; 
let boardSize = 5; 

function placeComputerShips() {
    computerShips = []; 
    while (computerShips.length < totalShips) {
        let newShip = Math.floor(Math.random() * (boardSize * boardSize));
        if (!computerShips.includes(newShip)) {
            computerShips.push(newShip);
        }
    }
}


function createBoard() {
    const board = difficultySelect.value === 'easy' ? boardeasy : boardhard;
    board.innerHTML = ''; 
    playerBoard = Array(boardSize * boardSize).fill(null); 

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handlePlayerClick);
        board.appendChild(cell);
    }
}


function revealCells() {
    const board = difficultySelect.value === 'easy' ? boardeasy : boardhard;
    for (let i = 0; i < board.children.length; i++) {
        const cell = board.children[i];
        if (computerShips.includes(i)) {
            cell.classList.add('hit'); 
        } else {
            cell.classList.add('miss'); 
        }
    }
}


function handlePlayerClick(e) {
    if (!gameActive) return; 

    const index = e.target.dataset.index;

    if (playerBoard[index] !== null) {
        alert('Você já tentou esta posição! Escolha outra.');
        return;
    }

    playerBoard[index] = 'miss';
    if (computerShips.includes(parseInt(index))) {
        e.target.classList.add('hit');
        resultDisplay.textContent = 'Você acertou!';
        playerHits++;
        playerScore += 1000;
    } else {
        e.target.classList.add('miss');
        resultDisplay.textContent = 'Você errou!';
        playerMisses++; 
        playerScore -= 50; 
    }

    e.target.removeEventListener('click', handlePlayerClick);
    
   
    scoreDisplay.style.display = 'block';
    playerScoreDisplay.textContent = playerScore; 
    playerHitsDisplay.textContent = playerHits; 
    playerMissesDisplay.textContent = playerMisses; 

   
    if (playerHits === totalShips) {
        resultDisplay.textContent = 'Você ganhou!';
        gameActive = false; 
        revealCells(); 
        return;
    }

    
    computerTurn();
}
function computerTurn() {
    if (!gameActive) return; 

    let computerGuess;
    do {
        computerGuess = Math.floor(Math.random() * (boardSize * boardSize));
    } while (computerGuesses.has(computerGuess));

    computerGuesses.add(computerGuess);
    const board = difficultySelect.value === 'easy' ? boardeasy : boardhard;
    const computerCell = board.children[computerGuess];

   
    const guessText = `Máquina tentou a posição ${computerGuess}. `;
    historyList.innerHTML += `<li>${guessText}</li>`;

    if (computerShips.includes(computerGuess)) {
        computerHits++;
        computerScore += 1000; 
        resultDisplay.textContent += ' A máquina acertou!';
    } else {
        computerScore -= 50; 
        resultDisplay.textContent += ' A máquina errou!';
    }

   
    computerScoreDisplay.textContent = computerScore; 
    
    if (computerHits === totalShips) {
        resultDisplay.textContent += ' A máquina ganhou!';
        gameActive = false; 
        revealCells(); 
    }
}


function resetGame() {
    playerHits = 0;
    playerMisses = 0; 
    computerHits = 0;
    playerScore = 0;
    computerScore = 0;
    gameActive = true; 
    scoreDisplay.style.display = 'none'; 

    
    if (difficultySelect.value === 'easy') {
        totalShips = 5;
        boardSize = 5; 
        boardeasy.style.display = 'grid'; 
        boardhard.style.display = 'none'; 
    } else {
        totalShips = 10;
        boardSize = 10;
        boardhard.style.display = 'grid'; 
        boardeasy.style.display = 'none';
    }

    placeComputerShips();
    createBoard();
    resultDisplay.textContent = '';
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    playerHitsDisplay.textContent = playerHits;
    playerMissesDisplay.textContent = playerMisses; 
    historyList.innerHTML = '';
}

startButton.addEventListener('click', resetGame);

difficultySelect.addEventListener('change', function() {
    const difficulty = this.value === 'easy' ? 'Fácil' : 'Difícil';
    alert(`Dificuldade escolhida: ${difficulty}`);
    resetGame();
});

resetGame();