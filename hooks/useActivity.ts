import { useState, useCallback, useEffect, useRef } from 'react';
import { activityService, DailyActivity } from '@/services/activityService';
import { supabase } from '@/lib/supabase';

export function useActivity(userId: string | undefined) {
  const [activity, setActivity] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const activityQueue = useRef<number>(0);
  const isProcessingQueue = useRef<boolean>(false);

  const fetchActivity = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await activityService.getActivity(userId);
    setActivity(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const processActivityQueue = useCallback(async () => {
    if (!userId || isProcessingQueue.current) return;
    isProcessingQueue.current = true;
    
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    while(activityQueue.current !== 0) {
        const delta = activityQueue.current;
        activityQueue.current = 0;
        await activityService.logActivity(userId, todayStr, delta);
    }
    
    await fetchActivity();
    isProcessingQueue.current = false;
  }, [userId, fetchActivity]);

  const logActivity = useCallback((delta: number = 1) => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    // Optimistic UI
    setActivity(prev => {
        const existing = prev.find(a => a.date === todayStr);
        if (existing) return prev.map(a => a.date === todayStr ? { ...a, activity_level: Math.max(0, a.activity_level + delta) } : a);
        if (delta > 0) return [...prev, { id: 'temp', user_id: userId || '', date: todayStr, activity_level: delta }];
        return prev;
    });

    activityQueue.current += delta;
    processActivityQueue();
  }, [userId, processActivityQueue]);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    const activityChannel = supabase.channel(`activity_${userId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'daily_activity', 
          filter: `user_id=eq.${userId}` 
      }, () => {
          fetchActivity();
      }).subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
    };
  }, [userId, fetchActivity]);

  return {
    activity,
    isLoading,
    logActivity,
    refreshActivity: fetchActivity
  };
}
