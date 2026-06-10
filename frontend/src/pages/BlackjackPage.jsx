import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlackjackGame } from '../hooks/useBlackjackGame';
import { AppShell } from '../components/AppShell/AppShell';
import './blackjack-animations.css';

const Card = ({ card, hidden }) => {
    if (hidden) {
        return (
            <div className="w-16 h-24 md:w-28 md:h-40 rounded-xl bg-[#111] bg-[url('/casino-bg.png')] bg-cover border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] card-enter" />
        );
    }
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
        <div className={`w-16 h-24 md:w-28 md:h-40 rounded-xl bg-white/95 backdrop-blur-sm flex flex-col justify-between p-1.5 md:p-3 shadow-[0_5px_20px_rgba(0,0,0,0.5)] border-2 border-white/20 card-enter ${isRed ? 'text-red-500' : 'text-slate-800'}`}>
            <div className="text-lg md:text-3xl font-bold leading-none">{card.value}</div>
            <div className="text-3xl md:text-6xl self-center">{card.suit}</div>
            <div className="text-lg md:text-3xl font-bold leading-none self-end rotate-180">{card.value}</div>
        </div>
    );
};

export function BlackjackPage() {
    const navigate = useNavigate();
    const {
        balance, currentTotalBet, placedChips, placeBet, clearBet, repeatLastBet, startGame, hit, stand, doubleDown, split, canSplit,
        playerHands, activeHandIndex, handBets, dealerHand, gameState, message, resetGame, calculateScore
    } = useBlackjackGame();

    const getChipStyle = (amt) => {
        switch(amt) {
            case 10: return 'from-blue-600 to-blue-900 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]';
            case 50: return 'from-red-600 to-red-900 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)]';
            case 100: return 'from-green-600 to-green-900 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]';
            case 500: return 'from-purple-600 to-purple-900 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]';
            default: return 'from-gray-600 to-gray-900 border-gray-400';
        }
    };

    return (
        <AppShell>
            <div className="view-container glassmorphism fade-in flex flex-col items-center py-6 min-h-[calc(100vh-80px)]">

                {/* HEADER */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <button onClick={() => navigate('/lobby')} className="btn-secondary neon-btn-outline">
                        ⬅ Back to Lobby
                    </button>
                    <h2 className="neon-title m-0">Blackjack Pro</h2>
                    <div className="glassmorphism-dark px-6 py-3 rounded-xl border border-purple-500/30 flex items-center gap-2">
                        <span className="text-gray-400 uppercase tracking-widest text-sm">Balance:</span>
                        <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                            ${balance.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-6xl flex flex-col justify-center items-center gap-8 relative">

                    {/* DEALER */}
                    <div className="flex flex-col items-center gap-4 w-full min-h-[180px]">
                        <div className="text-xl md:text-2xl font-black text-purple-400 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] bg-purple-900/20 px-8 py-2 rounded-full border border-purple-500/30">
                            Dealer
                        </div>
                        <div className="flex justify-center gap-3 relative">
                            {dealerHand.map((card, idx) => (
                                <Card key={idx} card={card} hidden={(gameState === 'playing' || gameState === 'dealing') && idx === 1} />
                            ))}
                        </div>
                        {gameState !== 'playing' && gameState !== 'dealing' && gameState !== 'betting' && dealerHand.length > 0 && (
                            <div className="glassmorphism-dark text-white border border-purple-500/50 px-6 py-1 rounded-full text-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                {calculateScore(dealerHand)}
                            </div>
                        )}
                    </div>

                    {/* ŚRODEK STOŁU - KOMUNIKATY I WIEŻA ŻETONÓW */}
                    <div className="flex flex-col items-center justify-center min-h-[140px] z-10 w-full my-2">
                        {message && (
                            <div className={`text-center font-black tracking-widest uppercase pulse-text drop-shadow-[0_0_20px_rgba(250,204,21,1)] bg-black/60 px-10 py-4 rounded-3xl border mb-4
                                ${message.includes('BLACKJACK')
                                ? 'text-4xl md:text-6xl text-yellow-300 border-yellow-300/80 shadow-[0_0_50px_rgba(250,204,21,1)]'
                                : 'text-2xl md:text-4xl text-yellow-500 border-yellow-500/30'}`}
                            >
                                {message}
                            </div>
                        )}
                        {gameState === 'dealing' && (
                            <div className="text-2xl text-purple-400 font-bold uppercase tracking-widest animate-pulse mb-4">
                                Dealing Cards...
                            </div>
                        )}

                        {/* Stos żetonów na stole */}
                        {placedChips.length > 0 && (
                            <div className="relative w-32 h-20 md:h-24 flex items-center justify-center mt-6">
                                {placedChips.map((chip, i) => (
                                    <div
                                        key={i}
                                        className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b ${getChipStyle(chip)} border-[4px] border-dashed text-white font-black text-sm md:text-base flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.6)] chip-enter`}
                                        style={{ bottom: `${i * 6}px`, zIndex: i }}
                                    >
                                        ${chip}
                                    </div>
                                ))}
                            </div>
                        )}
                        {gameState !== 'betting' && placedChips.length > 0 && (
                            <div className="mt-8 text-green-400 font-bold text-lg drop-shadow-md">Total Bet: ${currentTotalBet}</div>
                        )}
                    </div>

                    {/* PLAYER (Z OBSŁUGĄ SPLITA) */}
                    <div className="flex flex-col items-center gap-4 w-full min-h-[220px]">
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 w-full">
                            {playerHands.map((hand, idx) => (
                                <div key={idx} className={`flex flex-col items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${gameState === 'playing' && activeHandIndex === idx ? 'bg-blue-900/30 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-2 border-transparent'}`}>
                                    {hand.length > 0 && (
                                        <div className="glassmorphism-dark text-white border border-blue-500/50 px-6 py-1 rounded-full text-lg shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                            {calculateScore(hand)} {playerHands.length > 1 ? `(Bet: $${handBets[idx]})` : ''}
                                        </div>
                                    )}
                                    <div className="flex justify-center gap-3">
                                        {hand.map((card, cIdx) => (
                                            <Card key={cIdx} card={card} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-xl md:text-2xl font-black text-blue-400 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] bg-blue-900/20 px-8 py-2 rounded-full border border-blue-500/30 mt-2">
                            Player
                        </div>
                    </div>

                </div>

                {/* PANEL KONTROLNY */}
                <div className="w-full max-w-4xl mt-12 glassmorphism-dark p-6 md:p-8 rounded-[30px] border border-white/10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative z-20">

                    {gameState === 'betting' && (
                        <>
                            <div className="text-xl text-gray-300 font-light tracking-widest uppercase mb-2">
                                Current Bet: <span className="text-green-400 font-bold ml-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] text-3xl">${currentTotalBet}</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {[10, 50, 100, 500].map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => placeBet(amt)}
                                        className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-b ${getChipStyle(amt)} border-[6px] border-dashed text-white font-black text-lg md:text-2xl hover:scale-110 hover:rotate-12 transition-all flex items-center justify-center`}
                                    >
                                        ${amt}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4 w-full justify-center mt-4">
                                <button onClick={clearBet} className="px-8 md:px-10 py-3 rounded-xl border-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all uppercase tracking-widest font-bold">
                                    Clear
                                </button>
                                <button onClick={repeatLastBet} className="px-8 md:px-10 py-3 rounded-xl border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all uppercase tracking-widest font-bold">
                                    Last Bet
                                </button>
                                <button onClick={startGame} disabled={currentTotalBet === 0} className="btn-success neon-green-btn px-12 md:px-16 py-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                    Deal Cards
                                </button>
                            </div>
                        </>
                    )}

                    {gameState === 'playing' && (
                        <div className="flex flex-wrap gap-4 md:gap-6 w-full justify-center">
                            <button onClick={hit} className="btn-success neon-green-btn px-10 md:px-14 py-4 text-xl md:text-2xl">Hit</button>
                            <button onClick={stand} className="btn-secondary neon-btn-outline px-10 md:px-14 py-4 text-xl md:text-2xl border-red-500/50 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">Stand</button>

                            {playerHands[activeHandIndex]?.length === 2 && balance >= handBets[activeHandIndex] && (
                                <button onClick={doubleDown} className="px-10 md:px-14 py-4 rounded-xl border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all uppercase tracking-widest font-bold text-xl md:text-2xl">
                                    Double
                                </button>
                            )}

                            {canSplit && balance >= handBets[activeHandIndex] && (
                                <button onClick={split} className="px-10 md:px-14 py-4 rounded-xl border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all uppercase tracking-widest font-bold text-xl md:text-2xl">
                                    Split
                                </button>
                            )}
                        </div>
                    )}

                    {gameState === 'gameOver' && (
                        <button onClick={resetGame} className="btn-bonus neon-gold-btn pulse-anim px-16 md:px-20 py-4 text-xl md:text-2xl uppercase tracking-widest">
                            New Game
                        </button>
                    )}
                </div>
            </div>
        </AppShell>
    );
}