import React, { useState, useEffect, useContext } from 'react';
import './styles/Tablero.css';
import Dados from './Dados';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';

const Tablero = () => {
  const { players, currentTurn, nextTurn } = useContext(PlayersContext);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [valorDados, setValorDados] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [positions, setPositions] = useState([]);

  // Inicializa posiciones para cada jugador en 0
  useEffect(() => {
    if (players.length > 0 && positions.length !== players.length) {
      setPositions(players.map(() => 0));
    }
  }, [players, positions.length]);

  // Animación para mover el token del jugador actual
  const animation = (start, steps) => {
    const newActiveIndexes = [];
    for (let i = 0; i <= steps; i++) {
      newActiveIndexes.push((start + i) % 40);
    }
    setActiveIndexes([]);
    // Recorre cada paso de la animación
    newActiveIndexes.forEach((activeIndex, i) => {
      setTimeout(() => {
        // Para dar efecto visual en el tablero
        setActiveIndexes(prev => [...prev, activeIndex]);
        // Actualiza la posición del token del jugador actual
        setPositions(prev => {
          const newPositions = [...prev];
          newPositions[currentTurn] = activeIndex;
          return newPositions;
        });
      }, i * 500);
    });
    // Al finalizar la animación, cambia automáticamente de turno
    setTimeout(() => {
      nextTurn();
    }, (steps + 1) * 500);
  };

  const handleCenterClick = () => {
    if (!spinning) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 1000); // Stop spin
    }
  };

  useEffect(() => {
    if (valorDados[0] && valorDados[1] && positions.length === players.length) {
      const sumaDados = valorDados[0] + valorDados[1];
      const currentPos = positions[currentTurn] || 0;
      // Ajusta la posición si se excede el número de casillas
      // (asumimos 40 casillas y usamos módulo 40)
      animation(currentPos, sumaDados);
    }
  }, [valorDados]);

  const casillas = [];
  for (let i = 0; i < 41; i++) {
    const isCorner = [10, 20, 30, 40].includes(i);
    const isActive = activeIndexes.includes(i);
    casillas.push(
      <div
        key={i}
        className={`casilla ${isCorner ? 'casilla-esquina' : ''} ${isActive ? 'recorrer' : ''}`}
      >
        <div className="content">
          <span>Casilla {i}</span>
          {
            // Muestra los tokens que se encuentren en esta casilla
            positions.map((pos, pIndex) =>
              pos === i ? (
                <div
                  key={pIndex}
                  className="token"
                  style={{
                    backgroundColor: players[pIndex].color,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    margin: '2px'
                  }}
                ></div>
              ) : null
            )
          }
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
        {players.length > 0 && (
          <p style={{ color: players[currentTurn].color, fontWeight: 'bold' }}>
            Turno de: {players[currentTurn].name}
          </p>
        )}
      </div>
    </div>
  );
};

export default Tablero;