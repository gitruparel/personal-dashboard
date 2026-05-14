import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type DailyActivity = Database['public']['Tables']['daily_activity']['Row'];

export const activityService = {
  async getActivity(userId: string): Promise<DailyActivity[]> {
    const { data, error } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching activity:', error);
      return [];
    }
    return data || [];
  },

  async logActivity(userId: string, dateStr: string, levelDelta: number): Promise<DailyActivity | null> {
    // We try to fetch the existing row first to update it
    const { data: existing } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .single();

    if (existing) {
      const newLevel = Math.max(0, existing.activity_level + levelDelta);
      const { data, error } = await supabase
        .from('daily_activity')
        .update({ activity_level: newLevel })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) console.error('Error updating activity:', error);
      return data;
    } else if (levelDelta > 0) {
      const { data, error } = await supabase
        .from('daily_activity')
        .insert([{ user_id: userId, date: dateStr, activity_level: levelDelta }])
        .select()
        .single();

      if (error) console.error('Error inserting activity:', error);
      return data;
    }
    return null;
  }
};
