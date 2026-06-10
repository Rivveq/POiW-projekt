import React from 'react';

export function PlayerStatsPanel({ rank, level, xp }) {
    // Obliczanie precyzyjnego progresu do następnego levelu
    const currentLevelBaseXp = Math.pow(level - 1, 2) * 150;
    const nextLevelXp = Math.pow(level, 2) * 150;
    const xpInCurrentLevel = xp - currentLevelBaseXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelBaseXp;
    const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

    // Dynamiczne style w zależności od obecnej rangi
    const getRankStyles = (rankName) => {
        switch(rankName) {
            case 'Bronze': return { bar: 'from-[#714a2c] to-[#cd7f32]', border: 'border-[#cd7f32]', text: 'text-[#cd7f32]', shadow: 'shadow-[0_0_15px_rgba(205,127,50,0.3)]' };
            case 'Silver': return { bar: 'from-[#707070] to-[#e3e3e3]', border: 'border-[#e3e3e3]', text: 'text-[#e3e3e3]', shadow: 'shadow-[0_0_15px_rgba(227,227,227,0.4)]' };
            case 'Gold': return { bar: 'from-[#856100] to-[#ffd700]', border: 'border-[#ffd700]', text: 'text-[#ffd700]', shadow: 'shadow-[0_0_20px_rgba(255,215,0,0.6)]' };
            case 'Platinum': return { bar: 'from-[#005c6e] to-[#00f0ff]', border: 'border-[#00f0ff]', text: 'text-[#00f0ff]', shadow: 'shadow-[0_0_25px_rgba(0,240,255,0.7)]' };
            case 'Amethyst': return { bar: 'from-[#3a005c] to-[#b000ff]', border: 'border-[#b000ff]', text: 'text-[#b000ff]', shadow: 'shadow-[0_0_30px_rgba(176,0,255,0.8)]' };
            case 'Ruby': return { bar: 'from-[#5e0000] to-[#ff003c]', border: 'border-[#ff003c]', text: 'text-[#ff003c]', shadow: 'shadow-[0_0_40px_rgba(255,0,60,0.9)]' };
            case 'Grandmaster': return { bar: 'from-yellow-400 to-yellow-200', border: 'border-yellow-400', text: 'text-yellow-400', shadow: 'shadow-[0_0_50px_rgba(255,215,0,1)] animate-pulse' };
            default: return { bar: 'from-gray-600 to-gray-400', border: 'border-gray-400', text: 'text-gray-400', shadow: '' };
        }
    };

    const getRankIcon = (rankName) => {
        switch(rankName) {
            case 'Bronze': return '🥉';
            case 'Silver': return '🥈';
            case 'Gold': return '🥇';
            case 'Platinum': return '💎';
            case 'Amethyst': return '🔮';
            case 'Ruby': return '🔴';
            case 'Grandmaster': return '👑';
            default: return '⭐';
        }
    }

    const rankStyle = getRankStyles(rank);

    return (
        <div className="w-full max-w-2xl mx-auto my-6">
            <div className={`bg-[#050b09] p-6 rounded-[30px] border-2 ${rankStyle.border} ${rankStyle.shadow} flex flex-col items-center gap-4 relative overflow-hidden transition-all duration-700`}>

                {/* Ozdobny błysk świetlny w rogu */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex w-full justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl drop-shadow-xl hover:scale-110 transition-transform">{getRankIcon(rank)}</div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-widest font-black">Current Rank</span>
                            <span className={`text-2xl md:text-3xl font-black uppercase tracking-widest ${rankStyle.text} drop-shadow-lg`} style={{ fontFamily: 'Cinzel, serif' }}>
                                {rank}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-gray-500 text-xs uppercase tracking-widest font-black">Player Level</span>
                        <span className={`text-4xl font-black ${rankStyle.text} drop-shadow-lg`}>{level}</span>
                    </div>
                </div>

                {/* Precyzyjny Pasek Progresu XP */}
                <div className="w-full mt-4 z-10">
                    <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                        <span>XP: {xp.toLocaleString()}</span>
                        <span>NEXT LEVEL: {nextLevelXp.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-4 bg-black/80 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,1)] relative">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${rankStyle.bar} transition-all duration-1000 ease-out relative`}
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Efekt przelatującego błysku na pasku */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}