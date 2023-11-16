import React, { useState, useEffect } from 'react';
import solveSudoku from './sudokuSolver';
import './Sudoku.scss';

const EMPTY_SUDOKU = Array.from({ length: 9 }, () => Array(9).fill(0));

const quotes = [
    "This is the way.",
    "May the Force be with you.",
    "That is the way of things...the way of the Force. — Yoda",
    "In my experience, there is no such thing as luck.",
    "The Emperor is not as forgiving as I am. — Darth Vader"
];
  
const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
};

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const generateSudoku = (difficulty) => {
  // Print the difficulty for debugging
  console.log('Generating Sudoku with Difficulty:', difficulty);
  const baseSudoku = EMPTY_SUDOKU.map(() => shuffleArray([...Array(9).keys()]));

  switch (difficulty) {
    case 'Youngling':
      return baseSudoku.map((row) => shuffleArray(row).map((cell) => (Math.random() < 1 ? cell : 0)));
    case 'Padawan':
      return baseSudoku.map((row) => shuffleArray(row).map((cell) => (Math.random() < 0.6 ? cell : 0)));
    case 'Knight':
      return baseSudoku.map((row) => shuffleArray(row).map((cell) => (Math.random() < 0.5 ? cell : 0)));
    case 'Master':
      return baseSudoku.map((row) => shuffleArray(row).map((cell) => (Math.random() < 0.4 ? cell : 0)));
    case 'Grand Master':
      return baseSudoku.map((row) => {
        const filledIndexes = shuffleArray([...Array(9).keys()]).slice(0, 2);
        return row.map((cell, index) => (filledIndexes.includes(index) ? cell : 0));
      });
    default: 

    // Print the generated puzzle for debugging
    console.log('Generated Sudoku:', baseSudoku);

    return baseSudoku;
  }
};

const Sudoku = () => {
  const [difficulty, setDifficulty] = useState('');
  const [sudoku, setSudoku] = useState([]);
  const [originalSudoku, setOriginalSudoku] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());
  
  useEffect(() => {
      if (difficulty) {
          const newSudoku = generateSudoku(difficulty);

          console.log('New Sudoku Puzzle:', newSudoku);

          setOriginalSudoku(newSudoku.map((row) => [...row])); // Create a copy of the puzzle
          setSudoku(newSudoku);
          setIsSolved(false);
          setShowSolution(false);

          // Change quote every 8 seconds
          const quoteInterval = setInterval(() => {
              setCurrentQuote(getRandomQuote());
          }, 8000);

          return () => clearInterval(quoteInterval);
      }
  }, [difficulty]);

  // Function to check if a number can be placed in a given position
  const isSafe = (sudoku, row, col, num) => {
      // Check if 'num' is not present in the current row, column, and 3x3 subgrid
      for (let i = 0; i < 9; i++) {
      if (
          sudoku[row][i] === num ||
          sudoku[i][col] === num ||
          sudoku[row - (row % 3) + Math.floor(i / 3)][col - (col % 3) + (i % 3)] === num
      ) {
          return false;
      }
      }
      return true;
  };
    
  const solveSudoku = (sudoku) => {
    console.log('Current Sudoku State:', sudoku);
    // Check if the puzzle is solved
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (sudoku[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(sudoku, row, col, num)) {
              sudoku[row][col] = num;

              // Print the state after placing a number for debugging
              console.log('Placed', num, 'at', row, ',', col);
  
              if (solveSudoku(sudoku)) {
                return true;
              }
  
              sudoku[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const showToast = (message) => {
      setMessage(message);
      setTimeout(() => setMessage(''), 5000);
  };

  const solvePuzzle = () => {
    if (difficulty) {
      const solvedSudoku = JSON.parse(JSON.stringify(originalSudoku)); // Create a copy of the original puzzle
      if (Array.isArray(solvedSudoku)) {
        const filledSudoku = solvedSudoku.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const originalValue = originalSudoku[rowIndex][colIndex];
            return {
              value: cell !== 0 ? String(cell) : '', // Convert non-zero values to string, keep empty if it's 0
              solved: cell === originalValue,
              incorrect: cell !== originalValue && cell !== 0,
            };
          })
        );
  
        setSudoku(filledSudoku);
        setIsSolved(true);
  
        // Start countdown for new puzzle generation
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
  
        // Reset puzzle after countdown
        setTimeout(() => {
          clearInterval(intervalId);
          resetPuzzle();
        }, 5000);
  
        setMessage({ text: 'Congratulations! Puzzle solved successfully!', type: 'success' });
      } else {
        const isIncomplete = solvedSudoku === null || solvedSudoku.some((row) => row.includes(0));
        if (isIncomplete) {
          setMessage({ text: 'Please fill out the remaining cells.', type: 'info' });
        } else {
          setMessage({ text: 'The puzzle is incorrect. Use the Force and try again.', type: 'error' });
        }
      }
    }
    if (!isSolved) {
      const solvedSudoku = solveSudoku(originalSudoku);

      if (Array.isArray(solvedSudoku) && Array.isArray(solvedSudoku[0])) {
        const filledSudoku = solvedSudoku.map(row => row.slice());

        // Mark solved and incorrect cells
        const markedSudoku = filledSudoku.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const originalValue = originalSudoku[rowIndex][colIndex];
            return {
              value: cell,
              solved: cell === originalValue,
              incorrect: cell !== originalValue && cell !== '.',
            };
          })
        );

        setSudoku(markedSudoku);
        setIsSolved(true);
        setMessage({ text: 'Puzzle solved!', type: 'success' });
      } else {
        setMessage({ text: 'An error occurred while solving the puzzle. Try again.', type: 'error' });
      }
    } else {
      setMessage({ text: 'The puzzle is already solved. No need to solve it again!', type: 'warning' });
    }
  };

  const resetPuzzle = () => {
    if (difficulty) {
      const newSudoku = generateSudoku(difficulty);
      setOriginalSudoku(newSudoku.map((row) => [...row])); // Create a copy of the puzzle
      setSudoku(newSudoku);
      setIsSolved(false);
      setShowSolution(false);
      setCountdown(3);
      showToast('New puzzle generated!');
    }
  };

  const handleCellChange = (row, col, value) => {
    if (!isSolved && difficulty) {
      // Validate that only one digit can populate the cell
      if (/^[1-9]$/.test(value) || value === '') {
        const newSudoku = [...sudoku];
        newSudoku[row][col] = value;
        setSudoku(newSudoku);
      } else {
        setMessage({ text: 'Invalid input. Please enter a single digit (1-9) or leave it empty.', type: 'error' });
      }
    }
  };

  const handleUseTheForce = () => {
    if (!isSolved) {
      const solvedSudoku = solveSudoku(originalSudoku);

      if (Array.isArray(solvedSudoku) && Array.isArray(solvedSudoku[0])) {
        const filledSudoku = solvedSudoku.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const originalValue = originalSudoku[rowIndex][colIndex];
            return {
              value: cell === '.' ? originalValue : cell,
              solved: cell !== '.' && cell === originalValue,
              incorrect: cell !== '.' && cell !== originalValue,
            };
          })
        );

        setSudoku(filledSudoku);
        setIsSolved(true);
        setMessage({ text: 'The Force is strong with you. Puzzle auto-completed!', type: 'success' });
      } else {
        setMessage({ text: 'An error occurred while using the Force. Try again.', type: 'error' });
      }
    } else {
      setMessage({ text: 'The puzzle is already solved. No need to use the Force again!', type: 'warning' });
    }
  };

  return (
    <div className="sudoku-container">
      <button className="use-the-force-btn" onClick={handleUseTheForce} title="Use the Force">
        Use the Force
      </button>
      <h1 className="sudoku-title">Sudoku Game</h1>
      <div className={`message ${message.type}`}>
        <p>{message.text}</p>
      </div>
      <div className="difficulty-selection">
        <h2>Select Difficulty:</h2>
        <div className="difficulty-options">
          {['Youngling', 'Padawan', 'Knight', 'Master', 'Grand Master'].map((option) => (
            <button key={option} onClick={() => setDifficulty(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      {difficulty && (
        <div className="sudoku">
          {sudoku.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  className={`cell ${isSolved ? 'solved' : ''} ${
                    showSolution && originalSudoku[rowIndex][colIndex] !== cell ? 'incorrect' : ''
                  }`}
                  value={cell === 0 ? '' : cell}
                  readOnly={originalSudoku[rowIndex][colIndex] !== 0} // Set readOnly for pre-populated cells
                  onChange={(e) => handleCellChange(rowIndex, colIndex, parseInt(e.target.value) || 0)}
                />
              ))}
            </div>
          ))}
          <button className="solve-btn" onClick={solvePuzzle}>Solve Puzzle</button>
          <button onClick={resetPuzzle}>Generate New Puzzle</button>
          {isSolved && (
            <div className="countdown">
              <p>New puzzle in: {countdown}</p>
            </div>
          )}
        </div>
      )}
      <div className="footer">
          <p className="quote">{currentQuote}</p>
      </div>
    </div>
  );
};

export default Sudoku;
