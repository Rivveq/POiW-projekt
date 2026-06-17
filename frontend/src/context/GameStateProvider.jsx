import React, { useState, useEffect } from 'react';
import { GameStateContext } from './GameStateContext';
import { useAuth } from '../hooks/useAuth';

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
    const { user } = useAuth();

    const xpKey = user && user.username ? `casino_xp_${user.username}` : 'casino_xp_guest';

    const [xp, setXp] = useState(() => parseInt(localStorage.getItem(xpKey) || '0'));
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const savedXp = parseInt(localStorage.getItem(xpKey) || '0');
        setXp(savedXp);

        setBalance(0);
    }, [xpKey]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(xpKey, xp.toString());
        }
    }, [xp, xpKey, user]);

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