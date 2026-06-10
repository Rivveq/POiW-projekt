import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../services/api';
import { useGameState } from './useGameState';

const DEFAULT_GRID = [
    ["CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY"],
    ["CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY"],
    ["CHERRY", "CHERRY", "CHERRY", "CHERRY", "CHERRY"]
];

export function useSlotsGame() {
    const { addXp } = useGameState();
    const [balance, setBalance] = useState(0);
    const [betAmount, setBetAmount] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinningReels, setSpinningReels] = useState([false, false, false, false, false]);
    const [grid, setGrid] = useState(DEFAULT_GRID);

    const [currentWin, setCurrentWin] = useState(0);
    const [showWinSplash, setShowWinSplash] = useState(false);
    const [activeMultiplier, setActiveMultiplier] = useState(1);
    const [freeSpins, setFreeSpins] = useState(0);

    const [isAutoSpin, setIsAutoSpin] = useState(false);
    const [isQuickSpin, setIsQuickSpin] = useState(false);

    const autoSpinTimer = useRef(null);

    const fetchBalance = useCallback(async () => {
        try {
            const res = await apiFetch('/api/wallet/balance');
            if (res && res.balance !== undefined) setBalance(res.balance);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => { fetchBalance(); }, [fetchBalance]);

    const performSpin = async () => {
        if (balance < betAmount && freeSpins === 0) {
            setIsAutoSpin(false);
            return;
        }

        setIsSpinning(true);
        setShowWinSplash(false);
        setCurrentWin(0);
        setActiveMultiplier(1);
        setSpinningReels([true, true, true, true, true]);

        const spinDuration = isQuickSpin ? 100 : 300;

        try {
            const actualBet = freeSpins > 0 ? 0 : betAmount;

            const result = await apiFetch('/api/slots/spin', {
                method: 'POST',
                body: { betAmount: actualBet }
            });

            addXp(actualBet * 10);
            setGrid(result.grid);

            for (let i = 0; i < 5; i++) {
                await new Promise(r => setTimeout(r, spinDuration));
                setSpinningReels(prev => {
                    const next = [...prev];
                    next[i] = false;
                    return next;
                });
            }

            if (result.winAmount > 0) {
                setCurrentWin(result.winAmount);
                setShowWinSplash(true);
                if (result.multiplier > 1) setActiveMultiplier(result.multiplier);
            }

            if (result.freeSpinsWon > 0) {
                setFreeSpins(prev => prev + result.freeSpinsWon);
            } else if (freeSpins > 0) {
                setFreeSpins(prev => prev - 1);
            }

            await fetchBalance();

        } catch (err) {
            console.error('Spin failed', err);
            setSpinningReels([false, false, false, false, false]);
            setIsAutoSpin(false);
        } finally {
            setIsSpinning(false);
        }
    };

    useEffect(() => {
        if (isAutoSpin && !isSpinning) {
            const delay = showWinSplash ? 2000 : 500;
            autoSpinTimer.current = setTimeout(() => {
                performSpin();
            }, delay);
        }
        return () => clearTimeout(autoSpinTimer.current);
    }, [isAutoSpin, isSpinning, showWinSplash]);

    const toggleAutoSpin = () => setIsAutoSpin(!isAutoSpin);
    const toggleQuickSpin = () => setIsQuickSpin(!isQuickSpin);

    return {
        balance, betAmount, setBetAmount, isSpinning, spinningReels,
        grid, currentWin, showWinSplash, performSpin,
        isAutoSpin, toggleAutoSpin, isQuickSpin, toggleQuickSpin,
        activeMultiplier, freeSpins
    };
}