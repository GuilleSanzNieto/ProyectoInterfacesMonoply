import React, { useState, useContext } from 'react';
import './styles/Inicio.css';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import ColorPicker from './ColorPicker.jsx';

function Inicio({ onStart }) {
  const {players, setPlayers} = useContext(PlayersContext);
  const [numPlayers, setNumPlayers] = useState(2);
  const [errors, setErrors] = useState([]);
  const [showColorPickerIndex, setShowColorPickerIndex] = useState(null);
    
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
      Array.from({ length: num }, (_, i) => players[i] || { name: '', color: '#000000', position: 0 })
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
      color: !player.color || player.color.trim()  === ''
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
      <div className="logo">LOGO</div>
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
            className={errors[index]?.name ? "input-errorCirculo" : `color-preview ${player.color}`}
            onClick={() => setShowColorPickerIndex(index)}>
          </div>
        </div>
      ))}
      <button className="start-button" onClick={handleStart}>JUGAR</button>
      {showColorPickerIndex !== null && (
        <ColorPicker
          allColors={allColors}
          usedColors={players.map((p, i) => i !== showColorPickerIndex ? p.color : null).filter(Boolean)}
          onColorSelect={(colorClass) => {
            handlePlayerChange(showColorPickerIndex, 'color', colorClass);
            setShowColorPickerIndex(null);
          }}
          onClose={() => setShowColorPickerIndex(null)}
        />
      )}
    </div>
  );
}

export default Inicio;