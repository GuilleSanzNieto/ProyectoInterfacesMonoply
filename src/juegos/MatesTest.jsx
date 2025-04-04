import React, { useState, useEffect } from 'react';
import './styles/MatesTest.css';
import './styles/commonStyles.css'; // Para overlay, win-message y loser-alt

const MathGame = ({ visible }) => {
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
      <h1>Mates Test</h1>
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
    </div>
  );
};

export default MathGame;