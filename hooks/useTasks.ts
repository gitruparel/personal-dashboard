import { useState, useCallback, useEffect } from 'react';
import { taskService, Task } from '@/services/taskService';
import { supabase } from '@/lib/supabase';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await taskService.getTasks(userId);
    setTasks(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
    await taskService.toggleTask(taskId, completed);
  }, []);

  const addTask = useCallback(async (text: string) => {
    if (!userId) return;
    // Optimistic update logic is tricky for adds because we need the real DB ID. 
    // We will await the real insert here.
    const newTask = await taskService.addTask(userId, text, tasks.length);
    if (newTask) setTasks(prev => [...prev, newTask]);
  }, [userId, tasks.length]);

  const deleteTask = useCallback(async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    await taskService.deleteTask(taskId);
  }, []);

  const saveOrder = useCallback(async (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    await taskService.updateTaskOrder(reorderedTasks);
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    const tasksChannel = supabase.channel(`tasks_${userId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'tasks', 
          filter: `user_id=eq.${userId}` 
      }, () => {
          fetchTasks(); // Pull latest on any remote change
      }).subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [userId, fetchTasks]);

  return {
    tasks,
    isLoading,
    toggleTask,
    addTask,
    deleteTask,
    saveOrder,
    refreshTasks: fetchTasks
  };
}
