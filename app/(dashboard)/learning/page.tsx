'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useLearning } from '@/hooks/useLearning';
import { useActivity } from '@/hooks/useActivity';
import { LearningType } from '@/services/learningService';
import { Plus, Trash2, BookOpen, PlusCircle, MinusCircle } from 'lucide-react';
import './Learning.css';

export default function LearningPage() {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<LearningType>('dsa');
  const [newTarget, setNewTarget] = useState<number>(150);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { topics, isLoading, addTopic, updateProgress, deleteTopic } = useLearning(userId);
  const { logActivity } = useActivity(userId); // Log learning progress to heatmap

  if (!session || isLoading) {
    return <div style={{ padding: '2rem' }}>Loading Learning Tracker...</div>;
  }

  const handleAddTopic = async () => {
    if (!newTitle.trim()) return;
    await addTopic(newTitle, newType, Number(newTarget));
    setIsModalOpen(false);
    setNewTitle('');
  };

  const handleProgress = (topicId: string, current: number, target: number, delta: number) => {
    const newProgress = Math.min(Math.max(0, current + delta), target);
    updateProgress(topicId, newProgress, target);
    if (delta > 0) logActivity(1); // Log to momentum engine when moving forward
  };

  return (
    <div className="learning-container">
      <header className="learning-header">
        <div>
            <h1>Learning Tracker</h1>
            <p>Mastery requires structure. Track courses, books, and DSA concepts.</p>
        </div>
        <button className="new-topic-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Topic
        </button>
      </header>

      <div className="learning-grid">
        {topics.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No learning topics. Queue something up.</div>
        ) : (
            topics.map(topic => {
                const percentage = Math.round((topic.progress / topic.target) * 100);
                return (
                <GlassCard key={topic.id} className="topic-card">
                    <div className="topic-header">
                        <div className="topic-title">{topic.title}</div>
                        <span className={`topic-type ${topic.type}`}>{topic.type}</span>
                    </div>

                    <div className="topic-progress-container">
                        <div className="topic-progress-text">
                            <span>{topic.status === 'completed' ? 'Mastered' : topic.status}</span>
                            <span>{topic.progress} / {topic.target} ({percentage}%)</span>
                        </div>
                        <div className="topic-progress-bar-bg">
                            <div className="topic-progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>

                    <div className="topic-actions">
                        <div className="progress-controls">
                            <button className="btn-icon" onClick={() => handleProgress(topic.id, topic.progress, topic.target, -1)}>
                                <MinusCircle size={16} />
                            </button>
                            <button className="btn-icon" onClick={() => handleProgress(topic.id, topic.progress, topic.target, 1)}>
                                <PlusCircle size={16} />
                            </button>
                        </div>
                        <button onClick={() => deleteTopic(topic.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </GlassCard>
            )})
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Learning Topic</h2>
                <input 
                    type="text" 
                    placeholder="Topic Title (e.g. Neetcode 150)" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    autoFocus
                />
                <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value as LearningType)}
                >
                    <option value="dsa">DSA / Algorithms</option>
                    <option value="course">Video Course</option>
                    <option value="book">Book</option>
                    <option value="concept">General Concept</option>
                </select>
                <input 
                    type="number" 
                    placeholder="Target (e.g. 150 for Neetcode, 20 for Course modules)" 
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                />
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="new-topic-btn" onClick={handleAddTopic}>Queue Topic</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
