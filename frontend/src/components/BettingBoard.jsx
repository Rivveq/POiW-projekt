import React from 'react';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const getChipStyle = (amount) => {
    if (amount >= 1000) return 'bg-purple-800 text-white border-purple-950';
    if (amount >= 500) return 'bg-black text-white border-zinc-700';
    if (amount >= 100) return 'bg-green-700 text-white border-green-900';
    if (amount >= 25) return 'bg-blue-600 text-white border-blue-800';
    if (amount >= 5) return 'bg-red-600 text-white border-red-800';
    return 'bg-white text-black border-zinc-300';
};

export default function BettingBoard({ placeBet, bets, isSpinning }) {

    const BetToken = ({ amount }) => {
        const style = getChipStyle(amount);
        return (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 border-[3px] rounded-full flex items-center justify-center shadow-2xl z-20 pointer-events-none ${style}`}>
                <div className="absolute inset-[2px] rounded-full border border-dashed border-white/50"></div>
                <span className="text-[10px] md:text-xs font-black relative z-10 drop-shadow-md">${amount}</span>
            </div>
        );
    };

    const NumberCell = ({ num }) => {
        const isRed = RED_NUMBERS.includes(num);
        return (
            <button
                onClick={() => placeBet(num.toString())}
                disabled={isSpinning}
                className={`relative w-full h-12 md:h-16 border border-white/20 flex items-center justify-center transition-all hover:brightness-125 ${isRed ? 'bg-roulette-red' : 'bg-roulette-black'}`}
            >
                <span className="text-xl md:text-2xl text-white font-bold roulette-number">{num}</span>
                {bets[num] && <BetToken amount={bets[num]} />}
            </button>
        );
    };

    const SpecialCell = ({ id, label, className = '' }) => (
        <button
            onClick={() => placeBet(id)}
            disabled={isSpinning}
            className={`relative p-2 md:p-3 border border-white/20 flex items-center justify-center transition-all hover:bg-white/10 bg-transparent ${className}`}
        >
            <span className="text-white text-xs md:text-sm tracking-widest uppercase font-bold font-sans">{label}</span>
            {bets[id] && <BetToken amount={bets[id]} />}
        </button>
    );

    return (
        <div className="w-full flex justify-center p-2 rounded-xl bg-[#0b2b20] border-2 border-roulette-brass shadow-2xl">
            <div className="flex w-full gap-1 md:gap-2">

                {/* KOLUMNA ZERO */}
                <button
                    onClick={() => placeBet('0')}
                    disabled={isSpinning}
                    className="relative w-16 md:w-20 bg-roulette-green border border-white/20 flex items-center justify-center hover:brightness-125 rounded-l-full"
                >
                    <span className="text-3xl md:text-4xl text-white font-bold roulette-number">0</span>
                    {bets[0] && <BetToken amount={bets[0]} />}
                </button>

                {/* GŁÓWNA SIATKA (Liczby + 2:1) */}
                <div className="flex-grow flex flex-col gap-1 md:gap-2">

                    <div className="flex gap-1 md:gap-2">
                        <div className="grid grid-cols-12 gap-1 md:gap-2 flex-grow">
                            {[3,6,9,12,15,18,21,24,27,30,33,36].map(n => <NumberCell key={n} num={n} />)}
                            {[2,5,8,11,14,17,20,23,26,29,32,35].map(n => <NumberCell key={n} num={n} />)}
                            {[1,4,7,10,13,16,19,22,25,28,31,34].map(n => <NumberCell key={n} num={n} />)}
                        </div>
                        <div className="grid grid-rows-3 gap-1 md:gap-2 w-12 md:w-16">
                            <SpecialCell id="col3" label="2:1" className="h-full" />
                            <SpecialCell id="col2" label="2:1" className="h-full" />
                            <SpecialCell id="col1" label="2:1" className="h-full" />
                        </div>
                    </div>

                    {/* TUZINY */}
                    <div className="grid grid-cols-[1fr_1fr_1fr_3rem] md:grid-cols-[1fr_1fr_1fr_4rem] gap-1 md:gap-2">
                        <SpecialCell id="1st12" label="1ST 12" />
                        <SpecialCell id="2nd12" label="2ND 12" />
                        <SpecialCell id="3rd12" label="3RD 12" />
                        <div></div>
                    </div>

                    {/* ZAKŁADY ZEWNĘTRZNE */}
                    <div className="grid grid-cols-[repeat(6,1fr)_3rem] md:grid-cols-[repeat(6,1fr)_4rem] gap-1 md:gap-2">
                        <SpecialCell id="1-18" label="1-18" />
                        <SpecialCell id="even" label="EVEN" />
                        <button onClick={() => placeBet('red')} className="bg-roulette-red border border-white/20 hover:brightness-125 relative">
                            {bets['red'] && <BetToken amount={bets['red']} />}
                        </button>
                        <button onClick={() => placeBet('black')} className="bg-roulette-black border border-white/20 hover:brightness-125 relative">
                            {bets['black'] && <BetToken amount={bets['black']} />}
                        </button>
                        <SpecialCell id="odd" label="ODD" />
                        <SpecialCell id="19-36" label="19-36" />
                        <div></div>
                    </div>

                </div>
            </div>
        </div>
    );
}