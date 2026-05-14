'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useGoals } from '@/hooks/useGoals';
import { useJournal } from '@/hooks/useJournal';
import { useProjects } from '@/hooks/useProjects';
import './Archive.css';

type ArchiveTab = 'workouts' | 'goals' | 'journal' | 'projects';

export default function ArchivePage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<ArchiveTab>('workouts');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { activeSession: _activeSession, isLoading: workoutsLoading } = useWorkouts(userId);
  const { goals, isLoading: goalsLoading } = useGoals(userId);
  const { getEntryForDate: _getEntry, isLoading: journalLoading } = useJournal(userId);
  const { projects, isLoading: projectsLoading } = useProjects(userId);

  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [journalHistory, setJournalHistory] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      if (!userId) return;

      // Fetch completed workouts
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('end_time', 'is', null)
        .order('start_time', { ascending: false });
      setWorkoutHistory(workouts || []);

      // Fetch all journal entries
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      setJournalHistory(journals || []);
    }

    if (userId) fetchHistory();
  }, [userId]);

  const archivedGoals = useMemo(() => 
    goals.filter(g => g.status === 'completed' || g.status === 'dropped'),
  [goals]);

  const archivedProjects = useMemo(() => 
    projects.filter(p => p.status === 'shipped' || p.status === 'paused'),
  [projects]);

  const isLoading = workoutsLoading || goalsLoading || journalLoading || projectsLoading;

  if (!session || isLoading) {
    return <div style={{ padding: '2rem' }}>Decrypting Vault...</div>;
  }

  return (
    <div className="archive-container">
      <header className="archive-header">
        <h1>History Vault</h1>
        <p>A complete record of your execution, progress, and reflections.</p>
      </header>

      <div className="archive-tabs">
        <button 
          className={`archive-tab ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </button>
        <button 
          className={`archive-tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
        <button 
          className={`archive-tab ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          Journal
        </button>
        <button 
          className={`archive-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
      </div>

      <div className="archive-content">
        {activeTab === 'workouts' && (
          workoutHistory.length > 0 ? (
            workoutHistory.map(w => (
              <GlassCard key={w.id} className="archive-item-card">
                <div className="archive-item-header">
                  <div className="archive-item-title">{w.name}</div>
                  <div className="archive-item-date">{new Date(w.start_time).toLocaleDateString()}</div>
                </div>
                <div className="archive-item-body">
                  Volume: {w.volume} kg • Duration: {Math.round((new Date(w.end_time).getTime() - new Date(w.start_time).getTime()) / 60000)} mins
                </div>
              </GlassCard>
            ))
          ) : <div className="empty-state">No completed workouts in the vault.</div>
        )}

        {activeTab === 'goals' && (
          archivedGoals.length > 0 ? (
            archivedGoals.map(g => (
              <GlassCard key={g.id} className="archive-item-card">
                <div className="archive-item-header">
                  <div className="archive-item-title">{g.title}</div>
                  <div className="archive-item-date">{g.status.toUpperCase()}</div>
                </div>
                <div className="archive-item-body">
                  Timeframe: {g.timeframe.replace('_', ' ')}
                  {g.completed_at && ` • Completed on ${new Date(g.completed_at).toLocaleDateString()}`}
                </div>
              </GlassCard>
            ))
          ) : <div className="empty-state">No archived goals yet. Keep executing.</div>
        )}

        {activeTab === 'journal' && (
          journalHistory.length > 0 ? (
            journalHistory.map(j => (
              <GlassCard key={j.id} className="archive-item-card">
                <div className="archive-item-header">
                  <div className="archive-item-title">{j.type === 'daily' ? 'Daily Protocol' : 'Weekly Review'}</div>
                  <div className="archive-item-date">{new Date(j.date).toLocaleDateString()}</div>
                </div>
                <div className="archive-item-body">
                  {Object.entries(j.content as Record<string, string>).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '8px' }}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))
          ) : <div className="empty-state">Your reflections have not yet been archived.</div>
        )}

        {activeTab === 'projects' && (
          archivedProjects.length > 0 ? (
            archivedProjects.map(p => (
              <GlassCard key={p.id} className="archive-item-card">
                <div className="archive-item-header">
                  <div className="archive-item-title">{p.name}</div>
                  <div className="archive-item-date">{p.status.toUpperCase()}</div>
                </div>
                <div className="archive-item-body">
                  {p.description}
                  {p.repository_url && <div style={{ marginTop: '4px' }}><a href={p.repository_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Repository</a></div>}
                </div>
              </GlassCard>
            ))
          ) : <div className="empty-state">No inactive projects. Stay in build mode.</div>
        )}
      </div>
    </div>
  );
}
