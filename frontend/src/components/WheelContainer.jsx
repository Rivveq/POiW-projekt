import React, { useState, useEffect, useRef } from 'react';

const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const getSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = (index * angle) - 90 - (angle / 2);
    const endAngle = startAngle + angle;

    const startRad = (Math.PI * startAngle) / 180;
    const endRad = (Math.PI * endAngle) / 180;

    const r = 48;
    const x1 = 50 + r * Math.cos(startRad);
    const y1 = 50 + r * Math.sin(startRad);
    const x2 = 50 + r * Math.cos(endRad);
    const y2 = 50 + r * Math.sin(endRad);

    return `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
};

export default function WheelContainer({ isSpinning, lastResult }) {
    const [ballAngle, setBallAngle] = useState(0);
    const currentAngle = useRef(0);

    useEffect(() => {
        if (isSpinning && lastResult !== null) {
            const targetIndex = NUMBERS.indexOf(lastResult);
            const segmentAngle = 360 / 37;
            const targetAngleWithinCircle = targetIndex * segmentAngle;
            const currentMod = currentAngle.current % 360;

            let diff = targetAngleWithinCircle - currentMod;
            if (diff < 0) diff += 360;

            const newAngle = currentAngle.current + (360 * 8) + diff;

            currentAngle.current = newAngle;
            setBallAngle(newAngle);
        }
    }, [isSpinning, lastResult]);

    return (
        <div className="w-full min-h-[350px] md:min-h-[450px] flex items-center justify-center p-6 wood-panel rounded-2xl relative shadow-2xl">
            {/* ZWIĘKSZONY ROZMIAR KOŁA: lg:w-[28rem] lg:h-[28rem] */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full border-[10px] border-[#2a1b12] shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#2a1b12] ring-4 ring-roulette-brass">

                <svg viewBox="0 0 100 100" className="w-full h-full rounded-full drop-shadow-xl">
                    {NUMBERS.map((num, i) => (
                        <g key={num}>
                            <path d={getSegmentPath(i, 37)} fill={num === 0 ? '#076d3f' : RED_NUMBERS.includes(num) ? '#bb1717' : '#111111'} stroke="#c5a363" strokeWidth="0.2" />
                            <text x="50" y="10" fill="white" fontSize="4" fontFamily="Playfair Display, serif" fontWeight="bold" textAnchor="middle" transform={`rotate(${i * (360/37)}, 50, 50)`}>
                                {num}
                            </text>
                        </g>
                    ))}
                    <circle cx="50" cy="50" r="32" fill="#2a1b12" stroke="#c5a363" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="6" fill="#c5a363" />
                </svg>

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        transform: `rotate(${ballAngle}deg)`,
                        transitionProperty: 'transform',
                        transitionDuration: isSpinning ? '8s' : '0s',
                        transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.35, 1)'
                    }}
                >
                    <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[4%] h-[4%] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9),inset_-1px_-1px_3px_rgba(0,0,0,0.3)]"></div>
                </div>

            </div>
        </div>
    );
}