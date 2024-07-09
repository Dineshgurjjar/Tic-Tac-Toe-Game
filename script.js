document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const resetButton = document.getElementById('resetButton');
    const undoButton = document.getElementById('undoButton');
    const startButton = document.getElementById('startButton');
    const message = document.getElementById('message');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const playerXNameInput = document.getElementById('playerXName');
    const playerONameInput = document.getElementById('playerOName');
    const boardSizeSelect = document.getElementById('boardSize');
    const themeButtonLight = document.getElementById('themeButtonLight');
    const themeButtonDark = document.getElementById('themeButtonDark');
    const toggleComputerMode = document.getElementById('toggleComputerMode');

    let board = [];
    let currentPlayer = 'X';
    let scores = { 'X': 0, 'O': 0 };
    let history = [];
    let boardSize = 3;
    let playerXName = 'Player X';
    let playerOName = 'Player O';
    let computerMode = false;

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    undoButton.addEventListener('click', undoMove);
    themeButtonLight.addEventListener('click', () => changeTheme('light'));
    themeButtonDark.addEventListener('click', () => changeTheme('dark'));
    toggleComputerMode.addEventListener('click', toggleComputer);
    const moveSound = new Audio('move.mp3');
const winSound = new Audio('win.mp3');

    function startGame() {
        moveSound.play();
        winSound.pause()
        playerXName = playerXNameInput.value || 'Player X';
        playerOName = playerONameInput.value || 'Player O';
        boardSize = parseInt(boardSizeSelect.value, 10);
        initializeBoard();
        updateScoreboard();
        message.textContent = `${currentPlayer === 'X' ? playerXName : playerOName}'s turn`;
    }

    function initializeBoard() {
        board = Array(boardSize * boardSize).fill(null);
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        for (let i = 0; i < board.length; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', makeMove);
            gameBoard.appendChild(cell);
        }
    }

   

function makeMove(event) {
    const index = event.target.dataset.index;
    if (board[index] || checkWinner()) return;

    board[index] = currentPlayer;
    history.push(index);
    event.target.textContent = currentPlayer;
    event.target.classList.add('active');
    moveSound.play();

    if (checkWinner()) {
        highlightWinner();
        message.textContent = `${currentPlayer === 'X' ? playerXName : playerOName} wins!`;
        winSound.play();
        moveSound.pause();
        scores[currentPlayer]++;
        updateScoreboard();
    } else if (board.every(cell => cell)) {
        message.textContent = "It's a tie!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `${currentPlayer === 'X' ? playerXName : playerOName}'s turn`;

        if (currentPlayer === 'O' && computerMode) {
            setTimeout(makeComputerMove, 500);
        }
    }
}

    function makeComputerMove() {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (!cell) acc.push(index);
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const index = emptyCells[randomIndex];
        
        board[index] = 'O';
        history.push(index);
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.textContent = 'O';
        cell.classList.add('active');

        if (checkWinner()) {
            highlightWinner();
            message.textContent = `${playerOName} wins!`;
            scores['O']++;
            updateScoreboard();
        } else if (board.every(cell => cell)) {
            message.textContent = "It's a tie!";
        } else {
            currentPlayer = 'X';
            message.textContent = `${playerXName}'s turn`;
        }
    }

    function checkWinner() {
        const winPatterns = getWinPatterns(boardSize);
        return winPatterns.some(pattern => pattern.every(index => board[index] === currentPlayer));
    }

    function highlightWinner() {
        const winPatterns = getWinPatterns(boardSize);
        winPatterns.forEach(pattern => {
            if (pattern.every(index => board[index] === currentPlayer)) {
                pattern.forEach(index => {
                    document.querySelector(`.cell[data-index='${index}']`).classList.add('win');
                });
            }
        });
    }

    function getWinPatterns(size) {
        const patterns = [];
        for (let i = 0; i < size; i++) {
            const row = Array.from({ length: size }, (_, j) => i * size + j);
            const col = Array.from({ length: size }, (_, j) => i + j * size);
            patterns.push(row, col);
        }
        const diag1 = Array.from({ length: size }, (_, i) => i * size + i);
        const diag2 = Array.from({ length: size }, (_, i) => (i + 1) * (size - 1));
        patterns.push(diag1, diag2);
        return patterns;
    }

    function updateScoreboard() {
        scoreX.textContent = scores['X'];
        scoreO.textContent = scores['O'];
    }

    function resetGame() {
        winSound.pause();
        moveSound.pause();
        board = [];
        currentPlayer = 'X';
        history = [];
        initializeBoard();
        updateScoreboard();
        message.textContent = `${playerXName}'s turn`;
    }

    function undoMove() {
        if (history.length === 0) return;
        const index = history.pop();
        board[index] = null;
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.textContent = '';
        cell.classList.remove('active', 'win');
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `${currentPlayer === 'X' ? playerXName : playerOName}'s turn`;
    }

    function changeTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    function toggleComputer() {
        computerMode = !computerMode;
        toggleComputerMode.textContent = `Computer Mode: ${computerMode ? 'On' : 'Off'}`;
    }
});
