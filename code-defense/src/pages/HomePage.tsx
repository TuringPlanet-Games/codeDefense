// ==========================================
// 首页
// ==========================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, BookOpen, CheckSquare, Trophy, TrendingUp } from 'lucide-react';
import { useGameStore, useTaskStore } from '../stores';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { gold, currentLevel, score } = useGameStore();
  const { tasks, totalEarned } = useTaskStore();

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="home-page">
      {/* 欢迎区域 */}
      <section className="welcome-section">
        <h1>欢迎来到 CodeDefense!</h1>
        <p>通过学习赚取金币，在塔防游戏中击败 Bug!</p>
      </section>

      {/* 统计卡片 */}
      <section className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{gold}</span>
            <span className="stat-label">CodeCoin</span>
          </div>
        </div>

        <div className="stat-card level">
          <Trophy size={24} />
          <div className="stat-info">
            <span className="stat-value">Lv.{currentLevel}</span>
            <span className="stat-label">当前关卡</span>
          </div>
        </div>

        <div className="stat-card score">
          <TrendingUp size={24} />
          <div className="stat-info">
            <span className="stat-value">{score}</span>
            <span className="stat-label">总分数</span>
          </div>
        </div>

        <div className="stat-card tasks">
          <CheckSquare size={24} />
          <div className="stat-info">
            <span className="stat-value">{completedTasks}/{totalTasks}</span>
            <span className="stat-label">今日任务</span>
          </div>
        </div>
      </section>

      {/* 快速入口 */}
      <section className="quick-actions">
        <h2>快速开始</h2>
        <div className="action-grid">
          <Link to="/game" className="action-card game">
            <Gamepad2 size={40} />
            <span>开始游戏</span>
            <p>使用你的开发者抵御 Bug 入侵</p>
          </Link>

          <Link to="/tasks" className="action-card tasks">
            <CheckSquare size={40} />
            <span>完成任务</span>
            <p>完成每日习惯赚取 CodeCoin</p>
          </Link>

          <Link to="/learn" className="action-card learn">
            <BookOpen size={40} />
            <span>观看学习</span>
            <p>观看 freeCodeCamp 视频获得奖励</p>
          </Link>
        </div>
      </section>

      {/* 今日收益 */}
      <section className="earnings-section">
        <h2>累计收益</h2>
        <div className="earnings-card">
          <span className="earnings-value">💰 {totalEarned}</span>
          <span className="earnings-label">通过学习和任务获得的 CodeCoin</span>
        </div>
      </section>
    </div>
  );
};
