'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useActivity } from '@/hooks/useActivity';
import { Play, Plus, Dumbbell, Check, Trash2, X } from 'lucide-react';
import './Workouts.css';

export default function WorkoutsPage() {
  const [session, setSession] = useState<any>(null);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { 
    exercises, routines, activeSession, activeSets, isLoading, 
    startWorkout, finishWorkout, addSet, updateSet, deleteSet 
  } = useWorkouts(userId);
  const { logActivity } = useActivity(userId);

  if (!session || isLoading) {
    return <div style={{ padding: '2rem' }}>Loading Workout Engine...</div>;
  }

  const handleStartEmptyWorkout = () => {
    startWorkout('Freestyle Workout');
  };

  const handleFinishWorkout = async () => {
    await finishWorkout();
    logActivity(1); // Log to momentum heatmap
    alert('Workout complete! Momentum logged.');
  };

  // Group active sets by exercise
  const exerciseGroups = activeSets.reduce((groups, set) => {
    const ex = exercises.find(e => e.id === set.exercise_id);
    if (!ex) return groups;
    if (!groups[ex.id]) {
      groups[ex.id] = { exercise: ex, sets: [] };
    }
    groups[ex.id].sets.push(set);
    return groups;
  }, {} as Record<string, { exercise: any, sets: any[] }>);

  // --- LIVE WORKOUT UI ---
  if (activeSession) {
    return (
      <div className="workouts-container live-workout">
        <div className="live-workout-header">
          <div>
            <div className="live-workout-title">{activeSession.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Started at {new Date(activeSession.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => finishWorkout()}>Cancel</button>
            <button className="btn-primary" onClick={handleFinishWorkout}>Finish</button>
          </div>
        </div>

        {Object.values(exerciseGroups).map(group => (
          <GlassCard key={group.exercise.id} className="exercise-group">
            <div className="exercise-header">
              <span>{group.exercise.name}</span>
            </div>
            <table className="sets-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Set</th>
                  <th style={{ textAlign: 'center' }}>kg</th>
                  <th style={{ textAlign: 'center' }}>Reps</th>
                  <th style={{ width: '60px', textAlign: 'center' }}><Check size={16}/></th>
                </tr>
              </thead>
              <tbody>
                {group.sets.map((set, idx) => (
                  <tr key={set.id} className={`set-row ${set.completed ? 'completed' : ''}`}>
                    <td className="set-number">{idx + 1}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="number" 
                        className="set-input" 
                        value={set.weight || ''} 
                        onChange={(e) => updateSet(set.id, { weight: parseFloat(e.target.value) })}
                        placeholder="-"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="number" 
                        className="set-input" 
                        value={set.reps || ''} 
                        onChange={(e) => updateSet(set.id, { reps: parseInt(e.target.value, 10) })}
                        placeholder="-"
                      />
                    </td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <button 
                        className={`btn-check ${set.completed ? 'checked' : ''}`}
                        onClick={() => updateSet(set.id, { completed: !set.completed })}
                      >
                        <Check size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="add-set-btn" onClick={() => addSet(group.exercise.id)}>+ Add Set</button>
          </GlassCard>
        ))}

        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} onClick={() => setIsExerciseModalOpen(true)}>
          <Plus size={18} /> Add Exercise
        </button>

        {/* Exercise Selection Modal */}
        {isExerciseModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Select Exercise</h2>
                <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setIsExerciseModalOpen(false)}><X size={20}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exercises.map(ex => (
                  <div key={ex.id} className="exercise-list-item" onClick={() => { addSet(ex.id); setIsExerciseModalOpen(false); }}>
                    <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ex.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ex.muscle_group}</div>
                    </div>
                    <Plus size={16} color="var(--accent-primary)" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD ROUTINES UI ---
  return (
    <div className="workouts-container">
      <header className="workouts-header">
        <div>
            <h1>Training</h1>
            <p>Hevy-style robust workout tracking. Progressive overload.</p>
        </div>
        <button className="btn-primary" onClick={handleStartEmptyWorkout}>
            <Dumbbell size={16} /> Start Empty Workout
        </button>
      </header>

      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>My Routines</h2>
            <button className="btn-secondary" onClick={() => setIsRoutineModalOpen(true)}>
                <Plus size={14} /> New Routine
            </button>
        </div>
        <div className="routines-grid">
            {routines.map(routine => (
                <GlassCard key={routine.id} className="routine-card">
                    <div className="routine-title">{routine.name}</div>
                    {routine.notes && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{routine.notes}</div>}
                    <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startWorkout(routine.name, routine.id)}>
                            <Play size={14} fill="currentColor" /> Start Routine
                        </button>
                    </div>
                </GlassCard>
            ))}
            {routines.length === 0 && (
                <div style={{ color: 'var(--text-secondary)' }}>No routines yet. Create one or start an empty workout.</div>
            )}
        </div>
      </div>
    </div>
  );
}
