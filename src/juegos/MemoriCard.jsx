import React, {useState, useEffect} from 'react';
import instrucciones from '../images/imagesAyuda.png';
import { FaDog, FaCat } from 'react-icons/fa';
import { GiRabbit, GiPanda } from 'react-icons/gi';
import './styles/MemoriCard.css';
import './styles/commonStyles.css'; // Importa los estilos comunes para el overlay

const iconMap = {
  dog: <FaDog />,
  cat: <FaCat />,
  rabbit: <GiRabbit />,
  panda: <GiPanda />
};

// Datos iniciales de las cartas (4 pares, 8 cartas en total)
// A cada carta se le asigna un id único y un valor (o imagen) que identifica el par.
const initialCards = [
  { id: 1, value: 'dog', flipped: false, matched: false },
  { id: 2, value: 'cat', flipped: false, matched: false },
  { id: 3, value: 'dog', flipped: false, matched: false },
  { id: 4, value: 'cat', flipped: false, matched: false },
  { id: 5, value: 'rabbit', flipped: false, matched: false },
  { id: 6, value: 'panda', flipped: false, matched: false },
  { id: 7, value: 'rabbit', flipped: false, matched: false },
  { id: 8, value: 'panda', flipped: false, matched: false },
];

const colors = ['#FFC107', '#8BC34A', '#00BCD4', '#FF5722', '#9C27B0'];

// Función para mezclar las cartas
const shuffleCards = (cards) => {
  return cards.sort(() => Math.random() - 0.5);
};

const MemoriCard = ({ visible, onGameEnd }) => {
  const [cards, setCards] = useState(shuffleCards(initialCards));
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);

  // Manejar el clic en una carta
  const handleCardClick = (clickedCard) => {
    if (isComparing || clickedCard.flipped || clickedCard.matched) return;

    // Volteamos la carta
    const flippedCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, flipped: true } : card
    );
    setCards(flippedCards);

    if (!firstCard) {
      setFirstCard(clickedCard);
    } else {
      setSecondCard(clickedCard);
      setIsComparing(true);
    }
  };

  // Comparar cartas cuando se seleccionan dos
  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.value === secondCard.value) {
        // Son pareja: marcamos ambas como emparejadas
        setCards(prevCards =>
          prevCards.map(card => {
            if (card.value === firstCard.value) {
              return { ...card, matched: true };
            }
            return card;
          })
        );
        resetTurn();
      } else {
        // No son pareja: esperar y voltearlas de regreso
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card => {
              if (card.id === firstCard.id || card.id === secondCard.id) {
                return { ...card, flipped: false };
              }
              return card;
            })
          );
          resetTurn();
        }, 2000);
      }
    }
  }, [firstCard, secondCard]);

   // Cada vez que se actualicen las cartas, verificamos si todas están emparejadas
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.matched)) {
            setHasWon(true);
            setTimeout(() => {
              if (onGameEnd) onGameEnd(0);
              visible(false);
            }, 3000);
        }
    }, [cards]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setIsComparing(false);
  };

  return (
    <div className="memory-wrapper">
      <div className="header-container">
        <h1>Juego de memoria</h1>
        <button
        className="instrucciones-button"
        onClick={() => setShowInstrucciones(true)}
        title="Instrucciones"
      >
        <img src={instrucciones} alt="Instrucciones" className="instrucciones-icon" />
        </button>
      </div>
    <div className="memory-container">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card)}
          className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
        >
          <div className="card-inner">
            <div className="card-front"></div>
            <div className="card-back">
              {iconMap[card.value]}
            </div>
          </div>
        </div>
      ))}
    </div>
    {hasWon && (
        <div className="overlay">
          <div className="win-message">
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
                >
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    {showInstrucciones && (
        <div className="instrucciones-overlay">
          <div className="instrucciones-panel">
            <h2>🃏 Juego de Memoria</h2>
            <div className="instrucciones-contenido">
              <p><strong>🎯 Objetivo: </strong><br/>
                  Encuentra todas las parejas de cartas iguales.
              </p>
              <p>
                <strong>🕹️ Cómo jugar: </strong><br/>
                - Al comenzar, las cartas están ocultas. <br/>
                - Haz clic en una carta para voltearla. <br/>
                - Luego haz clic en otra para intentar encontrar su pareja. <br/>
                - Si ambas cartas son iguales, se quedarán descubiertas. <br/>
                - Si no coinciden, se voltearán de nuevo. <br/>
                - El juego termina cuando todas las parejas han sido encontradas. <br/>
              </p>
              <p>
                <strong>💡Consejo: </strong><br/>
                  ¡Memoriza bien las posiciones! La clave es observar y recordar 🧠
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

export default MemoriCard;