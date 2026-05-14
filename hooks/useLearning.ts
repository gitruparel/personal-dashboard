import { useState, useCallback, useEffect } from 'react';
import { learningService, LearningTopic, LearningType } from '@/services/learningService';
import { supabase } from '@/lib/supabase';

export function useLearning(userId: string | undefined) {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await learningService.getTopics(userId);
    setTopics(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const addTopic = useCallback(async (title: string, type: LearningType, target: number) => {
    if (!userId) return;
    const newTopic = await learningService.addTopic(userId, title, type, target);
    if (newTopic) setTopics(prev => [newTopic, ...prev]);
  }, [userId]);

  const updateProgress = useCallback(async (topicId: string, progress: number, target: number) => {
    let status = undefined;
    if (progress >= target) status = 'completed';
    else if (progress > 0) status = 'active';

    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, progress, status: status || t.status } : t));
    await learningService.updateTopicProgress(topicId, progress, status);
  }, []);

  const deleteTopic = useCallback(async (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
    await learningService.deleteTopic(topicId);
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`learning_${userId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'learning_topics', 
          filter: `user_id=eq.${userId}` 
      }, () => {
          fetchTopics();
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchTopics]);

  return {
    topics,
    isLoading,
    addTopic,
    updateProgress,
    deleteTopic,
    refreshTopics: fetchTopics
  };
}
