import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function CommandCenter() {
  return (
    <div className="command-center-container">
      <header className="cc-header">
        <h1>Command Center</h1>
        <p>Momentum Score: 0</p>
      </header>
      
      <div className="cc-grid">
        <GlassCard className="cc-widget">
          <h2>Today's Priority</h2>
          <p>No tasks yet.</p>
        </GlassCard>

        <GlassCard className="cc-widget">
          <h2>Activity Heatmap</h2>
          <p>Heatmap coming soon...</p>
        </GlassCard>
      </div>
    </div>
  );
}
