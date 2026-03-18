'use client';

import { Zap } from 'lucide-react';

export default function StreakCard({ streak, isCompletedToday, onMarkComplete, onUndo, historyDots }: { streak: number, isCompletedToday: boolean, onMarkComplete: () => void, onUndo: () => void, historyDots: boolean[] }) {
    return (
        <div className="card streak-card delay-1" style={{opacity: 1, animation: 'none'}}>
            <h2>
                <Zap style={{cursor: 'pointer', transition: 'transform 0.2s'}} width={20} height={20} tabIndex={0} />
                Momentum
            </h2>
            <div className="streak-container">
                <div className="streak-number">{streak}</div>
                <div className="streak-label">Day Streak</div>
                <div className="streak-history">
                    {historyDots.map((isActive, i) => (
                        <div key={i} className={`history-dot ${isActive ? 'active' : ''}`}></div>
                    ))}
                </div>
            </div>
            <button className={`action-btn ${isCompletedToday ? 'completed' : ''}`} onClick={onMarkComplete}>
                {isCompletedToday ? 'Day Completed!' : 'Mark Day Complete'}
            </button>
            {isCompletedToday && <button className="undo-btn visible" onClick={onUndo}>Undo completion</button>}
        </div>
    );
}
