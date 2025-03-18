import React, {useState, useEffect} from 'react';
import './styles/MemoriCard.css';

// Datos iniciales de las cartas (4 pares, 8 cartas en total)
// A cada carta se le asigna un id único y un valor (o imagen) que identifica el par.
const initialCards = [
  { id: 1, value: '🐶', flipped: false, matched: false },
  { id: 2, value: '🐱', flipped: false, matched: false },
  { id: 3, value: '🐶', flipped: false, matched: false },
  { id: 4, value: '🐱', flipped: false, matched: false },
  { id: 5, value: '🐰', flipped: false, matched: false },
  { id: 6, value: '🐼', flipped: false, matched: false },
  { id: 7, value: '🐰', flipped: false, matched: false },
  { id: 8, value: '🐼', flipped: false, matched: false },
];

const colors = ['#FFC107', '#8BC34A', '#00BCD4', '#FF5722', '#9C27B0'];

// Función para mezclar las cartas
const shuffleCards = (cards) => {
  return cards.sort(() => Math.random() - 0.5);
};

const MemoriCard = () => {
  const [cards, setCards] = useState(shuffleCards(initialCards));
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [hasWon, setHasWon] = useState(false);

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
        }
    }, [cards]);
    //Para que el mensaje de ganador se muestre por 3 segundos
    useEffect(() => {
        if (hasWon) {
          const timer = setTimeout(() => {
            setHasWon(false);
          }, 3000);
          return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta o si se vuelve a ejecutar el efecto.
        }
      }, [hasWon]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setIsComparing(false);
  };

  // Reiniciar el juego
  const resetGame = () => {
    const newCards = shuffleCards(
      initialCards.map(card => ({ ...card, flipped: false, matched: false }))
    );
    setCards(newCards);
    setHasWon(false);
    resetTurn();
  };

  return (
    <div className="memory-wrapper">
    <h1>Juego de Memoria</h1>
    <button onClick={resetGame}>Reiniciar Juego</button>
    <div className="memory-container">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card)}
          className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
        >
          <div className="card-inner">
            <div className="card-front"></div>
            <div className="card-back">{card.value}</div>
          </div>
        </div>
      ))}
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
                >
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
  </div>
  );
};

export default MemoriCard;