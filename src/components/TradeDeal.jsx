import React, { useState, useContext } from 'react';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import './styles/TradeDeal.css';

const TradeDeal = ({ onClose }) => {
  const { players, setPlayers } = useContext(PlayersContext);

  // Si no hay al menos dos jugadores, no renderizamos nada.
  if (!players || players.length < 2) {
    return null;
  }

  const [proposer, setProposer] = useState(0); // Jugador que inicia el trato
  const [responder, setResponder] = useState(1);
  const [proposerProperty, setProposerProperty] = useState('');
  const [responderProperty, setResponderProperty] = useState('');
  const [proposerMoney, setProposerMoney] = useState(0);
  const [responderMoney, setResponderMoney] = useState(0);
  const [error, setError] = useState('');

  const handleTrade = () => {
    const proposerPlayer = players[proposer];
    const responderPlayer = players[responder];

    // Validar que, en caso de intercambiar propiedad, el jugador la posee.
    const proposerOwns = proposerProperty ? 
      (proposerPlayer.properties || []).some(p => p.index.toString() === proposerProperty)
      : true;
    const responderOwns = responderProperty ? 
      (responderPlayer.properties || []).some(p => p.index.toString() === responderProperty)
      : true;
    
    if (!proposerOwns) {
      setError("El jugador emisor no posee la propiedad ofrecida.");
      return;
    }
    if (!responderOwns) {
      setError("El jugador receptor no posee la propiedad solicitada.");
      return;
    }
    if (proposerMoney > proposerPlayer.money) {
      setError("El emisor no tiene suficiente dinero para el trato.");
      return;
    }
    if (responderMoney > responderPlayer.money) {
      setError("El receptor no tiene suficiente dinero para el trato.");
      return;
    }

    let updatedPlayers = [...players];

    // Intercambio de propiedades:
    if (proposerProperty) {
      const propOffered = updatedPlayers[proposer].properties.find(p => p.index.toString() === proposerProperty);
      updatedPlayers[proposer].properties = updatedPlayers[proposer].properties.filter(p => p.index.toString() !== proposerProperty);
      updatedPlayers[responder].properties = [...(updatedPlayers[responder].properties || []), propOffered];
    }
    if (responderProperty) {
      const propRequested = updatedPlayers[responder].properties.find(p => p.index.toString() === responderProperty);
      updatedPlayers[responder].properties = updatedPlayers[responder].properties.filter(p => p.index.toString() !== responderProperty);
      updatedPlayers[proposer].properties = [...(updatedPlayers[proposer].properties || []), propRequested];
    }

    // Intercambio de dinero:
    updatedPlayers[proposer].money = updatedPlayers[proposer].money - proposerMoney + responderMoney;
    updatedPlayers[responder].money = updatedPlayers[responder].money - responderMoney + proposerMoney;

    setPlayers(updatedPlayers);
    onClose();
  };

  return (
    <div className="trade-deal-overlay">
      <div className="trade-deal-container">
        <h2>Propuesta de Trato</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="trade-form">
          <div>
            <label>Jugador Emisor:</label>
            <select value={proposer} onChange={e => setProposer(parseInt(e.target.value))}>
              {players.map((player, index) => (
                <option key={index} value={index}>
                  {player.name || `Jugador ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Propiedad a Ofrecer (opcional):</label>
            <select value={proposerProperty} onChange={e => setProposerProperty(e.target.value)}>
              <option value="">Ninguna</option>
              {(players[proposer].properties || []).map(p => (
                <option key={p.index} value={p.index}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Dinero a Ofrecer:</label>
            <input type="number" value={proposerMoney} onChange={e => setProposerMoney(parseInt(e.target.value) || 0)} />
          </div>
          <hr />
          <div>
            <label>Jugador Receptor:</label>
            <select value={responder} onChange={e => setResponder(parseInt(e.target.value))}>
              {players
                .map((player, index) => ({ player, index }))
                .filter(({ index }) => index !== proposer)
                .map(({ player, index }) => (
                  <option key={index} value={index}>
                    {player.name || `Jugador ${index + 1}`}
                  </option>
                ))
              }
            </select>
          </div>
          <div>
            <label>Propiedad Solicitada (opcional):</label>
            <select value={responderProperty} onChange={e => setResponderProperty(e.target.value)}>
              <option value="">Ninguna</option>
              {(players[responder].properties || []).map(p => (
                <option key={p.index} value={p.index}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Dinero a Solicitar:</label>
            <input type="number" value={responderMoney} onChange={e => setResponderMoney(parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="trade-buttons">
          <button onClick={handleTrade}>Aceptar Trato</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
      {showTradeDeal && <TradeDeal onClose={() => setShowTradeDeal(false)} />}
    </div>
  );
};

export default TradeDeal;