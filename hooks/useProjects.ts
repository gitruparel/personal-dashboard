import { useState, useCallback, useEffect } from 'react';
import { projectService, Project } from '@/services/projectService';
import { supabase } from '@/lib/supabase';

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await projectService.getProjects(userId);
    setProjects(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback(async (name: string, description: string | null = null, repositoryUrl: string | null = null) => {
    if (!userId) return;
    const newProject = await projectService.addProject(userId, name, description, repositoryUrl);
    if (newProject) setProjects(prev => [newProject, ...prev]);
  }, [userId]);

  const updateStatus = useCallback(async (projectId: string, status: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
    await projectService.updateProjectStatus(projectId, status);
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    await projectService.deleteProject(projectId);
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`projects_${userId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'projects', 
          filter: `user_id=eq.${userId}` 
      }, () => {
          fetchProjects();
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchProjects]);

  return {
    projects,
    isLoading,
    addProject,
    updateStatus,
    deleteProject,
    refreshProjects: fetchProjects
  };
}
