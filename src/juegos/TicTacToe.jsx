import React, { useState, useEffect } from 'react';
import './styles/TicTacToe.css';
import './styles/commonStyles.css'; // Importa estilos comunes (overlay, win-message, losser-message)

const TicTacToe = ({ visible, onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

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
      <h1>Tic Tac Toe</h1>
      {renderBoard()}
      {/* En lugar de mostrar <p>Winner: {winner}</p>, se renderiza el overlay si hay ganador */}
      {winner && (
        <div className="overlay">
          <div className={winner === 'X' ? "win-message" : "losser-message"}></div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;