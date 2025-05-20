import React, { useState, useEffect } from 'react';
import instrucciones from '../images/imagesAyuda.png';
import './styles/TicTacToe.css';
import './styles/commonStyles.css'; // Importa estilos comunes (overlay, win-message, losser-message)

const TicTacToe = ({ visible, onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showInstrucciones, setShowInstrucciones] = useState(false);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const simulateMove = (board, index, player) => {
    const newBoard = board.slice();
    newBoard[index] = player;
    return checkWinner(newBoard) === player;
  };

  const findBestMove = () => {
    let availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    // Primero: intenta ganar
    for (let move of availableMoves) {
      if (simulateMove(board, move, 'O')) {
        return move;
      }
    }

    // Segundo: intenta bloquear la victoria del jugador
    for (let move of availableMoves) {
      if (simulateMove(board, move, 'X')) {
        return move;
      }
    }

    // Movimiento aleatorio
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = board.slice();
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (onGameEnd) {
        onGameEnd(gameWinner === 'X' ? 0 : null);
      }
      //Vuelve al tablero
      setTimeout(() => {
        visible(false);
      }, 3000);
      return;
    }
    
    // Empate: se puede decidir mostrar un mensaje o no
    if (newBoard.every(cell => cell !== null)) {
      return;
    }

    setIsPlayerTurn(false);
  };

  const makeComputerMove = () => {
    const availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);
    if (availableMoves.length === 0) return;

    const bestMove = findBestMove();
    const newBoard = board.slice();
    newBoard[bestMove] = 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
       //Vuelve al tablero
       setTimeout(() => {
        visible(false);
      }, 3000);
      return;
    }
    
    if (newBoard.every(cell => cell !== null)) {
      return;
    }

    setIsPlayerTurn(true);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const renderBoard = () => (
    <div className="tictactoe_board">
      {board.map((_, index) => renderSquare(index))}
    </div>
  );

  return (
    <div className="tic-tac-toe">
      <div className="header-container">
        <h1>Tic Tac Toe</h1>
        <button
        className="instrucciones-button"
        onClick={() => setShowInstrucciones(true)}
        title="Instrucciones"
      >
        <img src={instrucciones} alt="Instrucciones" className="instrucciones-icon" />
        </button>
      </div>
      {renderBoard()}
      {/* En lugar de mostrar <p>Winner: {winner}</p>, se renderiza el overlay si hay ganador */}
      {winner && (
        <div className="overlay">
          <div className={winner === 'X' ? "win-message" : "losser-message"}></div>
        </div>
      )}
      {showInstrucciones && (
          <div className="instrucciones-overlay">
            <div className="instrucciones-panel">
              <h2>⭕❌ Tic Tac Toe (Tres en Raya)</h2>
              <div className="instrucciones-contenido">
                <p><strong>🎯 Objetivo: </strong><br/>
                      Sé el primero en alinear tres de tus símbolos (❌ o ⭕) en una fila, columna o diagonal.
                </p>
                <p>
                  <strong>🕹️ Cómo jugar: </strong><br/>
                  - Juegas como ❌, el ordenador como ⭕. <br/>
                  - Haz clic en cualquier celda vacía del tablero para colocar tu símbolo. <br/>
                  - Luego de tu jugada, el ordenador hará su movimiento. <br/>
                  - El juego continúa hasta que uno gane o el tablero se llene. <br/>
                </p>
                <p>
                  <strong>📊 Reglas: </strong><br/>
                  - Ganas si logras formar una línea de 3 ❌ (horizontal, vertical o diagonal). <br/>
                  - El ordenador gana si forma una línea de 3 ⭕. <br/>
                  - Si el tablero se llena y nadie gana, es un empate. <br/>
                </p>
                <p>
                  ¡A pensar con estrategia y a ganar! ✨
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

export default TicTacToe;