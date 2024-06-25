const TicTacToe = (function () {

    const Player = (name, token) => {
        return { name, token };
    };

    const Cell = () => {
        let value = 0;

        const addToken = (player) => {
            value = player;
        };

        const getValue = () => value;

        return { addToken, getValue };
    };

    const gameBoard = () => {
        const rows = 3;
        const columns = 3;
        const board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }

        const getBoard = () => board;

        const playMove = (position, player) => {
            const row = Math.floor(position / columns);
            const col = position % columns;
            if (board[row][col].getValue() !== 0) return false;
            board[row][col].addToken(player);
            return true;
        };

        const checkWin = (player) => {
            const token = player.token;
            const boardWithCellValues = board.map((row) =>
                row.map((cell) => cell.getValue())
            );

            for (let row = 0; row < rows; row++) {
                if (boardWithCellValues[row].every(cell => cell === token)) {
                    return true;
                }
            }

            for (let col = 0; col < columns; col++) {
                if (boardWithCellValues.every(row => row[col] === token)) {
                    return true;
                }
            }

            if (
                (boardWithCellValues[0][0] === token && boardWithCellValues[1][1] === token && boardWithCellValues[2][2] === token) ||
                (boardWithCellValues[0][2] === token && boardWithCellValues[1][1] === token && boardWithCellValues[2][0] === token)
            ) {
                return true;
            }

            return false;
        };

        return { getBoard, playMove, checkWin };
    };

    const gameController = (playerOneName = "Player One", playerTwoName = "Player Two") => {
        let count = 0;
        const board = gameBoard();
        const players = [
            Player(playerOneName, 1),
            Player(playerTwoName, 2)
        ];
        let activePlayer = players[0];
        let gameWon = false;

        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };

        const getActivePlayer = () => activePlayer;
        const getGameWon = () => gameWon;

        const NewRound = () => {
            if (!gameWon) {
                document.querySelector(".player-name h1").innerHTML = `It's ${getActivePlayer().name}'s turn`;
            }
        };

        const playRound = (pos) => {
            if (!gameWon && board.playMove(pos, getActivePlayer().token)) {
                if (board.checkWin(getActivePlayer())) {
                    gameWon = true;
                    document.querySelector(".player-name h1").innerHTML = `${getActivePlayer().name} wins!`;
                } else {
                    count++;
                    switchPlayerTurn();
                    NewRound();
                }
            }if (count === 9 && !gameWon) {
                document.querySelector(".player-name h1").innerHTML = `It's a tie`;
                
            }
        };

        NewRound();

        return {
            playRound,
            NewRound,
            getActivePlayer,
            getGameWon
        };
    };

    return { gameController };
})();

(function(){
    const gridCells = document.querySelectorAll('.cell');
    let board = TicTacToe.gameController();

    function gridCheck(cell){
        if (cell.textContent !== "") return;
        const activePlayer = board.getActivePlayer();
        cell.textContent = activePlayer.token === 1 ? "X" : "O";
        board.playRound(parseInt(cell.dataset.index));
    }


    gridCells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (!board.getGameWon()) {
                gridCheck(cell);
            }
        });
    });

    document.querySelector('.btn-reset').addEventListener('click', () => {
        gridCells.forEach(cell => cell.textContent = "");
        board = TicTacToe.gameController();
    });;
})();
