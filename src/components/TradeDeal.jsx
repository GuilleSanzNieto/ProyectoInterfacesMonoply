import React, { useState, useContext } from 'react';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import './styles/TradeDeal.css';

const TradeDeal = ({ onClose }) => {
  const { players, setPlayers, currentTurn } = useContext(PlayersContext);

  // Si no hay al menos dos jugadores, no renderizamos nada.
  if (!players || players.length < 2) {
    return null;
  }

  // El emisor es siempre el jugador con el turno actual.
  const proposer = currentTurn;

  // Estado para el paso del modal: 1 = seleccionar receptor, 2 = oferta completa.
  const [step, setStep] = useState(1);
  // El receptor se inicializa como indefinido hasta que se seleccione.
  const [responder, setResponder] = useState(null);
  const [proposerProperty, setProposerProperty] = useState('');
  const [responderProperty, setResponderProperty] = useState('');
  const [proposerMoney, setProposerMoney] = useState(0);
  const [responderMoney, setResponderMoney] = useState(0);
  const [error, setError] = useState('');

  const handleNext = () => {
    // Validamos que se haya seleccionado receptor.
    if (responder === null) {
      setError("Por favor, selecciona un jugador receptor.");
      return;
    }
    setError('');
    setStep(2);
  };

  const handleOfferTrade = () => {
    const proposerPlayer = players[proposer];
    const responderPlayer = players[responder];

    // Validar si se seleccionó propiedad y si el jugador la posee.
    const proposerOwns = proposerProperty 
      ? (proposerPlayer.properties || []).some(p => p.index.toString() === proposerProperty)
      : true;
    const responderOwns = responderProperty 
      ? (responderPlayer.properties || []).some(p => p.index.toString() === responderProperty)
      : true;
    
    if (!proposerOwns) {
      setError("No posees la propiedad ofrecida.");
      return;
    }
    if (!responderOwns) {
      setError("El jugador receptor no posee la propiedad solicitada.");
      return;
    }
    if (proposerMoney > proposerPlayer.money) {
      setError("No tienes suficiente dinero para ofrecer.");
      return;
    }
    if (responderMoney > responderPlayer.money) {
      setError("El jugador receptor no tiene suficiente dinero para el trato.");
      return;
    }

    // Creamos el objeto de oferta pendiente.
    const tradeOffer = {
      from: proposer,
      proposerProperty,
      responderProperty,
      proposerMoney,
      responderMoney,
      timestamp: Date.now()
    };

    // Asignamos la oferta pendiente al jugador receptor.
    let updatedPlayers = [...players];
    updatedPlayers[responder] = {
      ...updatedPlayers[responder],
      pendingTradeOffer: tradeOffer
    };
    setPlayers(updatedPlayers);
    
    console.log('Oferta de trato enviada:', tradeOffer);
    onClose();
  };

  return (
    <div className="trade-deal-overlay">
      <div className="trade-deal-container">
        {step === 1 && (
          <>
            <h2>Selecciona el Jugador Receptor</h2>
            {error && <p className="error-message">{error}</p>}
            <div>
              <label>Jugador Receptor:</label>
              <select
                value={responder !== null ? responder : ""}
                onChange={e => setResponder(parseInt(e.target.value))}
              >
                <option value="">-- Seleccionar --</option>
                {players.map((player, index) => {
                  if (index !== proposer) {
                    return (
                      <option key={index} value={index}>
                        {player.name || `Jugador ${index + 1}`}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>
            <div className="trade-buttons">
              <button onClick={handleNext}>Siguiente</button>
              <button onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Ofrecer Trato a {players[responder].name || `Jugador ${responder + 1}`}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="trade-content" style={{ display: 'flex', gap: '1rem' }}>
              {/* Información del emisor */}
              <div className="trade-column">
                <h3>Tus Propiedades</h3>
                <ul>
                  {(players[proposer].properties || []).map(p => (
                    <li key={p.index}>
                      {p.name} (#{p.index})
                    </li>
                  ))}
                </ul>
              </div>
              {/* Información del receptor */}
              <div className="trade-column">
                <h3>Propiedades de {players[responder].name || `Jugador ${responder + 1}`}</h3>
                <ul>
                  {(players[responder].properties || []).map(p => (
                    <li key={p.index}>
                      {p.name} (#{p.index})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="trade-form">
              <div>
                <label>Dinero a Ofrecer:</label>
                <input 
                  type="number" 
                  value={proposerMoney} 
                  onChange={e => setProposerMoney(parseInt(e.target.value) || 0)} 
                />
              </div>
              <div>
                <label>Dinero a Solicitar:</label>
                <input 
                  type="number" 
                  value={responderMoney} 
                  onChange={e => setResponderMoney(parseInt(e.target.value) || 0)} 
                />
              </div>
              <hr />
              <div>
                <label>Seleccionar Propiedad a Ofrecer:</label>
                <select value={proposerProperty} onChange={e => setProposerProperty(e.target.value)}>
                  <option value="">Ninguna</option>
                  {(players[proposer].properties || []).map(p => (
                    <option key={p.index} value={p.index}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Seleccionar Propiedad Solicitada:</label>
                <select value={responderProperty} onChange={e => setResponderProperty(e.target.value)}>
                  <option value="">Ninguna</option>
                  {(players[responder].properties || []).map(p => (
                    <option key={p.index} value={p.index}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="trade-buttons">
              <button onClick={handleOfferTrade}>Ofrecer Trato</button>
              <button onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TradeDeal;