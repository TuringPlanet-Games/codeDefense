// ==========================================
// 游戏引擎 - 赛博朋克塔防核心逻辑
// ==========================================

import rough from 'roughjs';
import { BugEntity, DeveloperEntity } from './entities';
import { 
  CYBER_COLORS,
  DEVELOPER_CONFIGS,
  type BugType, 
  type DeveloperType, 
  type PathPoint, 
  type PlacementSpot,
  type GameStatus,
} from '../types';
import { 
  GAME_CONFIG, 
  LEVEL_PATHS, 
  PLACEMENT_SPOTS, 
  LEVEL_CONFIGS,
} from '../config/gameConfig';
import {
  drawCyberGrid,
  drawNeonPath,
  drawDeveloper,
  drawBug,
  drawPlacementSpot,
  drawAttackEffect,
  drawDataCore,
  drawDataPort,
  drawCircuitLines,
} from '../utils/renderUtils';

export interface GameEngineCallbacks {
  onGoldChange: (gold: number) => void;
  onLivesChange: (lives: number) => void;
  onWaveChange: (wave: number) => void;
  onScoreChange: (score: number) => void;
  onStatusChange: (status: GameStatus) => void;
  onBugKilled: (reward: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rc: ReturnType<typeof rough.canvas>;
  
  // 游戏状态
  private gold: number;
  private lives: number;
  private score: number;
  private currentLevel: number;
  private currentWave: number;
  private status: GameStatus;
  
  // 游戏对象
  private bugs: BugEntity[];
  private developers: DeveloperEntity[];
  private placementSpots: PlacementSpot[];
  private path: PathPoint[];
  
  // 攻击特效
  private attackEffects: { 
    fromX: number; 
    fromY: number; 
    toX: number; 
    toY: number; 
    color: string;
    duration: number;
  }[];
  
  // 波次管理
  private waveConfig: typeof LEVEL_CONFIGS[0]['waves'][0] | null;
  private spawnQueue: { type: BugType; delay: number }[];
  private spawnTimer: number;
  private waveCompleted: boolean;
  
  // 交互状态
  private selectedDeveloperType: DeveloperType | null;
  private hoveredSpot: PlacementSpot | null;
  private selectedDeveloper: DeveloperEntity | null;
  
  // 动画
  private animationId: number | null;
  private lastTime: number;
  
  // 回调
  private callbacks: GameEngineCallbacks;

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.rc = rough.canvas(canvas);
    this.callbacks = callbacks;
    
    // 初始化状态
    this.gold = GAME_CONFIG.INITIAL_GOLD;
    this.lives = GAME_CONFIG.INITIAL_LIVES;
    this.score = 0;
    this.currentLevel = 1;
    this.currentWave = 0;
    this.status = 'idle';
    
    // 初始化对象
    this.bugs = [];
    this.developers = [];
    this.placementSpots = JSON.parse(JSON.stringify(PLACEMENT_SPOTS));
    this.path = LEVEL_PATHS[1];
    this.attackEffects = [];
    
    // 波次
    this.waveConfig = null;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.waveCompleted = false;
    
    // 交互
    this.selectedDeveloperType = null;
    this.hoveredSpot = null;
    this.selectedDeveloper = null;
    
    // 动画
    this.animationId = null;
    this.lastTime = 0;
    
    // 绑定事件
    this.bindEvents();
    
    // 初始渲染
    this.render();
  }

  // 绑定鼠标事件
  private bindEvents(): void {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
  }

  // 处理鼠标移动
  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查是否悬停在放置点上
    this.hoveredSpot = null;
    for (const spot of this.placementSpots) {
      if (!spot.isOccupied) {
        const distance = Math.sqrt(Math.pow(x - spot.x, 2) + Math.pow(y - spot.y, 2));
        if (distance < 30) {
          this.hoveredSpot = spot;
          break;
        }
      }
    }
    
    this.canvas.style.cursor = this.hoveredSpot && this.selectedDeveloperType ? 'pointer' : 'default';
  }

  // 处理点击
  private handleClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 如果选择了塔类型，尝试放置
    if (this.selectedDeveloperType && this.hoveredSpot) {
      this.placeDeveloper(this.selectedDeveloperType, this.hoveredSpot);
      return;
    }
    
    // 检查是否点击了已放置的塔
    for (const dev of this.developers) {
      const distance = Math.sqrt(Math.pow(x - dev.x, 2) + Math.pow(y - dev.y, 2));
      if (distance < 30) {
        this.selectedDeveloper = dev;
        return;
      }
    }
    
    this.selectedDeveloper = null;
  }

  // 放置开发者塔
  public placeDeveloper(type: DeveloperType, spot: PlacementSpot): boolean {
    const config = DEVELOPER_CONFIGS[type];
    
    if (this.gold < config.cost) {
      return false;
    }
    
    // 扣除金币
    this.gold -= config.cost;
    this.callbacks.onGoldChange(this.gold);
    
    // 创建开发者
    const developer = new DeveloperEntity(type, spot.x, spot.y);
    this.developers.push(developer);
    
    // 标记放置点已占用
    spot.isOccupied = true;
    spot.developerId = developer.id;
    
    // 清除选择
    this.selectedDeveloperType = null;
    
    return true;
  }

  // 出售开发者
  public sellDeveloper(developer: DeveloperEntity): void {
    const sellPrice = developer.getSellPrice();
    this.gold += sellPrice;
    this.callbacks.onGoldChange(this.gold);
    
    // 释放放置点
    const spot = this.placementSpots.find(s => s.developerId === developer.id);
    if (spot) {
      spot.isOccupied = false;
      spot.developerId = undefined;
    }
    
    // 移除开发者
    this.developers = this.developers.filter(d => d.id !== developer.id);
    this.selectedDeveloper = null;
  }

  // 升级开发者
  public upgradeDeveloper(developer: DeveloperEntity): boolean {
    const cost = developer.getUpgradeCost();
    if (this.gold < cost) return false;
    
    if (developer.upgrade()) {
      this.gold -= cost;
      this.callbacks.onGoldChange(this.gold);
      return true;
    }
    return false;
  }

  // 选择塔类型
  public selectDeveloperType(type: DeveloperType | null): void {
    this.selectedDeveloperType = type;
  }

  // 开始游戏
  public start(): void {
    if (this.status === 'playing') return;
    
    this.status = 'playing';
    this.callbacks.onStatusChange(this.status);
    
    if (this.currentWave === 0) {
      this.startNextWave();
    }
    
    this.lastTime = performance.now();
    this.gameLoop();
  }

  // 暂停游戏
  public pause(): void {
    this.status = 'paused';
    this.callbacks.onStatusChange(this.status);
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // 继续游戏
  public resume(): void {
    if (this.status !== 'paused') return;
    
    this.status = 'playing';
    this.callbacks.onStatusChange(this.status);
    this.lastTime = performance.now();
    this.gameLoop();
  }

  // 开始下一波
  private startNextWave(): void {
    const levelConfig = LEVEL_CONFIGS.find(l => l.id === this.currentLevel);
    if (!levelConfig) return;
    
    this.currentWave++;
    this.callbacks.onWaveChange(this.currentWave);
    
    const waveIndex = this.currentWave - 1;
    if (waveIndex >= levelConfig.waves.length) {
      // 关卡胜利
      this.status = 'victory';
      this.callbacks.onStatusChange(this.status);
      return;
    }
    
    this.waveConfig = levelConfig.waves[waveIndex];
    this.waveCompleted = false;
    
    // 准备生成队列
    this.spawnQueue = [];
    for (const bugConfig of this.waveConfig.bugs) {
      for (let i = 0; i < bugConfig.count; i++) {
        this.spawnQueue.push({
          type: bugConfig.type,
          delay: bugConfig.spawnInterval * i,
        });
      }
    }
    
    this.spawnTimer = 0;
  }

  // 游戏主循环
  private gameLoop(): void {
    if (this.status !== 'playing') return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // 转换为秒
    this.lastTime = currentTime;
    
    this.update(deltaTime, currentTime);
    this.render();
    
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  // 更新游戏逻辑
  private update(deltaTime: number, currentTime: number): void {
    // 生成敌人
    this.updateSpawning(deltaTime);
    
    // 更新敌人位置
    this.updateBugs(deltaTime);
    
    // 塔攻击
    this.updateDevelopers(currentTime);
    
    // 更新攻击特效
    this.updateAttackEffects(deltaTime);
    
    // 检查波次完成
    this.checkWaveComplete();
  }

  // 更新敌人生成
  private updateSpawning(deltaTime: number): void {
    if (this.spawnQueue.length === 0) return;
    
    this.spawnTimer += deltaTime * 1000;
    
    // 生成到期的敌人
    while (this.spawnQueue.length > 0 && this.spawnQueue[0].delay <= this.spawnTimer) {
      const spawn = this.spawnQueue.shift()!;
      const bug = new BugEntity(spawn.type, this.path);
      this.bugs.push(bug);
    }
  }

  // 更新敌人
  private updateBugs(deltaTime: number): void {
    for (const bug of this.bugs) {
      if (!bug.isAlive) continue;
      
      const reachedEnd = bug.update(deltaTime * 60); // 调整速度
      
      if (reachedEnd) {
        // 敌人到达终点，扣除生命
        this.lives--;
        this.callbacks.onLivesChange(this.lives);
        bug.isAlive = false;
        
        if (this.lives <= 0) {
          this.status = 'defeat';
          this.callbacks.onStatusChange(this.status);
        }
      }
    }
    
    // 清理死亡的敌人
    this.bugs = this.bugs.filter(b => b.isAlive);
  }

  // 更新开发者攻击
  private updateDevelopers(currentTime: number): void {
    for (const dev of this.developers) {
      const result = dev.attack(currentTime, this.bugs);
      
      if (result.target) {
        // 添加攻击特效
        const color = CYBER_COLORS.towerColors[dev.type];
        this.attackEffects.push({
          fromX: dev.x,
          fromY: dev.y,
          toX: result.target.x,
          toY: result.target.y,
          color,
          duration: 100,
        });
      }
      
      // 处理击杀
      for (const killed of result.killed) {
        this.gold += killed.reward;
        this.score += killed.reward * 10;
        this.callbacks.onGoldChange(this.gold);
        this.callbacks.onScoreChange(this.score);
        this.callbacks.onBugKilled(killed.reward);
      }
    }
  }

  // 更新攻击特效
  private updateAttackEffects(deltaTime: number): void {
    for (const effect of this.attackEffects) {
      effect.duration -= deltaTime * 1000;
    }
    this.attackEffects = this.attackEffects.filter(e => e.duration > 0);
  }

  // 检查波次完成
  private checkWaveComplete(): void {
    if (this.waveCompleted) return;
    if (this.spawnQueue.length > 0) return;
    if (this.bugs.length > 0) return;
    
    this.waveCompleted = true;
    
    // 延迟开始下一波
    setTimeout(() => {
      if (this.status === 'playing') {
        this.startNextWave();
      }
    }, 3000);
  }

  // 渲染游戏画面
  private render(): void {
    const { width, height } = this.canvas;
    
    // 清除画布
    this.ctx.clearRect(0, 0, width, height);
    
    // 绘制背景
    drawCyberGrid(this.ctx, width, height, GAME_CONFIG.GRID_SIZE);
    
    // 绘制电路装饰
    drawCircuitLines(this.ctx, width, height);
    
    // 绘制路径
    drawNeonPath(this.ctx, this.path);
    
    // 绘制起点和终点
    drawDataCore(this.rc, this.ctx, this.path[0].x, this.path[0].y);
    drawDataPort(this.rc, this.ctx, this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
    
    // 绘制放置点
    for (const spot of this.placementSpots) {
      drawPlacementSpot(
        this.rc,
        this.ctx,
        spot.x,
        spot.y,
        spot.isOccupied,
        this.hoveredSpot === spot
      );
    }
    
    // 绘制开发者
    for (const dev of this.developers) {
      drawDeveloper(
        this.rc,
        this.ctx,
        dev.x,
        dev.y,
        dev.type,
        this.selectedDeveloper?.id === dev.id
      );
    }
    
    // 绘制敌人
    for (const bug of this.bugs) {
      if (bug.isAlive) {
        drawBug(this.rc, this.ctx, bug.x, bug.y, bug.type, bug.hp, bug.maxHp);
      }
    }
    
    // 绘制攻击特效
    for (const effect of this.attackEffects) {
      drawAttackEffect(this.ctx, effect.fromX, effect.fromY, effect.toX, effect.toY, effect.color);
    }
  }

  // 重置游戏
  public reset(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.gold = GAME_CONFIG.INITIAL_GOLD;
    this.lives = GAME_CONFIG.INITIAL_LIVES;
    this.score = 0;
    this.currentWave = 0;
    this.status = 'idle';
    
    this.bugs = [];
    this.developers = [];
    this.placementSpots = JSON.parse(JSON.stringify(PLACEMENT_SPOTS));
    this.attackEffects = [];
    this.spawnQueue = [];
    this.waveConfig = null;
    this.selectedDeveloperType = null;
    this.selectedDeveloper = null;
    
    this.callbacks.onGoldChange(this.gold);
    this.callbacks.onLivesChange(this.lives);
    this.callbacks.onScoreChange(this.score);
    this.callbacks.onWaveChange(this.currentWave);
    this.callbacks.onStatusChange(this.status);
    
    this.render();
  }

  // 获取当前状态
  public getState() {
    return {
      gold: this.gold,
      lives: this.lives,
      score: this.score,
      currentLevel: this.currentLevel,
      currentWave: this.currentWave,
      status: this.status,
      developers: this.developers.map(d => d.getState()),
      bugs: this.bugs.map(b => b.getState()),
      selectedDeveloper: this.selectedDeveloper?.getState() || null,
    };
  }

  // 销毁游戏引擎
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
