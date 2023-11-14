const solveSudoku = (sudoku) => {
    const solve = (grid) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                if (isSafe(grid, row, col, num)) {
                    grid[row][col] = num;

                    if (solve(grid)) {
                    return grid.map(row => [...row]); // Return a deep copy of the solved array
                    }

                    grid[row][col] = 0;
                }
                }
                return null;
            }
            }
        }
        return grid.map(row => [...row]); // Return a deep copy of the original array
    };
  
    const isSafe = (grid, row, col, num) => {
      return (
        !usedInRow(grid, row, num) &&
        !usedInCol(grid, col, num) &&
        !usedInBox(grid, row - (row % 3), col - (col % 3), num)
      );
    };
  
    const usedInRow = (grid, row, num) => {
      return grid[row].includes(num);
    };
  
    const usedInCol = (grid, col, num) => {
      return grid.some((row) => row[col] === num);
    };
  
    const usedInBox = (grid, startRow, startCol, num) => {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[startRow + i][startCol + j] === num) {
            return true;
          }
        }
      }
      return false;
    };
  
    // Create a deep copy of the original sudoku to avoid modifying it
    const gridCopy = sudoku.map((row) => row.slice());
    if (solve(gridCopy)) {
      return gridCopy; // Return the solved array
    } else {
      return null;
    }
  };
  
  export default solveSudoku;