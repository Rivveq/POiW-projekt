import React, { useState, useEffect } from 'react';
import { GameStateContext } from './GameStateContext';

// rangi wg poziomu
const getRank = (level) => {
    if (level < 10) return 'Bronze';
    if (level < 20) return 'Silver';
    if (level < 30) return 'Gold';
    if (level < 50) return 'Platinum';
    if (level < 75) return 'Amethyst';
    if (level < 100) return 'Ruby';
    return 'Grandmaster';
};

export const GameStateProvider = ({ children }) => {
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('casino_xp') || '0'));
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        localStorage.setItem('casino_xp', xp.toString());
    }, [xp]);

    // poziom rośnie wg pierwiastka z XP
    const level = Math.floor(Math.sqrt(xp / 150)) + 1;
    const rank = getRank(level);

    const addXp = (amount) => {
        setXp(prev => prev + Math.floor(amount));
    };

    return (
        <GameStateContext.Provider value={{
            xp, level, rank, balance, setBalance, addXp
        }}>
            {children}
        </GameStateContext.Provider>
    );
};