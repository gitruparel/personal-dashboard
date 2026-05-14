'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useProfile } from '@/hooks/useProfile';
import { useTasks } from '@/hooks/useTasks';
import { useActivity } from '@/hooks/useActivity';
import { useMomentum } from '@/hooks/useMomentum';
import Checklist from '@/components/Checklist';
import ActivityGraph from '@/components/ActivityGraph';
import ProgressTrackerCard from '@/components/ProgressTrackerCard';
import StreakCard from '@/components/StreakCard';
import StatsCard from '@/components/StatsCard';
import { getDynamicGreeting } from '@/utils/greetings';

export default function CommandCenter() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { profile, isLoading: profileLoading, updateProfile } = useProfile(userId);
  const { tasks, toggleTask, addTask, deleteTask, saveOrder } = useTasks(userId);
  const { activity, logActivity } = useActivity(userId);
  const { currentStreak, weeklyTasks, perfectDays, consistency, historyDots } = useMomentum(activity);

  if (!session || profileLoading) {
    return <div style={{ padding: '2rem' }}>Loading Command Center...</div>;
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    logActivity(completed ? 1 : -1);
  };

  const handleLogProgress = async () => {
    const newProgress = (profile?.neetcode_progress || 0) + 1;
    await updateProfile({ neetcode_progress: newProgress });
    logActivity(1);
  };

  const handleUndoProgress = async () => {
    const current = profile?.neetcode_progress || 0;
    if (current > 0) {
      await updateProfile({ neetcode_progress: current - 1 });
      logActivity(-1);
    }
  };

  const displayName = profile?.greeting_name || session.user?.user_metadata?.full_name?.split(' ')[0] || 'Builder';

  return (
    <div className="command-center-container">
      <header className="cc-header">
        <h1>{getDynamicGreeting(displayName, currentStreak, profile?.neetcode_progress || 0, profile?.tracker_target || 150)}</h1>
        <p>Momentum Score: {profile?.momentum_score || 0} • Current Season: {profile?.current_season || 'Building'}</p>
      </header>
      
      <div className="cc-grid" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <ProgressTrackerCard 
            name={profile?.tracker_name || 'Project'}
            target={profile?.tracker_target || 100}
            progress={profile?.neetcode_progress || 0}
            onLogProblem={handleLogProgress}
            onUndo={handleUndoProgress}
            onSaveSettings={(name, target) => updateProfile({ tracker_name: name, tracker_target: target })}
          />
          <GlassCard className="cc-widget">
            <Checklist 
              tasks={tasks} 
              onToggle={handleToggleTask} 
              onAdd={addTask} 
              onDelete={deleteTask}
              onSaveOrder={saveOrder}
            />
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <StreakCard streak={currentStreak} historyDots={historyDots} />
          <GlassCard className="cc-widget">
            <ActivityGraph activityData={activity} />
          </GlassCard>
          <StatsCard weeklyTasks={weeklyTasks} perfectDays={perfectDays} consistency={consistency} />
        </div>
      </div>
    </div>
  );
}
