import React from 'react';
import './styles/Tablero.css';

const Tablero = () => {
  const casillas = [];
  for (let i = 0; i < 40; i++) {
    casillas.push(<div key={i} className="casilla">{i + 1}</div>);
  }

  return (
    <div className="tablero">
      <div className="fila-superior">
        {casillas.map((casilla, index) => {
          if (index < 11) {
            return <div key={index} className="casilla">{casilla}</div>;
          }
        })}
      </div>

      <div className="columna-derecha">
        {casillas.map((casilla, index) => {
          if (index >= 11 && index < 21) {
            return <div key={index} className="casilla">{casilla}</div>;
          }
        })}
      </div>

      <div className="fila-inferior">
        {casillas.map((casilla, index) => {
            if (index >= 21 && index < 31) {
              return <div key={index} className="casilla">{casilla}</div>;
            }
          })}
      </div>

      <div className="columna-izquierda">
        {casillas.slice(31, 40).reverse().map((casilla, index) => {
          return <div key={30 + index} className="casilla">{casilla}</div>;
        })}
      </div>

    </div>
  );
};

export default Tablero;