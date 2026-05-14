import { useState, useCallback, useEffect } from 'react';
import { workoutService, WorkoutSession, WorkoutSet, Exercise, Routine } from '@/services/workoutService';
import { supabase } from '@/lib/supabase';

export function useWorkouts(userId: string | undefined) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [activeSets, setActiveSets] = useState<WorkoutSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  const initialize = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    
    const [exData, routData, sessionData] = await Promise.all([
      workoutService.getExercises(),
      workoutService.getRoutines(userId),
      workoutService.getActiveSession(userId)
    ]);
    
    setExercises(exData);
    setRoutines(routData);
    setActiveSession(sessionData);

    if (sessionData) {
      const sets = await workoutService.getSetsForSession(sessionData.id);
      setActiveSets(sets);
    }
    
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // --- Session Management ---
  const startWorkout = useCallback(async (name: string, routineId?: string) => {
    if (!userId) return;
    const session = await workoutService.startSession(userId, name, routineId);
    if (session) {
      setActiveSession(session);
      setActiveSets([]);
    }
  }, [userId]);

  const finishWorkout = useCallback(async () => {
    if (!activeSession) return;
    // Calculate volume
    const volume = activeSets.reduce((acc, set) => {
        if (set.completed && set.weight && set.reps) return acc + (set.weight * set.reps);
        return acc;
    }, 0);
    
    await workoutService.finishSession(activeSession.id, volume);
    setActiveSession(null);
    setActiveSets([]);
  }, [activeSession, activeSets]);

  // --- Set Management ---
  const addSet = useCallback(async (exerciseId: string) => {
    if (!activeSession) return;
    // determine next set number for this exercise
    const existingSets = activeSets.filter(s => s.exercise_id === exerciseId);
    const nextSetNumber = existingSets.length > 0 ? Math.max(...existingSets.map(s => s.set_number)) + 1 : 1;
    
    const newSet = await workoutService.addSet(activeSession.id, exerciseId, nextSetNumber);
    if (newSet) setActiveSets(prev => [...prev, newSet]);
  }, [activeSession, activeSets]);

  const updateSet = useCallback(async (setId: string, updates: Partial<WorkoutSet>) => {
    // Optimistic UI
    setActiveSets(prev => prev.map(s => s.id === setId ? { ...s, ...updates } : s));
    await workoutService.updateSet(setId, updates);
  }, []);

  const deleteSet = useCallback(async (setId: string) => {
    // Optimistic UI
    setActiveSets(prev => prev.filter(s => s.id !== setId));
    await workoutService.deleteSet(setId);
  }, []);

  return {
    exercises,
    routines,
    activeSession,
    activeSets,
    isLoading,
    startWorkout,
    finishWorkout,
    addSet,
    updateSet,
    deleteSet
  };
}
