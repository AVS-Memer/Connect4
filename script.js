const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

let currentPlayer = 'Red';
let gameActive = true;
let boardState = Array(42).fill(''); // 7 columns * 6 rows = 42

// Setup the DOM Grid elements once
function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 42; i++) {
        const cell = document.createElement('div');
        cell.classList.add('c4-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        // NEW: Track when the cursor enters or leaves a slot
        cell.addEventListener('mouseenter', handleCellHover);
        cell.addEventListener('mouseleave', clearColumnHighlight);
        boardElement.appendChild(cell);
    }
}

function handleCellHover(e) {
    if (!gameActive) return;
    
    const clickedIndex = parseInt(e.target.dataset.index);
    const columnIndex = clickedIndex % 7; // Identify the active vertical column

    // Loop through all 6 rows for this specific column and apply the highlight class
    for (let row = 0; row < 6; row++) {
        let targetIndex = (row * 7) + columnIndex;
        boardElement.children[targetIndex].classList.add('column-highlight');
    }
}

function clearColumnHighlight() {
    // Quickly wipe the highlight class off every single cell on the board
    for (let i = 0; i < 42; i++) {
        boardElement.children[i].classList.remove('column-highlight');
    }
}


function handleCellClick(e) {
    if (!gameActive) return;

    const clickedIndex = parseInt(e.target.dataset.index);
    const columnIndex = clickedIndex % 7; // Find which vertical column was tapped

    // Run the instant drop logic from the bottom row up
    const moveMade = dropToken(columnIndex);

    if (moveMade) {
        if (checkWin()) {
            statusElement.innerText = `🎉 Player ${currentPlayer} Wins!`;
            gameActive = false;
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            statusElement.innerText = `It's a tie match! 🤝`;
            gameActive = false;
            return;
        }

        // Switch player turns
        currentPlayer = currentPlayer === 'Red' ? 'Yellow' : 'Red';
        statusElement.innerText = `${currentPlayer}'s Turn`;
    }
}

function dropToken(col) {
    // Traverse rows backward starting from row 5 (bottom) up to row 0 (top)
    for (let row = 5; row >= 0; row--) {
        let targetIndex = (row * 7) + col;
        
        if (boardState[targetIndex] === '') {
            boardState[targetIndex] = currentPlayer;
            
            // Instant graphic render via selector
            const cell = boardElement.children[targetIndex];
            cell.classList.add(currentPlayer);
            return true; 
        }
    }
    return false; // Column was completely full
}

function checkWin() {
    // 1. Horizontal Checks
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            let i = r * 7 + c;
            if (boardState[i] && boardState[i] === boardState[i+1] && boardState[i] === boardState[i+2] && boardState[i] === boardState[i+3]) return true;
        }
    }
    // 2. Vertical Checks
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
            let i = r * 7 + c;
            if (boardState[i] && boardState[i] === boardState[i+7] && boardState[i] === boardState[i+14] && boardState[i] === boardState[i+21]) return true;
        }
    }
    // 3. Diagonal Down-Right Check (\)
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            let i = r * 7 + c;
            if (boardState[i] && boardState[i] === boardState[i+8] && boardState[i] === boardState[i+16] && boardState[i] === boardState[i+24]) return true;
        }
    }
    // 4. Diagonal Up-Right Check (/)
    for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            let i = r * 7 + c;
            if (boardState[i] && boardState[i] === boardState[i-6] && boardState[i] === boardState[i-12] && boardState[i] === boardState[i-18]) return true;
        }
    }
    return false;
}

function initGame() {
    currentPlayer = 'Red';
    gameActive = true;
    boardState = Array(42).fill('');
    statusElement.innerText = "Red's Turn";
    createBoard();
}

// Boot up game layout on launch
initGame();
