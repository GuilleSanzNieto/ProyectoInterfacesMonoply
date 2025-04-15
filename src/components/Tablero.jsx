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

const MoneyPanel = () => {
  const { players } = useContext(PlayersContext);
  return (
    <div className="money-panel">
      <h3>Dinero de los jugadores</h3>
      <ul>
        {players.map((player, idx) => (
          <li key={idx} style={{ color: player.color }}>
            {player.name || `Jugador ${idx + 1}`}: ${player.money}
          </li>
        ))}
      </ul>
    </div>
  );
};

const propiedades = [
  { index: 1, name: "Centro de Enfermería (Ronda)", price: 100 },
  { index: 3, name: "Centro de Magisterio (Antequera)", price: 120 },
  { index: 6, name: "Biblioteca", price: 150 },
  { index: 8, name: "Pabellón de deportes", price: 180 },
  { index: 9, name: "Jardín botánico", price: 200 },
  { index: 11, name: "Comunicación", price: 220 },
  { index: 13, name: "Filosofía", price: 240 },
  { index: 14, name: "Derecho", price: 260 },
  { index: 16, name: "Educación", price: 280 },
  { index: 18, name: "Ciencias", price: 300 },
  { index: 19, name: "Medicina", price: 320 },
  { index: 21, name: "Turismo", price: 340 },
  { index: 23, name: "Estudios sociales", price: 360 },
  { index: 24, name: "Comunicación", price: 380 },
  { index: 26, name: "Ciencias de la salud", price: 400 },
  { index: 27, name: "Psicología", price: 420 },
  { index: 29, name: "Industriales", price: 440 },
  { index: 31, name: "Bellas artes", price: 460 },
  { index: 32, name: "Económicas", price: 480 },
  { index: 34, name: "Arquitectura", price: 500 },
  { index: 37, name: "Telecomunicaciones", price: 520 },
  { index: 39, name: "ETSII", price: 540 },
];

const PropertiesPanel = () => {
  const { players } = useContext(PlayersContext);
  return (
    <div className="properties-panel">
      <h3>Propiedades de los jugadores</h3>
      <ul>
        {players.map((player, idx) => (
          <li key={idx} style={{ color: player.color }}>
            {player.name || `Jugador ${idx + 1}`}: 
            <ul>
              {(player.properties || []).map((prop, i) => (
                <li key={i}>{prop.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Tablero = () => {
  const { players, currentTurn, nextTurn, updatePlayerPosition, spinning, setSpinning, buyProperty, sellProperty } = useContext(PlayersContext);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [valorDados, setValorDados] = useState([]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameComponent, setMiniGameComponent] = useState(null);
  const [infoCasilla, setInfoCasilla] = useState(null); // Estado para mostrar la información de la casilla
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [propertyModalByLanding, setPropertyModalByLanding] = useState(false);
  const [propertyBuyerIndex, setPropertyBuyerIndex] = useState(null);
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

  const handleCasillaClick = (index) => {
    const propiedad = propiedades.find(p => p.index === index);
    setInfoCasilla({
      index,
      name: casillaNames[index],
      price: propiedad ? propiedad.price : null
    });
    setShowPropertyModal(false);
    setCurrentProperty(null);
    setPropertyModalByLanding(false);
  };

  const closeInfoCasilla = () => {
    setInfoCasilla(null);
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

        setActiveIndexes(prev => [...prev, activeIndex]);
        updatePlayerPosition(currentTurn, activeIndex);
      }, i * 250);

    });

    setTimeout(() => {
      const finalPos = newActiveIndexes[newActiveIndexes.length - 1];
      const propiedad = propiedades.find(p => p.index === finalPos);
      if (propiedad) {
        setCurrentProperty(propiedad);
        setShowPropertyModal(true);
        setPropertyModalByLanding(true);
        setPropertyBuyerIndex(currentTurn); // Captura el turno en ese momento
      }
      executeWhenAnimationEnds(finalPos);

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
        onClick={() => handleCasillaClick(i)}
      >
        <div className="content">
          <span className="nombre-casilla">
            {casillaNames[i]}
          </span>
        </div>
        <div className="color">
          {mostarTokens(i)}
        </div>
      </div>
    );
  }

  const handleBuyProperty = (property) => {
    if (propertyBuyerIndex !== null) {
      buyProperty(propertyBuyerIndex, property);
      setShowPropertyModal(false);
      setPropertyBuyerIndex(null);
    }
  };

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
    <div className="tablero-layout">
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        {showMiniGame && miniGameComponent
          ? React.createElement(miniGameComponent, { visible: setEndMinigame })
          : tableroComponent}
        {infoCasilla && (
          <div className="info-casilla" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '10px', border: '1px solid black', borderRadius: '5px', zIndex: 10 }}>
            <h3>Información de la casilla</h3>
            <p><strong>Nombre:</strong> {infoCasilla.name}</p>
            <p><strong>Índice:</strong> {infoCasilla.index}</p>
            {infoCasilla.price !== null && (
              <p><strong>Precio:</strong> ${infoCasilla.price}</p>
            )}
            <button onClick={closeInfoCasilla}>Cerrar</button>
          </div>
        )}
        {showPropertyModal && currentProperty && (
          (() => {
            // Comprobar si la propiedad ya pertenece a algún jugador
            const propiedadYaComprada = players.some(player => player.properties?.some(p => p.index === currentProperty.index));
            const esPropietarioActual = players[propertyBuyerIndex]?.properties?.some(p => p.index === currentProperty.index);
            if (propertyModalByLanding) {
              return (
                <div className="property-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="property-modal-content" style={{ background: '#fff', borderRadius: '12px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.25)', minWidth: '260px', maxWidth: '90vw', textAlign: 'center' }}>
                    <h3>{currentProperty.name}</h3>
                    <p>Precio: ${currentProperty.price}</p>
                    {!propiedadYaComprada ? (
                      <>
                        <button
                          disabled={players[propertyBuyerIndex]?.money < currentProperty.price}
                          onClick={() => handleBuyProperty(currentProperty)}
                        >
                          Comprar
                        </button>
                        <button onClick={() => setShowPropertyModal(false)}>Pasar</button>
                      </>
                    ) : esPropietarioActual ? (
                      <button
                        onClick={() => {
                          sellProperty(currentTurn, currentProperty);
                          setShowPropertyModal(false);
                        }}
                      >
                        Vender
                      </button>
                    ) : (
                      <>
                        <p style={{color: 'red', fontWeight: 'bold'}}>Esta propiedad ya ha sido comprada por otro jugador.</p>
                        <button onClick={() => setShowPropertyModal(false)}>Cerrar</button>
                      </>
                    )}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="property-modal-content" style={{ background: '#fff', borderRadius: '12px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.25)', minWidth: '260px', maxWidth: '90vw', textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
                  <h3>{currentProperty.name}</h3>
                  <p>Precio: ${currentProperty.price}</p>
                  {!propiedadYaComprada ? (
                    <>
                      <button
                        disabled={players[propertyBuyerIndex]?.money < currentProperty.price}
                        onClick={() => handleBuyProperty(currentProperty)}
                      >
                        Comprar
                      </button>
                      <button onClick={() => setShowPropertyModal(false)}>Pasar</button>
                    </>
                  ) : esPropietarioActual ? (
                    <button
                      onClick={() => {
                        sellProperty(currentTurn, currentProperty);
                        setShowPropertyModal(false);
                      }}
                    >
                      Vender
                    </button>
                  ) : (
                    <>
                      <p style={{color: 'red', fontWeight: 'bold'}}>Esta propiedad ya ha sido comprada por otro jugador.</p>
                      <button onClick={() => setShowPropertyModal(false)}>Cerrar</button>
                    </>
                  )}
                </div>
              );
            }
          })()
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
        <MoneyPanel />
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default Tablero;