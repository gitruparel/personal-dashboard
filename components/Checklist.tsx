'use client';

import { CheckSquare, Edit2, Check, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

export type Task = {
    id: string;
    text: string;
    completed: boolean;
    order_index: number;
};

export default function Checklist({ 
    tasks, 
    onToggle,
    onAdd,
    onDelete,
    onSaveOrder
}: { 
    tasks: Task[], 
    onToggle: (id: string, completed: boolean) => void,
    onAdd: (text: string) => void,
    onDelete: (id: string) => void,
    onSaveOrder: (reorderedTasks: Task[]) => void
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [localTasks, setLocalTasks] = useState<Task[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    useEffect(() => {
        setLocalTasks([...tasks].sort((a,b) => a.order_index - b.order_index));
    }, [tasks]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const text = newTaskText.trim();
        // Easter Egg 2: Barrel Roll
        if (text.toLowerCase() === 'do a barrel roll') {
            document.body.style.transition = 'transform 2s ease-in-out';
            document.body.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                document.body.style.transition = '';
                document.body.style.transform = '';
            }, 2000);
            setNewTaskText('');
            return;
        }

        if (text) {
            onAdd(text);
            setNewTaskText('');
        }
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === id) return;
        
        const draggedIndex = localTasks.findIndex(t => t.id === draggedId);
        const targetIndex = localTasks.findIndex(t => t.id === id);
        
        const newTasks = [...localTasks];
        const [draggedTask] = newTasks.splice(draggedIndex, 1);
        newTasks.splice(targetIndex, 0, draggedTask);
        
        const reordered = newTasks.map((t, idx) => ({ ...t, order_index: idx }));
        setLocalTasks(reordered);
    };

    const finishEditing = () => {
        setIsEditing(false);
        onSaveOrder(localTasks);
    };

    return (
        <div className="card checklist-card delay-3" style={{opacity: 1, animation: 'none'}}>
            <h2 style={{position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
                <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <CheckSquare width={20} height={20} /> Daily Focus
                </span>
                {isEditing ? (
                    <Check onClick={finishEditing} style={{cursor: 'pointer', color: '#39d353'}} width={20} height={20} />
                ) : (
                    <Edit2 onClick={() => setIsEditing(true)} style={{cursor: 'pointer', color: 'var(--text-muted)'}} width={16} height={16} />
                )}
            </h2>
            
            <ul className="checklist">
                {localTasks.map(task => (
                    <li 
                        key={task.id} 
                        className={`checklist-item ${task.completed && !isEditing ? 'done' : ''}`} 
                        onClick={() => !isEditing && onToggle(task.id, !task.completed)}
                        draggable={isEditing}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragOver={(e) => handleDragOver(e, task.id)}
                        onDragEnd={() => setDraggedId(null)}
                        style={{
                            opacity: draggedId === task.id ? 0.5 : 1,
                            cursor: isEditing ? 'grab' : 'pointer'
                        }}
                    >
                        {isEditing ? (
                            <GripVertical width={18} height={18} style={{ color: 'var(--text-muted)', marginRight: '10px', flexShrink: 0 }} />
                        ) : (
                            <div className="check-box"></div>
                        )}
                        <span className="item-text" style={{ flexGrow: 1 }}>{task.text}</span>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', padding: 4 }}
                            >
                                <Trash2 width={18} height={18} />
                            </button>
                        )}
                    </li>
                ))}
                {localTasks.length === 0 && !isEditing && (
                    <li style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No tasks assigned. Click edit to add one.</li>
                )}
            </ul>
            
            {isEditing && (
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <input 
                        type="text" 
                        value={newTaskText}
                        onChange={e => setNewTaskText(e.target.value)}
                        placeholder="New Task Name" 
                        style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', padding: '10px', outline: 'none', fontSize: '0.95rem' }}
                    />
                    <button type="submit" style={{ background: 'white', color: 'black', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Plus width={18} height={18} />
                    </button>
                </form>
            )}
        </div>
    );
}
