import React, { useState, useContext, useEffect} from 'react';
import './styles/Inicio.css';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import ColorPicker from './ColorPicker.jsx';
import  logoUma from '../images/logoUMA.png';
import ajustes from '../images/imagesAjustes.png';
import instrucciones from '../images/imagesAyuda.png';
import { useSettings } from './SettingsContext.jsx';
import { SettingsPanel } from './SettingsPanel.jsx';
import { useTranslation } from './i18n.js';

//para poder hacer el commit de la Primera entrega 

function Inicio({ onStart }) {
  const settings = useSettings();
  const {players, setPlayers} = useContext(PlayersContext);
  const [numPlayers, setNumPlayers] = useState(2);
  const [errors, setErrors] = useState([]);
  const [showColorPickerIndex, setShowColorPickerIndex] = useState(null);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const t = useTranslation(); 

  console.log('showSettings:', showSettings);
  const allColors = [
    { class: "color-morado", hex: "#5e005e" },
    { class: "color-azul", hex: "#003366" },
    { class: "color-verde", hex: "#006400" },
    { class: "color-rojo", hex: "#990000" },
  ];
  
  const usedColors = players.map(player => player.color);


  const handleNumPlayersChange = (num) => {
    setNumPlayers(num);
    setPlayers(
      Array.from({ length: num }, (_, i) => players[i] || { name: '', color: '#000000', position: 0, money: 3000, properties: [] })
    );
  };


  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);

    const updateErrors = [...errors];
    if(updateErrors[index]){
      updateErrors[index][field] = false;
    }
    setErrors(updateErrors);
  };

  const handleStart = () => {
    //Validamos cada jugador si ha rellenado el nombre y el color
    const validationErrors = players.map(player => ({
      name: player.name.trim() === '',
      //suponeos que si el color es #000000 no ha elegido color
      color: !player.color || player.color === '#000000'

    }));
    const nombres = players.map(player => player.name.trim());
    const nombresRepetidos = nombres.filter((item, index) => nombres.indexOf(item) !== index);
    // Si hay nombres repetidos, marcamos el error
    if (nombresRepetidos.length > 0) {
      players.forEach((player, index) => {
        if (nombresRepetidos.includes(player.name.trim().toLowerCase())) {
          validationErrors[index].name = true;
        }
      }
      );
    }
    const hasErrors = validationErrors.some(error => error.name || error.color);
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }
    // Si no hay errores, se puede iniciar el juego
    setErrors([]);
    onStart();
  };

 return (
    <div className="inicio-container">
      <h1 className="titulo-principal">Monopoly UMA</h1>
      <div className="header-container">
        <div className="logo">
          <img src={logoUma} alt="Logo UMA" className="logo" />
        </div>

        <button
          className="settings-button"
          onClick={() => setShowSettings(true)}
          title={t.ajustesTitulo}
        >
          <img src={ajustes} alt={t.ajustesTitulo} className="settings-icon" />
        </button>

        <button
          className="instrucciones-button"
          onClick={() => setShowInstrucciones(true)}
          title={t.instruccionesTitulo}
        >
          <img src={instrucciones} alt={t.instruccionesTitulo} className="instrucciones-icon" />
        </button>
      </div>

      <h2 className="numero-jugadores">{t.numeroJugadores}</h2>

      <div className="player-selection">
        {[2, 3, 4].map(n => (
          <button
            key={n}
            className={n === numPlayers ? 'selected player-button' : 'player-button'}
            onClick={() => {
              setNumPlayers(n);
              setPlayers(Array.from(
                { length: n },
                (_, i) => players[i] || { name: '', color: '#000000', position: 0, money: 3000, properties: [] }
              ));
            }}
          >
            {n}
          </button>
        ))}
      </div>
      {players.map((player, index) => (
        <div key={index} className="player-input">
          <input
            type="text"
            placeholder={`${t.nombreJugador || 'Nombre del jugador'} ${index + 1}`} 
            aria-label={`Nombre del jugador ${index + 1}`}
            value={player.name}
            onChange={e => {
              const updated = [...players];
              updated[index].name = e.target.value;
              setPlayers(updated);
              setErrors(prev => {
                const copy = [...prev];
                if (copy[index]) copy[index].name = false;
                return copy;
              });
            }}
            className={errors[index]?.name ? 'input-error' : ''}
          />
          <div
            className={errors[index]?.color ? 'input-errorCirculo' : 'color-preview'}
            style={{ backgroundColor: player.color }}
            onClick={() => setShowColorPickerIndex(index)}
          />
        </div>
      ))}

      <button className="start-button" onClick={handleStart}>
        {t.jugar}
      </button>

      {showColorPickerIndex !== null && (
        <ColorPicker
          allColors={allColors}
          usedColors={players
            .map((p, i) => i !== showColorPickerIndex ? p.color : null)
            .filter(Boolean)
          }
          onColorSelect={col => {
            handlePlayerChange(showColorPickerIndex, 'color', col);
            setShowColorPickerIndex(null);
          }}
          onClose={() => setShowColorPickerIndex(null)}
        />
      )}

      {showInstrucciones && (
        <div className="instrucciones-overlay">
          <div className="instrucciones-panel">
            <h2>{t.instruccionesTitulo}</h2>
            <div className="instrucciones-contenido">
              <p>
                <strong>🎯 Objetivo:</strong> <br/>
                Consigue ser el jugador con más propiedades y dinero al final de la partida.
              </p>
              <p>
                <strong>🛠️ Cómo jugar:</strong> <br/>
                - Tira los dados para avanzar por el tablero. <br/>
                - Compra propiedades cuando caigas en casillas disponibles. <br/>
                - Si otro jugador cae en tu propiedad, te pagará alquiler. <br/>
                - Si caes en una casilla de Suerte o Caja de Comunidad, sigue las instrucciones de la carta. <br/>
                - Negocia e intercambia propiedades con otros jugadores para mejorar tu posición. <br/>
                - Si no puedes pagar una deuda, tendrás que cender propiedades o declararte en bancarrota. <br/>
                - El juego termina cuando solo queda un jugador, que será el ganador. 🏆
              </p>
              <p>
                <strong>💡 Consejo:</strong> <br/>
                ¡Invierte sabiamente y negocia con inteligencia! A veces, una buena alianza puede ser la clave para la victoria.
              </p>
            </div>
            <button onClick={() => setShowInstrucciones(false)}>
              {t.cerrar}
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
export default Inicio;