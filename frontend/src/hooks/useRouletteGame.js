import { useState, useMemo } from 'react';

const WHEEL_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export const useRouletteGame = () => {
    const [balance, setBalance] = useState(10000);
    const [currentBets, setCurrentBets] = useState({});
    const [selectedChip, setSelectedChip] = useState(5);
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastWin, setLastWin] = useState(0);
    const [winningNumber, setWinningNumber] = useState(null);
    const [showWinSplash, setShowWinSplash] = useState(false);
    const [winAmount, setWinAmount] = useState(0);

    // PRAWDZIWA HISTORIA LOSOWAŃ
    const [history, setHistory] = useState([]);

    const placeBet = (betId) => {
        if (isSpinning || balance < selectedChip) return;
        setCurrentBets(prev => ({
            ...prev,
            [betId]: (prev[betId] || 0) + selectedChip
        }));
        setBalance(prev => prev - selectedChip);
    };

    const clearBets = () => {
        if (isSpinning) return;
        const totalBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
        setBalance(prev => prev + totalBet);
        setCurrentBets({});
    };

    const calculateWinnings = (bets, result) => {
        let totalWin = 0;
        for (const [betKey, amount] of Object.entries(bets)) {

            // Zmiana z parseInt na Number naprawia buga z "1-18" i "1st12"
            const numBet = Number(betKey);

            if (!isNaN(numBet) && numBet === result) {
                totalWin += amount * 36;
            }
            else if (betKey === 'red' && RED_NUMBERS.includes(result)) totalWin += amount * 2;
            else if (betKey === 'black' && BLACK_NUMBERS.includes(result)) totalWin += amount * 2;
            else if (betKey === 'even' && result !== 0 && result % 2 === 0) totalWin += amount * 2;
            else if (betKey === 'odd' && result !== 0 && result % 2 !== 0) totalWin += amount * 2;
            else if (betKey === '1-18' && result >= 1 && result <= 18) totalWin += amount * 2;
            else if (betKey === '19-36' && result >= 19 && result <= 36) totalWin += amount * 2;
            else if (betKey === '1st12' && result >= 1 && result <= 12) totalWin += amount * 3;
            else if (betKey === '2nd12' && result >= 13 && result <= 24) totalWin += amount * 3;
            else if (betKey === '3rd12' && result >= 25 && result <= 36) totalWin += amount * 3;
            else if (betKey === 'col1' && result !== 0 && result % 3 === 1) totalWin += amount * 3;
            else if (betKey === 'col2' && result !== 0 && result % 3 === 2) totalWin += amount * 3;
            else if (betKey === 'col3' && result !== 0 && result % 3 === 0) totalWin += amount * 3;
        }
        return totalWin;
    };

    const spinWheel = () => {
        const totalCurrentBet = Object.values(currentBets).reduce((a, b) => a + b, 0);
        if (isSpinning || totalCurrentBet === 0) return;

        setIsSpinning(true);
        setShowWinSplash(false);
        setLastWin(0);

        const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
        const result = WHEEL_NUMBERS[randomIndex];
        setWinningNumber(result);

        setTimeout(() => {
            setIsSpinning(false);

            // Dodajemy nowy wynik na początek historii (pamiętamy max 100 ostatnich)
            setHistory(prev => [result, ...prev].slice(0, 100));

            const win = calculateWinnings(currentBets, result);
            if (win > 0) {
                setBalance(prev => prev + win);
                setLastWin(win);
                setWinAmount(win);
                setShowWinSplash(true);
                setTimeout(() => setShowWinSplash(false), 3500);
            }

            setCurrentBets({});
        }, 8500);
    };

    // PRAWDZIWE OBLICZANIE HOT / COLD
    const { hotNumbers, coldNumbers } = useMemo(() => {
        if (history.length === 0) return { hotNumbers: [], coldNumbers: [] };

        // Liczymy wystąpienia każdego numeru
        const counts = {};
        WHEEL_NUMBERS.forEach(n => counts[n] = 0);
        history.forEach(n => counts[n]++);

        // Wyciągamy TYLKO te liczby, które faktycznie padły (ich count > 0)
        const droppedNumbers = Object.entries(counts).filter(([_, count]) => count > 0);

        // Sortujemy od najczęściej padających
        const sortedHot = [...droppedNumbers].sort((a, b) => b[1] - a[1]);
        // Sortujemy od najrzadziej padających
        const sortedCold = [...droppedNumbers].sort((a, b) => a[1] - b[1]);

        // Gorące liczby (max 4)
        const hot = sortedHot.slice(0, 4).map(entry => parseInt(entry[0]));

        // Zimne liczby (max 4) - wykluczamy te, które już wpadły do "hot", żeby się nie dublowały na początku gry
        const cold = sortedCold
            .map(entry => parseInt(entry[0]))
            .filter(n => !hot.includes(n))
            .slice(0, 4);

        return { hotNumbers: hot, coldNumbers: cold };
    }, [history]);

    const totalCurrentBet = Object.values(currentBets).reduce((a, b) => a + b, 0);

    return {
        balance, currentBets, selectedChip, setSelectedChip,
        isSpinning, lastWin, winningNumber, totalCurrentBet,
        placeBet, clearBets, spinWheel, showWinSplash, winAmount,
        history, hotNumbers, coldNumbers // Eksportujemy nowe dane statystyczne!
    };
};