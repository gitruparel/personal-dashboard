import React, { useMemo } from 'react';
import { DailyActivity } from '@/services/activityService';
import { TrendingUp, TrendingDown, Minus, CircleDashed } from 'lucide-react';
import './Trajectory.css';

interface TrajectoryProps {
  activityData: DailyActivity[];
  trajectory: string;
}

export default function TrajectorySparkline({ activityData, trajectory }: TrajectoryProps) {
  // Generate sparkline path for the last 14 days
  const sparklinePath = useMemo(() => {
    if (!activityData || activityData.length === 0) return '';
    
    const points: number[] = [];
    const today = new Date();
    
    // Get last 14 days of data
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      const dayRecord = activityData.find(a => a.date === dateStr);
      points.push(dayRecord ? dayRecord.activity_level : 0);
    }

    const max = Math.max(...points, 1); // Avoid div by 0
    const width = 60;
    const height = 20;
    const stepX = width / (points.length - 1);

    // Build SVG path
    let path = `M 0 ${height - (points[0] / max) * height}`;
    for (let i = 1; i < points.length; i++) {
        const x = i * stepX;
        const y = height - (points[i] / max) * height;
        // Simple bezier curve for smooth sparkline
        const prevX = (i - 1) * stepX;
        const prevY = height - (points[i - 1] / max) * height;
        const cpX = prevX + (x - prevX) / 2;
        path += ` C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
    }

    return path;
  }, [activityData]);

  const getIcon = () => {
    switch (trajectory) {
        case 'Rising': return <TrendingUp size={16} className="trend-rising" />;
        case 'Declining': return <TrendingDown size={16} className="trend-declining" />;
        case 'Plateauing': return <Minus size={16} className="trend-plateau" />;
        default: return <CircleDashed size={16} className="trend-stagnant" />;
    }
  };

  return (
    <div className="trajectory-container">
      <div className="trajectory-icon">
        {getIcon()}
      </div>
      <div className="trajectory-text">
        <span className="trajectory-label">Trajectory</span>
        <span className="trajectory-value">{trajectory}</span>
      </div>
      <div className="trajectory-sparkline-wrapper">
        <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d={sparklinePath} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
