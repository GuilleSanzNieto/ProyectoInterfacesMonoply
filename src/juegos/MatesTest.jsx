import React, { useState, useEffect } from 'react';
import './styles/MatesTest.css';
import './styles/commonStyles.css'; // Importa los estilos comunes para el overlay

const MathGame = ({ visible }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [streak, setStreak] = useState(0); // Contador de aciertos consecutivos
  const [failCount, setFailCount] = useState(0); // Contador de fallos
  const [showAnimation, setShowAnimation] = useState(false); // Para activar overlay de WINNER/LOSER

  const generateOperation = () => {
    const operators = ['+', '-', '*'];
    const operatorSelected = operators[Math.floor(Math.random() * operators.length)];
    let n1, n2;

    if (operatorSelected === '*') {
      n1 = Math.floor(Math.random() * 90) + 10; // 10 a 99
      n2 = Math.floor(Math.random() * 9) + 1;   // 1 a 9
    } else {
      n1 = Math.floor(Math.random() * 90) + 10; // 10 a 99
      n2 = Math.floor(Math.random() * 90) + 10; // 10 a 99
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(operatorSelected);
    setUserAnswer('');
    setResultMessage('');
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
      setResultMessage('¡Correcto!');
      // Incrementa la racha de aciertos y resetea fallos
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFailCount(0);
      if (newStreak === 2) { // Condición para ganar
        setShowAnimation(true); // Activa overlay de WINNER (estilos en commonStyles.css muestran "WINNER")
        setTimeout(() => {
          setShowAnimation(false);
          setStreak(0);
        }, 2000);
        setTimeout(() => {
          visible(false);
        }, 3000);
      }
    } else {
      setResultMessage('Incorrecto. Intenta de nuevo.');
      setStreak(0);
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
      if (newFailCount === 2) { // Condición para perder
        setShowAnimation(true); // Activa overlay de LOSER (estilos en commonStyles.css muestran "LOSER")
        setTimeout(() => {
          setShowAnimation(false);
          setFailCount(0);
        }, 2000);
        setTimeout(() => {
          visible(false);
        }, 3000);
      }
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
      <h1>Juego de Matemáticas</h1>
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
      <div className={`result ${resultMessage === '¡Correcto!' ? 'correct' : 'incorrect'}`}>
        {resultMessage}
      </div>
      <div className="streak">Aciertos consecutivos: {streak}</div>
      {showAnimation && (
        <div className="overlay">
          <div className={failCount === 2 ? "losser-message" : "win-message"}></div>
        </div>
      )}
      <button onClick={generateOperation}>Nueva Operación</button>
    </div>
  );
};

export default MathGame;