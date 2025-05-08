import React, { useState } from 'react';
import './styles/Suerte.css';

const Suerte = ({ onClose, outcome }) => {
  const [selectedCard, setSelectedCard] = useState(null);


  // Función que se ejecuta al hacer clic en alguna carta
  const handleCardClick = (index) => {
    // Solo permitimos seleccionar una carta una única vez
    if (selectedCard === null) {
      setSelectedCard(index);
    }
  };

  return (
    <>
      <h2>Elige una carta</h2>
      <div className="cardsSuerte">
        {[0, 1, 2].map((_, index) => (
          <div
            key={index}
            className={`cardSuerte ${selectedCard === index ? 'selected' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            ?
          </div>
        ))}
      </div>

      {selectedCard !== null && (
        <div className="result-wrapper">
          <p>{outcome?.message}</p>
          <button onClick={onClose}>Volver atrás</button>
        </div>
      )}
    </>
  );
};

export default Suerte;