'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useGoals } from '@/hooks/useGoals';
import { GoalTimeframe } from '@/services/goalService';
import { Plus, Target, Trash2 } from 'lucide-react';
import './Goals.css';

export default function GoalsPage() {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTimeframe, setNewGoalTimeframe] = useState<GoalTimeframe>('1_year');
  const [newGoalParentId, setNewGoalParentId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { goals, goalTree, isLoading, addGoal, updateStatus, deleteGoal } = useGoals(userId);

  if (!session || isLoading) {
    return <div style={{ padding: '2rem' }}>Decrypting Vision...</div>;
  }

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;
    await addGoal(newGoalTitle, newGoalTimeframe, newGoalParentId);
    setIsModalOpen(false);
    setNewGoalTitle('');
    setNewGoalParentId(null);
  };

  const openSubgoalModal = (parentId: string, parentTimeframe: GoalTimeframe) => {
    setNewGoalParentId(parentId);
    // Auto-select the next logical timeframe downwards
    if (parentTimeframe === '5_year') setNewGoalTimeframe('1_year');
    else if (parentTimeframe === '1_year') setNewGoalTimeframe('quarterly');
    else if (parentTimeframe === 'quarterly') setNewGoalTimeframe('monthly');
    else setNewGoalTimeframe('weekly');
    setIsModalOpen(true);
  };

  const renderGoalNode = (node: any) => {
    return (
      <div key={node.id} className="goal-node-wrapper">
        <GlassCard className="goal-card">
          <div className="goal-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="var(--accent-primary)" />
                <span className="goal-card-title" style={{ textDecoration: node.status === 'completed' ? 'line-through' : 'none', opacity: node.status === 'completed' ? 0.5 : 1 }}>
                    {node.title}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`goal-badge timeframe-${node.timeframe}`}>
                {node.timeframe.replace('_', ' ')}
                </span>
                <button onClick={() => deleteGoal(node.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Trash2 size={14} />
                </button>
            </div>
          </div>
          <div className="goal-status">
            <select 
                className="status-select" 
                value={node.status} 
                onChange={(e) => updateStatus(node.id, e.target.value as any)}
            >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
            </select>
            {node.timeframe !== 'weekly' && (
                <button 
                    onClick={() => openSubgoalModal(node.id, node.timeframe)}
                    className="btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}
                >
                    <Plus size={12} /> Break Down
                </button>
            )}
          </div>
        </GlassCard>

        {node.children && node.children.length > 0 && (
          <div className="goal-children">
            {node.children.map((child: any) => renderGoalNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="goals-container">
      <header className="goals-header">
        <div>
            <h1>Hierarchical Vision</h1>
            <p>Break down the 5-year mission into actionable weekly targets.</p>
        </div>
        <button className="new-goal-btn" onClick={() => { setNewGoalParentId(null); setIsModalOpen(true); }}>
            <Plus size={16} /> New Root Goal
        </button>
      </header>

      <div className="goals-grid">
        {goalTree.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No goals set. Define the vision.</div>
        ) : (
            goalTree.map(rootNode => renderGoalNode(rootNode))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{newGoalParentId ? 'Add Sub-Target' : 'Create Root Goal'}</h2>
                <input 
                    type="text" 
                    placeholder="E.g. Reach $10k MRR" 
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    autoFocus
                />
                <select 
                    value={newGoalTimeframe} 
                    onChange={(e) => setNewGoalTimeframe(e.target.value as GoalTimeframe)}
                >
                    <option value="5_year">5 Year Vision</option>
                    <option value="1_year">1 Year Goal</option>
                    <option value="quarterly">Quarterly Target</option>
                    <option value="monthly">Monthly Milestone</option>
                    <option value="weekly">Weekly Action</option>
                </select>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="new-goal-btn" onClick={handleAddGoal}>Deploy Goal</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
