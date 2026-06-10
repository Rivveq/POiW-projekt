import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../services/api';
import { useGameState } from './useGameState';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getCardValue = (val) => {
    if (['J', 'Q', 'K'].includes(val)) return 10;
    if (val === 'A') return 11;
    return parseInt(val);
};

export function useBlackjackGame() {
    const { addXp } = useGameState();
    const [deck, setDeck] = useState([]);

    // Obsługa wielu rąk (dla Splita)
    const [playerHands, setPlayerHands] = useState([]);
    const [handBets, setHandBets] = useState([]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);

    const [dealerHand, setDealerHand] = useState([]);
    const [gameState, setGameState] = useState('betting');

    // Żetony i zakłady
    const [placedChips, setPlacedChips] = useState([]);
    const [lastPlacedChips, setLastPlacedChips] = useState([]);
    const [balance, setBalance] = useState(0);
    const [message, setMessage] = useState('');

    const currentTotalBet = placedChips.reduce((a, b) => a + b, 0);

    const fetchBalance = useCallback(async () => {
        try {
            const res = await apiFetch('/api/wallet/balance');
            if (res && res.balance !== undefined) setBalance(res.balance);
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => { fetchBalance(); }, [fetchBalance]);

    const calculateScore = (hand) => {
        let score = 0;
        let aces = 0;
        hand.forEach(card => {
            score += card.weight;
            if (card.value === 'A') aces += 1;
        });
        while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
        }
        return score;
    };

    const createDeck = () => {
        let newDeck = [];
        for (let s of SUITS) {
            for (let v of VALUES) {
                newDeck.push({ suit: s, value: v, weight: getCardValue(v) });
            }
        }
        return newDeck.sort(() => Math.random() - 0.5);
    };

    const placeBet = (amount) => {
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
        setPlayerHands([]);
        setDealerHand([]);

        const currentDeck = createDeck();

        const p1 = currentDeck.pop();
        setPlayerHands([[p1]]);
        await new Promise(r => setTimeout(r, 600));

        const d1 = currentDeck.pop();
        setDealerHand([d1]);
        await new Promise(r => setTimeout(r, 600));

        const p2 = currentDeck.pop();
        const initialHand = [p1, p2];
        setPlayerHands([initialHand]);
        setHandBets([currentTotalBet]);
        setActiveHandIndex(0);
        await new Promise(r => setTimeout(r, 600));

        const d2 = currentDeck.pop();
        setDealerHand([d1, d2]);
        await new Promise(r => setTimeout(r, 600));

        setDeck(currentDeck);

        if (calculateScore(initialHand) === 21) {
            setGameState('dealerTurn');
        } else {
            setGameState('playing');
        }
    };

    const hit = () => {
        if (gameState !== 'playing') return;

        const newCard = deck.pop();
        const newHands = [...playerHands];
        newHands[activeHandIndex] = [...newHands[activeHandIndex], newCard];

        setPlayerHands(newHands);
        setDeck([...deck]);

        const score = calculateScore(newHands[activeHandIndex]);
        if (score >= 21) {
            if (activeHandIndex < newHands.length - 1) {
                setActiveHandIndex(prev => prev + 1);
            } else {
                setGameState('dealerTurn');
            }
        }
    };

    const stand = () => {
        if (gameState !== 'playing') return;

        if (activeHandIndex < playerHands.length - 1) {
            setActiveHandIndex(prev => prev + 1);
        } else {
            setGameState('dealerTurn');
        }
    };

    const doubleDown = () => {
        const betForHand = handBets[activeHandIndex];
        if (balance < betForHand) return;

        // Dorzucenie żetonu na stół wizualnie
        setPlacedChips(prev => [...prev, betForHand]);

        const newBets = [...handBets];
        newBets[activeHandIndex] *= 2;
        setHandBets(newBets);

        const newCard = deck.pop();
        const newHands = [...playerHands];
        newHands[activeHandIndex] = [...newHands[activeHandIndex], newCard];

        setPlayerHands(newHands);
        setDeck([...deck]);

        if (activeHandIndex < newHands.length - 1) {
            setActiveHandIndex(prev => prev + 1);
        } else {
            setGameState('dealerTurn');
        }
    };

    const split = () => {
        const currentHand = playerHands[activeHandIndex];
        const betForHand = handBets[activeHandIndex];

        if (balance < betForHand) return;

        setPlacedChips(prev => [...prev, betForHand]);

        const card1 = currentHand[0];
        const card2 = currentHand[1];
        const newCard1 = deck.pop();
        const newCard2 = deck.pop();

        const newHands = [...playerHands];
        newHands.splice(activeHandIndex, 1, [card1, newCard1], [card2, newCard2]);

        const newBets = [...handBets];
        newBets.splice(activeHandIndex, 1, betForHand, betForHand);

        setPlayerHands(newHands);
        setHandBets(newBets);
        setDeck([...deck]);
    };

    useEffect(() => {
        if (gameState === 'dealerTurn') {
            let currentDealerHand = [...dealerHand];
            let currentDeck = [...deck];

            const allBusted = playerHands.every(hand => calculateScore(hand) > 21);

            const playDealer = async () => {
                if (!allBusted) {
                    while (calculateScore(currentDealerHand) < 17) {
                        await new Promise(r => setTimeout(r, 800));
                        currentDealerHand = [...currentDealerHand, currentDeck.pop()];
                        setDealerHand([...currentDealerHand]);
                        setDeck([...currentDeck]);
                    }
                }
                endGame(playerHands, currentDealerHand, handBets);
            };
            playDealer();
        }
    }, [gameState]);

    const endGame = async (pHands, dHand, hBets) => {
        setGameState('resolving');
        const dScore = calculateScore(dHand);
        const isDealerBj = dHand.length === 2 && dScore === 21;

        let totalWin = 0;
        let totalBetUsed = 0;
        let results = [];

        pHands.forEach((hand, idx) => {
            const pScore = calculateScore(hand);
            const isPlayerBj = hand.length === 2 && pScore === 21 && pHands.length === 1;
            const bet = hBets[idx];
            totalBetUsed += bet;

            let handWin = 0;
            let resText = '';

            if (pScore > 21) {
                resText = 'BUST';
            } else if (isPlayerBj && !isDealerBj) {
                handWin = bet * 2.5;
                resText = 'BLACKJACK';
            } else if (isPlayerBj && isDealerBj) {
                handWin = bet;
                resText = 'PUSH';
            } else if (isDealerBj) {
                resText = 'LOSE';
            } else if (dScore > 21) {
                handWin = bet * 2;
                resText = 'WIN';
            } else if (pScore > dScore) {
                handWin = bet * 2;
                resText = 'WIN';
            } else if (pScore === dScore) {
                handWin = bet;
                resText = 'PUSH';
            } else {
                resText = 'LOSE';
            }

            totalWin += handWin;
            results.push(`H${idx+1}: ${resText}`);
        });

        if (pHands.length === 1) {
            if (results[0].includes('BLACKJACK')) setMessage(`🔥 BLACKJACK! WIN $${totalWin.toFixed(2)} 🔥`);
            else if (results[0].includes('WIN')) setMessage(`YOU WIN $${totalWin.toFixed(2)}`);
            else if (results[0].includes('PUSH')) setMessage('PUSH! BET RETURNED.');
            else if (results[0].includes('BUST')) setMessage('BUST! YOU LOSE.');
            else setMessage('DEALER WINS.');
        } else {
            setMessage(results.join(' | ') + (totalWin > 0 ? ` (WIN $${totalWin.toFixed(2)})` : ' (LOSE)'));
        }

        try {
            const res = await apiFetch('/api/blackjack/settle', {
                method: 'POST',
                body: { betAmount: totalBetUsed, winAmount: totalWin }
            });
            if (res && res.balance !== undefined) setBalance(res.balance);
        } catch (err) { console.error(err); }

        setGameState('gameOver');
    };

    const resetGame = () => {
        setPlayerHands([]);
        setDealerHand([]);
        setPlacedChips([]);
        setGameState('betting');
        setMessage('');
    };

    // Helpery do wyświetlania na froncie
    const activeHand = playerHands[activeHandIndex] || [];
    const canSplit = gameState === 'playing' &&
        playerHands.length === 1 &&
        activeHand.length === 2 &&
        getCardValue(activeHand[0].value) === getCardValue(activeHand[1].value);

    return {
        balance, currentTotalBet, placedChips, placeBet, clearBet, repeatLastBet, startGame, hit, stand, doubleDown, split, canSplit,
        playerHands, activeHandIndex, handBets, dealerHand, gameState, message, resetGame, calculateScore
    };
}