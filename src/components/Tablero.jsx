import React, { useState } from 'react';
import './styles/Tablero.css';
import Dados from './Dados';

const Tablero = () => {
  const [activeIndexes, setActiveIndexes] = useState([]);

  const handleClick = (index) => {
    const newActiveIndexes = [index, index + 1, index + 2];
    setActiveIndexes([]);

    newActiveIndexes.forEach((activeIndex, i) => {
      setTimeout(() => {
        setActiveIndexes((prev) => [...prev, activeIndex]);
      }, i * 500); 
    });

    setTimeout(() => {
      newActiveIndexes.forEach((activeIndex, i) => {
        setTimeout(() => {
          setActiveIndexes((prev) => prev.filter((idx) => idx !== activeIndex));
        }, i * 500); 
      });
    }, 2000); 
  };

  const casillas = [];
  for (let i = 0; i < 41; i++) {
    const isCorner = [10, 20, 30, 40].includes(i);
    const isActive = activeIndexes.includes(i);
    casillas.push(
      <div
        key={i}
        className={`casilla ${isCorner ? 'casilla-esquina' : ''} ${isActive ? 'recorrer' : ''}`}
        onClick={() => handleClick(i)}
      >
        {i + 1}
      </div>
    );
  }

  return (
    <div className="tablero">
      <div className="fila-superior">
        {casillas.slice(1, 10)}
      </div>
      <div className="columna-derecha">
        {casillas.slice(10, 21)}
      </div>
      <div className="fila-inferior">
        {casillas.slice(21, 30)}
      </div>
      <div className="columna-izquierda">
        {casillas.slice(30, 41).reverse()}
      </div>
      <div className="casilla-centro">
        <Dados />
      </div>
    </div>
  );
};

export default Tablero;