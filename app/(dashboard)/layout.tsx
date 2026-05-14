'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';
import { Home, Activity, Target, Terminal, BookOpen, PenTool, Archive } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="pos-layout">
      <nav className="pos-sidebar">
        <div className="sidebar-brand">POS</div>
        <ul className="sidebar-nav">
          <Link href="/command-center" style={{ textDecoration: 'none' }}>
            <li className={`nav-item ${pathname === '/command-center' ? 'active' : ''}`}><Home size={18} /> Command Center</li>
          </Link>
          <li className="nav-item"><Activity size={18} /> Workouts</li>
          <Link href="/goals" style={{ textDecoration: 'none' }}>
            <li className={`nav-item ${pathname === '/goals' ? 'active' : ''}`}><Target size={18} /> Goals</li>
          </Link>
          <Link href="/build" style={{ textDecoration: 'none' }}>
            <li className={`nav-item ${pathname === '/build' ? 'active' : ''}`}><Terminal size={18} /> Build</li>
          </Link>
          <Link href="/learning" style={{ textDecoration: 'none' }}>
            <li className={`nav-item ${pathname === '/learning' ? 'active' : ''}`}><BookOpen size={18} /> Learning</li>
          </Link>
          <Link href="/journal" style={{ textDecoration: 'none' }}>
            <li className={`nav-item ${pathname === '/journal' ? 'active' : ''}`}><PenTool size={18} /> Journal</li>
          </Link>
          <li className="nav-item"><Archive size={18} /> Archive</li>
        </ul>
      </nav>
      <main className="pos-main-content">
        {children}
      </main>
    </div>
  );
}
