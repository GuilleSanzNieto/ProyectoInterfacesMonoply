import React, { useState } from 'react';
import './styles/WordSearch.css';

const WordSearch = () => {
  // Batería de 10 palabras relacionadas con la Universidad de Málaga
  const battery = ['UMA', 'CAMPUS', 'ESTUDIANTE', 'ESCUELA', 'UNIVERSIDAD', 'MALAGA', 'FACULTAD', 'INGENIERIA', 'DEPORTES', 'ASIGNATURA', 'MATRICULA'];
  // Selecciona 4 palabras aleatorias para la ronda al inicializar
  const [roundWords] = useState(() =>
    [...battery].sort(() => 0.5 - Math.random()).slice(0, 4)
  );
  
  const [board, setBoard] = useState(generateBoard());
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundPositions, setFoundPositions] = useState([]);
  const [hasWon, setHasWon] = useState(false);

  // Array de colores para el confetti
  const colors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

  function generateBoard() {
    const size = 10;
    const board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null));

    const placeWord = (word) => {
      for (let attempt = 0; attempt < 200; attempt++) {
        const orientation = Math.floor(Math.random() * 3);
        if (orientation === 0 && word.length <= size) {
          // Horizontal
          const row = Math.floor(Math.random() * size);
          const col = Math.floor(Math.random() * (size - word.length + 1));
          let fits = true;
          for (let j = 0; j < word.length; j++) {
            if (board[row][col + j] !== null && board[row][col + j] !== word[j]) {
              fits = false;
              break;
            }
          }
          if (!fits) continue;
          for (let j = 0; j < word.length; j++) {
            board[row][col + j] = word[j];
          }
          return true;
        } else if (orientation === 1 && word.length <= size) {
          // Vertical
          const row = Math.floor(Math.random() * (size - word.length + 1));
          const col = Math.floor(Math.random() * size);
          let fits = true;
          for (let j = 0; j < word.length; j++) {
            if (board[row + j][col] !== null && board[row + j][col] !== word[j]) {
              fits = false;
              break;
            }
          }
          if (!fits) continue;
          for (let j = 0; j < word.length; j++) {
            board[row + j][col] = word[j];
          }
          return true;
        } else if (orientation === 2 && word.length <= size) {
          // Diagonal hacia abajo-derecha
          const row = Math.floor(Math.random() * (size - word.length + 1));
          const col = Math.floor(Math.random() * (size - word.length + 1));
          let fits = true;
          for (let j = 0; j < word.length; j++) {
            if (board[row + j][col + j] !== null && board[row + j][col + j] !== word[j]) {
              fits = false;
              break;
            }
          }
          if (!fits) continue;
          for (let j = 0; j < word.length; j++) {
            board[row + j][col + j] = word[j];
          }
          return true;
        }
      }
      return false;
    };

    // Coloca cada palabra de la ronda en el tablero
    roundWords.forEach(word => {
      placeWord(word);
    });

    // Rellena las celdas vacías con letras aleatorias
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null) {
          board[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
    return board;
  }

  // Activa o desactiva la selección de una celda
  const handleCellClick = (row, col) => {
    if (selectedCells.some(cell => cell.row === row && cell.col === col)) {
      setSelectedCells(selectedCells.filter(cell => !(cell.row === row && cell.col === col)));
    } else {
      setSelectedCells([...selectedCells, { row, col }]);
    }
  };

  // Verifica si la selección actual forma una palabra correcta
  const checkWord = () => {
    const word = selectedCells.map(cell => board[cell.row][cell.col]).join('');
    if (roundWords.includes(word)) {
      // Actualiza foundWords y foundPositions
      setFoundWords(prev => {
        const newFound = [...prev, word];
        if (newFound.length === 4) {
          setHasWon(true);
        }
        return newFound;
      });
      setFoundPositions([...foundPositions, ...selectedCells]);
    }
    // Reinicia la selección para una nueva palabra
    setSelectedCells([]);
  };

  const renderCell = (row, col) => {
    const isFound = foundPositions.some(pos => pos.row === row && pos.col === col);
    const isSelected = selectedCells.some(pos => pos.row === row && pos.col === col);
    return (
      <button 
        className={`cell ${isFound ? "found" : ""} ${isSelected ? "selected" : ""}`}
        onClick={() => handleCellClick(row, col)}
      >
        {board[row][col]}
      </button>
    );
  };

  const renderBoard = () => {
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="word-search">
      <h1>Word Search</h1>
      
      <div className="to-find-words">
        <h2>Palabras a encontrar:</h2>
        <ul>
          {roundWords.map((word, index) => (
            <li 
              key={index} 
              className={foundWords.includes(word) ? "found-word" : ""}
            >
              {word}
            </li>
          ))}
        </ul>
      </div>
      
      {renderBoard()}
      <button className="check-word" onClick={checkWord}>Comprobar Palabra</button>
      
      <div className="found-words">
        <h2>Found Words:</h2>
        <h3>Palabras encontradas: {foundWords.length} de 4</h3>
        <ul>
          {foundWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
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

export default WordSearch;