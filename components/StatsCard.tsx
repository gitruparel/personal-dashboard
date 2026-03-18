'use client';

export default function StatsCard({ weeklyTasks, perfectDays, consistency }: { weeklyTasks: number, perfectDays: number, consistency: number }) {
    return (
        <div className="stats-card" style={{opacity: 1, animation: 'none'}}>
            <h3>Last Week's Stats</h3>
            <div className="stat-row">
                <span>Tasks Completed</span>
                <span className="stat-val">{weeklyTasks}</span>
            </div>
            <div className="stat-row">
                <span>Perfect Days</span>
                <span className="stat-val">{perfectDays}</span>
            </div>
            <div className="stat-row">
                <span>Consistency</span>
                <span className="stat-val">{Math.round(consistency)}%</span>
            </div>
        </div>
    );
}
