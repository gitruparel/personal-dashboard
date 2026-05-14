'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useJournal } from '@/hooks/useJournal';
import './Journal.css';

const DAILY_PROMPTS = [
  { id: 'forward', label: 'What moved you forward today?' },
  { id: 'distraction', label: 'Biggest distraction?' },
  { id: 'win', label: 'Biggest win?' },
  { id: 'improve', label: 'What should improve tomorrow?' }
];

const WEEKLY_PROMPTS = [
  { id: 'worked', label: 'What worked this week?' },
  { id: 'wasted', label: 'What wasted time?' },
  { id: 'change', label: 'What should change next week?' }
];

export default function JournalPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { getEntryForDate, saveEntry, isLoading } = useJournal(userId);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toLocaleDateString('en-CA'), [today]);
  const isSunday = today.getDay() === 0;

  // Local state for the forms to allow fast typing before auto-save
  const [dailyForm, setDailyForm] = useState<Record<string, string>>({});
  const [weeklyForm, setWeeklyForm] = useState<Record<string, string>>({});

  // Sync DB to local state initially
  useEffect(() => {
    if (!isLoading) {
      const daily = getEntryForDate(todayStr, 'daily');
      if (daily?.content) setDailyForm(daily.content as Record<string, string>);

      const weekly = getEntryForDate(todayStr, 'weekly_review');
      if (weekly?.content) setWeeklyForm(weekly.content as Record<string, string>);
    }
  }, [isLoading, getEntryForDate, todayStr]);

  const handleDailyChange = (id: string, value: string) => {
    const updated = { ...dailyForm, [id]: value };
    setDailyForm(updated);
    saveEntry(todayStr, 'daily', updated);
  };

  const handleWeeklyChange = (id: string, value: string) => {
    const updated = { ...weeklyForm, [id]: value };
    setWeeklyForm(updated);
    saveEntry(todayStr, 'weekly_review', updated);
  };

  if (!session || isLoading) {
    return <div style={{ padding: '2rem' }}>Decrypting Journal...</div>;
  }

  return (
    <div className="journal-container">
      <header className="journal-header">
        <h1>Tactical Review</h1>
        <p>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </header>

      <div className="journal-grid">
        {!isSunday ? (
          <GlassCard className="journal-card">
            <h2>Daily Protocol</h2>
            <div className="prompts-list">
              {DAILY_PROMPTS.map(prompt => (
                <div key={prompt.id} className="prompt-item">
                  <label>{prompt.label}</label>
                  <textarea 
                    value={dailyForm[prompt.id] || ''}
                    onChange={(e) => handleDailyChange(prompt.id, e.target.value)}
                    placeholder="Reflect and answer..."
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="journal-card weekly-card">
            <h2>Weekly Systems Review</h2>
            <p className="weekly-subtitle">Analyze the past 7 days to adjust the trajectory for the next 7.</p>
            <div className="prompts-list">
              {WEEKLY_PROMPTS.map(prompt => (
                <div key={prompt.id} className="prompt-item">
                  <label>{prompt.label}</label>
                  <textarea 
                    value={weeklyForm[prompt.id] || ''}
                    onChange={(e) => handleWeeklyChange(prompt.id, e.target.value)}
                    placeholder="Reflect and analyze..."
                    rows={4}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="journal-sidebar">
          <GlassCard className="journal-insights-card">
            <h3><span className="icon">🧠</span> Journaling Philosophy</h3>
            <p>This is not an emotional diary. This is a tactical feedback loop.</p>
            <ul>
              <li>Identify bottlenecks</li>
              <li>Acknowledge momentum</li>
              <li>Course correct daily</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
