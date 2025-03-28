import React, { useState, useEffect, useContext } from 'react';
import './styles/Tablero.css';
import Dados from './Dados';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import TicTacToe from '../juegos/TicTacToe.jsx';

const Tablero = () => {
  const { players, currentTurn, nextTurn, updatePlayerPosition, spinning, setSpinning } = useContext(PlayersContext);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [valorDados, setValorDados] = useState([]);
  const [showMiniGame, setShowMiniGame] = useState(false);

  const executeWhenAnimationEnds = () => {
    setValorDados([]);
    setActiveIndexes([]);

    nextTurn();
    setSpinning(false);
    
    executeMiniGame();
  };

  const executeMiniGame = () => {
    setShowMiniGame(true);
  };


  // Animación para mover el token del jugador actual
  const animation = (start, steps) => {
    const newActiveIndexes = [];
    for (let i = 0; i <= steps; i++) {
      newActiveIndexes.push((start + i) % 40);
    }
    setActiveIndexes([]);
    newActiveIndexes.forEach((activeIndex, i) => {
      setTimeout(() => {
        // Efecto visual en el tablero
        setActiveIndexes(prev => [...prev, activeIndex]);
        // Actualiza la posición del jugador actual en el contexto
        updatePlayerPosition(currentTurn, activeIndex);
      }, i * 250);
    });
    // Al finalizar la animación, cambia de turno
    setTimeout(() => {
      executeWhenAnimationEnds();
    }, (steps + 2) * 250);
  };

  const handleCenterClick = () => {
    if (!spinning) {
      setSpinning(true);
    }
  };

  useEffect(() => {
    if (!showMiniGame && valorDados[0] && valorDados[1]) {
      const sumaDados = valorDados[0] + valorDados[1];
      const currentPos = players[currentTurn]?.position || 0;
      animation(currentPos, sumaDados);
    }
  }, [valorDados, showMiniGame]);

  const mostarTokens = (casillaIndex) => {
    return players.map((player, index) =>
      player.position === casillaIndex ? (
        <div
          key={index}
          className="token"
          style={{
            backgroundColor: player.color,
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            margin: '2px'
          }}
        ></div>
      ) : null
    );
  };

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
          {
            mostarTokens(i)
          }
        </div>
        <div className="color"></div>
      </div>
    );
  }

  const tableroComponent = (
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
  )

  return (
    <div className="tablero-container">
      {
        showMiniGame ? <TicTacToe visible={setShowMiniGame}  /> : tableroComponent
      }
    </div>
   
  );
};

export default Tablero;