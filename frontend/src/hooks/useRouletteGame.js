import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useGameState } from './useGameState'; // Dodany import

export const useRouletteGame = () => {
    const { addXp } = useGameState(); // Wyciągnięcie funkcji
    const [rouletteBalance, setRouletteBalance] = useState(0);
    const [currentBets, setCurrentBets] = useState({});
    const [selectedChip, setSelectedChip] = useState(5);

    const [isSpinning, setIsSpinning] = useState(false);
    const [lastWin, setLastWin] = useState(0);
    const [winningNumber, setWinningNumber] = useState(null);
    const [showWinSplash, setShowWinSplash] = useState(false);
    const [winAmount, setWinAmount] = useState(0);

    const totalCurrentBet = Object.values(currentBets).reduce((a, b) => a + b, 0);

    useEffect(() => {
        apiFetch('/api/wallet/balance')
            .then(res => {
                if (res && res.balance !== undefined) setRouletteBalance(res.balance);
            })
            .catch(console.error);
    }, []);

    const placeBet = (betId) => {
        if (isSpinning || rouletteBalance < totalCurrentBet + selectedChip) return;
        setCurrentBets(prev => ({
            ...prev,
            [betId]: (prev[betId] || 0) + selectedChip
        }));
    };

    const clearBets = () => {
        if (isSpinning) return;
        setCurrentBets({});
    };

    const spinWheel = async () => {
        if (isSpinning || totalCurrentBet === 0) return;

        setIsSpinning(true);
        setShowWinSplash(false);
        setLastWin(0);

        try {
            const data = await apiFetch('/api/roulette/bet', {
                method: 'POST',
                body: { bets: currentBets }
            });

            addXp(totalCurrentBet * 10); // Dodanie XP po wysłaniu zakładu
            setWinningNumber(data.winningNumber);
            setRouletteBalance(prev => prev - totalCurrentBet);

            setTimeout(() => {
                setIsSpinning(false);

                if (data && data.newBalance) {
                    const freshBalance = data.newBalance.balance ?? data.newBalance.amount ?? data.newBalance;
                    setRouletteBalance(Number(freshBalance));
                }

                if (data && data.totalWin > 0) {
                    setLastWin(data.totalWin);
                    setWinAmount(data.totalWin);
                    setShowWinSplash(true);
                    setTimeout(() => setShowWinSplash(false), 3500);
                }

                setCurrentBets({});
            }, 8500);

        } catch (error) {
            console.error("Wystąpił błąd podczas kręcenia:", error);
            setIsSpinning(false);
        }
    };

    return {
        rouletteBalance, currentBets, selectedChip, setSelectedChip,
        isSpinning, lastWin, winningNumber, totalCurrentBet,
        placeBet, clearBets, spinWheel, showWinSplash, winAmount
    };
};