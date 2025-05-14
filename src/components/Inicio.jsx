import React, { useState, useContext } from 'react';
import './styles/Inicio.css';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import ColorPicker from './ColorPicker.jsx';
import  logoUma from '../images/logoUMA.png';
import ajustes from '../images/imagesAjustes.png';
import instrucciones from '../images/imagesAyuda.png';

function Inicio({ onStart }) {
  const {players, setPlayers} = useContext(PlayersContext);
  const [numPlayers, setNumPlayers] = useState(2);
  const [errors, setErrors] = useState([]);
  const [showColorPickerIndex, setShowColorPickerIndex] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [modoDaltonico, setModoDaltonico] = useState(false);
  const [idioma,setIdioma] = useState('es');
  const [modoOscuro, setModoOscuro] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);


  const allColors = [
    { class: "color-rojo", hex: "#f44336" },
    { class: "color-rosa", hex: "#e91e63" },
    { class: "color-morado", hex: "#9c27b0" },
    { class: "color-azul", hex: "#3f51b5" },
    { class: "color-celeste", hex: "#03a9f4" },
    { class: "color-verdeagua", hex: "#009688" },
    { class: "color-verde", hex: "#4caf50" },
    { class: "color-naranja", hex: "#ff9800" },
    { class: "color-marron", hex: "#795548" },
  ];
  
  const usedColors = players.map(player => player.color);


  const handleNumPlayersChange = (num) => {
    setNumPlayers(num);
    setPlayers(
      Array.from({ length: num }, (_, i) => players[i] || { name: '', color: '#000000', position: 0, money: 5500, properties: [] })
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
      <div className="header-container">
        <div className="logo">
          <img src={logoUma} alt="Logo" className='logo'/>
        </div>
        <button className="settings-button" onClick={() => setShowSettings(true)} title= "Ajustes">
          <img src={ajustes} alt="Ajustes" className='settings-icon'/>
        </button>
        <button className="instrucciones-button" onClick={() => setShowInstrucciones(true)} title= "Instrucciones">
          <img src={instrucciones} alt="Instrucciones" className='instrucciones-icon'/>
        </button>

      </div>
      <h3>Número de Jugadores</h3>
      <div className="player-selection">
        {[2, 3, 4].map(num => (
          <button
            key={num}
            className={num === numPlayers ? 'selected player-button' : 'player-button'}
            onClick={() => handleNumPlayersChange(num)}
          >
            {num}
          </button>
        ))}
      </div>
      {players.map((player, index) => (
        <div key={index} className="player-input">
          <input
            type="text"
            placeholder={`Nombre del jugador ${index + 1}`}
            value={player.name}
            onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
            className={errors[index]?.name ? "input-error" : ""}
          />
          <div
            className={errors[index]?.color ? "input-errorCirculo" : `color-preview`}
            style={{ backgroundColor: player.color }}
            onClick={() => setShowColorPickerIndex(index)}>
          </div>
        </div>
      ))}
      <button className="start-button" onClick={handleStart}>JUGAR</button>
      {showColorPickerIndex !== null && (
        <ColorPicker
          allColors={allColors}
          usedColors={players.map((p, i) => i !== showColorPickerIndex ? p.color : null).filter(Boolean)}
          onColorSelect={(selectedColor) => {
            handlePlayerChange(showColorPickerIndex, 'color', selectedColor); // selectedColor es ahora un valor hexadecimal
            setShowColorPickerIndex(null);
          }}
          
          onClose={() => setShowColorPickerIndex(null)}
        />
      )}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-panel">
            <h2>Ajustes del juego</h2>
            <label>
              <input
                type="checkbox"
                checked={modoDaltonico}
                onChange={(e) => setModoDaltonico(e.target.checked)}
              />
              Modo daltónico
            </label>
            <label>
              Idioma:
              <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={modoOscuro}
                onChange={(e) => setModoOscuro(e.target.checked)}
              />
              Modo oscuro
            </label>
            <button onClick={() => setShowSettings(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {showInstrucciones && (
      <div className="instrucciones-overlay">
        <div className="instrucciones-panel">
          <h2>📜 Instrucciones del Monopoly UMA</h2>
          <div className="instrucciones-contenido">
            <p><strong>🎯 Objetivo:</strong> Sé el último jugador en pie sin bancarrota, comprando propiedades, cobrando alquileres y construyendo aulas y facultades.</p>
            
            <p><strong>🎲 Inicio:</strong> Cada jugador elige ficha, color y recibe $5500 UMA. Coloca tu ficha en la casilla de <em>“INICIO”</em>.</p>

            <p><strong>🚶 Turnos:</strong> En tu turno:</p>
            <ul>
              <li>Lanza los dados y avanza tu ficha.</li>
              <li>Si caes en una propiedad libre, puedes comprarla.</li>
              <li>Si no la compras, pasas el turno.</li>
              <li>Si es de otro jugador, pagas alquiler.</li>
            </ul>

            <p><strong>🏗️ Construcción:</strong> Si tienes todas las propiedades del mismo color, puedes edificar:</p>
            <ul>
              <li>Primero aulas, luego facultades.</li>
              <li>El alquiler aumenta con cada construcción.</li>
            </ul>

            <p><strong>📚 Cárcel:</strong> Puedes salir:</p>
            <ul>
              <li>Pagando $200 a la UMA</li>
              <li>O sacando dobles cuando sea tu turno</li>
            </ul>

            <p><strong>💸 Bancarrota:</strong> Si no puedes pagar, estás fuera. El último jugador con dinero gana.</p>

            <p><strong>🎁 Reglas especiales UMA (opcionales):</strong></p>
            <ul>
              <li>Cobras $200 UMA al pasar por la casilla de “INICIO”.</li>
            </ul>
          </div>

          <button onClick={() => setShowInstrucciones(false)}>Cerrar</button>
        </div>
      </div>
    )}

    </div>
  );
}

export default Inicio;