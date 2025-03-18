import React, { useState, useEffect } from 'react';
import './styles/PiedraPapelTijera.css';

const PiedraPapelTijera = () => {
  const opciones = ['Piedra', 'Papel', 'Tijera'];
  const [eleccionUsuario, setEleccionUsuario] = useState('');
  const [eleccionOrdenador, setEleccionOrdenador] = useState('');
  const [resultado, setResultado] = useState('');
  const [puntuacionUsuario, setPuntuacionUsuario] = useState(0);
  const [puntuacionOrdenador, setPuntuacionOrdenador] = useState(0);
  const [rondas, setRondas] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);

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
      setPuntuacionUsuario(puntuacionUsuario + 1);
    } else {
      setResultado('Perdiste');
      setPuntuacionOrdenador(puntuacionOrdenador + 1);
    }
    setRondas(rondas + 1);
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

  const obtenerEmoticono = (opcion) => {
    switch (opcion) {
      case 'Piedra':
        return '✊';
      case 'Papel':
        return '✋';
      case 'Tijera':
        return '✌️';
      default:
        return '';
    }
  };

  return (
    <div className="game-container">
      <h1>Piedra, Papel o Tijera</h1>
      {/* Área de la elección del ordenador */}
      <div className="computer-display">
        { eleccionOrdenador 
          ? obtenerEmoticono(eleccionOrdenador) 
          : obtenerEmoticono(opciones[cycleIndex])
        }
      </div>
      <div className="scoreboard">
        <div className="score">Usuario: {puntuacionUsuario}</div>
        <div className="score">Ordenador: {puntuacionOrdenador}</div>
      </div>
      <div className="botones">
        <button onClick={() => jugar('Piedra')} disabled={rondas >= 3}>✊</button>
        <button onClick={() => jugar('Papel')} disabled={rondas >= 3}>✋</button>
        <button onClick={() => jugar('Tijera')} disabled={rondas >= 3}>✌️</button>
      </div>
      <div className="info">
        <p>Tu elección: {eleccionUsuario && obtenerEmoticono(eleccionUsuario)}</p>
        <p>Resultado: {resultado}</p>
      </div>
      {rondas >= 3 && (
        <div className="final">
          <h2>
            {puntuacionUsuario > puntuacionOrdenador
              ? '¡Ganaste el juego!'
              : puntuacionUsuario < puntuacionOrdenador
              ? 'Perdiste el juego'
              : 'Empate, juega una ronda más para desempatar'}
          </h2>
          {puntuacionUsuario === puntuacionOrdenador && (
            <button onClick={() => jugar(opciones[Math.floor(Math.random() * opciones.length)])}>
              Jugar Ronda de Desempate
            </button>
          )}
          <button onClick={reiniciarJuego}>Reiniciar Juego</button>
        </div>
      )}
    </div>
  );
};

export default PiedraPapelTijera;