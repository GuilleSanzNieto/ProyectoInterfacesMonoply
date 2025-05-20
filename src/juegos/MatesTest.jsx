import React, { useState, useEffect } from 'react';
import instrucciones from '../images/imagesAyuda.png';
import './styles/MatesTest.css';
import './styles/commonStyles.css'; // Para overlay, win-message y loser-alt

const MathGame = ({ visible, onGameEnd }) => {
  // Usamos números entre 1 y 20.
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  // showAnimation controla la visualización del overlay (sólo al finalizar el juego)
  const [showAnimation, setShowAnimation] = useState(false);
  // Contador de respuestas correctas
  const [winCount, setWinCount] = useState(0);
  // Indica si la última respuesta fue correcta (true) o incorrecta (false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  const [showInstrucciones, setShowInstrucciones] = useState(false);

  const generateOperation = () => {
    const n1 = Math.floor(Math.random() * 20) + 1;
    const n2 = Math.floor(Math.random() * 20) + 1;
    // Selecciona aleatoriamente el operador entre +, - y *
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];

    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setUserAnswer('');
    setResultMessage('');
    setLastAnswerCorrect(null);
  };

  const checkAnswer = () => {
    let correctAnswer;
    if (operator === '+') {
      correctAnswer = num1 + num2;
    } else if (operator === '-') {
      correctAnswer = num1 - num2;
    } else if (operator === '*') {
      correctAnswer = num1 * num2;
    }

    if (parseInt(userAnswer) === correctAnswer) {
      // Respuesta correcta
      setLastAnswerCorrect(true);
      const newWinCount = winCount + 1;
      setWinCount(newWinCount);
      setResultMessage(`¡Correcto! (${newWinCount} de 3)`);
      setTimeout(() => {
        if (newWinCount === 3) {
          // Si acertó 3 operaciones, finalizar mostrando overlay ganador
          setResultMessage('¡Ganaste!');
          setShowAnimation(true);

          if (onGameEnd) onGameEnd(0);

          setTimeout(() => {
            visible(false);
          }, 3000);
        } else {
          generateOperation();
        }
      }, 1000);
    } else {
      // Respuesta incorrecta: fin del juego mostrando overlay de derrota
      setLastAnswerCorrect(false);
      setResultMessage('Incorrecto');
      setShowAnimation(true);
      setTimeout(() => {
        setResultMessage('Perdiste');
        if (onGameEnd) onGameEnd(null);
        setTimeout(() => {
          visible(false);
        }, 3000);
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  useEffect(() => {
    generateOperation();
  }, []);

  return (
    <div className="math-game">
      <div className="header-container">
        <h1>Mates Test</h1>
        <button
        className="instrucciones-button"
        onClick={() => setShowInstrucciones(true)}
        title="Instrucciones"
      >
        <img src={instrucciones} alt="Instrucciones" className="instrucciones-icon" />
        </button>
      </div>
      <div className="operation">
        {num1} {operator} {num2} =
      </div>
      <input
        type="number"
        value={userAnswer}
        onChange={handleInputChange}
        placeholder="Tu respuesta"
      />
      <button onClick={checkAnswer}>Verificar</button>
      <div className={`result ${lastAnswerCorrect ? 'correct' : 'incorrect'}`}>
        {resultMessage}
      </div>
      {showAnimation && (
        <div className="overlay">
          <div className={lastAnswerCorrect ? "win-message" : "loser-alt"}>
            {lastAnswerCorrect && (
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      '--delay': `${Math.random() * 3}s`,
                      '--left': `${Math.random() * 100}%`,
                      '--duration': `${Math.random() * 3 + 2}s`,
                      backgroundColor: ['#FFC700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF'][Math.floor(Math.random() * 5)]
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showInstrucciones && (
        <div className="instrucciones-overlay">
          <div className="instrucciones-panel">
            <h2>🧠 Mates Test</h2>
            <div className="instrucciones-contenido">
              <p><strong>🎯 Objetivo: </strong><br/>
                    Resuelve correctamente 3 operaciones matemáticas seguidas para ganar.
              </p>
              <p>
                <strong>🕹️ Cómo jugar: </strong><br/>
                - Se te mostrará una operación aleatoria (suma, resta o multiplicación). <br/>
                - Escribe el resultado en el campo de respuesta. <br/>
                - Pulsa "Verificar" para comprobar tu respuesta. <br/>
                - Si aciertas, avanzas a la siguiente operación. <br/>
                - Si fallas, el juego termina. <br/>
              </p>
              <p>🏆 Ganas si respondes correctamente a 3 operaciones seguidas.</p>
              <p>
                <strong>💡Consejo: </strong><br/>
                  ¡Concéntrate! No hay segundas oportunidades si te equivocas 😅
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

export default MathGame;