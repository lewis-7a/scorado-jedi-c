// Function to solve a Sudoku puzzle using backtracking
const solveSudoku = (sudoku) => {
  // Recursive solve function to explore possible solutions
  const solve = (grid) => {
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              // Find an empty cell (with value 0)
              if (grid[row][col] === 0) {
                  for (let num = 1; num <= 9; num++) {
                      // Check if placing 'num' in the current cell is safe
                      if (isSafe(grid, row, col, num)) {
                          // Place 'num' in the current cell
                          grid[row][col] = num;

                          // Recursively try to solve the updated grid
                          if (solve(grid)) {
                              return grid.map(row => [...row]); // Return a deep copy of the solved array
                          }

                          // If the current placement leads to an incorrect solution, backtrack
                          grid[row][col] = 0;
                      }
                  }
                  // If no valid number can be placed, backtrack
                  return null;
              }
          }
      }
      // Return a deep copy of the original array if the puzzle is solved
      return grid.map(row => [...row]);
  };

  // Helper function to check if placing 'num' in the given cell is safe
  const isSafe = (grid, row, col, num) => {
      return (
          !usedInRow(grid, row, num) &&
          !usedInCol(grid, col, num) &&
          !usedInBox(grid, row - (row % 3), col - (col % 3), num)
      );
  };

  // Helper function to check if 'num' is used in the given row
  const usedInRow = (grid, row, num) => {
      return grid[row].includes(num);
  };

  // Helper function to check if 'num' is used in the given column
  const usedInCol = (grid, col, num) => {
      return grid.some((row) => row[col] === num);
  };

  // Helper function to check if 'num' is used in the 3x3 box
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
  
  // Attempt to solve the puzzle and return the result
  if (solve(gridCopy)) {
      return gridCopy; // Return the solved array
  } else {
      return null; // Return null if no solution is found
  }
};

export default solveSudoku;