import { useMemo } from 'react';
import { DailyActivity } from '@/services/activityService';

export function useMomentum(activity: DailyActivity[]) {
  const todayDateStr = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  const currentStreak = useMemo(() => {
    if (!activity || activity.length === 0) return 0;
    
    const hasActivityToday = activity.some(a => a.date === todayDateStr && a.activity_level > 0);
    const hasActivityYesterday = activity.some(a => a.date === yesterdayStr && a.activity_level > 0);
    
    if (!hasActivityToday && !hasActivityYesterday) return 0;
    
    let streak = 0;
    let checkDate = new Date(hasActivityToday ? todayDateStr : yesterdayStr);
    
    while (true) {
      const dateStr = checkDate.toLocaleDateString('en-CA');
      const dayRecord = activity.find(a => a.date === dateStr && a.activity_level > 0);
      
      if (dayRecord) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
      } else {
          break;
      }
    }
    return streak;
  }, [activity, todayDateStr, yesterdayStr]);

  const weeklyActivity = useMemo(() => activity.filter(a => {
    const diff = (new Date().getTime() - new Date(a.date).getTime()) / (1000 * 3600 * 24);
    return diff <= 7 && diff >= 0;
  }), [activity]);

  const weeklyTasks = useMemo(() => weeklyActivity.reduce((acc, curr) => acc + curr.activity_level, 0), [weeklyActivity]);
  const perfectDays = useMemo(() => weeklyActivity.filter(a => a.activity_level >= 3).length, [weeklyActivity]); 
  const consistency = useMemo(() => Math.min(100, (weeklyActivity.length / 7) * 100), [weeklyActivity]);

  const historyDots = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toLocaleDateString('en-CA');
    return activity.some(a => a.date === dStr && a.activity_level > 0);
  }), [activity]);

  const trajectory = useMemo(() => {
    // 7-day average vs 30-day average
    const thirtyDayActivity = activity.filter(a => {
        const diff = (new Date().getTime() - new Date(a.date).getTime()) / (1000 * 3600 * 24);
        return diff <= 30 && diff >= 0;
    });

    const thirtyDayTotal = thirtyDayActivity.reduce((acc, curr) => acc + curr.activity_level, 0);
    const thirtyDayAvg = thirtyDayTotal / 30;
    const sevenDayAvg = weeklyTasks / 7;

    if (thirtyDayAvg === 0 && sevenDayAvg === 0) return 'Stagnant';
    
    // If 7-day average is significantly higher than 30-day average (> 120%)
    if (sevenDayAvg > thirtyDayAvg * 1.2) return 'Rising';
    
    // If 7-day average is significantly lower (< 80%)
    if (sevenDayAvg < thirtyDayAvg * 0.8) return 'Declining';
    
    return 'Plateauing';
  }, [activity, weeklyTasks]);

  return {
    currentStreak,
    weeklyTasks,
    perfectDays,
    consistency,
    historyDots,
    trajectory
  };
}
