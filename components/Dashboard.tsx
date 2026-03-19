'use client';

import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Shield, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';
import ProgressTrackerCard from './ProgressTrackerCard';
import StreakCard from './StreakCard';
import Checklist, { Task } from './Checklist';
import ActivityGraph, { DailyActivity } from './ActivityGraph';
import StatsCard from './StatsCard';
import SettingsOverlay from './SettingsOverlay';
import { getDynamicGreeting } from '@/utils/greetings';

const MemoProgressTrackerCard = memo(ProgressTrackerCard);
const MemoStreakCard = memo(StreakCard);
const MemoChecklist = memo(Checklist);
const MemoActivityGraph = memo(ActivityGraph);
const MemoStatsCard = memo(StatsCard);

export default function Dashboard({ session }: { session: any }) {
    const user = session?.user;
    
    const [profile, setProfile] = useState<any>({
        streak: 0,
        neetcode_progress: 0,
        last_completed_date: '',
        greeting_name: '',
        tracker_name: 'NeetCode 150',
        tracker_target: 150
    });
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activity, setActivity] = useState<DailyActivity[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    
    useEffect(() => {
        if (!user) return;
        
        const loadAllData = async () => {
            const [profileRes, tasksRes, activityRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('tasks').select('*').eq('user_id', user.id).order('order_index'),
                supabase.from('daily_activity').select('*').eq('user_id', user.id)
            ]);

            if (profileRes.data) {
                setProfile(profileRes.data);
            } else {
                const { data: newProfile } = await supabase.from('profiles').insert([{ id: user.id }]).select().single();
                if (newProfile) setProfile(newProfile);
            }
            if (tasksRes.data) setTasks(tasksRes.data);
            if (activityRes.data) setActivity(activityRes.data);
            
            setIsDataLoaded(true);
        };
        
        loadAllData();
    }, [user?.id]);

    const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
    const isCompletedToday = profile.last_completed_date === todayDateStr;

    // Easter Egg 1: Konami Code
    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    triggerSuperConfetti();
                }
            } else {
                konamiIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const triggerSuperConfetti = useCallback(() => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        
        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 250);

        const orb1 = document.getElementById('orb1');
        const orb2 = document.getElementById('orb2');
        if (orb1 && orb2) {
            orb1.style.background = 'rgba(255, 0, 255, 0.4)';
            orb2.style.background = 'rgba(0, 255, 255, 0.4)';
            setTimeout(() => {
                orb1.style.background = '';
                orb2.style.background = '';
            }, 5000);
        }
    }, []);

    const updateProfile = useCallback(async (updates: Partial<typeof profile>) => {
        setProfile((prev: any) => ({ ...prev, ...updates }));
        await supabase.from('profiles').update(updates).eq('id', user.id);
    }, [user?.id]);

    const triggerConfetti = useCallback(() => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }, []);

    // Queue system for Activity DB requests to avoid Race Conditions
    const activityQueue = useRef<number>(0);
    const isProcessingQueue = useRef<boolean>(false);

    const pullActivity = async () => {
        const { data } = await supabase.from('daily_activity').select('*').eq('user_id', user.id);
        if (data) setActivity(data);
    };

    const processActivityQueue = useCallback(async () => {
        if (isProcessingQueue.current) return;
        isProcessingQueue.current = true;
        
        while(activityQueue.current !== 0) {
            const delta = activityQueue.current;
            activityQueue.current = 0;
            
            const { data } = await supabase.from('daily_activity').select('*').eq('user_id', user.id).eq('date', todayDateStr).single();
            if (data) {
                const newLevel = Math.max(0, data.activity_level + delta);
                await supabase.from('daily_activity').update({ activity_level: newLevel }).eq('id', data.id);
            } else if (delta > 0) {
                await supabase.from('daily_activity').insert([{ user_id: user.id, date: todayDateStr, activity_level: delta }]);
            }
        }
        
        await pullActivity();
        isProcessingQueue.current = false;
    }, [user?.id, todayDateStr]);

    const queueActivityDelta = useCallback((delta: number) => {
        activityQueue.current += delta;
        processActivityQueue();
    }, [processActivityQueue]);

    const logActivity = useCallback(() => queueActivityDelta(1), [queueActivityDelta]);
    const removeActivity = useCallback(() => queueActivityDelta(-1), [queueActivityDelta]);

    const handleLogProgress = useCallback(() => {
        const newProgress = profile.neetcode_progress + 1;
        updateProfile({ neetcode_progress: newProgress });
        logActivity();
        const target = profile.tracker_target || 150;
        if (newProgress > 0 && newProgress % Math.max(1, Math.floor(target/10)) === 0) triggerConfetti();
        if (newProgress === target) triggerConfetti();
    }, [profile.neetcode_progress, profile.tracker_target, updateProfile, logActivity, triggerConfetti]);

    const handleUndoProgress = useCallback(() => {
        if (profile.neetcode_progress > 0) {
            updateProfile({ neetcode_progress: profile.neetcode_progress - 1 });
            removeActivity();
        }
    }, [profile.neetcode_progress, updateProfile, removeActivity]);

    const handleMarkDayComplete = useCallback(() => {
        if (isCompletedToday) return;
        
        let newStreak = profile.streak;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (profile.last_completed_date === yesterdayStr) newStreak += 1;
        else newStreak = 1; 
        
        updateProfile({ streak: newStreak, last_completed_date: todayDateStr });
        logActivity();
        triggerConfetti();
    }, [isCompletedToday, profile.streak, profile.last_completed_date, todayDateStr, updateProfile, logActivity, triggerConfetti]);

    const handleUndoDayComplete = useCallback(() => {
        if (!isCompletedToday) return;
        updateProfile({ streak: Math.max(0, profile.streak - 1), last_completed_date: '' });
        removeActivity();
    }, [isCompletedToday, profile.streak, updateProfile, removeActivity]);

    const handleToggleTask = useCallback(async (taskId: string, completed: boolean) => {
        setTasks((prev: any) => prev.map((t: any) => t.id === taskId ? { ...t, completed } : t));
        await supabase.from('tasks').update({ completed }).eq('id', taskId);
        if (completed) logActivity();
        else removeActivity();
    }, [logActivity, removeActivity]);

    const handleAddTask = useCallback(async (text: string) => {
        const newTask = { user_id: user.id, text, completed: false, order_index: tasks.length };
        const { data } = await supabase.from('tasks').insert([newTask]).select().single();
        if (data) setTasks((prev: any) => [...prev, data]);
    }, [user?.id, tasks.length]);

    const handleDeleteTask = useCallback(async (taskId: string) => {
        const deletedTask = tasks.find(t => t.id === taskId);
        if (deletedTask?.completed) removeActivity();

        setTasks((prev: any) => prev.filter((t: any) => t.id !== taskId));
        await supabase.from('tasks').delete().eq('id', taskId);
    }, [tasks, removeActivity]);

    const handleSaveTaskOrder = useCallback((reorderedTasks: Task[]) => {
        setTasks(reorderedTasks);
        reorderedTasks.forEach(async (task) => {
            await supabase.from('tasks').update({ order_index: task.order_index }).eq('id', task.id);
        });
    }, []);

    const handleSaveSettingsOptions = useCallback((name: string, target: number) => updateProfile({ tracker_name: name, tracker_target: target }), [updateProfile]);

    const handleSignOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const handleExport = useCallback(() => {
        const data = { profile, tasks, activity };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workspace_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }, [profile, tasks, activity]);

    const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.profile) await updateProfile({
                    streak: data.profile.streak || 0,
                    neetcode_progress: data.profile.neetcode_progress || 0,
                    last_completed_date: data.profile.last_completed_date || '',
                    greeting_name: data.profile.greeting_name || '',
                    tracker_name: data.profile.tracker_name || 'NeetCode 150',
                    tracker_target: data.profile.tracker_target || 150
                });
                
                if (data.tasks) {
                    await supabase.from('tasks').delete().eq('user_id', user.id);
                    for (const t of data.tasks) {
                        await handleAddTask(t.text);
                    }
                }
                if (data.activity) {
                    await supabase.from('daily_activity').delete().eq('user_id', user.id);
                    await supabase.from('daily_activity').insert(data.activity.map((a: any) => ({ user_id: user.id, date: a.date, activity_level: a.activity_level })));
                }
                
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert("Failed to import data safely.");
            }
        };
        reader.readAsText(file);
    }, [user?.id, updateProfile, handleAddTask]);

    const handleReset = useCallback(async () => {
        await supabase.from('tasks').delete().eq('user_id', user.id);
        await supabase.from('daily_activity').delete().eq('user_id', user.id);
        const resetProfile = {
            streak: 0,
            neetcode_progress: 0,
            last_completed_date: '',
            tracker_name: 'NeetCode 150',
            tracker_target: 150
        };
        await updateProfile(resetProfile);
        setTasks([]);
        setActivity([]);
        setShowSettings(false);
    }, [user?.id, updateProfile]);

    const weeklyActivity = useMemo(() => activity.filter((a: DailyActivity) => {
        const diff = (new Date().getTime() - new Date(a.date).getTime()) / (1000 * 3600 * 24);
        return diff <= 7 && diff >= 0;
    }), [activity]);

    const weeklyTasks = useMemo(() => weeklyActivity.reduce((acc: number, curr: DailyActivity) => acc + curr.activity_level, 0), [weeklyActivity]);
    const perfectDays = useMemo(() => weeklyActivity.filter((a: DailyActivity) => a.activity_level >= 3).length, [weeklyActivity]); 
    const consistency = useMemo(() => Math.min(100, (weeklyActivity.length / 7) * 100), [weeklyActivity]);

    const historyDots = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dStr = d.toISOString().split('T')[0];
        return activity.some((a: DailyActivity) => a.date === dStr && a.activity_level > 0);
    }), [activity]);

    const displayName = useMemo(() => profile.greeting_name || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User', [profile.greeting_name, user]);

    if (!isDataLoaded) {
        return (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 500 }}>Decrypting Workspace...</div>
            </div>
        );
    }

    return (
        <>
            {showSettings && (
                <SettingsOverlay 
                    profile={profile}
                    onClose={() => setShowSettings(false)}
                    onSaveName={(name: string) => updateProfile({ greeting_name: name })}
                    onExport={handleExport}
                    onImport={handleImport}
                    onReset={handleReset}
                />
            )}
            <div className="container">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div className="greeting" id="greeting" style={{ textTransform: 'capitalize' }}>
                            {getDynamicGreeting(displayName)}
                        </div>
                        <div className="date-time" id="datetime">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="reset-btn" aria-label="Settings" title="Settings" onClick={() => setShowSettings(true)}>
                            <Settings width="20" height="20" />
                        </button>
                        <button className="reset-btn" aria-label="Sign Out" title="Sign Out" onClick={handleSignOut}>
                            <RefreshCw width="20" height="20" />
                        </button>
                    </div>
                </header>

                <div className="left-panel">
                    <MemoProgressTrackerCard 
                        name={profile.tracker_name}
                        target={profile.tracker_target}
                        progress={profile.neetcode_progress} 
                        onLogProblem={handleLogProgress} 
                        onUndo={handleUndoProgress} 
                        onSaveSettings={handleSaveSettingsOptions}
                    />
                    
                    <MemoChecklist 
                        tasks={tasks} 
                        onToggle={handleToggleTask} 
                        onAdd={handleAddTask} 
                        onDelete={handleDeleteTask}
                        onSaveOrder={handleSaveTaskOrder}
                    />

                    <div className="card rules-card delay-4" style={{opacity: 1, animation: 'none'}}>
                        <h2><Shield width={20} height={20} /> Core Principles</h2>
                        <ul className="rules-list">
                            <li className="rule-item"><b>Feynman Method</b> Learn → Explain simply → Apply → Relearn gaps.</li>
                            <li className="rule-item"><b>Consistency</b> Missing a day is a mistake. Missing two is a choice.</li>
                        </ul>
                    </div>
                </div>

                <div className="right-panel">
                    <MemoStreakCard 
                        streak={profile.streak} 
                        isCompletedToday={isCompletedToday}
                        onMarkComplete={handleMarkDayComplete}
                        onUndo={handleUndoDayComplete}
                        historyDots={historyDots}
                    />
                    
                    <MemoActivityGraph activityData={activity} />
                    
                    <MemoStatsCard 
                        weeklyTasks={weeklyTasks}
                        perfectDays={perfectDays}
                        consistency={consistency}
                    />
                </div>
            </div>
        </>
    );
}
