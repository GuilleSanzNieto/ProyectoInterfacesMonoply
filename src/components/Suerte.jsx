import React, { useState } from 'react';
import './styles/Suerte.css';

const Suerte = ({ onClose }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  // Definimos las 3 opciones disponibles
  const opciones = [
    "Bonificacion: Se te suman 200€",
    "Multa: Se te restan 100€",
    "Turno Extra: ¡Tienes un turno extra!"
  ];

  // Función que se ejecuta al hacer clic en alguna carta
  const handleCardClick = (index) => {
    // Solo permitimos seleccionar una carta una única vez
    if (selectedCard === null) {
      setSelectedCard(index);
      // Selecciona aleatoriamente una de las 3 opciones
      const randomIndex = Math.floor(Math.random() * opciones.length);
      setResultMessage(`Te ha tocado: ${opciones[randomIndex]}`);
    }
  };

  return (
    <>
      <h2>Elige una carta</h2>
      <div className="cardsSuerte">
        {[0, 1].map((_, index) => (
          <div
            key={index}
            className={`cardSuerte ${selectedCard === index ? 'selected' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            ?
          </div>
        ))}
      </div>

      {resultMessage && (
        <div className="result-wrapper">
          <p>{resultMessage}</p>
          <button onClick={onClose} >Volver atrás</button>
        </div>
      )}
    </>
  );
};

export default Suerte;