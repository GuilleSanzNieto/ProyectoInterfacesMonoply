import React from 'react';
import './styles/Inicio.css';


function Inicio({ onStart }) {
  return (
    <div className="inicio-container">
      <h1>Bienvenido a Mi Juego</h1>
      <button onClick={onStart}>Empezar</button>
    </div>
  );
}

export default Inicio;
