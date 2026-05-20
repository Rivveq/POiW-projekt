import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

// Hook przyjmuje teraz startowy balans z zewnątrz
export const useRouletteGame = (initialBalance) => {
    const [rouletteBalance, setRouletteBalance] = useState(initialBalance || 0);
    const [currentBets, setCurrentBets] = useState({});
    const [selectedChip, setSelectedChip] = useState(5);

    const [isSpinning, setIsSpinning] = useState(false);
    const [lastWin, setLastWin] = useState(0);
    const [winningNumber, setWinningNumber] = useState(null);
    const [showWinSplash, setShowWinSplash] = useState(false);
    const [winAmount, setWinAmount] = useState(0);

    const totalCurrentBet = Object.values(currentBets).reduce((a, b) => a + b, 0);

    useEffect(() => {
        if (initialBalance !== undefined) {
            setRouletteBalance(Number(initialBalance));
        }
    }, [initialBalance]);

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
            // Używamy gotowego helpera, który sam wkleja odpowiedni token i parsowanie JSON:
            const data = await apiFetch('/api/roulette/bet', {
                method: 'POST',
                body: { bets: currentBets }
            });

            setWinningNumber(data.winningNumber);
            setRouletteBalance(prev => prev - totalCurrentBet);

            setTimeout(() => {
                setIsSpinning(false);

                // Po kręceniu serwer w RouletteResult zwraca nam zaktualizowany portfel
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