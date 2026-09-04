import React from 'react';
import * as Icons from 'lucide-react';
import { adminNavigation } from '../types/navigation';

type Props = { path: string; onNavigate: (path: string) => void; dark: boolean; onToggleDark: () => void; children: React.ReactNode };

function iconFor(name: string) {
  const key = name.split('-').map((part, index) => index ? part[0].toUpperCase() + part.slice(1) : part).join('');
  return (Icons as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[key] ?? Icons.Circle;
}

export function AdminShell({ path, onNavigate, dark, onToggleDark, children }: Props) {
  return <div className={dark ? 'shell dark' : 'shell'}>
    <aside className="sidebar">
      <div className="sidebar-brand"><div className="brand-mark">X</div><div><strong>XBoard</strong><span>Admin</span></div></div>
      <nav className="sidebar-nav">
        {adminNavigation.map(item => {
          const Icon = iconFor(item.icon);
          const active = item.path === '/' ? path === '/' : path.startsWith(item.path);
          return <button key={item.key} className={active ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(item.path)}>
            <Icon size={17} strokeWidth={1.9}/><span>{item.label}</span>
          </button>;
        })}
      </nav>
    </aside>
    <div className="shell-main">
      <header className="topbar">
        <div className="top-search"><Icons.Search size={16}/><span>搜索菜单和功能...</span><kbd>⌘K</kbd></div>
        <div className="top-actions">
          <button className="icon-btn" aria-label="切换深色模式" onClick={onToggleDark}><Icons.Moon size={18}/></button>
          <button className="lang-btn">🇨🇳 <span>CN</span><Icons.ChevronDown size={14}/></button>
          <button className="avatar-btn" aria-label="用户菜单">A</button>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>
  </div>;
}
