import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type LearningTopic = Database['public']['Tables']['learning_topics']['Row'];
export type LearningType = Database['public']['Tables']['learning_topics']['Row']['type'];

export const learningService = {
  async getTopics(userId: string): Promise<LearningTopic[]> {
    const { data, error } = await supabase
      .from('learning_topics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching learning topics:', error);
      return [];
    }
    return data || [];
  },

  async addTopic(userId: string, title: string, type: LearningType, target: number): Promise<LearningTopic | null> {
    const { data, error } = await supabase
      .from('learning_topics')
      .insert([{ user_id: userId, title, type, target, progress: 0, status: 'queued' }])
      .select()
      .single();

    if (error) {
      console.error('Error adding learning topic:', error);
      return null;
    }
    return data;
  },

  async updateTopicProgress(topicId: string, progress: number, status?: string): Promise<boolean> {
    const updates: any = { progress };
    if (status) updates.status = status;
    
    const { error } = await supabase
      .from('learning_topics')
      .update(updates)
      .eq('id', topicId);

    if (error) {
      console.error('Error updating learning topic:', error);
      return false;
    }
    return true;
  },

  async deleteTopic(topicId: string): Promise<boolean> {
    const { error } = await supabase
      .from('learning_topics')
      .delete()
      .eq('id', topicId);

    if (error) {
      console.error('Error deleting topic:', error);
      return false;
    }
    return true;
  }
};
