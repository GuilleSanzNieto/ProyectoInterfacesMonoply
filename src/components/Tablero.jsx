import React, { useState, useRef, useEffect } from 'react';
import './styles/Tablero.css';
import Dados from './Dados';

const Tablero = () => {
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [valorDados, setValorDados] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [casillaActual, setCasillaActual] = useState(0);

  const animation = (index, size) => {
    const newActiveIndexes = [];
    for (let i = 0; i <= size; i++) {
      newActiveIndexes.push((index + i) % 40);
    }

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

    // Actualiza la casilla actual después de que la animación haya terminado
    setTimeout(() => {
      setCasillaActual(newActiveIndexes[newActiveIndexes.length - 1]);
    }, (size + 1) * 500);
  };

  const handleCenterClick = () => {
    if (!spinning) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 1000); // Stop spin
    }
  };

  useEffect(() => {
    if (valorDados[0] && valorDados[1]) {
      const sumaDados = valorDados[0] + valorDados[1];
      let nuevaCasilla = casillaActual + sumaDados;

      console.log('casillaActual', casillaActual);
      console.log('nuevaCasilla', nuevaCasilla);

      if (nuevaCasilla > 40) {
        nuevaCasilla = 0;
      }

      setCasillaActual(null);
      animation(casillaActual, sumaDados);
    }
  }, [valorDados]);

  const casillas = [];
  for (let i = 0; i < 41; i++) {
    const isCorner = [10, 20, 30, 40].includes(i);
    const isActive = activeIndexes.includes(i);
    const isActual = casillaActual === i;
    casillas.push(
      <div
        key={i}
        className={`casilla ${isCorner ? 'casilla-esquina' : ''} ${isActive ? 'recorrer' : ''} ${isActual ? 'actual' : ''}`}
      >
        <div className="content">
          <span>Casilla {i}</span>
        </div>
        <div className="color"></div>
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
      <div className="casilla-centro" onClick={handleCenterClick}>
        <div className="dados">
          <Dados spinning={spinning} index={0} setValor={setValorDados} />
          <Dados spinning={spinning} index={1} setValor={setValorDados} />
        </div>
        {valorDados[0] && valorDados[1] && (
          <p>{valorDados[0]} + {valorDados[1]} = {valorDados[0] + valorDados[1]}</p>
        )}
      </div>
    </div>
  );
};

export default Tablero;