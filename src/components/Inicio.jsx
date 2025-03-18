import React, { useState, useContext } from 'react';
import './styles/Inicio.css';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';

function Inicio({ onStart }) {
  const { setPlayers: setContextPlayers } = useContext(PlayersContext);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([
    { name: '', color: '#ff0000' },
    { name: '', color: '#0000ff' }
  ]);

  const handleNumPlayersChange = (num) => {
    setNumPlayers(num);
    setPlayers(
      Array.from({ length: num }, (_, i) => players[i] || { name: '', color: '#000000' })
    );
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;
    setPlayers(updatedPlayers);
  };

  const handleStart = () => {
    setContextPlayers(players);
    onStart(players);
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
          />
          <input
            type="color"
            value={player.color}
            onChange={(e) => handlePlayerChange(index, 'color', e.target.value)}
          />
        </div>
      ))}
      <button className="start-button" onClick={handleStart}>JUGAR</button>
    </div>
  );
}

export default Inicio;