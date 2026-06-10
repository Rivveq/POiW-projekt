import React from 'react';

export const SlotSymbols = {
    CHERRY: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-full h-full drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            <path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm-2 10a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zM12 6v6" strokeLinecap="round" />
        </svg>
    ),
    LEMON: () => (
        <svg viewBox="0 0 24 24" fill="#eab308" className="w-full h-full drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#fef08a" />
        </svg>
    ),
    BELL: () => (
        <svg viewBox="0 0 24 24" fill="#f59e0b" className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
    ),
    SEVEN: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" className="w-full h-full drop-shadow-[0_0_12px_rgba(220,38,38,0.9)]">
            <path d="M5 5h14l-6 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    DIAMOND: () => (
        <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,1)]">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 16.5L5.5 12 12 5.5 18.5 12 12 18.5z" />
        </svg>
    ),
    WILD: () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg text-white font-black text-2xl shadow-[0_0_20px_rgba(168,85,247,1)] border-2 border-white/50">
            W
        </div>
    )
};