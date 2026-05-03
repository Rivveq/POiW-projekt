import { useContext } from 'react'
import { GameStateContext } from '../context/GameStateContext'

export function useGameState() {
    const ctx = useContext(GameStateContext)
    if (!ctx) throw new Error('useGameState must be used within GameStateProvider')
    return ctx
}
