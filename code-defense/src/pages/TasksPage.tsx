// ==========================================
// 任务页面 - 每日习惯
// ==========================================

import React from 'react';
import { Check, Plus, RotateCcw, Coins } from 'lucide-react';
import { useTaskStore } from '../stores';
import './TasksPage.css';

export const TasksPage: React.FC = () => {
  const { tasks, completeTask, resetDailyTasks } = useTaskStore();

  const habitTasks = tasks.filter((t) => t.type === 'habit');
  const completedCount = habitTasks.filter((t) => t.isCompleted).length;

  return (
    <div className="tasks-page">
      {/* 页面标题 */}
      <header className="page-header">
        <div className="header-content">
          <h1>每日任务</h1>
          <p>完成任务获得 CodeCoin 奖励</p>
        </div>
        <button className="reset-btn" onClick={resetDailyTasks}>
          <RotateCcw size={18} />
          重置
        </button>
      </header>

      {/* 进度条 */}
      <div className="progress-section">
        <div className="progress-info">
          <span>今日进度</span>
          <span>{completedCount}/{habitTasks.length}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(completedCount / habitTasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 任务列表 */}
      <div className="task-list">
        {habitTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.isCompleted ? 'completed' : ''}`}
            onClick={() => !task.isCompleted && completeTask(task.id)}
          >
            <div className="task-checkbox">
              {task.isCompleted ? (
                <Check size={20} className="check-icon" />
              ) : (
                <div className="empty-checkbox" />
              )}
            </div>
            <div className="task-content">
              <span className="task-title">{task.title}</span>
              {task.description && (
                <span className="task-desc">{task.description}</span>
              )}
            </div>
            <div className="task-reward">
              <Coins size={16} />
              <span>+{task.reward}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 添加任务按钮 (预留) */}
      <button className="add-task-btn">
        <Plus size={24} />
        添加自定义任务
      </button>
    </div>
  );
};
