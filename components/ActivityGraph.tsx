'use client';

import { Activity } from 'lucide-react';

export type DailyActivity = {
    date: string;
    activity_level: number;
};

export default function ActivityGraph({ activityData }: { activityData: DailyActivity[] }) {
    // Generate 90 days grid
    const today = new Date();
    const days = [];
    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    const activityMap = new Map(activityData.map(a => [a.date, a.activity_level]));

    return (
        <div className="card activity-card delay-4" style={{opacity: 1, animation: 'none'}}>
            <h2><Activity width={20} height={20} /> Activity (Last 90 Days)</h2>
            <div className="activity-graph">
                {days.map(date => {
                    const level = activityMap.get(date) || 0;
                    // Max aesthetic level is 5, we divide actual activity count to scale it
                    const displayLevel = level > 0 ? Math.min(5, Math.ceil(level / 2)) : 0;
                    return (
                        <div 
                            key={date} 
                            className={displayLevel > 0 ? `activity-square activity-level-${displayLevel}` : 'activity-square'}
                            title={`${date}: ${level} tasks completed`}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
