import React from 'react';
import { useRouletteGame } from '../hooks/useRouletteGame';
import WheelContainer from '../components/WheelContainer';
import BettingBoard from '../components/BettingBoard';
import ActionBar from '../components/ActionBar';

export default function RoulettePage({ globalBalance }) {
    const {
        rouletteBalance, currentBets, selectedChip, winningNumber,
        isSpinning, placeBet, setSelectedChip, spinWheel, clearBets,
        showWinSplash, winAmount
    } = useRouletteGame(globalBalance);

    return (
        <div className="min-h-screen font-serif flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto gap-6">

            {/* ELEGANCKI KOMUNIKAT O WYGRANEJ */}
            {showWinSplash && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div className="text-center animate-bounce bg-[#2a1b12] border-[4px] border-roulette-brass p-12 rounded-3xl shadow-[0_0_100px_rgba(197,163,99,0.5)]">
                        <h1 className="text-5xl md:text-7xl font-black text-roulette-gold tracking-widest uppercase mb-4 drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                            WYGRANA!
                        </h1>
                        <p className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            +${winAmount.toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {/* ELEGANCKI TYTUŁ */}
            <div className="text-center mt-2 mb-4">
                <h1 className="text-4xl md:text-5xl text-roulette-gold tracking-[0.2em] font-medium drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                    MONTE CARLO
                </h1>
                <div className="w-32 h-[2px] bg-roulette-brass mx-auto mt-3 opacity-50"></div>
            </div>

            {/* GÓRNY RZĄD: Większe Koło i Statystyki */}
            <div className="flex w-full max-w-6xl mx-auto items-center justify-center">
                <WheelContainer lastResult={winningNumber} isSpinning={isSpinning} />
            </div>

            {/* DOLNY RZĄD: Zmniejszona plansza na środku */}
            <div className="flex-grow flex flex-col gap-6 w-full max-w-6xl mx-auto">
                <div className="w-full bg-[#0c261e] border-2 border-roulette-brass p-4 rounded-2xl shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
                    <BettingBoard placeBet={placeBet} bets={currentBets} isSpinning={isSpinning} />
                </div>

                <ActionBar
                    balance={rouletteBalance}
                    selectedChip={selectedChip}
                    setSelectedChip={setSelectedChip}
                    spinWheel={spinWheel}
                    isSpinning={isSpinning}
                    clearBets={clearBets}
                />
            </div>
        </div>
    );
}