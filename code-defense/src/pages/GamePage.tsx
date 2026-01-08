// ==========================================
// 游戏页面 - 赛博朋克塔防游戏
// ==========================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ShoppingCart, Zap, Heart, Coins, Target, ChevronUp, Trash2 } from 'lucide-react';
import { GameEngine } from '../game/GameEngine';
import { type DeveloperType, DEVELOPER_CONFIGS, CYBER_COLORS, type GameStatus } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';
import './GamePage.css';

export const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  
  // 游戏状态
  const [gold, setGold] = useState(GAME_CONFIG.INITIAL_GOLD);
  const [lives, setLives] = useState(GAME_CONFIG.INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [currentWave, setCurrentWave] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [selectedTowerType, setSelectedTowerType] = useState<DeveloperType | null>(null);
  const [killFeed, setKillFeed] = useState<{ id: number; reward: number }[]>([]);
  
  // 开发者配置列表
  const developersList = Object.entries(DEVELOPER_CONFIGS) as [DeveloperType, typeof DEVELOPER_CONFIGS[DeveloperType]][];

  // 添加击杀提示
  const addKillFeed = useCallback((reward: number) => {
    const id = Date.now();
    setKillFeed(prev => [...prev.slice(-4), { id, reward }]);
    setTimeout(() => {
      setKillFeed(prev => prev.filter(k => k.id !== id));
    }, 2000);
  }, []);

  // 初始化游戏引擎
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onGoldChange: setGold,
      onLivesChange: setLives,
      onScoreChange: setScore,
      onWaveChange: setCurrentWave,
      onStatusChange: setStatus,
      onBugKilled: addKillFeed,
    });

    gameEngineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, [addKillFeed]);

  // 选择塔类型
  const handleSelectTower = (type: DeveloperType) => {
    const config = DEVELOPER_CONFIGS[type];
    if (gold >= config.cost) {
      setSelectedTowerType(type);
      gameEngineRef.current?.selectDeveloperType(type);
    }
  };

  // 开始/暂停游戏
  const handleTogglePlay = () => {
    if (!gameEngineRef.current) return;
    
    if (status === 'playing') {
      gameEngineRef.current.pause();
    } else if (status === 'paused') {
      gameEngineRef.current.resume();
    } else {
      gameEngineRef.current.start();
    }
  };

  // 重置游戏
  const handleReset = () => {
    gameEngineRef.current?.reset();
    setSelectedTowerType(null);
  };

  return (
    <div className="game-page cyber-theme">
      {/* 游戏信息栏 */}
      <div className="game-info-bar">
        <div className="info-item gold">
          <Coins size={20} />
          <span className="info-label">CodeCoin</span>
          <span className="info-value">{gold}</span>
        </div>
        <div className="info-item lives">
          <Heart size={20} />
          <span className="info-label">Life</span>
          <span className="info-value">{lives}</span>
        </div>
        <div className="info-item wave">
          <Zap size={20} />
          <span className="info-label">Wave</span>
          <span className="info-value">{currentWave}</span>
        </div>
        <div className="info-item score">
          <Target size={20} />
          <span className="info-label">Score</span>
          <span className="info-value">{score}</span>
        </div>
      </div>

      {/* 游戏画布区域 */}
      <div className="game-canvas-container">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          className="game-canvas"
        />
        
        {/* 击杀提示 */}
        <div className="kill-feed">
          {killFeed.map(k => (
            <div key={k.id} className="kill-item">
              +{k.reward} 💰
            </div>
          ))}
        </div>

        {/* 放置提示 */}
        {selectedTowerType && (
          <div className="placement-hint">
            <span>正在放置: {DEVELOPER_CONFIGS[selectedTowerType].name}</span>
            <button onClick={() => {
              setSelectedTowerType(null);
              gameEngineRef.current?.selectDeveloperType(null);
            }}>
              取消
            </button>
          </div>
        )}

        {/* 游戏状态覆盖层 */}
        {(status === 'victory' || status === 'defeat') && (
          <div className={`game-overlay ${status}`}>
            <h2>{status === 'victory' ? '🎉 胜利!' : '💀 失败'}</h2>
            <p>得分: {score}</p>
            <button onClick={handleReset}>重新开始</button>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="game-controls">
        <button
          className={`control-btn play ${status === 'playing' ? 'active' : ''}`}
          onClick={handleTogglePlay}
        >
          {status === 'playing' ? <Pause size={20} /> : <Play size={20} />}
          {status === 'playing' ? '暂停' : status === 'paused' ? '继续' : '开始'}
        </button>
        <button className="control-btn reset" onClick={handleReset}>
          <RotateCcw size={20} />
          重置
        </button>
      </div>

      {/* 商店面板 */}
      <div className="shop-panel">
        <h3>
          <ShoppingCart size={18} />
          招募开发者
        </h3>
        <div className="developer-grid">
          {developersList.map(([type, config]) => {
            const canAfford = gold >= config.cost;
            const isSelected = selectedTowerType === type;
            
            return (
              <div
                key={type}
                className={`developer-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
                onClick={() => canAfford && handleSelectTower(type)}
                style={{ 
                  '--tower-color': CYBER_COLORS.towerColors[type] 
                } as React.CSSProperties}
              >
                <div className="dev-header">
                  <span className="dev-icon">
                    {type === 'JuniorDev' && '👨‍💻'}
                    {type === 'SeniorArchitect' && '🖥️'}
                    {type === 'UIDesigner' && '🎨'}
                    {type === 'DataEngineer' && '📊'}
                    {type === 'SecurityExpert' && '🛡️'}
                  </span>
                  <span className="dev-name">{config.name}</span>
                </div>
                <div className="dev-cost">
                  <Coins size={14} />
                  {config.cost}
                </div>
                <div className="dev-stats">
                  <span title="伤害">⚔️ {config.damage}</span>
                  <span title="范围">📡 {config.range}</span>
                  {config.isAOE && <span title="范围攻击">💥 AOE</span>}
                </div>
                <div className="dev-ability">
                  {config.specialAbility}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bug 图鉴 */}
      <div className="bug-guide">
        <h4>Bug 图鉴</h4>
        <div className="bug-list">
          <div className="bug-item">
            <span className="bug-icon">🐛</span>
            <span>Typo</span>
          </div>
          <div className="bug-item">
            <span className="bug-icon">👻</span>
            <span>NullPointer</span>
          </div>
          <div className="bug-item">
            <span className="bug-icon">🦠</span>
            <span>MemoryLeak</span>
          </div>
          <div className="bug-item boss">
            <span className="bug-icon">🤖</span>
            <span>SystemCrash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
