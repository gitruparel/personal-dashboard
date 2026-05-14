import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Task = Database['public']['Tables']['tasks']['Row'];

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('order_index');

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    return data || [];
  },

  async addTask(userId: string, text: string, orderIndex: number): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: userId, text, completed: false, order_index: orderIndex }])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return null;
    }
    return data;
  },

  async toggleTask(taskId: string, completed: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId);

    if (error) {
      console.error('Error toggling task:', error);
      return false;
    }
    return true;
  },

  async deleteTask(taskId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }
    return true;
  },

  async updateTaskOrder(tasks: Task[]): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .upsert(tasks.map(t => ({ id: t.id, user_id: t.user_id, text: t.text, completed: t.completed, order_index: t.order_index })));

    if (error) {
      console.error('Error updating task order:', error);
      return false;
    }
    return true;
  }
};
