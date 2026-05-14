import React from 'react';
import './layout.css';
import { Home, Activity, Target, Terminal, BookOpen, PenTool, Archive } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pos-layout">
      <nav className="pos-sidebar">
        <div className="sidebar-brand">POS</div>
        <ul className="sidebar-nav">
          <li className="nav-item active"><Home size={18} /> Command Center</li>
          <li className="nav-item"><Activity size={18} /> Workouts</li>
          <li className="nav-item"><Target size={18} /> Goals</li>
          <li className="nav-item"><Terminal size={18} /> Build</li>
          <li className="nav-item"><BookOpen size={18} /> Learning</li>
          <li className="nav-item"><PenTool size={18} /> Journal</li>
          <li className="nav-item"><Archive size={18} /> Archive</li>
        </ul>
      </nav>
      <main className="pos-main-content">
        {children}
      </main>
    </div>
  );
}
