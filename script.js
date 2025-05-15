// script.js
(() => {
    // ====== Game Class ======
    class Game {
      constructor(playerMarker, opponentType, difficulty) {
        this.playerMarker   = playerMarker;
        this.opponentMarker = playerMarker === 'X' ? 'O' : 'X';
        this.opponentType   = opponentType;
        this.difficulty     = difficulty;
        this.board          = Array(9).fill(null);
        this.currentPlayer  = 'X';
        this.gameActive     = true;
      }
  
      makeMove(idx) {
        if (!this.gameActive || this.board[idx]) return;
        this.board[idx] = this.currentPlayer;
        renderBoard();
  
        if (checkWinner(this.board, this.currentPlayer)) {
          this.end(`${this.currentPlayer} Wins!`);
          return;
        }
        if (!this.board.includes(null)) {
          this.end("It's a Draw!");
          return;
        }
  
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.opponentType === 'bot' && this.currentPlayer === this.opponentMarker) {
          setTimeout(botMove, 300);
        }
      }
  
      reset() {
        this.board         = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive    = true;
        statusDiv.textContent = '';
        renderBoard();
      }
  
      end(message) {
        this.gameActive = false;
        statusDiv.textContent = message;
      }
    }
  
    // ====== Controller Closure ======
    const GameController = (() => {
      let game = null;
      return {
        createGame(marker, opponent, difficulty) {
          game = new Game(marker, opponent, difficulty);
        },
        getGame() {
          return game;
        },
        makeMove(idx) {
          game.makeMove(idx);
        },
        resetGame() {
          game.reset();
        }
      };
    })();
  
    // ====== Cached DOM ======
    const statusDiv       = document.getElementById('status');
    const setupScreen     = document.getElementById('setupScreen');
    const gameBoard       = document.getElementById('gameBoard');
    const markerBtns      = document.querySelectorAll('.marker-btn');
    const opponentBtns    = document.querySelectorAll('.opponent-btn');
    const difficultyBtns  = document.querySelectorAll('.difficulty-btn');
    const difficultySec   = document.getElementById('difficultySelection');
    const startBtn        = document.querySelector('.start-btn');
    const cells           = document.querySelectorAll('.cell');
  
    // ====== Helpers ======
    function clearAndSelect(list, btn) {
      list.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    }
  
    function enableStart(marker, opponent, difficulty) {
      startBtn.disabled = !(marker && opponent && (opponent === 'player' || difficulty));
    }
  
    function renderBoard() {
      const g = GameController.getGame();
      cells.forEach((c,i) => c.textContent = g.board[i] || '');
      if (g.gameActive) {
        statusDiv.textContent = `Turn: ${g.currentPlayer}`;
      }
    }
  
    function checkWinner(board, m) {
      const W = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return W.some(c => c.every(i => board[i] === m));
    }
  
    function botMove() {
      const g = GameController.getGame();
      const avail = g.board.map((v,i) => v===null? i: null).filter(i=>i!==null);
      const idx = g.difficulty === 'easy'
        ? avail[Math.floor(Math.random()*avail.length)]
        : minimaxMove();
      GameController.makeMove(idx);
    }
  
    function minimaxMove() {
      const g = GameController.getGame();
      return solve(g.board, g.opponentMarker, g.playerMarker, true).index;
    }
    function solve(bd, botM, plM, max) {
      if (checkWinner(bd, botM))    return { score:  1 };
      if (checkWinner(bd, plM))     return { score: -1 };
      if (!bd.includes(null))       return { score:  0 };
  
      let best = max 
        ? { score: -Infinity }
        : { score:  Infinity };
  
      bd.forEach((v,i) => {
        if (v===null) {
          bd[i] = max ? botM : plM;
          const res = solve(bd, botM, plM, !max);
          bd[i] = null;
          if ((max && res.score > best.score) ||
              (!max && res.score < best.score)) {
            best = { score: res.score, index: i };
          }
        }
      });
      return best;
    }
  
    // ====== Global Functions for Inline Handlers ======
    window.makeMove   = idx => GameController.makeMove(idx);
    window.resetGame  = ()  => GameController.resetGame();
  
    // ====== Setup Event Wiring ======
    document.addEventListener('DOMContentLoaded', () => {
      let selMarker, selOpponent, selDiff;
  
      markerBtns.forEach(btn => btn.addEventListener('click', () => {
        selMarker = btn.dataset.marker;
        clearAndSelect(markerBtns, btn);
        enableStart(selMarker, selOpponent, selDiff);
      }));
  
      opponentBtns.forEach(btn => btn.addEventListener('click', () => {
        selOpponent = btn.dataset.opponent;
        clearAndSelect(opponentBtns, btn);
        difficultySec.style.display = selOpponent === 'bot' ? 'block' : 'none';
        enableStart(selMarker, selOpponent, selDiff);
      }));
  
      difficultyBtns.forEach(btn => btn.addEventListener('click', () => {
        selDiff = btn.dataset.difficulty;
        clearAndSelect(difficultyBtns, btn);
        enableStart(selMarker, selOpponent, selDiff);
      }));
  
      startBtn.addEventListener('click', () => {
        GameController.createGame(selMarker, selOpponent, selDiff);
        setupScreen.style.display = 'none';
        gameBoard.style.display   = 'block';
        renderBoard();
      });
    });
  })();
  
  







// let playerMarker = "";
// let opponentMarker = "";
// let opponentType = "";
// let difficulty = "";
// let board = Array(9).fill(null);
// let currentPlayer = 'player';
// let gameActive = false;

// const startBtn = document.querySelector('.start-btn');
// const difficultySelection = document.getElementById('difficultySelection');
// const setupScreen = document.querySelector('.setup-screen');
// const gameBoard = document.getElementById('gameBoard');
// const statusDisplay = document.querySelector('.status');
// const cells = document.querySelectorAll('.cell');

// function selectMarker(marker) {
//     playerMarker = marker;
//     opponentMarker = playerMarker === "X" ? "O":"X";
//     checkStartReady();
// }

// function selectOpponent(type){
//     opponentType = type;
//     if(opponentType === "bot"){
//         difficultySelection.style.display = "block";
//     } else {
//         difficultySelection.style.display = "none";
//     }
//     checkStartReady();

// }

// function selectDifficulty(level){
//     difficulty = level;
//     checkStartReady();
// }

// function checkStartReady(){
//     if(playerMarker && opponentType && (opponentType !== "bot" || difficulty)){
//         startBtn.disabled = false;
//     } else {
//         startBtn.disabled = true;
//     }

// }

// function startGame(){
//     setupScreen.style.display = 'none';
//     gameBoard.style.display = 'block';
//     board = Array(9).fill(null);
//     cells.forEach(cell => {
//         cell.textContent = '';
//         cell.classList.remove('disabled')
//     });
//     gameActive = true;
//     currentPlayer = 'player';
//     updateStatus(`${playerMarker}'s turn`);
// }

// function updateStatus(message){
//      statusDisplay.textContent = message;
// }

// function makeMove(index) {
//     if (!gameActive || board[index] !== null || (opponentType === 'bot' && currentPlayer === 'bot')) return;

//     board[index] = currentPlayer === 'player' ? playerMarker : opponentMarker;
//     cells[index].textContent = board[index];
//     cells[index].classList.add('disabled');

//     if (checkWinner(board[index])) {
//         updateStatus(`${board[index]} Wins!`);
//         gameActive = false;
//         return;
//     } else if (board.every(cell => cell !== null)) {
//         updateStatus("It's a Draw!");
//         gameActive = false;
//         return;
//     }

//     if (opponentType === 'bot') {
//         currentPlayer = 'bot';
//         updateStatus("Bot's Turn...");
//         setTimeout(botMove, 500);
//     } else {
//         currentPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
//         updateStatus(`${(currentPlayer === 'player' ? playerMarker : opponentMarker)}'s Turn`);
//     }
// }

// function botMove(){
//     if (!gameActive) return;

//     let move;
//     if(difficulty === "easy"){
//         move = getRandomMove();
//     } else {
//         move = getSmartMove();
//     }

//     // Check if move is valid
//     if (move === undefined || board[move] !== null) {
//         move = getRandomMove(); // Fallback to random move if smart move fails
//     }

//     if (move === undefined) return; // No valid moves left

//     board[move] = opponentMarker;
//     cells[move].textContent = opponentMarker;
//     cells[move].classList.add("disabled");

//     if(checkWinner(opponentMarker)){
//         updateStatus(`${opponentMarker} Wins!`);
//         gameActive = false;
//         return;
//     } else if(board.every(cell => cell !== null)){
//         updateStatus("It's a Draw!");
//         gameActive = false;
//         return;
//     }

//     currentPlayer = 'player';
//     updateStatus(`${playerMarker}'s turn`);
// }

// function getRandomMove() {
//     const empty = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
//     return empty[Math.floor(Math.random() * empty.length)];
// }

// function getSmartMove() {
//     // Check if there are any empty cells
//     const emptyCells = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
//     if (emptyCells.length === 0) return undefined;

//     let bestScore = -Infinity;
//     let move;

//     // If it's the first move, make it more interesting by not always choosing the same spot
//     if (emptyCells.length === 8) {
//         const firstMoves = [0, 2, 4, 6, 8]; // Corners and center
//         return firstMoves[Math.floor(Math.random() * firstMoves.length)];
//     }

//     for (let i = 0; i < board.length; i++) {
//         if (board[i] === null) {
//             board[i] = opponentMarker;
//             let score = minimax(board, 0, false);
//             board[i] = null;
//             if (score > bestScore) {
//                 bestScore = score;
//                 move = i;
//             }
//         }
//     }
//     return move;
// }

// function minimax(newBoard, depth, isMaximizing) {
//     const scores = {
//         [opponentMarker]: 10 - depth, // Slightly prefer winning in fewer moves
//         [playerMarker]: -10 + depth,  // Slightly prefer losing in more moves
//         tie: 0
//     };

//     let winner = getWinner(newBoard);
//     if (winner !== null) {
//         return scores[winner];
//     }

//     if (isMaximizing) {
//         let bestScore = -Infinity;
//         for (let i = 0; i < newBoard.length; i++) {
//             if (newBoard[i] === null) {
//                 newBoard[i] = opponentMarker;
//                 let score = minimax(newBoard, depth + 1, false);
//                 newBoard[i] = null;
//                 bestScore = Math.max(score, bestScore);
//             }
//         }
//         return bestScore;
//     } else {
//         let bestScore = Infinity;
//         for (let i = 0; i < newBoard.length; i++) {
//             if (newBoard[i] === null) {
//                 newBoard[i] = playerMarker;
//                 let score = minimax(newBoard, depth + 1, true);
//                 newBoard[i] = null;
//                 bestScore = Math.min(score, bestScore);
//             }
//         }
//         return bestScore;
//     }
// }

// function getWinner(boardState = board) {
//     const winCombos = [
//         [0,1,2], [3,4,5], [6,7,8],
//         [0,3,6], [1,4,7], [2,5,8],
//         [0,4,8], [2,4,6]
//     ];
//     for (const combo of winCombos) {
//         const [a,b,c] = combo;
//         if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
//             return boardState[a];
//         }
//     }
//     if (boardState.every(cell => cell !== null)) return 'tie';
//     return null;
// }

// function checkWinner(marker) {
//     return getWinner() === marker;
// }

// function resetGame() {
//     setupScreen.style.display = 'block';
//     gameBoard.style.display = 'none';
//     board = Array(9).fill(null);
//     playerMarker = '';
//     opponentMarker = '';
//     opponentType = '';
//     difficulty = '';
//     gameActive = false;
//     startBtn.disabled = true;
//     difficultySelection.style.display = 'none';
// }

const GameController = {
    createGame(playerMarker, opponentType, difficulty) {
        this.playerMarker = playerMarker;
        this.opponentMarker = playerMarker === "X" ? "O" : "X";
        this.opponentType = opponentType;
        this.difficulty = difficulty;
        this.board = Array(9).fill(null);
        this.currentPlayer = 'player';
        this.gameActive = true;
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('disabled');
        });
        
        this.updateStatus(`${this.playerMarker}'s turn`);
    }
};

function makeMove(index) {
    if (!GameController.gameActive || GameController.board[index] !== null || 
        (GameController.opponentType === 'bot' && GameController.currentPlayer === 'bot')) return;

    GameController.board[index] = GameController.currentPlayer === 'player' ? 
        GameController.playerMarker : GameController.opponentMarker;
    
    const cells = document.querySelectorAll('.cell');
    cells[index].textContent = GameController.board[index];
    cells[index].classList.add('disabled');

    if (checkWinner(GameController.board[index])) {
        updateStatus(`${GameController.board[index]} Wins!`);
        GameController.gameActive = false;
        return;
    } else if (GameController.board.every(cell => cell !== null)) {
        updateStatus("It's a Draw!");
        GameController.gameActive = false;
        return;
    }

    if (GameController.opponentType === 'bot') {
        GameController.currentPlayer = 'bot';
        updateStatus("Bot's Turn...");
        setTimeout(botMove, 500);
    } else {
        GameController.currentPlayer = GameController.currentPlayer === 'player' ? 'opponent' : 'player';
        updateStatus(`${(GameController.currentPlayer === 'player' ? GameController.playerMarker : GameController.opponentMarker)}'s Turn`);
    }
}

function updateStatus(message) {
    document.querySelector('.status').textContent = message;
}

function checkWinner(marker) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => GameController.board[index] === marker);
    });
}

function botMove() {
    if (!GameController.gameActive) return;

    let move;
    if (GameController.difficulty === "easy") {
        move = getRandomMove();
    } else {
        move = getSmartMove();
    }

    if (move === undefined || GameController.board[move] !== null) {
        move = getRandomMove();
    }

    if (move === undefined) return;

    GameController.board[move] = GameController.opponentMarker;
    const cells = document.querySelectorAll('.cell');
    cells[move].textContent = GameController.opponentMarker;
    cells[move].classList.add("disabled");

    if (checkWinner(GameController.opponentMarker)) {
        updateStatus(`${GameController.opponentMarker} Wins!`);
        GameController.gameActive = false;
        return;
    } else if (GameController.board.every(cell => cell !== null)) {
        updateStatus("It's a Draw!");
        GameController.gameActive = false;
        return;
    }

    GameController.currentPlayer = 'player';
    updateStatus(`${GameController.playerMarker}'s turn`);
}

function getRandomMove() {
    const empty = GameController.board.map((val, i) => val === null ? i : null).filter(i => i !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function getSmartMove() {
    const emptyCells = GameController.board.map((val, i) => val === null ? i : null).filter(i => i !== null);
    if (emptyCells.length === 0) return undefined;

    let bestScore = -Infinity;
    let move;

    if (emptyCells.length === 8) {
        const firstMoves = [0, 2, 4, 6, 8];
        return firstMoves[Math.floor(Math.random() * firstMoves.length)];
    }

    for (let i = 0; i < GameController.board.length; i++) {
        if (GameController.board[i] === null) {
            GameController.board[i] = GameController.opponentMarker;
            let score = minimax(GameController.board, 0, false);
            GameController.board[i] = null;
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
        [GameController.opponentMarker]: 10 - depth,
        [GameController.playerMarker]: -10 + depth,
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
                newBoard[i] = GameController.opponentMarker;
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
                newBoard[i] = GameController.playerMarker;
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(cell => cell !== null)) {
        return 'tie';
    }

    return null;
}

function resetGame() {
    document.getElementById("setupScreen").style.display = "block";
    document.getElementById("gameBoard").style.display = "none";
    document.querySelector('.start-btn').disabled = true;
    document.querySelectorAll('.marker-btn, .opponent-btn, .difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}
