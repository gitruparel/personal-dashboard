import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Project = Database['public']['Tables']['projects']['Row'];

export const projectService = {
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  async addProject(userId: string, name: string, description: string | null = null, repositoryUrl: string | null = null): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id: userId, name, description, repository_url: repositoryUrl }])
      .select()
      .single();

    if (error) {
      console.error('Error adding project:', error);
      return null;
    }
    return data;
  },

  async updateProjectStatus(projectId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', projectId);

    if (error) {
      console.error('Error updating project:', error);
      return false;
    }
    return true;
  },

  async deleteProject(projectId: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    return true;
  }
};
