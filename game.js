// Function to hide the help modal
function hideHelp() {
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.querySelector('.score-box .value');
    const bestScoreElement = document.querySelector('.best-box .value');
    const movesElement = document.querySelector('.moves-box .value');
    const newGameButton = document.getElementById('new-game-btn');
    const helpButton = document.getElementById('help-button');

    let score = 0; // Counter for the total scored on adding tiles
    let bestScore = 0; // Highest score scored in the session
    let moveCounter = 0; // Counter for the number of tiles moved
    let board = [];

    // Variables to store initial touch coordinates
    let initialX = null;
    let initialY = null;

    // Function to show the help modal
    function showHelp() {
        const helpModal = document.getElementById('help-modal');
        helpModal.style.display = 'block';
    }

    // Function to initialize the game board
    function initializeBoard() {
        const containerWidth = parseInt(gameContainer.style.width, 10);
        const containerHeight = parseInt(gameContainer.style.height, 10);
        const aspectRatio = containerWidth / containerHeight;
        const tileSize = containerWidth * 0.1;

        // Update tile size
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.style.width = `${tileSize}px`;
            tile.style.height = `${tileSize}px`;
        });

        // You may also want to adjust the font size of the tile numbers dynamically
        const tileNumberFontSize = Math.floor(tileSize / 2);
        document.styleSheets[0].insertRule(`.tile-number { font-size: ${tileNumberFontSize}px; }`, 0);
        // Add other styling adjustments as needed

        const newBoard = [];
        for (let i = 0; i < 4; i++) {
            newBoard[i] = [];
            for (let j = 0; j < 4; j++) {
                newBoard[i][j] = 0;
            }
        }

        // Update the board size dynamically based on screen width
        board.forEach((row, i) => {
            row.forEach((col, j) => {
                const tile = document.querySelector(`.tile[data-row="${i}"][data-col="${j}"]`);
                positionTile(tile, i, j, tileSize);
            });
        });

        return newBoard;
    }

    // Function to get random available cell
    function getRandomAvailableCell() {
        const availableCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    availableCells.push({ row: i, col: j });
                }
            }
        }
        if (availableCells.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
    }

    // Function to place new random tile (mostly it will be used in move)
    function placeRandomTile() {
        const cell = getRandomAvailableCell();
        if (cell !== null) {
            const value = Math.random() < 0.9 ? 2 : 4;
            board[cell.row][cell.col] = value;
        }
    }

    // Function to update the board size dynamically based on screen width
    function updateBoardSize() {
        const screenWidth = window.innerWidth;
        const maxContainerWidth = 400; // Adjust this value as needed
        const containerWidth = Math.min(screenWidth, maxContainerWidth);
        const aspectRatio = 1;

        // Set a maximum width for the game container
        gameContainer.style.width = `${containerWidth}px`;
        gameContainer.style.height = `${containerWidth * aspectRatio}px`;
    }

    // Call the function to update board size initially
    updateBoardSize();


    // Function to update the scoreboard display
    function updateScoreboard() {
        if (score > bestScore) {
            bestScore = score;
        }
        // Update the score
        scoreElement.textContent = scoreToHindi(score);

        // Update the best score
        bestScoreElement.textContent = scoreToHindi(bestScore);

        // Update the moves
        movesElement.textContent = scoreToHindi(moveCounter);
    }

    function scoreToHindi(value) {
        // Function to convert numbers to Hindi
        const hindiNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        return value.toString().split('').map(char => hindiNumbers[parseInt(char)]).join('');
    }

    function updateBoard() {
        gameContainer.innerHTML = ''; // Clear the previous state

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tileValue = board[i][j];
                const tile = document.createElement('div');
                tile.className = `tile tile-${tileValue}`;

                // Set the background icon using the Font Awesome class
                if (tileValue !== 0) {
                    // Add the tile value (number) to the tile element
                    const tileNumber = document.createElement('div');
                    tileNumber.className = 'tile-number';
                    tileNumber.textContent = tileValue !== 0 ? scoreToHindi(tileValue) : '';
                    tile.appendChild(tileNumber);
                }

                // Append the content container to the tile
                gameContainer.appendChild(tile);
                positionTile(tile, i, j);

                // Check if the tile value is 2048 and the prompt hasn't been shown
                if (tileValue === 2048) {
                    showCongratulationModal();
                }
            }
        }
        // Update the scoreboard
        updateScoreboard();
    }

    // Function to position tile on gameboard
    function positionTile(tile, row, col, tileSize, tileMargin) {
        if (tile) {
            const containerWidth = parseInt(gameContainer.style.width, 10);
            const containerHeight = parseInt(gameContainer.style.height, 10);
            const aspectRatio = containerWidth / containerHeight;

            const top = row * (tileSize + tileMargin);
            const left = col * (tileSize * aspectRatio + tileMargin);

            tile.style.width = `${tileSize * aspectRatio}px`;
            tile.style.height = `${tileSize}px`;
            tile.style.top = `${top}px`;
            tile.style.left = `${left}px`;

            // You may also want to adjust the font size of the tile numbers dynamically
            const tileNumber = tile.querySelector('.tile-number');
            if (tileNumber) {
                const tileNumberFontSize = Math.floor(tileSize / 2);
                tileNumber.style.fontSize = `${tileNumberFontSize}px`;
                // Add other styling adjustments as needed
            }
        }
    }

    // Function to move tiles to the left
    function moveLeft() {
        let moved = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if (board[i][j] !== 0) {
                    let col = j;
                    while (col > 0 && board[i][col - 1] === 0) {
                        board[i][col - 1] = board[i][col];
                        board[i][col] = 0;
                        col--;
                        moved = true;
                    }
                    if (col > 0 && board[i][col - 1] === board[i][col]) {
                        board[i][col - 1] *= 2;
                        score += board[i][col - 1];
                        board[i][col] = 0;
                        moved = true;
                    }
                }
            }
        }

        // If tiles is moved then increase the move counter and update the scoreboard
        // Place the random tile and update the board
        if (moved) {
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    // Function to move tiles to the right
    function moveRight() {
        let moved = false;

        for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
                if (board[i][j] !== 0) {
                    let col = j;
                    while (col < 3 && board[i][col + 1] === 0) {
                        board[i][col + 1] = board[i][col];
                        board[i][col] = 0;
                        col++;
                        moved = true;
                    }

                    if (col < 3 && board[i][col + 1] === board[i][col]) {
                        board[i][col + 1] *= 2;
                        score += board[i][col + 1];
                        board[i][col] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    // Function to move tiles to the up
    function moveUp() {
        let moved = false;

        for (let j = 0; j < 4; j++) {
            for (let i = 1; i < 4; i++) {
                if (board[i][j] !== 0) {
                    let row = i;
                    while (row > 0 && board[row - 1][j] === 0) {
                        board[row - 1][j] = board[row][j];
                        board[row][j] = 0;
                        row--;
                        moved = true;
                    }

                    if (row > 0 && board[row - 1][j] === board[row][j]) {
                        board[row - 1][j] *= 2;
                        score += board[row - 1][j];
                        board[row][j] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    // Function to move tiles to the down
    function moveDown() {
        let moved = false;

        for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    let row = i;
                    while (row < 3 && board[row + 1][j] === 0) {
                        board[row + 1][j] = board[row][j];
                        board[row][j] = 0;
                        row++;
                        moved = true;
                    }

                    if (row < 3 && board[row + 1][j] === board[row][j]) {
                        board[row + 1][j] *= 2;
                        score += board[row + 1][j];
                        board[row][j] = 0;
                        moved = true;
                    }
                }
            }
        }

        if (moved) {
            moveCounter++;
            updateScoreboard();
            placeRandomTile();
            updateBoard();
        }
    }

    function mergeTiles() {
        // This function is already used within moveLeft, moveRight, moveUp, and moveDown
        // It merges adjacent tiles with the same value
    }

    // Touch function starts here

    // Function to handle touch start event
    function handleTouchStart(event) {
        const touchWithinGame = isTouchWithinGame(event.touches[0]);
        if (touchWithinGame) {
            initialX = event.touches[0].clientX;
            initialY = event.touches[0].clientY;
            event.preventDefault(); // Prevent default scrolling behavior
        }
    }

    // Function to handle touch end event
    function handleTouchEnd(event) {
        // Determine the direction based on the initial and final touch positions
        // Call the corresponding movement function (e.g., moveLeft, moveRight, moveUp, moveDown)
        if (initialX === null || initialY === null) {
            return; // Ignore if touch start coordinates are not set
        }

        const finalX = event.changedTouches[0].clientX;
        const finalY = event.changedTouches[0].clientY;

        const deltaX = finalX - initialX;
        const deltaY = finalY - initialY;

        // Determine the direction based on the difference in coordinates
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                moveDown();
            } else {
                moveUp();
            }
        }

        if (isGameOver()) {
            // Perform actions for game over
            console.log('Game Over!');
        }

        // Update the game board after each touch
        updateBoard();

        // Reset initial touch coordinates
        initialX = null;
        initialY = null;

        // Call saveGameState after updating the board
        saveGameState();
    }

    // Function to check if a touch event is within the game container
    function isTouchWithinGame(touch) {
        const rect = gameContainer.getBoundingClientRect();
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        return (
            touchX >= rect.left &&
            touchX <= rect.right &&
            touchY >= rect.top &&
            touchY <= rect.bottom
        );
    }

    // Touch function ends here

    // Function to check if the game is over
    function isGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    return false;
                }

                if (
                    (j < 3 && board[i][j] === board[i][j + 1]) ||
                    (i < 3 && board[i][j] === board[i + 1][j])
                ) {
                    return false;
                }
            }
        }

        showGameOverModal();
        return true;
    }

    // Function to show the game over modal
    function showGameOverModal() {
        const modal = document.getElementById('game-over-modal');
        const scoreElement = document.getElementById('game-over-score');
        scoreElement.textContent = score;

        // Show the modal
        modal.style.display = 'block';

        // Add the 'game-over' class to the body
        document.body.classList.add('game-over');
    }

    // Function to hide the game over modal
    function hideGameOverModal() {
        const modal = document.getElementById('game-over-modal');
        modal.style.display = 'none';

        // Reset the body class when hiding the modal
        document.body.classList.remove('game-over');
    }

    // Function to retry the game
    function retryGame() {
        hideGameOverModal();
        newGame();
    }

    // Function to show the congratulation modal
    function showCongratulationModal() {
        const congratulationModal = document.getElementById('congratulation-modal');

        // Check if the congratulation modal has been shown in the local storage
        const congratulationShownInLocalStorage = localStorage.getItem('congratulationShown');
        if (board.flat().includes(2048) && congratulationShownInLocalStorage !== 'true') {
            congratulationModal.style.display = 'block';
            localStorage.setItem('congratulationShown', 'true');
        }
    }

    // Function to hide the congratulation modal
    function hideCongratulationModal() {
        const congratulationModal = document.getElementById('congratulation-modal');
        congratulationModal.style.display = 'none';
    }

    // Function to handle key presses
    function handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            default:
                return; // Ignore other key presses
        }

        isGameOver();
    }

    // Function to start a new game whenever this function is called
    function newGame() {
        // Hide the game over modal when starting a new game
        const modal = document.getElementById('game-over-modal');
        modal.style.display = 'none';

        // Reset the body class when starting a new game
        document.body.classList.remove('game-over');
        board = initializeBoard();
        score = 0;
        moveCounter = 0;
        placeRandomTile();
        placeRandomTile();
        updateBoard();
        saveGameState(); // Save the initial state of the new game

        // Reset the congratulationShown flag in both local
        localStorage.setItem('congratulationShown', 'false');
    }

    // Function to save the game state to local storage
    function saveGameState() {
        const gameState = {
            board,
            score,
            bestScore,
            moveCounter,
        };

        // const serializedState = JSON.stringify(gameState);
        localStorage.setItem('2048HindiGameState', JSON.stringify(gameState));
    }

    // Function to load the game state from local storage
    function loadGameState() {
        const serializedState = localStorage.getItem('2048HindiGameState');

        try {
            if (serializedState) {
                const gameState = JSON.parse(serializedState);
                board = gameState.board;
                score = gameState.score;
                bestScore = gameState.bestScore;
                moveCounter = gameState.moveCounter;
                // Update the UI or any other necessary tasks
                updateBoard(); // Update the board after loading the game state
                updateScoreboard(); // Update the scoreboard after loading the game state
            }
        } catch (error) {
            console.error('Error loading game state:', error);
            // Handle the error (e.g., start a new game or inform the user)
            newGame();
        }
    }

    // Function to reshuffle the existing tiles on the board
    function reshuffleBoard() {

        const nonEmptyTilesBeforeShuffling = [];

        // Collect all non-empty tiles before shuffling
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    nonEmptyTilesBeforeShuffling.push({ value: board[i][j], row: i, col: j });
                }
            }
        }

        // Reset the board
        board = initializeBoard();

        // Shuffle the non-empty tiles and place them back on the board
        for (const tile of nonEmptyTilesBeforeShuffling) {
            let randomRow, randomCol;
            do {
                randomRow = Math.floor(Math.random() * 4);
                randomCol = Math.floor(Math.random() * 4);
            } while (board[randomRow][randomCol] !== 0);

            board[randomRow][randomCol] = tile.value;
        }

        // Update the UI
        updateBoard();
    }

    // Event listener for reshuffle button
    const reshuffleButton = document.getElementById('reshuffle-btn');
    if (reshuffleButton) {
        reshuffleButton.addEventListener('click', () => {
            reshuffleBoard();
            saveGameState(); // Save game state after reshuffling the board
        });
    }

    // Event listener for continue button in the congratulation modal
    const continueButton = document.getElementById('continue-button');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            saveGameState();
            hideCongratulationModal();
            // Add any logic here for continuing the game after congratulation
        });
    }

    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', function () {
            // Call the function to start a new game
            newGame();
            saveGameState(); // Save game state after starting a new game
            hideCongratulationModal();
        });
    }

    // Event listeners for touch events
    gameContainer.addEventListener('touchstart', handleTouchStart);
    gameContainer.addEventListener('touchend', handleTouchEnd);

    // Event listeners for new game
    newGameButton.addEventListener('click', () => {
        newGame();
        saveGameState(); // Save game state after starting a new game
    });

    document.addEventListener('keydown', (event) => {
        handleKeyPress(event);
        saveGameState(); // Save game state after each key press
    });

    // Event listeners for gelp button
    helpButton.addEventListener('click', showHelp);

    // Event listener for window resize to dynamically update board size
    window.addEventListener('resize', updateBoardSize);

    // Event listener for retry button
    const retryButton = document.getElementById('retry-button');
    if (retryButton) {
        retryButton.addEventListener('click', retryGame);
    }

    // condition to check if we any localstorage item
    if (localStorage.getItem('2048HindiGameState')) {
        loadGameState();
    } else {
        // If no game state is found, start a new game
        newGame();
    }

    // Close the modal if the user clicks outside of it
    window.onclick = function (event) {
        const helpModal = document.getElementById('help-modal');
        if (event.target === helpModal) {
            hideHelp();  // Call the hideHelp function here
        }
    };
});