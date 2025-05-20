import React, { useState, useEffect } from 'react';
import instrucciones from '../images/imagesAyuda.png';
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa';
import './styles/PiedraPapelTijera.css';
import './styles/commonStyles.css'; // Importa los estilos comunes para el overlay

const PiedraPapelTijera = ({ visible, onGameEnd }) => {
  const opciones = ['Piedra', 'Papel', 'Tijera'];
  const [eleccionUsuario, setEleccionUsuario] = useState('');
  const [eleccionOrdenador, setEleccionOrdenador] = useState('');
  const [resultado, setResultado] = useState('');
  const [puntuacionUsuario, setPuntuacionUsuario] = useState(0);
  const [puntuacionOrdenador, setPuntuacionOrdenador] = useState(0);
  const [rondas, setRondas] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [showInstrucciones, setShowInstrucciones] = useState(false);

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3']; // Colores para los confetti

  // Mientras el ordenador no tenga una selección y aún no se hayan completado las 3 rondas, cicla los emoticonos
  useEffect(() => {
    if (rondas < 3 && !eleccionOrdenador) {
      const interval = setInterval(() => {
        setCycleIndex(prev => (prev + 1) % opciones.length);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [eleccionOrdenador, opciones.length, rondas]);

  const jugar = (eleccion) => {
    setEleccionUsuario(eleccion);
    const eleccionOrd = opciones[Math.floor(Math.random() * opciones.length)];
    setEleccionOrdenador(eleccionOrd);
    determinarGanador(eleccion, eleccionOrd);

    // Después de 1 segundo, se limpia la elección para que el ordenador pueda dejar de iterar (o reiniciar el ciclo si aún no se han jugado 3 rondas)
    setTimeout(() => {
      setEleccionOrdenador('');
      setCycleIndex(0);
      setEleccionUsuario('');
      setResultado('');
    }, 1000);
  };

  const determinarGanador = (usuario, ordenador) => {
    if (usuario === ordenador) {
      setResultado('Empate');
    } else if (
      (usuario === 'Piedra' && ordenador === 'Tijera') ||
      (usuario === 'Papel' && ordenador === 'Piedra') ||
      (usuario === 'Tijera' && ordenador === 'Papel')
    ) {
      setResultado('Ganaste');
      //Vuelve al tablero
      setTimeout(() => {
        visible(false);
      }, 3000);
      setPuntuacionUsuario(puntuacionUsuario + 1);
    } else {
      setResultado('Perdiste');
       //Vuelve al tablero
       setTimeout(() => {
        visible(false);
      }, 3000);
      setPuntuacionOrdenador(puntuacionOrdenador + 1);
    }
    setRondas(rondas + 1);

    //si se completan las 3 rondas, determinar el ganador final
    if (rondas + 1 === 3){
      setTimeout(() => {
        if (puntuacionUsuario > puntuacionOrdenador){
          if (onGameEnd) onGameEnd(0);
        }
        else if (puntuacionUsuario < puntuacionOrdenador){
          if (onGameEnd) onGameEnd(null);
        }
        visible(false);
    }, 3000);
    }
  };

  const reiniciarJuego = () => {
    setEleccionUsuario('');
    setEleccionOrdenador('');
    setResultado('');
    setPuntuacionUsuario(0);
    setPuntuacionOrdenador(0);
    setRondas(0);
    setCycleIndex(0);
  };

  const obtenerIcono = (opcion) => {
    switch (opcion) {
      case 'Piedra':
        return <FaHandRock />;
      case 'Papel':
        return <FaHandPaper />;
      case 'Tijera':
        return <FaHandScissors />;
      default:
        return null;
    }
  };

  return (
    <div className="game-container">
      <h1>Piedra, Papel o Tijera</h1>
      <div className="header-container">
        <button
        className="instrucciones-button"
        onClick={() => setShowInstrucciones(true)}
        title="Instrucciones"
      >
        <img src={instrucciones} alt="Instrucciones" className="instrucciones-icon" />
        </button>
      </div>
      {/* Área de la elección del ordenador */}
      <div className="computer-display">
        { eleccionOrdenador 
          ? obtenerIcono(eleccionOrdenador) 
          : obtenerIcono(opciones[cycleIndex])
        }
      </div>
      <div className="scoreboard">
        <div className="score">Usuario: {puntuacionUsuario}</div>
        <div className="score">Ordenador: {puntuacionOrdenador}</div>
      </div>
      <div className="botones">
        <button onClick={() => jugar('Piedra')} disabled={rondas >= 3}><FaHandRock /></button>
        <button onClick={() => jugar('Papel')} disabled={rondas >= 3}><FaHandPaper /></button>
        <button onClick={() => jugar('Tijera')} disabled={rondas >= 3}><FaHandScissors /></button>
      </div>
      <div className="info">
        <p>Tu elección: {eleccionUsuario && obtenerIcono(eleccionUsuario)}</p>
        <p>Resultado: {resultado}</p>
      </div>
      {rondas >= 3 && (
        <div className="overlay">
          <div className={puntuacionUsuario > puntuacionOrdenador ? "win-message" : "losser-message"}>
            {puntuacionUsuario > puntuacionOrdenador && (
              <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      '--delay': `${Math.random() * 3}s`,
                      '--left': `${Math.random() * 100}%`,
                      '--duration': `${Math.random() * 3 + 2}s`,
                      backgroundColor: colors[Math.floor(Math.random() * colors.length)]
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showInstrucciones && (
          <div className="instrucciones-overlay">
            <div className="instrucciones-panel">
              <h2>✊✋✌️ Piedra, Papel o Tijera</h2>
              <div className="instrucciones-contenido">
                <p><strong>🎯 Objetivo: </strong><br/>
                      Gana más rondas que el ordenador eligiendo estratégicamente entre Piedra, Papel o Tijera.
                </p>
                <p>
                  <strong>🕹️ Cómo jugar: </strong><br/>
                  - Elige una opción haciendo clic en el símbolo correspondiente. <br/>
                  - El ordenador seleccionará aleatoriamente su jugada. <br/>
                  - Se juega un total de 3 rondas. <br/>
                  - Gana quien obtenga más victorias al final de las 3 rondas. <br/>
                </p>
                <p>
                  <strong>📊 Reglas: </strong><br/>
                  - Piedra aplasta a Tijera 🪨✂️ <br/>
                  - Tijera corta a Papel ✂️📄 <br/>
                  - Papel envuelve a Piedra 📄🪨 <br/>
                </p>
                <p>
                  <strong>🏆 Resultado: </strong><br/>
                    Al completar las 3 rondas, verás si ganaste, perdiste o empataste contra el ordenador. <br/>
                    ¡Buena suerte! 🤜🤛
                </p>
              </div>
              <button onClick={() => setShowInstrucciones(false)}>
                Cerrar
              </button>
            </div>
          </div>
      )}
    </div>
  );
};

export default PiedraPapelTijera;