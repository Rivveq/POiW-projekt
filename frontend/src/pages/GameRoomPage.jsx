import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell/AppShell'
import { useGameState } from '../hooks/useGameState'
import './GameRoomPage.css'
import RoulettePage from "./RoulettePage.jsx";

const GAME_NAMES = {
    slots: 'Slots Max',
    roulette: 'Royal Roulette',
    poker: 'Poker Pro',
}

export function GameRoomPage() {
    const { gameId } = useParams()
    const navigate = useNavigate()
    const { balance, placeBet } = useGameState()

    const gameName = GAME_NAMES[gameId] ?? 'Unknown Table'

    const handleBet = () => {
        const ok = placeBet(10, 15)
        if (!ok) alert('Insufficient Funds!')
    }

    return (
        <AppShell>
            {/* DYNAMICZNA KLASA SZEROKOŚCI: jeśli to ruletka, dajemy max-w-7xl, w innym wypadku zostaje standardowy styl */}
            <div className={`view-container glassmorphism fade-in ${gameId === 'roulette' ? 'max-w-7xl w-full mx-auto' : ''}`}>
                <h2 className="neon-title">Room: {gameName}</h2>

                {gameId !== 'roulette' && (
                    <div className="wallet-panel glassmorphism-dark mini-wallet">
                        <p className="balance-label">Lounge Balance:</p>
                        <strong className="balance-amount neon-green mini">
                            ${balance ? balance.toFixed(2) : "0.00"}
                        </strong>
                    </div>
                )}

                {/* WARUNKOWE RENDEROWANIE GRY */}
                {gameId === 'roulette' ? (
                    <RoulettePage globalBalance={balance}/>
                ) : (
                    <div className="game-placeholder-luxe">
                        <p className="placeholder-text">Construction in progress... 🚧</p>
                        <p className="placeholder-subtext">Table will be ready shortly.</p>

                        <button className="btn-primary neon-btn" onClick={handleBet}>
                            🎲 Test Bet ($10 daje +15 XP)
                        </button>
                    </div>
                )}

                <button
                    className="btn-secondary neon-btn-outline"
                    onClick={() => navigate('/lobby')}
                >
                    🔙 Return to Lobby
                </button>
            </div>
        </AppShell>
    )
}