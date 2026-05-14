import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Goal = Database['public']['Tables']['goals']['Row'];
export type GoalTimeframe = Database['public']['Tables']['goals']['Row']['timeframe'];

export const goalService = {
  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return data || [];
  },

  async addGoal(userId: string, title: string, timeframe: GoalTimeframe, parentGoalId: string | null = null): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .insert([{ 
        user_id: userId, 
        title, 
        timeframe, 
        parent_goal_id: parentGoalId 
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding goal:', error);
      return null;
    }
    return data;
  },

  async updateGoalStatus(goalId: string, status: Goal['status']): Promise<boolean> {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    const { error } = await supabase
      .from('goals')
      .update({ status, completed_at: completedAt })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal:', error);
      return false;
    }
    return true;
  },

  async deleteGoal(goalId: string): Promise<boolean> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
    return true;
  }
};
