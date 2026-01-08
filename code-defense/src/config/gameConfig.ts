// ==========================================
// 游戏配置常量 - 赛博朋克科技风格
// ==========================================

import { type PathPoint, type PlacementSpot } from '../types';

export const GAME_CONFIG = {
  // 画布尺寸
  CANVAS_WIDTH: 960,
  CANVAS_HEIGHT: 640,

  // 网格配置
  GRID_SIZE: 40,
  GRID_COLS: 24,
  GRID_ROWS: 16,

  // 游戏速度
  GAME_SPEED: 1,

  // 初始值
  INITIAL_GOLD: 500,
  INITIAL_LIVES: 20,
};

// 路径配置 - 匹配设计图的路径
export const LEVEL_PATHS: Record<number, PathPoint[]> = {
  1: [
    { x: 40, y: 520 },   // Data Core 起点
    { x: 40, y: 200 },   // 向上
    { x: 200, y: 200 },  // 向右
    { x: 200, y: 120 },  // 向上
    { x: 480, y: 120 },  // 向右
    { x: 480, y: 400 },  // 向下
    { x: 640, y: 400 },  // 向右
    { x: 640, y: 520 },  // 向下
    { x: 920, y: 520 },  // Data Port 终点
  ],
};

// 放置点配置 - 可以放置塔的位置
export const PLACEMENT_SPOTS: PlacementSpot[] = [
  // 左侧区域
  { x: 120, y: 280, isOccupied: false },
  { x: 120, y: 360, isOccupied: false },
  { x: 120, y: 440, isOccupied: false },
  
  // 上方区域
  { x: 280, y: 200, isOccupied: false },
  { x: 360, y: 200, isOccupied: false },
  { x: 400, y: 40, isOccupied: false },
  
  // 中间区域
  { x: 320, y: 320, isOccupied: false },
  { x: 400, y: 320, isOccupied: false },
  { x: 560, y: 280, isOccupied: false },
  { x: 560, y: 360, isOccupied: false },
  
  // 右侧区域
  { x: 720, y: 320, isOccupied: false },
  { x: 720, y: 440, isOccupied: false },
  { x: 800, y: 440, isOccupied: false },
  
  // 底部区域
  { x: 280, y: 520, isOccupied: false },
  { x: 480, y: 520, isOccupied: false },
];

// 关卡配置 - 赛博朋克主题
export const LEVEL_CONFIGS = [
  {
    id: 1,
    name: 'Data Center Alpha',
    initialGold: 500,
    initialLives: 20,
    waves: [
      {
        waveNumber: 1,
        delayBeforeWave: 3000,
        bugs: [
          { type: 'Typo' as const, count: 8, spawnInterval: 1000 },
        ],
      },
      {
        waveNumber: 2,
        delayBeforeWave: 5000,
        bugs: [
          { type: 'Typo' as const, count: 10, spawnInterval: 800 },
          { type: 'NullPointerException' as const, count: 3, spawnInterval: 2000 },
        ],
      },
      {
        waveNumber: 3,
        delayBeforeWave: 5000,
        bugs: [
          { type: 'Typo' as const, count: 5, spawnInterval: 600 },
          { type: 'NullPointerException' as const, count: 5, spawnInterval: 1500 },
          { type: 'MemoryLeak' as const, count: 2, spawnInterval: 3000 },
        ],
      },
      {
        waveNumber: 4,
        delayBeforeWave: 5000,
        bugs: [
          { type: 'NullPointerException' as const, count: 8, spawnInterval: 1000 },
          { type: 'MemoryLeak' as const, count: 4, spawnInterval: 2000 },
          { type: 'SystemCrash' as const, count: 1, spawnInterval: 8000 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Firewall Breach',
    initialGold: 600,
    initialLives: 15,
    waves: [
      {
        waveNumber: 1,
        delayBeforeWave: 3000,
        bugs: [
          { type: 'Typo' as const, count: 15, spawnInterval: 600 },
          { type: 'NullPointerException' as const, count: 5, spawnInterval: 1500 },
        ],
      },
      {
        waveNumber: 2,
        delayBeforeWave: 5000,
        bugs: [
          { type: 'NullPointerException' as const, count: 10, spawnInterval: 1000 },
          { type: 'MemoryLeak' as const, count: 5, spawnInterval: 2000 },
        ],
      },
      {
        waveNumber: 3,
        delayBeforeWave: 5000,
        bugs: [
          { type: 'MemoryLeak' as const, count: 8, spawnInterval: 1500 },
          { type: 'SystemCrash' as const, count: 2, spawnInterval: 6000 },
        ],
      },
    ],
  },
];

// Rough.js 手绘风格配置
export const ROUGH_OPTIONS = {
  // 基础样式
  default: {
    roughness: 1.2,
    bowing: 1,
    strokeWidth: 2,
  },
  // 霓虹效果
  neon: {
    roughness: 0.5,
    bowing: 0.5,
    strokeWidth: 3,
  },
  // 电路板线条
  circuit: {
    roughness: 0,
    bowing: 0,
    strokeWidth: 2,
  },
  // 手绘风格
  sketchy: {
    roughness: 2,
    bowing: 2,
    strokeWidth: 1.5,
  },
};
