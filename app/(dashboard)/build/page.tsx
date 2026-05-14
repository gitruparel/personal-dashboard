'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';
import { useProjects } from '@/hooks/useProjects';
import { useActivity } from '@/hooks/useActivity';
import { Plus, Terminal, Trash2, Github, ExternalLink } from 'lucide-react';
import './Build.css';

export default function BuildPage() {
  const [session, setSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRepo, setNewRepo] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id;
  const { projects, isLoading, addProject, updateStatus, deleteProject } = useProjects(userId);
  const { logActivity } = useActivity(userId); // We will log 'build' activity, but the hook currently just logs basic +1.

  if (!session || isLoading) {
    return <div style={{ padding: '2rem' }}>Loading Build Dashboard...</div>;
  }

  const handleAddProject = async () => {
    if (!newName.trim()) return;
    await addProject(newName, newDesc, newRepo);
    setIsModalOpen(false);
    setNewName('');
    setNewDesc('');
    setNewRepo('');
  };

  const handleLogBuildSession = () => {
    // In the future this should specify type: 'build'
    logActivity(1);
    alert('Build session logged and added to heatmap!');
  };

  return (
    <div className="build-container">
      <header className="build-header">
        <div>
            <h1>Startup Cockpit</h1>
            <p>Track active projects, milestones, and shipping velocity.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={handleLogBuildSession}>
                <Terminal size={16} /> Log Build Session
            </button>
            <button className="new-project-btn" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> New Project
            </button>
        </div>
      </header>

      <div className="build-grid">
        {projects.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)' }}>No active projects. Start building.</div>
        ) : (
            projects.map(project => (
                <GlassCard key={project.id} className="project-card">
                    <div className="project-header">
                        <div>
                            <div className="project-title">{project.name}</div>
                            {project.description && <div className="project-desc">{project.description}</div>}
                        </div>
                        <span className={`project-status ${project.status}`}>{project.status}</span>
                    </div>

                    <div className="project-meta">
                        {project.repository_url && (
                            <a href={project.repository_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Github size={14} /> Repository
                            </a>
                        )}
                        {project.launch_date && (
                            <span>Launch: {new Date(project.launch_date).toLocaleDateString()}</span>
                        )}
                    </div>

                    <div className="project-actions">
                        <select 
                            className="status-select"
                            value={project.status}
                            onChange={(e) => updateStatus(project.id, e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="shipped">Shipped</option>
                        </select>
                        <button onClick={() => deleteProject(project.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </GlassCard>
            ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Initialize Project</h2>
                <input 
                    type="text" 
                    placeholder="Project Name (e.g. Personal OS)" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                />
                <textarea 
                    placeholder="Short description of what you are building..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="GitHub Repo URL (optional)" 
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                />
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="new-project-btn" onClick={handleAddProject}>Deploy Project</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
