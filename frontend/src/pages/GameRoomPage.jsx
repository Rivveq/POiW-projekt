import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell/AppShell';
import RoulettePage from './RoulettePage';
import { useGameState } from '../hooks/useGameState';
import './GameRoomPage.css';

export function GameRoomPage() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { balance } = useGameState();

    const renderGame = () => {
        if (gameId === 'roulette') {
            return <RoulettePage globalBalance={balance} />;
        }
        return <div className="text-white text-2xl font-bold">Gra {gameId} w budowie...</div>;
    };

    return (
        <AppShell>
            <div className="view-container glassmorphism fade-in flex flex-col min-h-[calc(100vh-80px)]">

                {/* Górny Pasek Nawigacji (Wyczyszczony z emotek) */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-[#0a1510]/80 p-4 rounded-3xl border border-[#c5a363]/30 shadow-lg">
                    <button
                        onClick={() => navigate('/lobby')}
                        className="px-8 py-3 rounded-xl border-2 border-[#c5a363]/50 text-[#c5a363] hover:bg-[#c5a363]/20 hover:shadow-[0_0_15px_rgba(197,163,99,0.4)] transition-all uppercase tracking-widest font-bold text-sm"
                    >
                        Back to Lobby
                    </button>

                    <h2 className="text-2xl md:text-3xl text-[#c5a363] tracking-[0.2em] font-medium m-0 drop-shadow-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                        Royal Casino
                    </h2>

                    <div className="glassmorphism-dark px-6 py-3 rounded-xl border border-green-500/30 flex items-center gap-2">
                        <span className="text-gray-400 uppercase tracking-widest text-sm">Balance:</span>
                        <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                            ${balance.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col items-center justify-center">
                    {renderGame()}
                </div>

            </div>
        </AppShell>
    );
}