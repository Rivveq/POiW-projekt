import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSlotsGame } from '../hooks/useSlotsGame';
import { AppShell } from '../components/AppShell/AppShell';
import './slots-animations.css';

const SlotSymbols = {
    CHERRY: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-full h-full drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            <path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm-2 10a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zM12 6v6" strokeLinecap="round" />
        </svg>
    ),
    LEMON: () => (
        <svg viewBox="0 0 24 24" fill="#eab308" className="w-full h-full drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#fef08a" />
        </svg>
    ),
    BELL: () => (
        <svg viewBox="0 0 24 24" fill="#f59e0b" className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
    ),
    SEVEN: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" className="w-full h-full drop-shadow-[0_0_12px_rgba(220,38,38,0.9)]">
            <path d="M5 5h14l-6 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    DIAMOND: () => (
        <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,1)]">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 16.5L5.5 12 12 5.5 18.5 12 12 18.5z" />
        </svg>
    ),
    WILD: () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg text-white font-black text-2xl shadow-[0_0_20px_rgba(168,85,247,1)] border-2 border-white/50">
            W
        </div>
    )
};

const getSymbolKey = (rawSymbol) => {
    const map = {
        "🍒": "CHERRY", "🍋": "LEMON", "🔔": "BELL", "7️⃣": "SEVEN", "💎": "DIAMOND",
        "CHERRY": "CHERRY", "LEMON": "LEMON", "BELL": "BELL", "SEVEN": "SEVEN", "DIAMOND": "DIAMOND", "WILD": "WILD"
    };
    return map[rawSymbol] || "CHERRY";
};

const BET_AMOUNTS = [0.50, 1, 2, 5, 10, 25];

export function SlotsPage() {
    const navigate = useNavigate();
    const {
        balance, betAmount, setBetAmount, isSpinning, spinningReels,
        grid, currentWin, showWinSplash, performSpin,
        isAutoSpin, toggleAutoSpin, isQuickSpin, toggleQuickSpin,
        activeMultiplier, freeSpins
    } = useSlotsGame();

    return (
        <AppShell>
            <div className="view-container glassmorphism fade-in flex flex-col items-center py-6 min-h-[calc(100vh-80px)] relative">

                {showWinSplash && activeMultiplier > 1 && (
                    <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-50 pointer-events-none multiplier-popup flex justify-center w-full">
                        <span className="text-6xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,1)] text-center w-full">
                            x{activeMultiplier} MULTIPLIER!
                        </span>
                    </div>
                )}

                <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <button onClick={() => navigate('/lobby')} className="btn-secondary neon-btn-outline">
                        ⬅ Back to Lobby
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="neon-title m-0">Cyber Slots</h2>
                        {freeSpins > 0 && (
                            <span className="text-pink-400 font-bold uppercase tracking-widest animate-pulse">
                                {freeSpins} Free Spins Remaining!
                            </span>
                        )}
                    </div>
                    <div className="glassmorphism-dark px-6 py-3 rounded-xl border border-blue-500/30 flex items-center gap-2">
                        <span className="text-gray-400 uppercase tracking-widest text-sm">Balance:</span>
                        <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                            ${balance.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-[1000px] bg-[#0c1a15] border border-green-500/30 p-8 rounded-[40px] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),_0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 items-center relative z-10">

                    {/* Główna sekcja slotów z twardym layoutem (overflow-hidden chroni siatkę) */}
                    <div className="bg-[#050b09] p-4 md:p-6 rounded-2xl border border-green-500/20 shadow-[inset_0_0_40px_rgba(0,0,0,1)] flex gap-2 md:gap-4 w-full justify-center">
                        {[0, 1, 2, 3, 4].map((colIndex) => (
                            <div key={colIndex} className="flex flex-col gap-2 md:gap-4">
                                {grid.map((row, rowIndex) => {
                                    const isColSpinning = spinningReels[colIndex];
                                    const symbolKey = getSymbolKey(row[colIndex]);
                                    const SymbolIcon = SlotSymbols[symbolKey] || SlotSymbols.CHERRY;

                                    return (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`relative w-16 h-16 md:w-24 md:h-24 bg-[#111] rounded-xl flex items-center justify-center shadow-xl border-2 border-white/5 overflow-hidden transition-colors duration-300
                                                ${showWinSplash && currentWin > 0 && !isColSpinning ? 'slot-cell-winner bg-[#1a1a1a]' : ''}
                                            `}
                                        >
                                            {isColSpinning ? (
                                                /* Udawany, płynny i długi pasek bębna zjeżdżający w dół */
                                                <div className="absolute top-0 left-0 w-full h-[200%] flex flex-col items-center justify-around animate-spin-reel opacity-70 blur-[1.5px]">
                                                    <div className="w-[65%] h-1/4 flex items-center justify-center"><SlotSymbols.SEVEN /></div>
                                                    <div className="w-[65%] h-1/4 flex items-center justify-center"><SlotSymbols.DIAMOND /></div>
                                                    <div className="w-[65%] h-1/4 flex items-center justify-center"><SlotSymbols.SEVEN /></div>
                                                    <div className="w-[65%] h-1/4 flex items-center justify-center"><SlotSymbols.DIAMOND /></div>
                                                </div>
                                            ) : (
                                                /* Właściwy symbol po zatrzymaniu */
                                                <div className={`w-[75%] h-[75%] flex items-center justify-center symbol-land ${showWinSplash && currentWin > 0 ? 'explosion-effect' : ''}`}>
                                                    <SymbolIcon />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="h-12 flex items-center justify-center w-full">
                        {showWinSplash && currentWin > 0 && (
                            <div className="text-3xl md:text-5xl text-yellow-400 font-black tracking-widest uppercase pulse-text drop-shadow-[0_0_15px_rgba(250,204,21,1)] text-center">
                                WIN ${currentWin.toFixed(2)}
                            </div>
                        )}
                    </div>

                    <div className="w-full glassmorphism-dark p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">

                        <div className="flex gap-4">
                            <button
                                onClick={toggleAutoSpin}
                                className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest border-2 transition-all ${isAutoSpin ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-gray-600 text-gray-400 hover:border-purple-500/50 hover:text-purple-300'}`}
                            >
                                Auto Spin
                            </button>
                            <button
                                onClick={toggleQuickSpin}
                                className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest border-2 transition-all ${isQuickSpin ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-gray-600 text-gray-400 hover:border-blue-500/50 hover:text-blue-300'}`}
                            >
                                Quick Spin
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 uppercase tracking-widest text-sm">Bet:</span>
                            <select
                                disabled={isSpinning || isAutoSpin}
                                value={betAmount}
                                onChange={(e) => setBetAmount(Number(e.target.value))}
                                className="bg-[#111] text-green-400 border border-green-500/50 p-3 rounded-lg text-xl outline-none font-bold cursor-pointer"
                            >
                                {BET_AMOUNTS.map(amt => (
                                    <option key={amt} value={amt}>${amt.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={performSpin}
                            disabled={isSpinning || (balance < betAmount && freeSpins === 0)}
                            className="btn-success neon-green-btn px-16 py-4 text-2xl uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSpinning ? '...' : (freeSpins > 0 ? 'FREE SPIN' : 'SPIN')}
                        </button>
                    </div>

                </div>
            </div>
        </AppShell>
    );
}