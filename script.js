function Gameboard() {
    const dim = 3; 
    const board = [];
  
    for (let i = 0; i < dim; i++) {
        board[i] = [];
        for (let j = 0; j < dim; j++) {
            board[i].push(Cell());
        }
    }
    
    const getBoard = () => board;
    
    const draw = (row, column, player) => {
        if (board[row][column].getValue() === " ") {
            board[row][column].draw(player);
        } else {
            return; 
        }
    };
  
    return { getBoard, draw };
}


function Cell() {
    let value = " "; 
  
    const draw = (player) => {
        value = player;
    };
  
    const getValue = () => value;
  
    return {
        draw,
        getValue,
    };
}
  
 
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    const players = [
        { name: playerOneName, token: "x" },
        { name: playerTwoName, token: "o" },
    ];
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const winCheck = (board) => {
        const dim = board.length;

        // rows
        for (let i = 0; i < dim; i++) {
            if (
                board[i][0].getValue() !== " " &&
                board[i][0].getValue() === board[i][1].getValue() &&
                board[i][0].getValue() === board[i][2].getValue()
            ) {
                return true;
            }
        }

        // columns
        for (let j = 0; j < dim; j++) {
            if (
                board[0][j].getValue() !== " " &&
                board[0][j].getValue() === board[1][j].getValue() &&
                board[0][j].getValue() === board[2][j].getValue()
            ) {
                return true;
            }
        }

        // diagonals
        if (
            board[0][0].getValue() !== " " &&
            board[0][0].getValue() === board[1][1].getValue() &&
            board[0][0].getValue() === board[2][2].getValue()
        ) {
            return true;
        }

        if (
            board[0][2].getValue() !== " " &&
            board[0][2].getValue() === board[1][1].getValue() &&
            board[0][2].getValue() === board[2][0].getValue()
        ) {
            return true;
        }

        return false;
    };

    const fullCheck = (board) => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].getValue() === " ") {
                    return false;
                }
            }
        }
        return true;
    };

    const playRound = (row, column) => {
        const results = document.querySelector(".results");
        const winner = document.querySelector(".winner");
        const again = document.getElementById("play-again");
        
        if (board.getBoard()[row][column].getValue() !== " ") {
            console.log("Invalid move. Cell is already occupied.");
            return;
        }

        board.draw(row, column, getActivePlayer().token);

        if (winCheck(board.getBoard())) {
            results.style.display = "flex";
            winner.textContent = `${getActivePlayer().name} wins!`
            
            again.addEventListener("click", () => {
                results.style.display = "none";
                
                ScreenController();
            })

            return;
        }

        if (fullCheck(board.getBoard())) {
            results.style.display = "flex";
            winner.textContent = `It's a tie!`;

            again.addEventListener("click", () => {
                results.style.display = "none";
                
                ScreenController();
            })
            
            return;
        }

        switchPlayerTurn();
    };


    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        setPlayerNames: (name1, name2) => {
            players[0].name = name1;
            players[1].name = name2;
        }
    };
}

function ScreenController() {
    const form = document.querySelector("#form");
    const container = document.querySelector(".container");
    const boardDiv = document.querySelector('.board');
    
    form.style.display = "flex";
    container.classList.add("opacity-change");
    boardDiv.classList.add("board-disabled");  // Disable the board

    const game = GameController();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const playerOneName = document.getElementById("player-one").value;
        const playerTwoName = document.getElementById("player-two").value;

        game.setPlayerNames(playerOneName, playerTwoName);

        form.reset();
        form.style.display = "none";
        container.classList.remove("opacity-change");
        boardDiv.classList.remove("board-disabled");  // Enable the board

        updateScreen();
    });

    const playerTurnDiv = document.querySelector('.turn');

    const updateScreen = () => {
        boardDiv.innerHTML = "";

        const board = game.getBoard();
        const dim = board.length;

        const activePlayer = game.getActivePlayer();
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        for (let rowIndex = 0; rowIndex < dim; rowIndex++) {
            for (let columnIndex = 0; columnIndex < dim; columnIndex++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = board[rowIndex][columnIndex].getValue();

                cellButton.addEventListener("click", clickHandlerBoard);

                boardDiv.appendChild(cellButton);
            }
        }
    };

    function clickHandlerBoard(e) {
        const selectedRow = parseInt(e.target.dataset.row);
        const selectedColumn = parseInt(e.target.dataset.column);

        if (!isNaN(selectedRow) && !isNaN(selectedColumn)) {
            game.playRound(selectedRow, selectedColumn);
            updateScreen();
        }
    }

    updateScreen();
}

ScreenController();