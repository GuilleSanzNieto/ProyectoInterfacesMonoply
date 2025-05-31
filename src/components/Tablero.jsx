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
import Suerte from './Suerte.jsx';
import TradeDeal from './TradeDeal.jsx';
import PendingTrade from './PendingTrade.jsx';
import prision from '../images/prisoner.png';
import start from '../images/start.png';
import google from '../images/search.png';
import suerte from '../images/clover.png';
import metro from '../images/metro.png';
import juego from '../images/juego.png';

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

// Solo propiedades reales, índices coinciden con casillaNames
const propiedades = [
  { index: 1, name: "Centro de Enfermería (Ronda)", price: 100 },
  { index: 3, name: "Centro de Magisterio (Antequera)", price: 120 },
  { index: 6, name: "Biblioteca", price: 150 },
  { index: 8, name: "Pabellón de deportes", price: 180 },
  { index: 9, name: "Jardin botánico", price: 200 },
  { index: 11, name: "Comunicación", price: 220 },
  { index: 13, name: "Filosofía", price: 240 },
  { index: 14, name: "Derecho", price: 260 },
  { index: 16, name: "Educación", price: 280 },
  { index: 18, name: "Ciencias", price: 300 },
  { index: 19, name: "Medicina", price: 320 },
  { index: 21, name: "Turismo", price: 340 },
  { index: 23, name: "Estudios sociales", price: 360 },
  { index: 24, name: "Comercio", price: 380 },
  { index: 26, name: "Ciencias de la salud", price: 400 },
  { index: 27, name: "Psicología", price: 420 },
  { index: 29, name: "Industriales", price: 440 },
  { index: 31, name: "Bellas artes", price: 460 },
  { index: 32, name: "Económicas", price: 480 },
  { index: 34, name: "Arquitectura", price: 500 },
  { index: 37, name: "Telecomunicaciones", price: 520 },
  { index: 39, name: "ETSII", price: 540 },
];

function PropertiesPanel() {
  const { players } = useContext(PlayersContext);

  return (
    <div className="properties-panel">
      <h3>Propiedades de los jugadores</h3>
      {players.map((player, idx) => (
        <div key={idx} className="player-properties">
          <h4 style={{ color: player.color }}>
            {player.name || `Jugador ${idx + 1}`}
          </h4>
          <ul>
            {(player.properties || []).map((prop, i) => (
              <li key={i}>• {prop.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const getCasillaOverlayColor = (i) => {
  if ([1, 3].includes(i)) return 'brown';           // Casillas 1 y 3: rojo
  else if ([6, 8, 9].includes(i)) return 'blue';     // Casillas 6, 8 y 9: azul
  else if ([11, 13, 14].includes(i)) return 'pink';  // Casillas 11, 13 y 14: verde
  else if ([16, 18, 19].includes(i)) return 'orange'; // Casillas 16, 18 y 19: amarillo
  else if ([21, 23, 24].includes(i)) return 'red'; // Casillas 21, 23 y 24: morado
  else if ([26, 27, 29].includes(i)) return 'yellow'; // Casillas 26, 28 y 29: naranja
  else if ([31, 32, 34].includes(i)) return 'green';   // Casillas 31, 32 y 34: verde azulado
  else if ([37, 39].includes(i)) return 'purple';      // Casillas 37 y 39: rosa
  else return 'transparent'; // De lo contrario, sin franja
};

// Función para obtener el fondo de la casilla según el índice
const getCasillaBackground = (i) => {
  return "#ccffcc";

};

const Tablero = () => {
  const { players, currentTurn, nextTurn, updatePlayerPosition, spinning, setSpinning, buyProperty, sellProperty, setPlayers } = useContext(PlayersContext);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [valorDados, setValorDados] = useState([]);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [showSuerte, setShowSuerte] = useState(false);
  const [miniGameComponent, setMiniGameComponent] = useState(null);
  const [infoCasilla, setInfoCasilla] = useState(null); // Estado para mostrar la información de la casilla
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [propertyModalByLanding, setPropertyModalByLanding] = useState(false);
  const [propertyBuyerIndex, setPropertyBuyerIndex] = useState(null);
  const [payRentMessage, setPayRentMessage] = useState("");
  const [showJailModal, setShowJailModal] = useState(false);
  const [lastActions, setLastActions] = useState([]);
  const [showBankruptConfirm, setShowBankruptConfirm] = useState(false);
  const miniGameCells = [2, 7, 17, 22, 33, 38];
  const suerteCells = [4, 12, 28, 36];


  const casillaNames = [
    "INICIO",
    "Enfermería (Ronda)",
    <img src={juego} alt="Juego" style={{ width: "75%" }} />,
    "Magisterio (Antequera)",
    <img src={suerte} alt="Suerte" style={{ width: "85%" }} />,
    <img src={metro} alt="Metro" style={{ width: "75%" }} />,
    "Biblioteca",
    <img src={juego} alt="Juego" style={{ width: "75%" }} />,
    "Pabellón de deportes",
    "Jardin botanico",
    <img src={prision} alt="Prisión" style={{ width: "75%" }} />,
    "Comunicacion",
    <img src={suerte} alt="Suerte" style={{ width: "65%", transform: 'rotate(90deg)' }} />,
    "Filosofia",
    "Derecho",
    <img src={metro} alt="Metro" style={{ width: "75%" }} />,
    "Educacion",
    <img src={juego} alt="Juego" style={{ width: "75%" }} />,
    "Ciencias",
    "Medicina",
    <img src={google} alt="Google" style={{ width: "75%" }} />,
    "Turismo",
    <img src={juego} alt="Juego" style={{ width: "75%" }} />,
    "Estudios sociales",
    "Comercio",
    <img src={metro} alt="Metro" style={{ width: "75%" }} />,
    "Ciencias de la salud",
    "Psicologia",
    <img src={suerte} alt="Suerte" style={{ width: "85%" }} />,
    "Industriales",
    "Go to prision",
    "Bellas artes",
    "Económicas",
    <img src={juego} alt="Juego" style={{ width: "75%" }} />,
    "Arquitectura",
    <img src={metro} alt="Metro" style={{ width: "75%" }} />,
    <img src={suerte} alt="Suerte" style={{ width: "65%", transform: 'rotate(270deg)' }} />,
    "Telecomunicaciones",
    <img src={juego} alt="Juego" style={{ width: "75%" }} />,
    "ETSII",
    <img src={start} alt="Inicio" style={{ width: "75%" }} />
  ];


  const pendingTradeOffer = players[currentTurn]?.pendingTradeOffer;

  const addAction = (action) => {
    setLastActions(prev => [action, ...prev].slice(0, 3));
  };

  const executeWhenAnimationEnds = (finalPosition) => {
    setValorDados([]);
    setActiveIndexes([]);

    let extraTurn = false; // Bandera para el turno extra

    if (suerteCells.includes(finalPosition)) {
      const currentName = players[currentTurn].name; // Capturamos el nombre antes de que se modifique algo
      const outcomes = [
        { message: `${currentName} ha recibido una bonificación`, effect: 'bonus', moneyChange: +200 },
        { message: `${currentName} ha pagado una multa`, effect: 'fine', moneyChange: -200 },
        { message: `${currentName} recibe un turno extra`, effect: 'extraTurn' }
      ];

      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];


      addAction(outcome.message);


      switch (outcome.effect) {
        case 'bonus':
        case 'fine':
          setPlayers(prevPlayers =>
            prevPlayers.map((player, idx) =>
              idx === currentTurn ? { ...player, money: player.money + outcome.moneyChange } : player
            )
          );
          break;
        case 'extraTurn':
          extraTurn = true;
          break;
        default:
          break;
      }

      setShowSuerte(outcome);




    }

    if (miniGameCells.includes(finalPosition)) {
      // Si cae en una casilla de minijuego, ejecuta un minijuego aleatorio 
      executeMiniGameRandom();
      return;
    }

    // Si no se obtuvo turno extra, se pasa el turno sin agregar mensaje adicional
    if (!extraTurn) {
      nextTurn();
    }

    setSpinning(false);
  };

  const executeMiniGameRandom = () => {
    // Lista de mini juegos disponibles
    const miniGamesArray = [TicTacToe, WordSearch, MemoriCard, Conecta4, MatesTest, PiedraPapelTijera, Trivial];
    const randomIndex = Math.floor(Math.random() * miniGamesArray.length);
    console.log('Ejecutando minijuego:', miniGamesArray[randomIndex].name);

    const onGameEnd = (winnerIndex) => {
      const reward = 100; // Cantidad de dinero que se suma al ganador

      if (winnerIndex !== null && winnerIndex >= 0) {
        // Si hay un ganador, se le suma el dinero
        const winnerName = players[winnerIndex].name;
        setPlayers(prevPlayers =>
          prevPlayers.map((player, idx) =>
            idx === winnerIndex ? { ...player, money: player.money + reward } : player
          )
        );
        addAction(`${winnerName} ha ganado el minijuego y ha recibido ${reward}€`);
      }
      else {
        addAction(`El minijuego ha terminado sin un ganador`);
      }
      setShowMiniGame(false);
      nextTurn();
    };

    setMiniGameComponent(() => miniGamesArray[randomIndex]);
    setShowMiniGame(true);
  };

  const setEndMinigame = (value) => {
    if (value === false) {
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
      const idx = (start + i) % 40;
      newActiveIndexes.push(idx);
      // Si pasa por la casilla 0 (salida), suma 200€ (pero no en la posición inicial)
      if (idx === 40) {
        setPlayers(prevPlayers => prevPlayers.map((player, index) =>
          index === currentTurn ? { ...player, money: player.money + 200 } : player
        ));
      }
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

      // Si cae en "go to prision" (índice 30)
      if (finalPos === 30) {
        // Mueve al jugador a la prisión (índice 10) y lo marca como en prisión
        setPlayers(prevPlayers =>
          prevPlayers.map((player, idx) =>
            idx === currentTurn ? { ...player, position: 10, inJail: true } : player
          )
        );
        addAction(`${players[currentTurn].name} ha sido enviado a prisión`);
        setTimeout(() => {
          nextTurn();
          setSpinning(false);
        }, 1000);
        return;
      }

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
      addAction(`${players[currentTurn].name} ha tirado los dados`);
      const sumaDados = valorDados[0] + valorDados[1];
      const currentPos = players[currentTurn]?.position || 0;

      // Si el jugador está en prisión
      if (players[currentTurn]?.inJail) {
        if (valorDados[0] === valorDados[1]) {
          setPlayers(prevPlayers =>
            prevPlayers.map((player, idx) =>
              idx === currentTurn ? { ...player, inJail: false } : player
            )
          );
          addAction(`${players[currentTurn].name} ha sacado dobles y sale de prisión`);
          animation(currentPos, sumaDados);
        } else {
          addAction(`${players[currentTurn].name} no ha sacado dobles y sigue en prisión`);
          setTimeout(() => {
            nextTurn();
            setSpinning(false);
          }, 1000);
        }
        setValorDados([]);
        return;
      } else {
        animation(currentPos, sumaDados);

        if(currentPos + sumaDados == 10){
          //Si cae en prision
          setPlayers(prevPlayers =>
            prevPlayers.map((player, idx) =>
              idx === currentTurn ? { ...player, position: 10, inJail: true } : player
            )
          );
        }
        
      }

    }
  }, [valorDados, showMiniGame]);

  useEffect(() => {
    if (players[currentTurn]?.inJail) {
      setShowJailModal(true);
    }
  }, [currentTurn]);

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
    const isCorner = [0, 10, 20, 30, 40].includes(i);
    const isActive = activeIndexes.includes(i);

    casillas.push(
      <div
        key={i}
        className={`casilla ${isCorner ? 'casilla-esquina' : ''} ${isActive ? 'recorrer' : ''}`}
        onClick={() => handleCasillaClick(i)}
        style={{ backgroundColor: getCasillaBackground(i) }}  // Se asigna el fondo aquí
      >
        <div className="content">
          <span className="nombre-casilla">
            {casillaNames[i]}
          </span>
        </div>
        <div
          className="color"
          style={{ backgroundColor: getCasillaOverlayColor(i) }}
        ></div>
        <div className="tokens">
          {mostarTokens(i)}
        </div>
      </div>
    );
  }

  const handleBuyProperty = (property) => {
    if (propertyBuyerIndex !== null) {
      buyProperty(propertyBuyerIndex, property);
      addAction(`${players[propertyBuyerIndex].name} ha comprado ${property.name}`);
      setShowPropertyModal(false);
      setPropertyBuyerIndex(null);
    }
  };

  const handlePayRent = (ownerIndex, rentPrice) => {
    const payerIndex = propertyBuyerIndex;
    if (players[payerIndex].money >= rentPrice) {
      // Descontar al jugador actual
      players[payerIndex].money -= rentPrice;

      // Sumar al dueño
      players[ownerIndex].money += rentPrice;

      // Actualizar el estado global
      const updatedPlayers = [...players];
      setPlayers(updatedPlayers);

      setPayRentMessage(`Has pagado ${rentPrice}€ a ${players[ownerIndex].name}`);
      addAction(`${players[payerIndex].name} ha pagado ${rentPrice}€ de alquiler a ${players[ownerIndex].name}`);
    } else {
      setPayRentMessage("No tienes suficiente dinero para pagar el alquiler.");
      addAction(`${players[payerIndex].name} no tiene suficiente dinero para pagar el alquiler a ${players[ownerIndex].name}`);
    }

    setTimeout(() => {
      setShowPropertyModal(false);
      setPropertyBuyerIndex(null);
      setPayRentMessage("");
    }, 2000);
  };

  const handleBankrupt = () => {
    addAction(`${players[currentTurn].name} ha declarado bancarrota`);
    setPlayers(prevPlayers => {
      const newPlayers = prevPlayers.filter((_, idx) => idx !== currentTurn);
      // Si el jugador eliminado era el último, retrocede el turno
      if (currentTurn >= newPlayers.length && newPlayers.length > 0) {
        nextTurn();
      }
      return newPlayers;
    });
    // Si solo queda un jugador, puedes mostrar un mensaje de victoria si lo deseas
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
        {/* {valorDados[0] && valorDados[1] && (
          <p className="dice-sum">
            {valorDados[0]} + {valorDados[1]} = {valorDados[0] + valorDados[1]}
          </p>
        )} */}
        {players.length > 0 && (
          <p
            className="turno-jugador"
            style={{
              backgroundColor: players[currentTurn].color, // Fondo del color del jugador
              color: "white", // Texto en blanco
              padding: "10px", // Espaciado interno
              borderRadius: "5px", // Bordes redondeados
              textAlign: "center", // Centrar el texto
            }}
          >
            Turno de: {players[currentTurn].name}
          </p>
        )}
        {/* Registro de las últimas 3 acciones, debajo del turno y encima del botón de bancarrota */}
        <div className="actions-log" style={{ marginTop: '8px' }}>
          {lastActions.map((action, index) => (
            <p key={index} style={{ margin: '0.2rem 0', fontSize: '1rem' }}>
              {action}
            </p>
          ))}
        </div>
        <button
          onClick={() => {
            setSpinning(true); // Permite lanzar los dados
          }}
        >
          Tirar dados
        </button>


      </div>
    </div>
  )

  const [showTradeDeal, setShowTradeDeal] = useState(false);

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


        {showSuerte && (
          <div className="suerte-modal" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '10px', border: '1px solid black', borderRadius: '5px', zIndex: 10 }}>
            <Suerte outcome={showSuerte} onClose={() => setShowSuerte(false)} />
          </div>
        )}


        {showPropertyModal && currentProperty && (
          (() => {
            // Comprobar si la propiedad ya pertenece a algún jugador
            const propiedadYaComprada = players.some(player => player.properties?.some(p => p.index === currentProperty.index));
            const esPropietarioActual = players[propertyBuyerIndex]?.properties?.some(p => p.index === currentProperty.index);
            const ownerIndex = players.findIndex(player => player.properties?.some(p => p.index === currentProperty.index));
            if (propertyModalByLanding) {
              return (
                <div className="property-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="property-modal-content" style={{ background: '#fff', borderRadius: '12px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.25)', minWidth: '260px', maxWidth: '90vw', textAlign: 'center' }}>
                    <h3>{currentProperty.name}</h3>
                    <p>Precio: ${currentProperty.price}</p>
                    {payRentMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{payRentMessage}</p>}
                    {!propiedadYaComprada ? (
                      <>
                        <button className="comprar-btn"
                          disabled={players[propertyBuyerIndex]?.money < currentProperty.price}
                          onClick={() => handleBuyProperty(currentProperty)}
                        >
                          Comprar
                        </button>
                        <button className="pasar-btn">
                          onClick={() => { setShowPropertyModal(false); addAction(`${players[propertyBuyerIndex].name} ha pasado el turno`); }}
                          Pasar
                        </button>
                      </>
                    ) : esPropietarioActual ? (
                      <>
                        <button
                          className="vender-btn"
                          onClick={() => {
                            sellProperty(propertyBuyerIndex, currentProperty);
                            setShowPropertyModal(false);
                          }}
                        >
                          Vender
                        </button>
                        <button onClick={() => setShowPropertyModal(false)}>Cerrar</button>
                      </>
                    ) : (
                      <>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Esta propiedad ya ha sido comprada por otro jugador.</p>
                        <button
                          onClick={() => handlePayRent(ownerIndex, currentProperty.price)} // Usa el precio dinámico
                          disabled={payRentMessage !== ""}
                        >
                          Pagar {currentProperty.price}€ de alquiler
                        </button>
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
                      <button onClick={() => { setShowPropertyModal(false); addAction(`${players[propertyBuyerIndex].name} ha pasado el turno`); }}>Pasar</button>
                    </>
                  ) : esPropietarioActual ? (
                    <>
                      <button
                        onClick={() => {
                          sellProperty(currentTurn, currentProperty);
                          setShowPropertyModal(false);
                        }}
                      >
                        Vender
                      </button>
                      <button onClick={() => setShowPropertyModal(false)}>Cerrar</button>
                    </>
                  ) : (
                    <>
                      <p style={{ color: 'red', fontWeight: 'bold' }}>Esta propiedad ya ha sido comprada por otro jugador.</p>
                      <button
                        onClick={() => handlePayRent(ownerIndex, currentProperty.price)} // Usa el precio dinámico
                        disabled={payRentMessage !== ""}
                      >
                        Pagar {currentProperty.price}€ de alquiler
                      </button>
                    </>
                  )}
                </div>
              );
            }
          })()
        )}


        {pendingTradeOffer && (
          <PendingTrade
            tradeOffer={pendingTradeOffer}
            onAccept={() => {
              const tradeOffer = pendingTradeOffer;
              const proposerIndex = tradeOffer.from;
              const responderIndex = currentTurn; // Quien recibe la oferta
              const updatedPlayers = [...players];

              // Intercambio de dinero
              updatedPlayers[proposerIndex].money =
                updatedPlayers[proposerIndex].money - tradeOffer.proposerMoney + tradeOffer.responderMoney;
              updatedPlayers[responderIndex].money =
                updatedPlayers[responderIndex].money - tradeOffer.responderMoney + tradeOffer.proposerMoney;

              // Intercambia las propiedades del proposer
              if (Array.isArray(tradeOffer.proposerProperties)) {
                tradeOffer.proposerProperties.forEach(propIndexStr => {
                  const propIndex = parseInt(propIndexStr, 10);
                  const prop = updatedPlayers[proposerIndex].properties?.find(p => p.index === propIndex);
                  if (prop) {
                    updatedPlayers[proposerIndex].properties = updatedPlayers[proposerIndex].properties.filter(p => p.index !== propIndex);
                    updatedPlayers[responderIndex].properties = [...(updatedPlayers[responderIndex].properties || []), prop];
                  }
                });
              }

              // Intercambia las propiedades del responder
              if (Array.isArray(tradeOffer.responderProperties)) {
                tradeOffer.responderProperties.forEach(propIndexStr => {
                  const propIndex = parseInt(propIndexStr, 10);
                  const prop = updatedPlayers[responderIndex].properties?.find(p => p.index === propIndex);
                  if (prop) {
                    updatedPlayers[responderIndex].properties = updatedPlayers[responderIndex].properties.filter(p => p.index !== propIndex);
                    updatedPlayers[proposerIndex].properties = [...(updatedPlayers[proposerIndex].properties || []), prop];
                  }
                });
              }

              // Quitamos la oferta pendiente
              updatedPlayers[responderIndex].pendingTradeOffer = null;
              setPlayers(updatedPlayers);
            }}
            onReject={() => {
              const updatedPlayers = [...players];
              updatedPlayers[currentTurn].pendingTradeOffer = null;
              setPlayers(updatedPlayers);
            }}
          />
        )}

        {showJailModal && (
          <div className="jail-modal" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '2px solid #333', borderRadius: '10px', zIndex: 1000 }}>
            <h3>¡Estás en prisión!</h3>
            <p>{players[currentTurn].name}, elige una opción:</p>
            <button
              className="jail-btn"
              onClick={() => {
                // Pagar 100 y salir
                setPlayers(prevPlayers =>
                  prevPlayers.map((player, idx) =>
                    idx === currentTurn
                      ? { ...player, money: player.money - 100, inJail: false }
                      : player
                  )
                );
                addAction(`${players[currentTurn].name} ha pagado $100 para salir de prisión`);
                setShowJailModal(false);
              }}
              disabled={players[currentTurn].money < 100}
            >
              Pagar 100€ y salir
            </button>
            <button
              className="jail-btn"
              onClick={() => {
                setShowJailModal(false);
                setSpinning(true); // Permite lanzar los dados
              }}
            >
              Tirar dados
            </button>
          </div>
        )}

      </div>





      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <button
          style={{ marginTop: '1rem', background: '#d32f2f', color: 'white' }}
          onClick={() => setShowBankruptConfirm(true)}
        >
          Bancarrota
        </button>
        <button
          onClick={() => setShowTradeDeal(true)}
          style={{ padding: '10px 20px', fontSize: '1rem', marginTop: '1rem' }}>
          Realizar Trato
        </button>
        
        </div>
        <MoneyPanel />
        <PropertiesPanel />
        
        
      </div>
      {showTradeDeal && <TradeDeal onClose={() => setShowTradeDeal(false)} />}
      {showBankruptConfirm && (
        <div
          className="bankrupt-modal"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '2px solid black',
            borderRadius: '10px',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <h3>¿Estás seguro de declarar bancarrota?</h3>
          <div style={{ marginTop: '10px' }}>
            <button
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={() => {
                handleBankrupt(); // Llama a la función de bancarrota
                setShowBankruptConfirm(false); // Cierra el modal
              }}
            >
              Sí
            </button>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={() => setShowBankruptConfirm(false)} // Cierra el modal
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tablero;