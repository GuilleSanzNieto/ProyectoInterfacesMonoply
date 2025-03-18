import React, { useState, useEffect } from 'react';
import './styles/MatesTest.css';

const MathGame = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [streak, setStreak] = useState(0); // Contador de aciertos consecutivos
  const [showAnimation, setShowAnimation] = useState(false); // Para activar la animación

  const generateOperation = () => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2;

    if (operator === '*') {
      num1 = Math.floor(Math.random() * 90) + 10; // 10 a 99
      num2 = Math.floor(Math.random() * 9) + 1;   // 1 a 9
    } else {
      num1 = Math.floor(Math.random() * 90) + 10; // 10 a 99
      num2 = Math.floor(Math.random() * 90) + 10; // 10 a 99
    }

    setNum1(num1);
    setNum2(num2);
    setOperator(operator);
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
      setStreak(streak + 1); // Incrementa el contador
      if (streak + 1 === 2) { // Si llega a 2 aciertos
        setShowAnimation(true); // Activa la animación
        setTimeout(() => {
          setShowAnimation(false); // Desactiva la animación después de 2 segundos
          setStreak(0); // Reinicia el contador
        }, 2000);
      }
    } else {
      setResultMessage('Incorrecto. Intenta de nuevo.');
      setStreak(0); // Reinicia el contador si falla
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
      <div className="streak">Aciertos consecutivos: {streak}</div> {/* Muestra el contador */}
      {showAnimation && (
        <div className="animation">
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  '--delay': `${Math.random() * 3}s`,
                  '--left': `${Math.random() * 100}%`,
                  '--duration': `${Math.random() * 3 + 2}s`,
                  backgroundColor: ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'][Math.floor(Math.random() * 7)]
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      <button onClick={generateOperation}>Nueva Operación</button>
    </div>
  );
};

export default MathGame;