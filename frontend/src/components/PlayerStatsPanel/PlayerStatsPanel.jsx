export function PlayerStatsPanel({ rank, level, xp }) {
    return (
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
    )
}
