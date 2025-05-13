let playerMarker = "";
let opponentMarker = "";
let opponentType = "";
let difficulty = "";
let board = Array(9).fill(null);
let currentPlayer = 'player';
let gameActive = false;

const startBtn = document.querySelector('.start-btn');
const difficultySelection = document.getElementById('difficultySelection');
const setupScreen = document.querySelector('.setup-screen');
const gameBoard = document.getElementById('gameBoard');
const statusDisplay = document.querySelector('.status');
const cells = document.querySelectorAll('.cell');

function selectMarker(marker) {
    playerMarker = marker;
    opponentMarker = playerMarker === "X" ? "O":"X";
    checkStartReady();
}

function selectOpponent(type){
    opponentType = type;
    if(opponentType === "bot"){
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
    if(playerMarker && opponentType && (opponentType !== "bot" || difficulty)){
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

function makeMove(index) {
    if (!gameActive || board[index] !== null || (opponentType === 'bot' && currentPlayer === 'bot')) return;

    board[index] = currentPlayer === 'player' ? playerMarker : opponentMarker;
    cells[index].textContent = board[index];
    cells[index].classList.add('disabled');

    if (checkWinner(board[index])) {
        updateStatus(`${board[index]} Wins!`);
        gameActive = false;
        return;
    } else if (board.every(cell => cell !== null)) {
        updateStatus("It's a Draw!");
        gameActive = false;
        return;
    }

    if (opponentType === 'bot') {
        currentPlayer = 'bot';
        updateStatus("Bot's Turn...");
        setTimeout(botMove, 500);
    } else {
        currentPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
        updateStatus(`${(currentPlayer === 'player' ? playerMarker : opponentMarker)}'s Turn`);
    }
}

function botMove(){
    if (!gameActive) return;
    
    let move;
    if(difficulty === "easy"){
        move = getRandomMove();
    } else {
        move = getSmartMove();
    }

    // Check if move is valid
    if (move === undefined || board[move] !== null) {
        move = getRandomMove(); // Fallback to random move if smart move fails
    }

    if (move === undefined) return; // No valid moves left

    board[move] = opponentMarker;
    cells[move].textContent = opponentMarker;
    cells[move].classList.add("disabled");

    if(checkWinner(opponentMarker)){
        updateStatus(`${opponentMarker} Wins!`);
        gameActive = false;
        return;
    } else if(board.every(cell => cell !== null)){
        updateStatus("It's a Draw!");
        gameActive = false;
        return;
    }

    currentPlayer = 'player';
    updateStatus(`${playerMarker}'s turn`);
}

function getRandomMove() {
    const empty = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function getSmartMove() {
    // Check if there are any empty cells
    const emptyCells = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
    if (emptyCells.length === 0) return undefined;

    let bestScore = -Infinity;
    let move;
    
    // If it's the first move, make it more interesting by not always choosing the same spot
    if (emptyCells.length === 8) {
        const firstMoves = [0, 2, 4, 6, 8]; // Corners and center
        return firstMoves[Math.floor(Math.random() * firstMoves.length)];
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = opponentMarker;
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(newBoard, depth, isMaximizing) {
    const scores = {
        [opponentMarker]: 10 - depth, // Slightly prefer winning in fewer moves
        [playerMarker]: -10 + depth,  // Slightly prefer losing in more moves
        tie: 0
    };

    let winner = getWinner(newBoard);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = opponentMarker;
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = playerMarker;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner(boardState = board) {
    const winCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    for (const combo of winCombos) {
        const [a,b,c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    if (boardState.every(cell => cell !== null)) return 'tie';
    return null;
}

function checkWinner(marker) {
    return getWinner() === marker;
}

function resetGame() {
    setupScreen.style.display = 'block';
    gameBoard.style.display = 'none';
    board = Array(9).fill(null);
    playerMarker = '';
    opponentMarker = '';
    opponentType = '';
    difficulty = '';
    gameActive = false;
    startBtn.disabled = true;
    difficultySelection.style.display = 'none';
}




    
