import { useState, useContext, useEffect, useRef } from 'react';
import { apiFetch } from '../services/api';
import { GameStateContext } from '../context/GameStateContext';

// 1. Definiujemy linie płatnicze tak samo jak na backendzie dla celów wizualizacji
const PAYLINES = [
    { id: 1, label: 'Top Line', coords: [[0,0], [0,1], [0,2], [0,3], [0,4]] },
    { id: 2, label: 'Middle Line', coords: [[1,0], [1,1], [1,2], [1,3], [1,4]] },
    { id: 3, label: 'Bottom Line', coords: [[2,0], [2,1], [2,2], [2,3], [2,4]] },
    { id: 4, label: 'V Shape', coords: [[0,0], [1,1], [2,2], [1,3], [0,4]] },
    { id: 5, label: 'A Shape', coords: [[2,0], [1,1], [0,2], [1,3], [2,4]] },
];

export function useSlotsGame() {
    const { balance, placeBet, topUp } = useContext(GameStateContext);

    // 2. Stan siatki 2D array (3x5)
    const [grid, setGrid] = useState(Array(3).fill(["🍒", "🍒", "🍒", "🍒", "🍒"]));
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinningReels, setSpinningReels] = useState(Array(5).fill(false)); // Stan każdego bębna
    const [currentWin, setCurrentWin] = useState(0);
    const [showWinSplash, setShowWinSplash] = useState(false);
    const [betAmount, setBetAmount] = useState(50);

    const spinIntervalRef = useRef(null);

    const spin = async () => {
        if (isSpinning || balance < betAmount) return;

        // Reset stanu
        setIsSpinning(true);
        setSpinningReels(Array(5).fill(true)); // Wszystkie bębny się kręcą
        setShowWinSplash(false);
        setCurrentWin(0);

        // Lokalnie zmniejszamy balans na czas trwania animacji
        placeBet(betAmount, 10);

        try {
            // Wysłanie żądania do backendu
            const response = await apiFetch('/api/slots/spin', {
                method: 'POST',
                body: { betAmount }
            });

            // 3. Efekt wizualny: zatrzymywanie bębnów co 400ms od lewej
            response.grid.forEach((finalRow, rowIndex) => {
                finalRow.forEach((finalSymbol, colIndex) => {
                    setTimeout(() => {
                        // Podmieniamy symbole w siatce wiersz po wierszu dla konkretnej kolumny
                        setGrid(prevGrid => {
                            const newGrid = prevGrid.map(row => [...row]);
                            newGrid[rowIndex][colIndex] = finalSymbol;
                            return newGrid;
                        });

                        // Gdy ostatni wiersz tej kolumny się zatrzyma, wyłącz stan 'spinning' dla kolumny
                        if (rowIndex === 2) {
                            setSpinningReels(prev => {
                                const newSpinState = [...prev];
                                newSpinState[colIndex] = false;
                                return newSpinState;
                            });
                        }
                    }, (colIndex + 1) * 450); // Zatrzymywanie co 450ms
                });
            });

            // 4. Po zatrzymaniu ostatniego bębna (ok. 2500ms) pokaż wynik
            setTimeout(() => {
                setIsSpinning(false);
                if (response.winAmount > 0) {
                    setCurrentWin(response.winAmount);
                    setShowWinSplash(true);
                    topUp(response.winAmount); // Aktualizacja balansu w Context
                    setTimeout(() => setShowWinSplash(false), 3000); // Ukryj splash po 3s
                }
            }, (5 * 450) + 200); // Czas ostatniego bębna + margines

        } catch (error) {
            console.error("Błąd podczas kręcenia:", error);
            setIsSpinning(false);
            setSpinningReels(Array(5).fill(false)); // Wyłącz animację kręcenia
        }
    };

    return {
        balance, betAmount, setBetAmount, isSpinning, spinningReels,
        grid, currentWin, showWinSplash, spin, PAYLINES
    };
}