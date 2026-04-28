import React from 'react';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const getColorClass = (num) => {
    if (num === '-') return 'bg-transparent border-white/20 text-white/30';
    if (num === 0) return 'bg-roulette-green border-emerald-300 text-white';
    if (RED_NUMBERS.includes(num)) return 'bg-roulette-red border-red-300 text-white';
    return 'bg-roulette-black border-zinc-500 text-white';
};

export default function HotColdPanel({ hotNumbers = [], coldNumbers = [], history = [] }) {
    const displayHot = [...hotNumbers, '-', '-', '-', '-'].slice(0, 4);
    const displayCold = [...coldNumbers, '-', '-', '-', '-'].slice(0, 4);
    const recentHistory = history.slice(0, 12);

    return (
        <div className="w-full wood-panel rounded-2xl p-5 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">

            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"></div>

            <div className="relative z-10">
                <div className="mb-8">
                    <h3 className="text-roulette-gold text-sm tracking-widest uppercase mb-4 font-bold text-center border-b border-roulette-brass/30 pb-2 font-sans">
                        Recent History
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2 min-h-[40px]">
                        {recentHistory.length === 0 ? (
                            <span className="text-white/40 text-sm mt-2 font-sans">Spin the wheel to track history...</span>
                        ) : (
                            recentHistory.map((num, i) => (
                                <div key={`hist-${i}`} className={`w-10 h-10 rounded-full border-[2px] flex items-center justify-center text-base font-bold shadow-md font-sans ${getColorClass(num)}`}>
                                    {num}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-roulette-brass/40 to-transparent my-6" />

                <div className="mb-8">
                    <h3 className="text-red-500 text-sm tracking-widest uppercase mb-4 font-black text-center font-sans">
                        Hot Numbers
                    </h3>
                    <div className="flex justify-between gap-2 px-4">
                        {displayHot.map((num, i) => (
                            <div key={`hot-${i}`} className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-black shadow-md font-sans ${num === '-' ? 'border-white/10 text-white/20' : 'border-red-400 bg-roulette-red text-white'}`}>
                                {num}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-black text-center font-sans">
                        Cold Numbers
                    </h3>
                    <div className="flex justify-between gap-2 px-4">
                        {displayCold.map((num, i) => (
                            <div key={`cold-${i}`} className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-black shadow-md font-sans ${num === '-' ? 'border-white/10 text-white/20' : 'border-blue-400 bg-blue-900 text-white'}`}>
                                {num}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}