import React, { useState, useContext } from 'react';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';
import './styles/TradeDeal.css';

function TradeDeal({ onClose }) {
  const { players, setPlayers, currentTurn } = useContext(PlayersContext);

  if (!players || players.length < 2) return null;

  const proposer = currentTurn;  
  const [step, setStep] = useState(1);
  const [responder, setResponder] = useState(null);

  // Mantenemos la lógica de dinero.
  const [proposerMoney, setProposerMoney] = useState(0);
  const [responderMoney, setResponderMoney] = useState(0);

  // Estados para gestionar propiedad(es) seleccionadas (selección múltiple).
  const [selectedProposerProperties, setSelectedProposerProperties] = useState([]);
  const [selectedResponderProperties, setSelectedResponderProperties] = useState([]);

  const [error, setError] = useState('');

  const handleNext = () => {
    if (responder === null) {
      setError("Por favor, selecciona un jugador receptor.");
      return;
    }
    setError('');
    setStep(2);
  };

  // Función para manejar el cambio en el select de propiedades del Proposer
  const handleProposerSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, opt => opt.value);
    setSelectedProposerProperties(selectedValues);
  };

  // Función para manejar el cambio en el select de propiedades del Responder
  const handleResponderSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, opt => opt.value);
    setSelectedResponderProperties(selectedValues);
  };

  const handleOfferTrade = () => {
    const proposerPlayer = players[proposer];
    const responderPlayer = players[responder];

    // Validamos que el Proposer y Responder posean las propiedades seleccionadas.
    const proposerOwnsAll = selectedProposerProperties.every(indexStr =>
      (proposerPlayer.properties || []).some(p => p.index.toString() === indexStr)
    );
    const responderOwnsAll = selectedResponderProperties.every(indexStr =>
      (responderPlayer.properties || []).some(p => p.index.toString() === indexStr)
    );
    if (!proposerOwnsAll) {
      setError("No posees todas las propiedades seleccionadas.");
      return;
    }
    if (!responderOwnsAll) {
      setError("El jugador receptor no posee alguna de las propiedades seleccionadas.");
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

    // Creamos el objeto con la oferta de intercambio.
    const tradeOffer = {
      from: proposer,
      proposerProperties: selectedProposerProperties,
      responderProperties: selectedResponderProperties,
      proposerMoney,
      responderMoney,
      timestamp: Date.now()
    };

    // Se asigna la oferta pendiente al jugador receptor.
    const updatedPlayers = [...players];
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
              <button onClick={onClose}
              style={{ backgroundColor: '#d32f2f', color: 'white' }}>Cancelar</button>
              <button onClick={handleNext}>Siguiente</button>
              
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Ofrecer Trato a {players[responder].name || `Jugador ${responder + 1}`}</h2>
            {error && <p className="error-message">{error}</p>}
            
            <div className="trade-content" style={{ display: 'flex', gap: '1rem' }}>
              {/* Lado del Proposer */}
              <div className="trade-column" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Tus Propiedades</h3>
                <select 
                  multiple
                  value={selectedProposerProperties}
                  onChange={handleProposerSelectChange}
                  style={{ width: '200px', height: '120px' }}
                >
                  {(players[proposer].properties || []).map(p => (
                    <option key={p.index} value={p.index}>
                      {p.name} (#{p.index})
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '1rem' }}>
                  <label>Dinero a Ofrecer:</label>
                  <input 
                    type="number" 
                    value={proposerMoney}
                    onChange={e => setProposerMoney(parseInt(e.target.value) || 0)} 
                  />
                </div>
              </div>
              
              {/* Lado del Responder */}
              <div className="trade-column" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Propiedades de {players[responder].name || `Jugador ${responder + 1}`}</h3>
                <select 
                  multiple
                  value={selectedResponderProperties}
                  onChange={handleResponderSelectChange}
                  style={{ width: '200px', height: '120px' }}
                >
                  {(players[responder].properties || []).map(p => (
                    <option key={p.index} value={p.index}>
                      {p.name} (#{p.index})
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '1rem' }}>
                  <label>Dinero a Solicitar:</label>
                  <input 
                    type="number" 
                    value={responderMoney}
                    onChange={e => setResponderMoney(parseInt(e.target.value) || 0)} 
                  />
                </div>
              </div>
            </div>
            
            <div className="trade-buttons">
              <button onClick={onClose} 
              style={{ backgroundColor: '#d32f2f', color: 'white' }}>Cancelar</button>
              <button onClick={handleOfferTrade}>Ofrecer Trato</button>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TradeDeal;