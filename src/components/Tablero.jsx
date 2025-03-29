import React, { useState, useEffect, useContext } from 'react';
import './styles/Tablero.css';
import Dados from './Dados';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import TicTacToe from '../juegos/TicTacToe.jsx';
import WordSearch from '../juegos/WordSearch.jsx';
import MemoriCard from '../juegos/MemoriCard.jsx';
import Conecta4 from '../juegos/Conecta4.jsx';
import MatesTest from '../juegos/MatesTest.jsx';
import PiedraPapelTijera from '../juegos/PiedraPapelTijera.jsx';
import Trivial from '../juegos/Trivial.jsx';


const Tablero = () => {
  const { players, currentTurn, nextTurn, updatePlayerPosition, spinning, setSpinning } = useContext(PlayersContext);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [valorDados, setValorDados] = useState([]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameComponent, setMiniGameComponent] = useState(null);
  const miniGameCells = [2, 7, 17, 22, 33, 38];
  // const miniGameCells = [];
  // for(let i = 0; i < 41; i++){
  //   if(i % 2 === 0){
  //     miniGameCells.push(i);
  //   }
  // }

  const casillaNames = ["", "Centro de Enfermería (Ronda)", "Juego por dinero", "Centro de Magisterio (Antequera)", 
    "suerte", "metro1", "biblioteca", "juego por dinero", "pabellón de deportes", "jardin botanico", "prision", "comunicacion", "suerte", "filosofia", "derecho",
    "metro2", "educacion", "juego por dinero", "ciencias", "medicina", "google", "turismo", "juego por dinero", "estudios sociales", "comunicacion", "metro3", "ciencias de la salud", 
    "psicologia", "suerte", "industriales", "go to prision", "bellas artes", "economicas", "juego por dinero", "arquitectura", "metro4", "suerte", "telecomunicaciones", "juego por dinero", "ETSII", ""]



  const executeWhenAnimationEnds = (finalPosition) => {
    setValorDados([]);
    setActiveIndexes([]);


    if (miniGameCells.includes(finalPosition)) {
      executeMiniGameRandom();
    } else{
      setEndMinigame(false);
    }
  };

  const executeMiniGameRandom = () => {
    // Lista de mini juegos disponibles
    const miniGamesArray = [TicTacToe, WordSearch, MemoriCard, Conecta4, MatesTest, PiedraPapelTijera, Trivial];
    const randomIndex = Math.floor(Math.random() * miniGamesArray.length);
    console.log('Ejecutando minijuego:', miniGamesArray[randomIndex].name);
    setMiniGameComponent(() => miniGamesArray[randomIndex]);
    setShowMiniGame(true);
  };

  const setEndMinigame = (value) => {
    if(value === false){
      setShowMiniGame(false);
      setMiniGameComponent(null);
      nextTurn();
      setSpinning(false);
    }

  }


  // Animación para mover el token del jugador actual
  const animation = (start, steps) => {
    const newActiveIndexes = [];
    for (let i = 0; i <= steps; i++) {
      newActiveIndexes.push((start + i) % 40);
    }

    setActiveIndexes([]);
    newActiveIndexes.forEach((activeIndex, i) => {
      setTimeout(() => {

        setActiveIndexes(prev => [...prev, activeIndex]);
        updatePlayerPosition(currentTurn, activeIndex);
      }, i * 250);

    });

    setTimeout(() => {

      executeWhenAnimationEnds(newActiveIndexes[newActiveIndexes.length - 1]);

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
            backgroundColor: player.color
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
          <span className= "nombre-casilla">
            {casillaNames[i]}
          </span>
         
        </div>
        <div className="color">
          {mostarTokens(i)}
        </div>
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
      {showMiniGame && miniGameComponent
        ? // Renderiza dinámicamente el mini juego seleccionado
          React.createElement(miniGameComponent, { visible: setEndMinigame })
        : tableroComponent}
    </div>
  );
};

export default Tablero;