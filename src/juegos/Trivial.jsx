import React, { useState, useEffect } from 'react';
import './styles/Trivial.css';

const questions = [
  {
    text: '¿Cuál es la capital de Francia?',
    options: [
      { text: 'París', isCorrect: true },
      { text: 'Lyon', isCorrect: false },
      { text: 'Marsella', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál es la capital de España?',
    options: [
      { text: 'Madrid', isCorrect: true },
      { text: 'Barcelona', isCorrect: false },
      { text: 'Sevilla', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál es la capital de Italia?',
    options: [
      { text: 'Roma', isCorrect: true },
      { text: 'Milán', isCorrect: false },
      { text: 'Nápoles', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál es la capital de Alemania?',
    options: [
      { text: 'Berlín', isCorrect: true },
      { text: 'Múnich', isCorrect: false },
      { text: 'Frankfurt', isCorrect: false },
    ],
  },
];

const Trivial = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseColor, setResponseColor] = useState('');

  // Al montar el componente seleccionamos una pregunta aleatoria
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setSelectedQuestion(questions[randomIndex]);
  }, []);

  const handleAnswer = (option) => {
    if (option.isCorrect) {
      setResponseMessage('Correcto');
      setResponseColor('green');
    } else {
      setResponseMessage('Incorrecto');
      setResponseColor('red');
    }
  };

  if (!selectedQuestion) return <div>Cargando...</div>;

  return (
    <div className="trivial-wrapper">
      <h1>Juego de Trivial</h1>
      <div className="question">
        <p>{selectedQuestion.text}</p>
      </div>
      <div className="options">
        {selectedQuestion.options.map((option, index) => (
          <div
            key={index}
            className="option"
            onClick={() => handleAnswer(option)}
          >
            {option.text}
          </div>
        ))}
      </div>
      {responseMessage && (
        <div className={`response-message ${responseColor === 'green' ? 'correct' : 'incorrect'}`}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default Trivial;