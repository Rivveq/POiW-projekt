import React from 'react';
import { Globe, Calendar, Settings, Plus } from 'lucide-react';

export default function TopHeader({ balance = 0 }) {
    return (
        <div className="w-full flex items-start justify-between px-6 py-4 relative z-20">

            {/* LEWA STRONA: Ikony Globu i Kalendarza */}
            <div className="flex flex-col gap-3">
                <button className="w-12 h-12 rounded-full bg-black/40 border-[3px] border-roulette-brass-dark flex items-center justify-center text-roulette-gold hover:bg-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all">
                    <Globe size={24} />
                </button>
                <div className="relative">
                    <button className="w-12 h-12 rounded-full bg-black/40 border-[3px] border-roulette-brass-dark flex items-center justify-center text-roulette-gold hover:bg-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all">
                        <Calendar size={24} />
                    </button>
                    {/* Czerwona kropka powiadomienia */}
                    <div className="absolute 0 -right-1 top-0 w-4 h-4 bg-red-600 rounded-full border-2 border-black shadow-sm"></div>
                </div>
            </div>

            {/* ŚRODEK: Tytuł MONTE CARLO */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col items-center">
                <h1 className="text-5xl text-roulette-gold tracking-[0.15em] font-medium drop-shadow-xl" style={{ fontFamily: 'Cinzel, serif' }}>
                    MONTE CARLO
                </h1>
                <p className="text-white/60 text-xs tracking-[0.2em] uppercase font-sans mt-2 font-bold drop-shadow-md">
                    European Roulette
                </p>
            </div>

            {/* PRAWA STRONA: Saldo, Pasek Postępu i Ustawienia */}
            <div className="flex flex-col items-end gap-4">

                {/* Górny rządek: Saldo, Pasek poziomu i Ustawienia */}
                <div className="flex items-center gap-6">

                    {/* Panel Salda (Styl z obrazka 3) */}
                    <div className="flex items-center">
                        <div className="bg-black/60 border-[3px] border-r-0 border-roulette-brass-dark rounded-l-full py-1.5 px-6 min-w-[140px] text-center shadow-inner">
                            <span className="text-2xl text-white font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {balance.toLocaleString()}
                            </span>
                        </div>
                        <button className="w-12 h-12 rounded-full bg-gradient-to-b from-green-400 to-green-600 border-[3px] border-white flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.4)] -ml-4 z-10 text-white hover:scale-105 transition-transform">
                            <Plus size={28} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Pasek Poziomu (Level 32 -> 33) */}
                    <div className="flex items-center gap-2 bg-sky-900/40 border-[2px] border-sky-600/50 rounded-full p-1 pl-1.5 shadow-md backdrop-blur-sm hidden md:flex">
                        <div className="w-7 h-7 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-sm">
                            32
                        </div>
                        <div className="w-24 h-2.5 bg-black/60 rounded-full overflow-hidden border border-black/50 shadow-inner">
                            <div className="w-3/4 h-full bg-gradient-to-r from-sky-400 to-sky-300 rounded-full"></div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-montecarlo-wood-light border-2 border-roulette-brass-dark flex items-center justify-center text-xs font-black text-roulette-gold shadow-sm">
                            33
                        </div>
                    </div>

                    {/* Przycisk Ustawień */}
                    <button className="w-12 h-12 rounded-full bg-black/40 border-[3px] border-roulette-brass-dark flex items-center justify-center text-roulette-gold hover:bg-black/60 shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all">
                        <Settings size={26} />
                    </button>
                </div>

                {/* Dolny rządek prawej strony: Wstążka Las Vegas */}
                <div className="mr-16 hidden md:block">
                    <div className="bg-gradient-to-b from-green-700 to-green-900 border-2 border-green-400 text-white text-xs font-bold font-sans uppercase tracking-wider px-4 py-1.5 rounded-sm shadow-lg relative">
                        Unlock Las Vegas at level 60
                        {/* Mały trójkącik pod spodem (stylizacja dymka) */}
                        <div className="absolute -bottom-2 right-12 w-4 h-4 bg-green-900 border-b-2 border-r-2 border-green-400 transform rotate-45"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}