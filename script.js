let playerMarker = "";
let opponentMarker = "";
let opponentType = "";
let difficulty = "";
let board = Array(9).fill(null);
let currentPlayer = 'player';
let gameActive = false;

const startBtn = document.querySelector('.start-btn');
const difficultySelection = document.querySelector('.difficulty-btn');
const setupScreen = document.querySelector('.setup-screen');
const gameBoard = document.querySelector('.board');
const statusDisplay = document.querySelector('.status');
const cells = document.querySelectorAll('.cell');

function selectMarker(marker) {
    playerMarker = marker;
    opponentMarker = playerMarker === "X" ? "O":"X";
    checkStartReady();
}

function selectOpponent(type){
    opponentType = type;
    if(opponentType = "bot"){
        difficultySelection.style.display = "block";
    } else {
        difficultySelection.style.display = "none";
    }
    checkStartReady();

}

function selectDifficulty(level){
    difficulty = level;
    checkStartReady();
}

function checkStartReady(){
    if(playerMarker && opponentType && gameActive === false){
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }

}

function startGame(){
    setupScreen.style.display = 'none';
    gameBoard.style.display = 'block';
    board = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled') 
    });
    gameActive = true;
    currentPlayer = 'player';
    updateStatus(`${playerMarker}'s turn`);
}

function updateStatus(message){
     statusDisplay.textContent = message;
}

function makeMove(index){
    
}




    
