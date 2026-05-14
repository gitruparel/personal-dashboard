import { useState, useCallback, useEffect, useMemo } from 'react';
import { goalService, Goal, GoalTimeframe } from '@/services/goalService';
import { supabase } from '@/lib/supabase';

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await goalService.getGoals(userId);
    setGoals(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (title: string, timeframe: GoalTimeframe, parentGoalId: string | null = null) => {
    if (!userId) return;
    const newGoal = await goalService.addGoal(userId, title, timeframe, parentGoalId);
    if (newGoal) setGoals(prev => [...prev, newGoal]);
  }, [userId]);

  const updateStatus = useCallback(async (goalId: string, status: Goal['status']) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status, completed_at: status === 'completed' ? new Date().toISOString() : null } : g));
    await goalService.updateGoalStatus(goalId, status);
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    await goalService.deleteGoal(goalId);
  }, []);

  // Helper to build a nested tree structure
  const goalTree = useMemo(() => {
    const rootGoals = goals.filter(g => !g.parent_goal_id);
    
    const buildTree = (goal: Goal): any => {
      const children = goals.filter(g => g.parent_goal_id === goal.id);
      return {
        ...goal,
        children: children.map(buildTree)
      };
    };

    return rootGoals.map(buildTree);
  }, [goals]);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`goals_${userId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'goals', 
          filter: `user_id=eq.${userId}` 
      }, () => {
          fetchGoals();
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchGoals]);

  return {
    goals,
    goalTree,
    isLoading,
    addGoal,
    updateStatus,
    deleteGoal,
    refreshGoals: fetchGoals
  };
}
