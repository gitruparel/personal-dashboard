'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { useTasks } from '@/hooks/useTasks';
import { useActivity } from '@/hooks/useActivity';
import { useMomentum } from '@/hooks/useMomentum';
import Checklist from '@/components/Checklist';
import LifeHeatmap from '@/components/modules/LifeHeatmap';
import StreakCard from '@/components/StreakCard';
import StatsCard from '@/components/StatsCard';
import TrajectorySparkline from '@/components/modules/TrajectorySparkline';
import { getDynamicGreeting } from '@/utils/greetings';

export default function CommandCenter() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { profile, isLoading: profileLoading } = useProfile(userId);
  const { tasks, toggleTask, addTask, deleteTask, saveOrder } = useTasks(userId);
  const { activity, logActivity } = useActivity(userId);
  const { currentStreak, weeklyTasks, perfectDays, consistency, historyDots, trajectory } = useMomentum(activity);

  if (!session || profileLoading) {
    return <div style={{ padding: '2rem' }}>Loading Command Center...</div>;
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    logActivity(completed ? 1 : -1);
  };

  const displayName = profile?.greeting_name || session.user?.user_metadata?.full_name?.split(' ')[0] || 'Builder';

  return (
    <div className="command-center-container">
      <header className="cc-header">
        <div>
          <h1>{getDynamicGreeting(displayName, currentStreak, profile?.neetcode_progress || 0, profile?.tracker_target || 150)}</h1>
          <p>Momentum Score: {profile?.momentum_score || 0} • Current Season: {profile?.current_season || 'Building'}</p>
        </div>
        <TrajectorySparkline activityData={activity} trajectory={trajectory} />
      </header>
      
      <div className="cc-grid" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <Checklist 
            tasks={tasks} 
            onToggle={handleToggleTask} 
            onAdd={addTask} 
            onDelete={deleteTask}
            onSaveOrder={saveOrder}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <GlassCard className="cc-widget" style={{ padding: 'var(--spacing-md)' }}>
            <LifeHeatmap activityData={activity} />
          </GlassCard>
          <div className="cc-stats-grid">
            <StreakCard streak={currentStreak} historyDots={historyDots} />
            <StatsCard weeklyTasks={weeklyTasks} perfectDays={perfectDays} consistency={consistency} />
          </div>
        </div>
      </div>
    </div>
  );
}
