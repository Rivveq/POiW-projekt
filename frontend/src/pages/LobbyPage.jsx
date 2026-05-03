import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { PlayerStatsPanel } from '../components/PlayerStatsPanel/PlayerStatsPanel'
import { useGameState } from '../hooks/useGameState'
import './LobbyPage.css'

const GAMES = [
    { id: 'slots', label: 'Slots Max', icon: '🍒', cssClass: 'slots' },
    { id: 'roulette', label: 'Royal Roulette', icon: '🎰', cssClass: 'roulette' },
    { id: 'poker', label: 'Poker Pro', icon: '🃏', cssClass: 'poker' },
]

export function LobbyPage() {
    const navigate = useNavigate()
    const { balance, xp, level, rank, dailyClaimed, topUp, claimDaily } =
        useGameState()

    return (
        <AppShell>
            <div className="view-container glassmorphism fade-in">
                <h2 className="neon-title">Grand Lobby</h2>

                <PlayerStatsPanel rank={rank} level={level} xp={xp} />

                <div className="wallet-panel glassmorphism-dark">
                    <div className="balance-info">
                        <p className="balance-label">Cash Balance:</p>
                        <strong className="balance-amount neon-green">
                            ${balance.toFixed(2)}
                        </strong>
                    </div>
                    <button
                        className="btn-success neon-green-btn"
                        onClick={() => topUp(100)}
                    >
                        💰 Top Up $100
                    </button>
                </div>

                {!dailyClaimed && (
                    <button
                        className="btn-bonus neon-gold-btn pulse-anim"
                        onClick={claimDaily}
                    >
                        🎁 Claim Daily $500 Gift!
                    </button>
                )}

                <h3 className="section-title">Select Your Game:</h3>
                <div className="games-grid-luxe">
                    {GAMES.map((game) => (
                        <button
                            key={game.id}
                            className={`btn-game-luxe ${game.cssClass}`}
                            onClick={() => navigate(`/game/${game.id}`)}
                        >
                            <span className="game-icon-luxe">{game.icon}</span> {game.label}
                        </button>
                    ))}
                </div>

                <div className="settings-box-panel">
                    <button
                        className="btn-secondary neon-btn-outline"
                        onClick={() => navigate('/settings')}
                    >
                        ⚙️ Lounge Settings
                    </button>
                </div>
            </div>
        </AppShell>
    )
}
