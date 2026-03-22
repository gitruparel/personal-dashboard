'use client';

import { Download, Upload, X, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';

export default function SettingsOverlay({ 
    profile, 
    onClose, 
    onSaveSettings,
    onExport,
    onImport,
    onReset
}: { 
    profile: any,
    onClose: () => void,
    onSaveSettings: (updates: any) => void,
    onExport: () => void,
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onReset: () => void
}) {
    const [name, setName] = useState(profile.greeting_name || '');
    const [trackerName, setTrackerName] = useState(profile.tracker_name || 'NeetCode 150');
    const [trackerTarget, setTrackerTarget] = useState(profile.tracker_target || 150);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onSaveSettings({ 
            greeting_name: name,
            tracker_name: trackerName,
            tracker_target: Number(trackerTarget)
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--bg)', zIndex: 100, overflowY: 'auto', padding: '40px 20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Settings</h1>
                    <button className="reset-btn" onClick={onClose}><X width={24} height={24} /></button>
                </div>

                <div className="card" style={{ opacity: 1, animation: 'none', marginBottom: '24px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Personalization</h2>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Display Name (for greetings)</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Swayam"
                        style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none', marginTop: '10px', marginBottom: '20px' }}
                    />

                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Progress Tracker Name</label>
                    <input 
                        type="text" 
                        value={trackerName}
                        onChange={e => setTrackerName(e.target.value)}
                        style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none', marginTop: '10px', marginBottom: '20px' }}
                    />

                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Progress Target (Total Number)</label>
                    <input 
                        type="number" 
                        value={trackerTarget}
                        onChange={e => setTrackerTarget(Number(e.target.value))}
                        style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none', marginTop: '10px', marginBottom: '20px' }}
                    />

                    <button className="action-btn" style={{ marginTop: 0, padding: '12px' }} onClick={handleSave}>Save All Changes</button>
                </div>

                <div className="card" style={{ opacity: 1, animation: 'none', marginBottom: '24px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Data Management</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Export your data to a JSON file, or import a previously exported file to restore your progress.</p>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="action-btn" style={{ marginTop: 0, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flex: 1 }} onClick={onExport}>
                            <Download width={18} height={18} /> Export 
                        </button>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={onImport} />
                        <button className="action-btn" style={{ marginTop: 0, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flex: 1 }} onClick={() => fileInputRef.current?.click()}>
                            <Upload width={18} height={18} /> Import 
                        </button>
                    </div>
                </div>

                <div className="card" style={{ opacity: 1, animation: 'none', borderColor: 'rgba(255, 68, 68, 0.3)' }}>
                    <h2 style={{ marginBottom: '15px', color: '#ff4444' }}>Danger Zone</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Permanently reset all your tracking data. This action cannot be undone.</p>
                    <button 
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete ALL your data? This cannot be undone!")) {
                                onReset();
                            }
                        }}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)', color: '#ff4444', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'}
                    >
                        <Trash2 width={18} height={18} /> Reset Everything
                    </button>
                </div>
            </div>
        </div>
    );
}
