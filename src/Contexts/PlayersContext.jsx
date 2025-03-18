import React, { createContext, useState } from 'react';

export const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [currentTurn, setCurrentTurn] = useState(0);

    const nextTurn = () => {
        setCurrentTurn((prev) =>
            players.length ? (prev + 1) % players.length : 0
        );
    };

    return (
        <PlayersContext.Provider value={{ players, setPlayers, currentTurn, setCurrentTurn, nextTurn }}>
            {children}
        </PlayersContext.Provider>
    );
};