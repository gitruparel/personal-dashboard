'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMsg, setAuthMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && !loading) {
      router.push('/command-center');
    }
  }, [session, loading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg('Processing...');
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthMsg(error.message);
      else setAuthMsg('Check your email for the confirmation link!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthMsg(error.message);
      else setAuthMsg('');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', color: 'white' }}>Loading Workspace...</div>;
  }

  if (!session) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', opacity: 1, animation: 'none' }}>
          <h2 style={{ justifyContent: 'center', marginBottom: '10px' }}>{isSignUp ? 'Create Account' : 'Login'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '0.95rem' }}>Sign in to access your workspace</p>
          
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none' }}
            />
            <button type="submit" className="action-btn" style={{ marginTop: '10px', padding: '12px' }}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          
          {authMsg && <p style={{ color: authMsg.includes('Check') ? '#39d353' : '#ff4444', fontSize: '0.9rem', marginBottom: '15px' }}>{authMsg}</p>}
          
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setAuthMsg(''); }}
            className="undo-btn visible" 
            style={{ margin: '0 auto', fontSize: '0.9rem'}}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    );
  }

  // Fallback while redirecting
  if (session) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', color: 'white' }}>Entering Workspace...</div>;
  }

  return null;
}
