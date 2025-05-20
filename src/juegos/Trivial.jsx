import React, { useState, useEffect } from 'react';
import './styles/Trivial.css';
import './styles/commonStyles.css'; // Importa estilos comunes (overlay, win-message, losser-message)

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

const confettiColors = ['#FFC700', '#FF0000', '#00FF00', '#0000FF', '#FF00FF'];

const Trivial = ({ visible, onGameEnd }) => {
  // Fase 1: Se muestra una pregunta única.
  // Fase 2: Se muestra una pregunta diferente.
  const [phase, setPhase] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [phase2Question, setPhase2Question] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseColor, setResponseColor] = useState('');
  const [wins, setWins] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);

  // Al montar, se selecciona una pregunta aleatoria para la fase 1
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setSelectedQuestion(questions[randomIndex]);
  }, []);

  const handleAnswer = (option) => {
    if (hasWon || hasLost) return; // Si el juego ya terminó, no procesamos la respuesta

    if (option.isCorrect) {
      setResponseMessage('Correcto');
      setResponseColor('green');
      if (phase === 1) {
        // Incrementa y pasa a Fase 2: selecciona una pregunta diferente a la de fase 1
        setWins(prev => prev + 1);
        let newQ;
        do {
          newQ = questions[Math.floor(Math.random() * questions.length)];
        } while (newQ.text === selectedQuestion.text);
        setPhase2Question(newQ);
        setPhase(2);
        setResponseMessage(''); // Limpia mensaje para la nueva fase
      } else if (phase === 2) {
        setWins(prev => prev + 1);
        if (wins + 1 === 2) { // Si en total tiene 2 aciertos, gana el juego
          setHasWon(true);
          if (onGameEnd) onGameEnd(0);
          //Vuelve al tablero
          setTimeout(() => {
            visible(false);
          }, 3000);
        }
      }
    } else {
      setResponseMessage('Incorrecto');
      setResponseColor('red');
      setHasLost(true);
      if (onGameEnd) onGameEnd(null);
      //Vuelve al tablero
      setTimeout(() => {
        visible(false);
      }, 3000);
    }
  };

  if ((phase === 1 && !selectedQuestion) || (phase === 2 && !phase2Question)) return <div>Cargando...</div>;

  return (
    <div className="trivial-wrapper">
      <h1>Juego de Trivial</h1>
      <div className="trivial-counter">
        Aciertos: {wins} de 2
      </div>
      {phase === 1 && (
        <div className="question">
          <p>{selectedQuestion.text}</p>
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
        </div>
      )}
      {phase === 2 && (
        <div className="question">
          <p>{phase2Question.text}</p>
          <div className="options">
            {phase2Question.options.map((option, index) => (
              <div
                key={index}
                className="option"
                onClick={() => handleAnswer(option)}
              >
                {option.text}
              </div>
            ))}
          </div>
        </div>
      )}
      {responseMessage && (
        <div className={`response-message ${responseColor === 'green' ? 'correct' : 'incorrect'}`}>
          {responseMessage}
        </div>
      )}
      {(hasWon || hasLost) && (
        <div className="overlay">
          <div className={hasWon ? "win-message" : "loser-alt"}>
            {hasWon && (
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      '--delay': `${Math.random() * 3}s`,
                      '--left': `${Math.random() * 100}%`,
                      '--duration': `${Math.random() * 3 + 2}s`,
                      backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)]
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

export default Trivial;