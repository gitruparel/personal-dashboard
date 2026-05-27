import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { DailyActivity } from '@/services/activityService';
import './LifeHeatmap.css';

interface LifeHeatmapProps {
  activityData: DailyActivity[];
}

export default function LifeHeatmap({ activityData }: LifeHeatmapProps) {
  const { weeks, maxLevel } = useMemo(() => {
    const activityMap = new Map(activityData.map(a => [a.date, a.activity_level]));
    let max = 0;
    for (const val of activityMap.values()) {
        if (val > max) max = val;
    }

    const weeksArray: { date: string; level: number }[][] = [];
    const today = new Date();
    
    // Start from exactly 364 days ago (52 weeks * 7 days)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Adjust to start on a Sunday to align the grid perfectly
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Normalize hours to avoid partial day bounds issues
    startDate.setHours(0, 0, 0, 0);
    const todayNormalized = new Date(today);
    todayNormalized.setHours(23, 59, 59, 999);

    let currentWeek: { date: string; level: number }[] = [];
    
    const d = new Date(startDate);
    while (d <= todayNormalized) {
        const dateStr = d.toLocaleDateString('en-CA');
        const level = activityMap.get(dateStr) || 0;
        
        currentWeek.push({ date: dateStr, level });

        if (currentWeek.length === 7) {
            weeksArray.push(currentWeek);
            currentWeek = [];
        }

        d.setDate(d.getDate() + 1);
    }

    // Push the final partial week
    if (currentWeek.length > 0) {
        // Pad the rest of the week so the grid aligns
        while (currentWeek.length < 7) {
             currentWeek.push({ date: '', level: -1 }); // -1 indicates future/empty
        }
        weeksArray.push(currentWeek);
    }

    return { weeks: weeksArray.reverse(), maxLevel: max };
  }, [activityData]);

  const getIntensityClass = (level: number) => {
      if (level === -1) return 'heatmap-square empty';
      if (level === 0) return 'heatmap-square level-0';
      
      // Scale dynamic to max volume, or fixed if we prefer stable colors
      // For now, let's use fixed tiers for consistency: 1, 3, 5, 8+
      if (level <= 1) return 'heatmap-square level-1';
      if (level <= 3) return 'heatmap-square level-2';
      if (level <= 5) return 'heatmap-square level-3';
      return 'heatmap-square level-4';
  };

  return (
    <div className="life-heatmap-container">
      <div className="heatmap-header">
        <h2><Activity width={18} height={18} /> Momentum (Last 365 Days)</h2>
        <div className="heatmap-legend">
            <span>Less</span>
            <div className="heatmap-square level-0"></div>
            <div className="heatmap-square level-1"></div>
            <div className="heatmap-square level-2"></div>
            <div className="heatmap-square level-3"></div>
            <div className="heatmap-square level-4"></div>
            <span>More</span>
        </div>
      </div>
      
      <div className="heatmap-grid-wrapper">
        <div className="heatmap-grid">
            {weeks.map((week, wIndex) => (
                <div key={wIndex} className="heatmap-col">
                    {week.map((day, dIndex) => (
                        <div 
                            key={`${wIndex}-${dIndex}`}
                            className={getIntensityClass(day.level)}
                            title={day.level >= 0 ? `${day.date}: ${day.level} actions` : ''}
                        />
                    ))}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
