import React from 'react';

const CHIP_VALUES = [
    { value: 1, text: '$1', bgClass: 'bg-white', textClass: 'text-black', borderClass: 'border-zinc-300' },
    { value: 5, text: '$5', bgClass: 'bg-red-600', textClass: 'text-white', borderClass: 'border-red-800' },
    { value: 25, text: '$25', bgClass: 'bg-blue-600', textClass: 'text-white', borderClass: 'border-blue-800' },
    { value: 100, text: '$100', bgClass: 'bg-green-700', textClass: 'text-white', borderClass: 'border-green-900' },
    { value: 500, text: '$500', bgClass: 'bg-black', textClass: 'text-white', borderClass: 'border-zinc-700' },
    { value: 1000, text: '$1K', bgClass: 'bg-purple-800', textClass: 'text-white', borderClass: 'border-purple-950' },
];

export default function ActionBar({ balance, selectedChip, setSelectedChip, spinWheel, isSpinning, clearBets }) {
    return (
        <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-6 p-6 wood-panel rounded-2xl relative overflow-hidden">

            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

            <div className="relative z-10 w-full flex flex-col xl:flex-row items-center justify-between gap-6">

                {/* SALDO */}
                <div className="flex flex-col items-center bg-black/80 border-2 border-roulette-brass px-8 py-3 rounded-xl shadow-inner min-w-[200px]">
                    <span className="text-roulette-brass text-[12px] tracking-widest uppercase font-bold mb-1 font-sans">Total Balance</span>
                    <span className="text-3xl text-white font-medium roulette-number drop-shadow-md">
                        ${balance.toLocaleString()}
                    </span>
                </div>

                {/* ŻETONY */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 flex-grow">
                    {CHIP_VALUES.map((chip) => (
                        <button
                            key={`chip-${chip.value}`}
                            onClick={() => setSelectedChip(chip.value)}
                            disabled={isSpinning || balance < chip.value}
                            className={`group relative w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-dashed font-black text-base md:text-xl shadow-[0_5px_15px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 ${chip.bgClass} ${chip.textClass} ${chip.borderClass} ${
                                balance < chip.value ? 'opacity-40 cursor-not-allowed' : ''
                            } ${
                                selectedChip === chip.value
                                    ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-black scale-110 shadow-[0_0_20px_rgba(250,204,21,0.5)]'
                                    : 'hover:ring-2 hover:ring-white/50'
                            }`}
                        >
                            <div className="absolute inset-[2px] rounded-full border-2 border-white/20"></div>
                            <span className="relative z-10">{chip.text}</span>
                        </button>
                    ))}
                </div>

                {/* PRZYCISKI AKCJI */}
                <div className="flex gap-4 w-full xl:w-auto">
                    {/* Wyczyść zakłady */}
                    <button
                        onClick={clearBets}
                        disabled={isSpinning}
                        className="flex-1 xl:w-32 h-16 md:h-20 rounded-xl text-white font-bold text-lg uppercase shadow-[0_0_20px_rgba(185,28,28,0.5)] border-2 border-red-500 bg-gradient-to-b from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 transition-all disabled:opacity-50 disabled:grayscale font-sans"
                    >
                        CLEAR
                    </button>

                    {/* Kręć */}
                    <button
                        onClick={spinWheel}
                        disabled={isSpinning || balance <= 0}
                        className="flex-2 xl:w-48 h-16 md:h-20 rounded-xl text-white font-black text-2xl uppercase shadow-[0_0_30px_rgba(7,109,63,0.8)] border-2 border-green-400 bg-gradient-to-b from-green-500 to-green-800 hover:from-green-400 hover:to-green-700 transition-all disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95 font-sans"
                    >
                        {isSpinning ? 'SPINNING' : 'SPIN'}
                    </button>
                </div>

            </div>
        </div>
    );
}