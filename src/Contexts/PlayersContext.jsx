import React, { createContext, useState } from 'react';

export const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
    const [players, setPlayers] = useState([
        { name: '', color: '#000000', position: 0, money: 3000, properties: [] },
        { name: '', color: '#000000', position: 0, money: 3000, properties: [] }
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

    const updatePlayerMoney = (playerIndex, newMoney) => {
        setPlayers(prevPlayers =>
            prevPlayers.map((player, index) =>
                index === playerIndex ? { ...player, money: newMoney } : player
            )
        );
    };

    const buyProperty = (playerIndex, property) => {
        setPlayers(prevPlayers =>
            prevPlayers.map((player, idx) =>
                idx === playerIndex
                    ? {
                        ...player,
                        money: player.money - property.price,
                        properties: [...(player.properties || []), property]
                    }
                    : player
            )
        );
    };

    const sellProperty = (playerIndex, property) => {
        setPlayers(prevPlayers =>
            prevPlayers.map((player, idx) =>
                idx === playerIndex
                    ? {
                        ...player,
                        money: player.money + property.price,
                        properties: player.properties.filter(p => p.index !== property.index)
                    }
                    : player
            )
        );
    };

    return (
        <PlayersContext.Provider value={{ players, setPlayers, currentTurn, setCurrentTurn, nextTurn, updatePlayerPosition, updatePlayerMoney, buyProperty, sellProperty, spinning, setSpinning }}>
            {children}
        </PlayersContext.Provider>
    );
};