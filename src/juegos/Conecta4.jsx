import React, { useState, useEffect } from 'react';
import instrucciones from '../images/imagesAyuda.png';
import './styles/Conecta4.css';
import './styles/commonStyles.css'; // Importa los estilos comunes para el overlay

const ROWS = 6;
const COLS = 7;

const createBoard = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
};

const Conecta4 = ({ visible, onGameEnd }) => {
  const [board, setBoard] = useState(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState('Red'); // Human: 'Red', Máquina: 'Yellow'
  const [winner, setWinner] = useState(null);
  const [showInstrucciones, setShowInstrucciones] = useState(false);

  // Definimos un array de colores para el confetti
  const colors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

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
    // Encuentra la posición más baja disponible en la columna seleccionada
    let placed = false;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][colIndex]) {
        newBoard[r][colIndex] = currentPlayer;
        placed = true;
        break;
      }
    }
    if (!placed) return; // Columna llena

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);

      if (onGameEnd) {
        onGameEnd(newWinner === 'Red' ? 0 : 1);
      }

      setTimeout(() => {
        visible(false);
      }, 3000);
    }

    setBoard(newBoard);
    if (!newWinner) {
      setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
    }
  };

  // Función para que la máquina (Yellow) haga su jugada
  const machineMove = () => {
    const availableColumns = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        availableColumns.push(c);
      }
    }
    if (availableColumns.length === 0) return;

    const simulateMove = (col, player) => {
      const tempBoard = board.map(row => [...row]);
      for (let r = ROWS - 1; r >= 0; r--) {
        if (!tempBoard[r][col]) {
          tempBoard[r][col] = player;
          break;
        }
      }
      return checkWinner(tempBoard);
    };

    // 1. Si la máquina puede ganar en esta jugada
    for (let col of availableColumns) {
      if (simulateMove(col, 'Yellow') === 'Yellow') {
        handleColumnClick(col);
        return;
      }
    }

    // 2. Si el jugador podría ganar en la siguiente jugada, bloquea esa columna
    for (let col of availableColumns) {
      if (simulateMove(col, 'Red') === 'Red') {
        handleColumnClick(col);
        return;
      }
    }

    // 3. Si no hay jugadas inmediatas, elige la columna más cercana al centro
    const center = Math.floor(COLS / 2);
    const bestCol = availableColumns.sort((a, b) => Math.abs(a - center) - Math.abs(b - center))[0];
    handleColumnClick(bestCol);
  };

  // Cuando cambia el turno a "Yellow", la máquina juega automáticamente
  useEffect(() => {
    if (currentPlayer === 'Yellow' && !winner) {
      const timer = setTimeout(() => {
        machineMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, winner]);

  const resetGame = () => {
    setBoard(createBoard());
    setCurrentPlayer('Red');
    setWinner(null);
  };

  return (
    <div className="conecta4">
      <div className="header-container">
        <h1>Conecta Cuatro</h1>
        <button
        className="instrucciones-button"
        onClick={() => setShowInstrucciones(true)}
        title="Instrucciones"
      >
        <img src={instrucciones} alt="Instrucciones" className="instrucciones-icon" />
        </button>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell ? cell.toLowerCase() : ''}`}
                onClick={() => {
                  if (currentPlayer === 'Red') {
                    handleColumnClick(colIndex);
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>
    
        <h2>Turno: {currentPlayer === 'Red' ? 'Jugador' : 'Máquina'}</h2>

      {winner && (
        <div className="overlay">
          <div className="win-message">
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
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {showInstrucciones && (
        <div className="instrucciones-overlay">
          <div className="instrucciones-panel">
            <h2>🧩 Conecta 4</h2>
            <div className="instrucciones-contenido">
              <p><strong>🎯 Objetivo: </strong><br/>
                    Sé el primero en alinear cuatro fichas del mismo color en línea horizontal, vertical o diagonal.
              </p>
              <p>
                <strong>🕹️ Cómo jugar: </strong><br/>
                - Juegas contra la máquina (color amarillo). <br/>
                - Tú eres el jugador rojo. <br/>
                - Haz clic en una columna para dejar caer tu ficha. <br/>
                - Las fichas caen hasta la posición más baja disponible. <br/>
                - Luego le toca a la máquina. <br/>
                - Gana quien logre alinear cuatro fichas primero. <br/>
              </p>
              <p>
                <strong>💡Consejo: </strong><br/>
                  ¡Piensa estratégicamente! La máquina bloqueará tus jugadas si estás a punto de ganar 😉
              </p>
            </div>
            <button onClick={() => setShowInstrucciones(false)}>
              Cerrar
            </button>
          </div>
        </div>
    )}
    </div>
  );
};

export default Conecta4;