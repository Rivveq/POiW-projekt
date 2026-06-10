import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell/AppShell';
import { PlayerStatsPanel } from '../components/PlayerStatsPanel/PlayerStatsPanel';
import { useGameState } from '../hooks/useGameState';
import { apiFetch } from '../services/api';
import './LobbyPage.css';

const GAMES = [
    { id: 'slots', label: 'Cyber Slots', cssClass: 'slots', path: '/slots' },
    { id: 'roulette', label: 'Royal Roulette', cssClass: 'roulette', path: '/game/roulette' },
    { id: 'blackjack', label: 'Blackjack Pro', cssClass: 'poker', path: '/blackjack' },
];

export function LobbyPage() {
    const navigate = useNavigate();
    const gameState = useGameState();

    const [liveBalance, setLiveBalance] = useState(gameState.balance || 0);

    useEffect(() => {
        apiFetch('/api/wallet/balance')
            .then(res => {
                if (res && res.balance !== undefined) {
                    setLiveBalance(res.balance);
                    if (gameState.setBalance) gameState.setBalance(res.balance);
                }
            })
            .catch(console.error);
    }, [gameState]);

    return (
        <AppShell>
            <div className="view-container glassmorphism fade-in">
                <h2 className="neon-title">Grand Lobby</h2>

                <PlayerStatsPanel rank={gameState.rank} level={gameState.level} xp={gameState.xp} />

                <div className="wallet-panel glassmorphism-dark">
                    <div className="balance-info">
                        <p className="balance-label">Cash Balance:</p>
                        <strong className="balance-amount neon-green">
                            ${liveBalance.toFixed(2)}
                        </strong>
                    </div>
                    <button
                        className="btn-success neon-green-btn"
                        onClick={() => navigate('/deposit')}
                    >
                        Deposit Funds
                    </button>
                </div>

                {/* Sekcja Daily Gift została stąd usunięta */}

                <h3 className="section-title">Select Your Game:</h3>
                <div className="games-grid-luxe">
                    {GAMES.map((game) => (
                        <button
                            key={game.id}
                            className={`btn-game-luxe ${game.cssClass}`}
                            onClick={() => navigate(game.path)}
                        >
                            {game.label}
                        </button>
                    ))}
                </div>

                <div className="settings-box-panel">
                    <button
                        className="btn-secondary neon-btn-outline"
                        onClick={() => navigate('/settings')}
                    >
                        Lounge Settings
                    </button>
                </div>
            </div>
        </AppShell>
    );
}