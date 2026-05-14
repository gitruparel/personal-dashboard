import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type Routine = Database['public']['Tables']['routines']['Row'];
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];
export type WorkoutSet = Database['public']['Tables']['workout_sets']['Row'];

export const workoutService = {
  // --- EXERCISES ---
  async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase.from('exercises').select('*').order('name');
    if (error) { console.error('Error fetching exercises:', error); return []; }
    return data || [];
  },

  // --- ROUTINES ---
  async getRoutines(userId: string): Promise<Routine[]> {
    const { data, error } = await supabase.from('routines').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) { console.error('Error fetching routines:', error); return []; }
    return data || [];
  },

  async addRoutine(userId: string, name: string, notes?: string): Promise<Routine | null> {
    const { data, error } = await supabase.from('routines').insert([{ user_id: userId, name, notes }]).select().single();
    if (error) { console.error('Error adding routine:', error); return null; }
    return data;
  },

  // --- SESSIONS ---
  async startSession(userId: string, name: string, routineId?: string): Promise<WorkoutSession | null> {
    const { data, error } = await supabase.from('workout_sessions').insert([{ 
        user_id: userId, 
        name, 
        routine_id: routineId,
        start_time: new Date().toISOString()
    }]).select().single();
    if (error) { console.error('Error starting session:', error); return null; }
    return data;
  },

  async getActiveSession(userId: string): Promise<WorkoutSession | null> {
    const { data, error } = await supabase.from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('end_time', null)
        .order('start_time', { ascending: false })
        .limit(1)
        .single();
    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
        console.error('Error fetching active session:', error);
    }
    return data || null;
  },

  async finishSession(sessionId: string, totalVolume: number): Promise<boolean> {
    const { error } = await supabase.from('workout_sessions')
        .update({ end_time: new Date().toISOString(), volume: totalVolume })
        .eq('id', sessionId);
    if (error) { console.error('Error finishing session:', error); return false; }
    return true;
  },

  // --- SETS ---
  async getSetsForSession(sessionId: string): Promise<WorkoutSet[]> {
    const { data, error } = await supabase.from('workout_sets')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
    if (error) { console.error('Error fetching sets:', error); return []; }
    return data || [];
  },

  async addSet(sessionId: string, exerciseId: string, setNumber: number): Promise<WorkoutSet | null> {
    const { data, error } = await supabase.from('workout_sets').insert([{ 
        session_id: sessionId, 
        exercise_id: exerciseId, 
        set_number: setNumber 
    }]).select().single();
    if (error) { console.error('Error adding set:', error); return null; }
    return data;
  },

  async updateSet(setId: string, updates: Partial<WorkoutSet>): Promise<boolean> {
    const { error } = await supabase.from('workout_sets').update(updates).eq('id', setId);
    if (error) { console.error('Error updating set:', error); return false; }
    return true;
  },

  async deleteSet(setId: string): Promise<boolean> {
    const { error } = await supabase.from('workout_sets').delete().eq('id', setId);
    if (error) { console.error('Error deleting set:', error); return false; }
    return true;
  }
};
