import './App.css'
import { AuthProvider } from './context/AuthProvider'
import { GameStateProvider } from './context/GameStateProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
    return (
        <AuthProvider>
            <GameStateProvider>
                <AppRoutes />
            </GameStateProvider>
        </AuthProvider>
    )
}

export default App
