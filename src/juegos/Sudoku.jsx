import React, { useState, useEffect } from 'react';
import './styles/Sudoku.css';

// Define algunos puzzles 4x4 (0 representa celda vacía)
const puzzles = [
  // Puzzle 1
  [
    [0, 2, 3, 0],  // Fila 1: faltan {1,4}
    [3, 0, 1, 2],  // Fila 2: falta {4} en la columna 2
    [2, 1, 0, 3],  // Fila 3: falta {4} en la columna 3
    [4, 0, 2, 1]   // Fila 4: falta {3} en la columna 2
  ],
  // Puzzle 2
  [
    [1, 0, 0, 4],  // Fila 1: faltan {2,3} en columna 2 y 3
    [0, 4, 1, 0],  // Fila 2: faltan {2,3} en columna 1 y 4
    [2, 0, 4, 3],  // Fila 3: falta {1} en columna 2
    [0, 3, 2, 1]   // Fila 4: falta {4} en columna 1
  ],
  // Puzzle 3
  [
    [1, 2, 0, 4],  // Fila 1: falta {3} en columna 3
    [0, 4, 1, 2],  // Fila 2: falta {3} en columna 1
    [2, 1, 4, 0],  // Fila 3: falta {3} en columna 4
    [4, 3, 0, 1]   // Fila 4: falta {2} en columna 3
  ]
];

// Función para seleccionar aleatoriamente un puzzle
const getRandomPuzzle = () => {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
};

// Función auxiliar para validar que un grupo contenga exactamente 1,2,3,4
const isValidGroup = (nums) => {
  const sorted = [...nums].sort();
  return sorted.join('') === '1234';
};

// Función para validar si el sudoku está resuelto
const isSudokuSolved = (board) => {
  // Comprobar filas
  for (let row of board) {
    if (!isValidGroup(row)) return false;
  }
  // Comprobar columnas
  for (let j = 0; j < 4; j++) {
    const col = board.map(row => row[j]);
    if (!isValidGroup(col)) return false;
  }
  // Comprobar cada bloque 2x2
  const boxes = [[0,0],[0,2],[2,0],[2,2]];
  for (let [r, c] of boxes) {
    const box = [
      board[r][c],
      board[r][c+1],
      board[r+1][c],
      board[r+1][c+1]
    ];
    if (!isValidGroup(box)) return false;
  }
  return true;
};

const Sudoku = () => {
  // Inicializa el tablero con un puzzle aleatorio
  const [board, setBoard] = useState(getRandomPuzzle());
  const [hasWon, setHasWon] = useState(false);

  // Array de colores para el confetti
  const colors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

  // Actualiza el valor de una celda
  const handleChange = (rowIndex, colIndex, value) => {
    const newBoard = board.map((row, i) =>
      row.map((cell, j) => {
        if (i === rowIndex && j === colIndex) {
          const num = parseInt(value, 10);
          return isNaN(num) ? 0 : num;
        }
        return cell;
      })
    );
    setBoard(newBoard);
  };

  // Comprueba si se ha resuelto el sudoku cada vez que cambia board
  useEffect(() => {
    if (isSudokuSolved(board)) {
      setHasWon(true);
    } else {
      setHasWon(false);
    }
  }, [board]);

  return (
    <div className="sudoku">
      <h1>Mini Sudoku 4x4</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => {
              // Para separar las subcuadrículas 2x2, agregamos clases extras:
              const extraClass = 
                (colIndex === 1 ? " vertical-border" : "") +
                (rowIndex === 1 ? " horizontal-border" : "");
              return (
                <input
                  key={colIndex}
                  className={"sudoku-cell" + extraClass}
                  type="text"
                  maxLength="1"
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                />
              );
            })}
          </div>
        ))}
      </div>
      {hasWon && (
        <div className="overlay">
          <div className="win-message">
            <h2>WINNER</h2>
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    '--delay': `${Math.random() * 3}s`,
                    '--left': `${Math.random() * 100}%`,
                    '--duration': `${Math.random() * 3 + 2}s`,
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sudoku;