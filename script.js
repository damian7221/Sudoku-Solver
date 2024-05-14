document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("sudoku-board");

    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("maxlength", "1");
            input.setAttribute("pattern", "[1-9]");
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/[^1-9]/g, "");
            });
            td.appendChild(input);
            tr.appendChild(td);
        }
        boardElement.appendChild(tr);
    }

    function solveSudoku(board) {
        const emptySpot = findEmptySpot(board);
        if (!emptySpot) return true;
        const [row, col] = emptySpot;

        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solveSudoku(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    function findEmptySpot(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
            const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
            const boxCol = Math.floor(col / 3) * 3 + i % 3;
            if (board[boxRow][boxCol] === num) return false;
        }
        return true;
    }

    function isValidInitialBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = board[row][col];
                if (num !== 0) {
                    board[row][col] = 0;
                    if (!isValid(board, row, col, num)) {
                        board[row][col] = num;
                        return false;
                    }
                    board[row][col] = num;
                }
            }
        }
        return true;
    }

    function getBoardFromInputs() {
        return Array.from(document.querySelectorAll("input"))
            .map(input => input.value ? parseInt(input.value) : 0)
            .reduce((rows, value, index) => {
                if (index % 9 === 0) rows.push([]);
                rows[rows.length - 1].push(value);
                return rows;
            }, []);
    }

    function updateBoardInputs(board) {
        document.querySelectorAll("input").forEach((input, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            input.value = board[row][col] ? board[row][col] : "";
        });
    }

    document.getElementById("solve-btn").addEventListener("click", () => {
        const board = getBoardFromInputs();
        document.getElementById("message").textContent = "";

        if (!isValidInitialBoard(board)) {
            document.getElementById("message").textContent = "Invalid Sudoku input. Please correct the numbers and try again.";
            return;
        }

        if (solveSudoku(board)) {
            updateBoardInputs(board);
            document.getElementById("message").textContent = "Sudoku solved!";
        } else {
            document.getElementById("message").textContent = "No solution exists for the given Sudoku";
        }
    });

    document.getElementById("restart-btn").addEventListener("click", () => {
        document.querySelectorAll("input").forEach(input => input.value = "");
        document.getElementById("message").textContent = "";
    });

    document.getElementById("darkmode-btn").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
