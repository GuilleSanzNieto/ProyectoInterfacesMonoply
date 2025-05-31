import React, { useContext } from 'react';
import { PlayersContext } from '../Contexts/PlayersContext.jsx';

function PendingTrade({ tradeOffer, onAccept, onReject }) {
  const { players } = useContext(PlayersContext);

  return (
    <div 
      style={{
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -30%)',
        background: '#fff',
        padding: '1rem 2rem',
        border: '2px solid #333',
        borderRadius: '8px',
        zIndex: 10000
      }}
    >
      <h3>Trato Pendiente</h3>
      <p>
        {players[tradeOffer.from].name} te ha ofrecido un trato:
      </p>
      <ul>
        {tradeOffer.proposerProperty && (
          <li>
            Ofrece la propiedad <strong>{/* Aquí podrías buscar el nombre según el índice */}</strong>
          </li>
        )}
        {tradeOffer.proposerMoney > 0 && (
          <li>Ofrece ${tradeOffer.proposerMoney}</li>
        )}
        {tradeOffer.responderProperty && (
          <li>
            Solicita la propiedad <strong>{/* Nombre según índice */}</strong>
          </li>
        )}
        {tradeOffer.responderMoney > 0 && (
          <li>Solicita ${tradeOffer.responderMoney}</li>
        )}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
        <button onClick={onReject}>Rechazar</button>
        <button onClick={onAccept}>Aceptar</button>
        
      </div>
    </div>
  );
}

export default PendingTrade;