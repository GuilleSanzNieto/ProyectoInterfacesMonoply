import React, { useState } from 'react';
import instrucciones from '../images/imagesAyuda.png';
import './styles/WordSearch.css';
import './styles/commonStyles.css'; // Importa estilos comunes (overlay, win-message, losser-message)

const WordSearch = ({ visible, onGameEnd }) => {
  const battery = ['UMA', 'CAMPUS', 'ESTUDIANTE', 'ESCUELA', 'UNIVERSIDAD', 'MALAGA', 'FACULTAD', 'DEPORTES', 'ASIGNATURA', 'MATRICULA'];

  const [roundWords] = useState(() =>
    [...battery].sort(() => 0.5 - Math.random()).slice(0, 4)
  );

  const [board, setBoard] = useState(generateBoard());
  const [firstCell, setFirstCell] = useState(null);
  const [secondCell, setSecondCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundPositions, setFoundPositions] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);

  const colors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

  function generateBoard() {
    const size = 10;
    const board = Array(size).fill(null).map(() => Array(size).fill(null));

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
          // Diagonal
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

    roundWords.forEach(word => {
      placeWord(word);
    });

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

  const getWordBetweenPoints = (start, end) => {
    let word = '';
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;

    // Solo permite horizontal, vertical o diagonal
    if (Math.abs(rowDiff) === Math.abs(colDiff) || rowDiff === 0 || colDiff === 0) {
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
      const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
      const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

      for (let i = 0; i <= steps; i++) {
        const currentRow = start.row + (rowStep * i);
        const currentCol = start.col + (colStep * i);
        word += board[currentRow][currentCol];
      }

      // También comprueba la palabra en sentido inverso
      const reverseWord = word.split('').reverse().join('');
      if (roundWords.includes(reverseWord)) {
        return reverseWord;
      }
    }

    return word;
  };

  const handleCellClick = (row, col) => {
    if (!firstCell) {
      // Primera selección
      setFirstCell({ row, col });
      setSelectedCells([{ row, col }]);
    } else {
      // Segunda selección
      const secondCell = { row, col };
      setSecondCell(secondCell);
      const word = getWordBetweenPoints(firstCell, secondCell);
      const reverseWord = getWordBetweenPoints(secondCell, firstCell);

      let cells = [];
      const rowDiff = secondCell.row - firstCell.row;
      const colDiff = secondCell.col - firstCell.col;

      if (Math.abs(rowDiff) === Math.abs(colDiff) || rowDiff === 0 || colDiff === 0) {
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
        const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
        const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

        for (let i = 0; i <= steps; i++) {
          const currentRow = firstCell.row + (rowStep * i);
          const currentCol = firstCell.col + (colStep * i);
          cells.push({ row: currentRow, col: currentCol });
        }
      }

      setSelectedCells(cells);

      // Comprueba si la palabra es válida en ambas direcciones
      if (roundWords.includes(word) || roundWords.includes(reverseWord)) {
        const validWord = roundWords.includes(word) ? word : reverseWord;
        if (!foundWords.includes(validWord)) {
          setFoundWords(prev => {
            const newFound = [...prev, validWord];
            if (newFound.length === 4) {
              setHasWon(true);
              if (onGameEnd) onGameEnd(0);
              setTimeout(() => {
                visible(false);
              }, 3000);
            }
            return newFound;
          });
          setFoundPositions(prev => [...prev, ...cells]);
        }
      }

      // Reinicia la selección
      setFirstCell(null);
      setSecondCell(null);
      setTimeout(() => {
        setSelectedCells([]);
      }, 500);
    }
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
      <div className="header-container">
        <h1>Word Search Universitario</h1>
        <button
        className="instrucciones-button"
        onClick={() => setShowInstrucciones(true)}
        title="Instrucciones"
      >
        <img src={instrucciones} alt="Instrucciones" className="instrucciones-icon" />
        </button>
      </div>

      <div className="to-find-words">
        <h2>Palabras a encontrar:</h2>
        <ul>
          {roundWords.map((word, index) => (
            <li key={index} className={foundWords.includes(word) ? "found-word" : ""}>
              {word}
            </li>
          ))}
        </ul>
      </div>
      {firstCell && !secondCell && (
        <p className="hint">Ahora selecciona la <strong>última letra</strong> de la palabra.</p>
      )}

      {renderBoard()}

      <div className="found-words">
        <h2>Found Words:</h2>
        <h3>Palabras encontradas: {foundWords.length} de 4</h3>
        <ul>
          {foundWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>

      {(hasWon || hasLost) && (
        <div className="overlay">
          <div className={hasWon ? "win-message" : "loser-alt"}>
            {hasWon ? (
              <>
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
              </>
            ) : (
              // Mensaje que se mostrará cuando pierda
              <h2>GAME OVER</h2>
            )}
          </div>
        </div>
      )}
      {showInstrucciones && (
          <div className="instrucciones-overlay">
            <div className="instrucciones-panel">
              <h2>🔎 Word Search Universitario</h2>
              <div className="instrucciones-contenido">
                <p><strong>🎯 Objetivo: </strong><br/>
                      Encuentra las 4 palabras escondidas relacionadas con la universidad.
                </p>
                <p>
                  <strong>🧩 Cómo jugar: </strong><br/>
                  - Haz clic en una letra para empezar.  <br/>
                  - Luego haz clic en otra letra que forme una línea recta con la primera, así sucesivamente.  <br/>
                  - Si la palabra seleccionada está entre las ocultas, ¡la descubrirás! <br/>
                </p>
                <p>🏆 Ganas cuando encuentras las 4 palabras.</p>
                <p>🧠🧮 ¡Ejercita tu mente y tus ojos!</p>
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

export default WordSearch;