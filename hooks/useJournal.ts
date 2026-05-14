import { useState, useCallback, useEffect } from 'react';
import { journalService, JournalEntry } from '@/services/journalService';
import { supabase } from '@/lib/supabase';

export function useJournal(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await journalService.getEntries(userId);
    setEntries(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const saveEntry = useCallback(async (dateStr: string, type: 'daily' | 'weekly_review', content: any) => {
    if (!userId) return;
    
    // Optimistic UI update
    setEntries(prev => {
        const existingIdx = prev.findIndex(e => e.date === dateStr && e.type === type);
        if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = { ...updated[existingIdx], content };
            return updated;
        }
        return [{ id: 'temp', user_id: userId, date: dateStr, created_at: new Date().toISOString(), type, content }, ...prev];
    });

    await journalService.saveEntry(userId, dateStr, type, content);
  }, [userId]);

  const getEntryForDate = useCallback((dateStr: string, type: 'daily' | 'weekly_review') => {
      return entries.find(e => e.date === dateStr && e.type === type);
  }, [entries]);

  // Set up realtime subscription
  useEffect(() => {
    if (!userId) return;

    const journalChannel = supabase.channel(`journal_${userId}`)
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'journal_entries', 
          filter: `user_id=eq.${userId}` 
      }, () => {
          fetchEntries();
      }).subscribe();

    return () => {
      supabase.removeChannel(journalChannel);
    };
  }, [userId, fetchEntries]);

  return {
    entries,
    isLoading,
    saveEntry,
    getEntryForDate,
    refreshEntries: fetchEntries
  };
}
