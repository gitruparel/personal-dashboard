'use client';

export default function StatsCard({ weeklyTasks, perfectDays, consistency }: { weeklyTasks: number, perfectDays: number, consistency: number }) {
    return (
        <div className="stats-card" style={{opacity: 1, animation: 'none'}}>
            <h3>Last Week's Stats</h3>
            <table className="stats-table">
                <tbody>
                    <tr>
                        <td className="stat-label">Tasks Completed</td>
                        <td className="stat-value-cell">
                            <span className="stat-val">{weeklyTasks}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="stat-label">Perfect Days</td>
                        <td className="stat-value-cell">
                            <span className="stat-val">{perfectDays}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="stat-label">Consistency</td>
                        <td className="stat-value-cell">
                            <span className="stat-val">{Math.round(consistency)}%</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
