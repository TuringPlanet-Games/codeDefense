// ==========================================
// 通用布局组件
// ==========================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, CheckSquare, Settings } from 'lucide-react';
import { useGameStore } from '../../stores';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const gold = useGameStore((state) => state.gold);

  return (
    <div className="layout">
      {/* 顶部导航栏 */}
      <header className="header">
        <div className="header-logo">
          <Gamepad2 size={28} />
          <span>CodeDefense</span>
        </div>
        <div className="header-stats">
          <div className="gold-display">
            <span className="gold-icon">💰</span>
            <span className="gold-amount">{gold}</span>
            <span className="gold-label">CodeCoin</span>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="main-content">{children}</main>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>首页</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={24} />
          <span>任务</span>
        </NavLink>
        <NavLink to="/game" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Gamepad2 size={24} />
          <span>游戏</span>
        </NavLink>
        <NavLink to="/learn" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={24} />
          <span>学习</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={24} />
          <span>设置</span>
        </NavLink>
      </nav>
    </div>
  );
};
