'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';
import { Home, Activity, Target, Terminal, BookOpen, PenTool, Archive, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="pos-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="hamburger" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="sidebar-brand" style={{ marginBottom: 0, marginLeft: '12px' }}>POS</span>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 95,
            backdropFilter: 'blur(2px)'
          }} 
          onClick={closeSidebar}
        />
      )}

      <nav className={`pos-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">POS</div>
        <ul className="sidebar-nav">
          <Link href="/command-center" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/command-center' ? 'active' : ''}`}><Home size={18} /> Command Center</li>
          </Link>
          <Link href="/workouts" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/workouts' ? 'active' : ''}`}><Activity size={18} /> Workouts</li>
          </Link>
          <Link href="/goals" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/goals' ? 'active' : ''}`}><Target size={18} /> Goals</li>
          </Link>
          <Link href="/build" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/build' ? 'active' : ''}`}><Terminal size={18} /> Build</li>
          </Link>
          <Link href="/learning" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/learning' ? 'active' : ''}`}><BookOpen size={18} /> Learning</li>
          </Link>
          <Link href="/journal" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/journal' ? 'active' : ''}`}><PenTool size={18} /> Journal</li>
          </Link>
          <Link href="/archive" style={{ textDecoration: 'none' }} onClick={closeSidebar}>
            <li className={`nav-item ${pathname === '/archive' ? 'active' : ''}`}><Archive size={18} /> Archive</li>
          </Link>
        </ul>
      </nav>
      <main className="pos-main-content">
        {children}
      </main>
    </div>
  );
}
