import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];

export const journalService = {
  async getEntries(userId: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
    return data || [];
  },

  async getEntryByDate(userId: string, dateStr: string, type: 'daily' | 'weekly_review'): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .eq('type', type)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error('Error fetching journal entry:', error);
    }
    return data;
  },

  async saveEntry(userId: string, dateStr: string, type: 'daily' | 'weekly_review', content: any): Promise<JournalEntry | null> {
    // Upsert logic
    const existing = await this.getEntryByDate(userId, dateStr, type);
    
    if (existing) {
        const { data, error } = await supabase
            .from('journal_entries')
            .update({ content })
            .eq('id', existing.id)
            .select()
            .single();
        if (error) console.error('Error updating journal:', error);
        return data;
    } else {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert([{ user_id: userId, date: dateStr, type, content }])
            .select()
            .single();
        if (error) console.error('Error inserting journal:', error);
        return data;
    }
  }
};
