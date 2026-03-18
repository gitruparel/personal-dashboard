'use client';

import { Code, Edit2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ProgressTrackerCard({ 
    name, 
    target, 
    progress, 
    onLogProblem, 
    onUndo,
    onSaveSettings 
}: { 
    name: string, 
    target: number, 
    progress: number, 
    onLogProblem: () => void, 
    onUndo: () => void,
    onSaveSettings: (name: string, target: number) => void
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);
    const [editTarget, setEditTarget] = useState(target.toString());

    const handleSave = () => {
        const parsedTarget = parseInt(editTarget, 10);
        if (!isNaN(parsedTarget) && parsedTarget > 0 && editName.trim()) {
            onSaveSettings(editName.trim(), parsedTarget);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="card neet-card delay-2" style={{opacity: 1, animation: 'none'}}>
                <h2 style={{position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Code width={20} height={20} /> Edit Tracker</span>
                    <Check onClick={handleSave} style={{cursor: 'pointer', color: '#39d353'}} width={20} height={20} />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tracker Name</label>
                    <input 
                        type="text" 
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px', outline: 'none' }}
                    />
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>Target Number</label>
                    <input 
                        type="number" 
                        value={editTarget}
                        onChange={e => setEditTarget(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px', outline: 'none' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="card neet-card delay-2" style={{opacity: 1, animation: 'none'}}>
            <h2 style={{position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
                <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Code width={20} height={20} /> {name || 'Custom Tracker'}</span>
                <Edit2 onClick={() => setIsEditing(true)} style={{cursor: 'pointer', color: 'var(--text-muted)'}} width={16} height={16} />
            </h2>
            <div style={{ fontSize: '3rem', fontWeight: 700, textAlign: 'center', margin: '15px 0', textShadow: '0 0 30px rgba(255,255,255,0.1)', transition: 'transform 0.3s' }}>{progress}</div>
            <div className="progress-wrapper">
                <div className="progress-stats">
                    <span style={{fontWeight: 600, color: 'white'}}>Progress</span>
                    <span style={{color: 'white'}}>{progress} / {target || 150}</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{width: `${Math.min(100, (progress / (target || 150)) * 100)}%`}}></div>
                </div>
            </div>
            <button className="action-btn" onClick={onLogProblem}>Log Progress</button>
            {progress > 0 && <button className="undo-btn visible" onClick={onUndo}>Undo last log</button>}
        </div>
    );
}
