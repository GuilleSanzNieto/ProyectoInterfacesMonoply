import React, { useState, useEffect } from 'react';
import './styles/TicTacToe.css';

const TicTacToe = () => {
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

  // Función auxiliar para simular una jugada y comprobar si gana
  const simulateMove = (board, index, player) => {
    const newBoard = board.slice();
    newBoard[index] = player;
    return checkWinner(newBoard) === player;
  };

  // Busca una jugada ganadora o bloquea al oponente
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

    // Si no se cumple ningún caso, escoge un movimiento aleatorio
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
    } else {
      setIsPlayerTurn(false);
    }
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
      
    } else {
      setIsPlayerTurn(true);
    }
  };

  // Efecto para que la máquina juegue automáticamente
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  const renderSquare = (index) => {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const renderBoard = () => {
    return (
      <div className="board">
        {board.map((_, index) => renderSquare(index))}
      </div>
    );
  };

  return (
    <div className="tic-tac-toe">
      <h1>Tic Tac Toe</h1>
      {renderBoard()}
      {winner && <p>Winner: {winner}</p>}
    </div>
  );
};

export default TicTacToe;