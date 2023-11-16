// Importing necessary dependencies
import React, { useState, useEffect } from 'react';
import './Sudoku.scss';

// Define an empty Sudoku grid
const EMPTY_SUDOKU = Array.from({ length: 9 }, () => Array(9).fill(0));

// Array of Star Wars quotes for display
const quotes = [
    "This is the way.",
    "May the Force be with you.",
    "That is the way of things...the way of the Force. — Yoda",
    "In my experience, there is no such thing as luck.",
    "The Emperor is not as forgiving as I am. — Darth Vader"
];

// Function to get a random quote from the quotes array
const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
};

// Function to shuffle the elements of an array
const shuffleArray = (array) => {
  // Create a copy of the array
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Swap elements randomly
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// Function to generate a Sudoku puzzle based on difficulty
const generateSudoku = (difficulty) => {
    const baseSudoku = EMPTY_SUDOKU.map(() => shuffleArray([...Array(9).keys()]));

    // Customize the puzzle based on difficulty
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
        return baseSudoku;
    }
};

// Sudoku component
const Sudoku = () => {
  // State variables
  const [difficulty, setDifficulty] = useState('');
  const [sudoku, setSudoku] = useState([]);
  const [originalSudoku, setOriginalSudoku] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());
  
  // useEffect hook to handle changes in difficulty
  useEffect(() => {
    // Generate a new Sudoku puzzle when the difficulty changes
    if (difficulty) {
        const newSudoku = generateSudoku(difficulty);
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
  
  // Function to solve the Sudoku puzzle - cheat mode to test
  const solveSudoku = () => {
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
  
    setSudoku(solution);
    setIsSolved(true);
    setShowSolution(true);
  
    // Start countdown for new puzzle generation
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
  
    // Reset puzzle after countdown
    setTimeout(() => {
      clearInterval(intervalId);
      resetPuzzle();
    }, 5000);
  
    setMessage('Congratulations! Puzzle solved successfully!');
  };

  const showToast = (message) => {
      setMessage(message);
      setTimeout(() => setMessage(''), 5000);
  };

  // Function to solve the puzzle
  // ERROR is in here somewhere - find it!
  const solvePuzzle = () => {
    if (difficulty) {

      const solvedSudoku = JSON.parse(JSON.stringify(originalSudoku)); // Create a copy of the original puzzle
      if (solveSudoku(solvedSudoku)) {
        setSudoku(solvedSudoku);
        setIsSolved(true);
        setShowSolution(true);
        // Start countdown for new puzzle generation
        const intervalId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        // Reset puzzle after countdown
        setTimeout(() => {
          clearInterval(intervalId);
          resetPuzzle();
        }, 3000);
        setMessage('Congratulations! Puzzle solved successfully!');
      } else {
        const isIncomplete = sudoku.some((row) => row.includes(0));
        if (isIncomplete) {
          setMessage('Please fill out the remaining cells.');
        } else {
          setMessage('The puzzle is incorrect. Use the Force and try again.');
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

   // Function to handle changes in Sudoku cell values
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

  // Function to handle using the Force to complete the puzzle
  // Idea here was to create an 'easter egg' that would solve the puzzle for the user if they found the button
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

  // Render the Sudoku component
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
