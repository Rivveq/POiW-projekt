import React from 'react';
import { useSlotsGame } from '../hooks/useSlotsGame';
import './slots-animations.css'; // <-- 1. Importujemy nowe animacje

export function SlotsPage() {
    const {
        balance, betAmount, setBetAmount, isSpinning, spinningReels,
        grid, currentWin, showWinSplash, spin, PAYLINES
    } = useSlotsGame();

    return (
        <div className="min-h-screen font-serif flex flex-col p-4 md:p-8 max-w-[1200px] mx-auto gap-8 items-center">

            {/* SPLASH SCREEN WYGRANEJ */}
            {showWinSplash && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500">
                    <div className="text-center animate-[bounce_1s_infinite] bg-[#1a0f0a] border-[4px] border-[#c5a363] p-12 rounded-[40px] shadow-[0_0_150px_rgba(197,163,99,0.8)]">
                        <h1 className="text-6xl md:text-8xl font-black text-[#c5a363] tracking-widest uppercase mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,1)]" style={{ fontFamily: 'Cinzel, serif' }}>
                            WIN!
                        </h1>
                        <p className="text-5xl md:text-7xl font-black text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            +${currentWin.toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {/* TYTUŁ MONTE CARLO */}
            <div className="text-center mt-6">
                <h1 className="text-4xl md:text-5xl text-[#c5a363] tracking-[0.2em] font-medium drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                    GRAND SLOTS
                </h1>
                <div className="w-48 h-[2px] bg-[#c5a363] mx-auto mt-3 opacity-50"></div>
                <p className="text-[#c5a363] mt-2 opacity-80 text-xl tracking-widest">MONTE CARLO</p>
            </div>

            {/* MASZYNA SLOTS - Przebudowana dla 3x5 */}
            <div className="w-full bg-[#0c261e] border-4 border-[#c5a363] p-8 rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8),_0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 items-center">

                {/* 2. SIATKA BĘBNÓW (Reel Grid) 3x5 */}
                <div className="bg-[#111] p-6 rounded-2xl border-2 border-[#c5a363]/50 shadow-inner flex gap-2 w-full justify-center">
                    {[0, 1, 2, 3, 4].map((colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-2">
                            {grid.map((row, rowIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-24 h-24 md:w-28 md:h-28 bg-white rounded-lg flex items-center justify-center text-6xl shadow-xl border-4 border-[#c5a363]/20 transition-all duration-300
                                        ${showWinSplash && currentWin > 0 ? 'slot-cell-winner' : ''} /* fikuśna animacja dla całej siatki, gdy wygrasz */
                                    `}
                                >
                                    {/* 3. Wizualizacja kręcenia dla konkretnej kolumny */}
                                    <div className={spinningReels[colIndex] ? 'slot-reel-spinning' : 'transition-transform duration-300'}>
                                        {spinningReels[colIndex] ? "🍒" : row[colIndex]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* INFO O LINIACH */}
                <div className="text-white opacity-60 text-xs w-full text-center">
                    Paylines: 3 Horizontal, 2 Diagonal (V-Shape & Inverted V). Minimum 3 matching symbols from left required.
                </div>

                {/* PANEL KONTROLNY (ACTION BAR) */}
                <div className="w-full bg-[#111] p-6 rounded-2xl border-2 border-[#c5a363]/50 flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[#c5a363] text-sm uppercase tracking-widest mb-1">Balance</span>
                        <span className="text-3xl text-white font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                            ${balance.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[#c5a363] uppercase tracking-widest text-sm">Bet:</span>
                        <select
                            disabled={isSpinning}
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            className="bg-[#2a1b12] text-[#c5a363] border border-[#c5a363] p-3 rounded-lg text-xl outline-none"
                        >
                            <option value={10}>$10</option>
                            <option value={50}>$50</option>
                            <option value={100}>$100</option>
                            <option value={500}>$500</option>
                            <option value={1000}>$1000</option>
                        </select>
                    </div>

                    <button
                        onClick={spin}
                        disabled={isSpinning || balance < betAmount}
                        className="bg-gradient-to-b from-[#e6c883] to-[#c5a363] text-black font-black text-2xl px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(197,163,99,0.4)] hover:shadow-[0_0_40px_rgba(197,163,99,0.7)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest"
                    >
                        {isSpinning ? 'Spinning...' : 'SPIN'}
                    </button>
                </div>

            </div>
        </div>
    );
}