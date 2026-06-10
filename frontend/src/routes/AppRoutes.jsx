import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AgeVerificationPage } from '../pages/AgeVerificationPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LobbyPage } from '../pages/LobbyPage';
import { GameRoomPage } from '../pages/GameRoomPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DepositPage } from '../pages/DepositPage';
import { BlackjackPage } from '../pages/BlackjackPage';
import { SlotsPage } from '../pages/SlotsPage'; // <-- Dodany import

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AgeVerificationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/lobby" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
                <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                {/* Nowe, dedykowane ścieżki dla Blackjacka i Slotów */}
                <Route path="/blackjack" element={<ProtectedRoute><BlackjackPage /></ProtectedRoute>} />
                <Route path="/slots" element={<ProtectedRoute><SlotsPage /></ProtectedRoute>} />

                {/* Stara ścieżka dla ruletki zostaje tak jak była */}
                <Route path="/game/:gameId" element={<ProtectedRoute><GameRoomPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}