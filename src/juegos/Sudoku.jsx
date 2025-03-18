import React, { useState, useEffect } from 'react';
import './styles/Conecta4.css';

const ROWS = 6;
const COLS = 7;

const createBoard = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
};

const Conecta4 = () => {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState('Red'); // Jugador: Red, Máquina: Yellow
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    // Comprueba horizontalmente
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const cell = board[r][c];
        if (cell && cell === board[r][c + 1] && cell === board[r][c + 2] && cell === board[r][c + 3]) {
          return cell;
        }
      }
    }
    // Comprueba verticalmente
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 3; r++) {
        const cell = board[r][c];
        if (cell && cell === board[r + 1][c] && cell === board[r + 2][c] && cell === board[r + 3][c]) {
          return cell;
        }
      }
    }
    // Comprueba diagonal (izquierda a derecha, hacia abajo)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const cell = board[r][c];
        if (cell && cell === board[r + 1][c + 1] && cell === board[r + 2][c + 2] && cell === board[r + 3][c + 3]) {
          return cell;
        }
      }
    }
    // Comprueba diagonal (derecha a izquierda, hacia abajo)
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 3; c < COLS; c++) {
        const cell = board[r][c];
        if (cell && cell === board[r + 1][c - 1] && cell === board[r + 2][c - 2] && cell === board[r + 3][c - 3]) {
          return cell;
        }
      }
    }
    return null;
  };

  const handleColumnClick = (colIndex) => {
    if (winner) return; // No se permiten más movimientos si hay ganador

    // Crea una copia del tablero
    const newBoard = board.map(row => [...row]);
    // Encuentra la posición más baja libre en la columna seleccionada
    let placed = false;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][colIndex]) {
        newBoard[r][colIndex] = currentPlayer;
        placed = true;
        break;
      }
    }
    if (!placed) return; // La columna está llena

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    }

    setBoard(newBoard);
    // Cambia de turno solo si no hay ganador
    if (!newWinner) {
      setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
    }
  };

  // Función para que la máquina haga su jugada (selecciona una columna aleatoria disponible)
  const machineMove = () => {
    const availableColumns = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) { // Si la celda superior de la columna está vacía, es jugable
        availableColumns.push(c);
      }
    }
    if (availableColumns.length === 0) return;
    const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    handleColumnClick(randomCol);
  };

  // Uso de useEffect para que la máquina juegue cuando sea su turno
  useEffect(() => {
    if (currentPlayer === 'Yellow' && !winner) {
      const timer = setTimeout(() => {
        machineMove();
      }, 500); // Retardo de 500ms para simular pensamiento
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, winner]);

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer('Red');
    setWinner(null);
  };

  // Array de colores para el confetti (opcional)
  const colors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

  return (
    <div className="conecta4">
      <h1>Conecta Cuatro</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell ? cell.toLowerCase() : ''}`}
                onClick={() => {
                  // Permitir el clic solo si es el turno del jugador
                  if (currentPlayer === 'Red') {
                    handleColumnClick(colIndex);
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {winner ? (
        <div className="winner">
          <h2>{winner} gana!</h2>
          <button onClick={resetGame}>Reiniciar</button>
        </div>
      ) : (
        <h2>Turno: {currentPlayer === 'Red' ? 'Jugador' : 'Máquina'}</h2>
      )}
    </div>
  );
};

export default Conecta4;