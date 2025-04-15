import React, { createContext, useState } from 'react';

export const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
    const [players, setPlayers] = useState([
        { name: '', color: '#000000', position: 0 },
        { name: '', color: '#000000', position: 0 }
    ]);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [spinning, setSpinning] = useState(false);

    const nextTurn = () => {
        setCurrentTurn((prev) =>
            players.length ? (prev + 1) % players.length : 0
        );
    };

    const updatePlayerPosition = (playerIndex, newPosition) => {
        setPlayers(prevPlayers => {
            return prevPlayers.map((player, index) =>
                index === playerIndex ? { ...player, position: newPosition } : player
            );
        });
        
    };

    return (
        <PlayersContext.Provider value={{ players, setPlayers, currentTurn, setCurrentTurn, nextTurn, updatePlayerPosition, spinning, setSpinning }}>
            {children}
        </PlayersContext.Provider>
    );
};