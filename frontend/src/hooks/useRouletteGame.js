import { useState } from 'react';

export const useRouletteGame = () => {
    // Stan UI i portfela
    const [balance, setBalance] = useState(10000); // Wartość początkowa (docelowo pobierana z API po zalogowaniu)
    const [currentBets, setCurrentBets] = useState({});
    const [selectedChip, setSelectedChip] = useState(5);

    // Stany losowania
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastWin, setLastWin] = useState(0);
    const [winningNumber, setWinningNumber] = useState(null);
    const [showWinSplash, setShowWinSplash] = useState(false);
    const [winAmount, setWinAmount] = useState(0);

    const totalCurrentBet = Object.values(currentBets).reduce((a, b) => a + b, 0);

    const placeBet = (betId) => {
        if (isSpinning || balance < totalCurrentBet + selectedChip) return;
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
            const token = localStorage.getItem('token');

            // zapytanie do RoulettleController
            const response = await fetch(`http://localhost:8080/api/roulette/bet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bets: currentBets
                })
            });

            if (!response.ok) throw new Error('Błąd komunikacji z serwerem');
            const data = await response.json();

            // Wylosowany numer otrzymany od razu, co aktywuje animację koła
            setWinningNumber(data.winningNumber);

            // Tymczasowo zdejmujmowanie z balansu kwoty zakładów, żeby UI dobrze wyglądało podczas kręcenia
            setBalance(prev => prev - totalCurrentBet);

            // Czekanie aż koło wizualnie się zatrzyma (8.5 sekundy)
            setTimeout(() => {
                setIsSpinning(false);

                // Przypisanie finalnego stanu z serwera
                // Możliwe źłe dopasowanie danych !!!!!!!!!!!!!!!!!!!!!!!!!!
                setBalance(data.newBalance.balance !== undefined ? data.newBalance.balance : data.newBalance.amount);

                // Animacja wygranej bazująca na backendowym 'totalWin'
                if (data.totalWin > 0) {
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
        balance, currentBets, selectedChip, setSelectedChip,
        isSpinning, lastWin, winningNumber, totalCurrentBet,
        placeBet, clearBets, spinWheel, showWinSplash, winAmount
    };
};