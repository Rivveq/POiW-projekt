/* * PLIK PODMIENIONY PRZEZ UŻYTKOWNIKA
 * Domyślny kod Vite został usunięty i zastąpiony poniższym
 * autorskim systemem widoków dla projektu Wirtualnego Kasyna.
 * DODANO: Nowy luksusowy interfejs graficzny i tło.
 */

import { useState } from 'react'
import './App.css'

function App() {
    const [currentView, setCurrentView] = useState('verification')
    const [balance, setBalance] = useState(1000)
    const [xp, setXp] = useState(0)
    const [dailyClaimed, setDailyClaimed] = useState(false)

    const level = Math.floor(xp / 50) + 1
    const rank = level >= 10 ? '👑 VIP MEMBER' : (level >= 5 ? '🌟 HIGH ROLLER' : '🌱 BEGINNER')

    const renderVerification = () => (
        <div className="view-container glassmorphism slide-in-top">
            <h2 className="neon-title">V-Casino Access</h2>
            <div className="warning-box">
                <p>Hazard wiąże się z ryzykiem. Musisz mieć ukończone 18 lat, aby zagrać.</p>
                <p className="age-notice">Access restricted to adults only.</p>
            </div>
            <button className="btn-primary neon-btn" onClick={() => setCurrentView('menu')}>
                Confirm Identity & Enter Lounge
            </button>
        </div>
    )

    const renderMenu = () => (
        <div className="view-container glassmorphism fade-in">
            <h2 className="neon-title">Grand Lobby</h2>

            <div className="player-stats-panel glassmorphism-dark">
                <div className="rank-display">
                    <span className="rank-badge">{rank}</span>
                    <span className="level-badge">Level {level}</span>
                </div>
                <div className="xp-progress-bar">
                    <div className="xp-bar-fill" style={{ width: `${(xp % 50) * 2}%` }}>
                        <span className="xp-text">{xp % 50} / 50 XP</span>
                    </div>
                </div>
            </div>

            <div className="wallet-panel glassmorphism-dark">
                <div className="balance-info">
                    <p className="balance-label">Cash Balance:</p>
                    <strong className="balance-amount neon-green">${balance.toFixed(2)}</strong>
                </div>
                <button className="btn-success neon-green-btn" onClick={() => setBalance(balance + 100)}>
                    💰 Top Up $100
                </button>
            </div>

            {!dailyClaimed && (
                <button className="btn-bonus neon-gold-btn pulse-anim" onClick={() => {
                    setBalance(balance + 500);
                    setDailyClaimed(true);
                }}>
                    🎁 Claim Daily $500 Gift!
                </button>
            )}

            <h3 className="section-title">Select Your Game:</h3>
            <div className="games-grid-luxe">
                <button className="btn-game-luxe slots" onClick={() => setCurrentView('slots')}>
                    <span className="game-icon-luxe">🍒</span> Slots Max
                </button>
                <button className="btn-game-luxe roulette" onClick={() => setCurrentView('roulette')}>
                    <span className="game-icon-luxe">🎰</span> Royal Roulette
                </button>
                <button className="btn-game-luxe poker" onClick={() => setCurrentView('poker')}>
                    <span className="game-icon-luxe">🃏</span> Poker Pro
                </button>
            </div>

            <div className="settings-box-panel">
                <button className="btn-secondary neon-btn-outline" onClick={() => setCurrentView('settings')}>
                    ⚙️ Lounge Settings
                </button>
            </div>
        </div>
    )

    const renderGameRoom = (gameName) => (
        <div className="view-container glassmorphism fade-in">
            <h2 className="neon-title">Room: {gameName}</h2>
            <div className="wallet-panel glassmorphism-dark mini-wallet">
                <p className="balance-label">Lounge Balance:</p>
                <strong className="balance-amount neon-green mini">${balance.toFixed(2)}</strong>
            </div>

            <div className="game-placeholder-luxe">
                <p className="placeholder-text">Construction in progress... 🚧</p>
                <p className="placeholder-subtext">Table will be ready shortly.</p>

                <button className="btn-primary neon-btn" onClick={() => {
                    if(balance >= 10) {
                        setBalance(balance - 10);
                        setXp(xp + 15);
                    } else {
                        alert("Insufficient Funds!");
                    }
                }}>
                    🎲 Test Bet ($10 daje +15 XP)
                </button>
            </div>

            <button className="btn-secondary neon-btn-outline" onClick={() => setCurrentView('menu')}>
                🔙 Return to Lobby
            </button>
        </div>
    )

    const renderSettings = () => (
        <div className="view-container glassmorphism slide-in-top">
            <h2 className="neon-title">Lounge Settings</h2>
            <div className="settings-options-luxe">
                <label className="toggle-switch-luxe">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                    <span className="toggle-label">Ambient Sound</span>
                </label>
                <label className="toggle-switch-luxe">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                    <span className="toggle-label">Win Notifications</span>
                </label>
            </div>

            <button className="btn-primary danger neon-red-btn" onClick={() => {
                setCurrentView('verification');
                setXp(0);
                setBalance(1000);
                setDailyClaimed(false);
            }}>
                🚪 Log Out & Reset Account
            </button>
            <button className="btn-secondary neon-btn-outline mt-3" onClick={() => setCurrentView('menu')}>
                🔙 Return
            </button>
        </div>
    )

    return (
        <div className="app-main-wrapper">
            <div className="background-overlay">
                <div className="app-container">
                    <h1 className="casino-title-luxe">V-Casino</h1>
                    {currentView === 'verification' && renderVerification()}
                    {currentView === 'menu' && renderMenu()}
                    {currentView === 'settings' && renderSettings()}
                    {currentView === 'slots' && renderGameRoom('Slots Max')}
                    {currentView === 'roulette' && renderGameRoom('Royal Roulette')}
                    {currentView === 'poker' && renderGameRoom('Poker Pro')}
                </div>
            </div>
        </div>
    )
}

export default App