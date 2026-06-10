import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../services/api';
import { useGameState } from './useGameState';

const getCardValue = (val) => {
    if (['J', 'Q', 'K'].includes(val)) return 10;
    if (val === 'A') return 11;
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? 0 : n;
};

// podgląd punktów tylko dla UI; wynik liczy serwer
const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
        score += getCardValue(card.value);
        if (card.value === 'A') aces += 1;
    });
    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }
    return score;
};

export function useBlackjackGame() {
    const { addXp } = useGameState();

    const [playerHands, setPlayerHands] = useState([]);
    const [handBets, setHandBets] = useState([]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [canSplit, setCanSplit] = useState(false);

    const [gameState, setGameState] = useState('betting');
    const [message, setMessage] = useState('');
    const [balance, setBalance] = useState(0);

    const [placedChips, setPlacedChips] = useState([]);
    const [lastPlacedChips, setLastPlacedChips] = useState([]);

    const currentTotalBet = placedChips.reduce((a, b) => a + b, 0);

    const fetchBalance = useCallback(async () => {
        try {
            const res = await apiFetch('/api/wallet/balance');
            if (res && res.balance !== undefined) setBalance(res.balance);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => { fetchBalance(); }, [fetchBalance]);

    const applyState = (state) => {
        setPlayerHands(state.playerHands || []);
        setDealerHand(state.dealerHand || []);
        setHandBets(state.handBets || []);
        setActiveHandIndex(state.activeHandIndex ?? 0);
        setCanSplit(!!state.canSplit);
        setMessage(state.message || '');
        if (state.balance !== undefined) setBalance(state.balance);
        setGameState(state.phase === 'FINISHED' ? 'gameOver' : 'playing');
    };

    const action = async (path) => {
        try {
            const state = await apiFetch(`/api/blackjack/${path}`, { method: 'POST' });
            applyState(state);
        } catch (err) {
            setMessage(err?.message || 'Server error');
        }
    };

    const placeBet = (amount) => {
        if (gameState !== 'betting') return;
        if (balance >= currentTotalBet + amount) {
            setPlacedChips(prev => [...prev, amount]);
        }
    };

    const clearBet = () => setPlacedChips([]);

    const repeatLastBet = () => {
        const lastTotal = lastPlacedChips.reduce((a, b) => a + b, 0);
        if (lastTotal > 0 && balance >= lastTotal) {
            setPlacedChips([...lastPlacedChips]);
        }
    };

    const startGame = async () => {
        if (currentTotalBet <= 0) return;

        setLastPlacedChips([...placedChips]);
        addXp(currentTotalBet * 10);
        setGameState('dealing');
        setMessage('');

        try {
            const state = await apiFetch('/api/blackjack/start', {
                method: 'POST',
                body: { betAmount: currentTotalBet }
            });
            applyState(state);
        } catch (err) {
            setMessage(err?.message || 'Server error');
            setGameState('betting');
        }
    };

    const hit = () => action('hit');
    const stand = () => action('stand');

    const doubleDown = async () => {
        const extra = handBets[activeHandIndex] || 0;
        setPlacedChips(prev => [...prev, extra]);
        await action('double');
    };

    const split = async () => {
        const extra = handBets[activeHandIndex] || 0;
        setPlacedChips(prev => [...prev, extra]);
        await action('split');
    };

    const resetGame = () => {
        setPlayerHands([]);
        setDealerHand([]);
        setHandBets([]);
        setPlacedChips([]);
        setActiveHandIndex(0);
        setCanSplit(false);
        setGameState('betting');
        setMessage('');
    };

    return {
        balance, currentTotalBet, placedChips, placeBet, clearBet, repeatLastBet, startGame,
        hit, stand, doubleDown, split, canSplit,
        playerHands, activeHandIndex, handBets, dealerHand, gameState, message, resetGame, calculateScore
    };
}
