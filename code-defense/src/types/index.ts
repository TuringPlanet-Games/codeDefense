// ==========================================
// CodeDefense - 类型定义 (赛博朋克科技风格)
// ==========================================

// 开发者（塔）类型 - 匹配设计图
export type DeveloperType = 
  | 'JuniorDev'      // Junior Developer - 戴VR眼镜
  | 'SeniorArchitect' // Senior Architect - 多屏幕监控
  | 'UIDesigner'      // UI Designer - 调色板
  | 'DataEngineer'    // Data Engineer - 数据处理
  | 'SecurityExpert'; // Security Expert - 防火墙

export interface Developer {
  id: string;
  type: DeveloperType;
  name: string;
  description: string;
  cost: number;
  damage: number;
  attackSpeed: number; // 攻击间隔 (毫秒)
  range: number; // 攻击范围
  targetBugType: BugType[]; // 只能攻击特定的 Bug 级别
  position?: { x: number; y: number };
  level: number; // 升级等级
  isAOE: boolean; // 是否范围攻击
  specialAbility?: string; // 特殊技能
}

// Bug（敌人）类型 - 匹配设计图
export type BugType = 
  | 'Typo'                // 小虫子 - 低血量
  | 'NullPointerException' // 幽灵 - 中等
  | 'MemoryLeak'           // 绿色粘液怪 - 高血量
  | 'SystemCrash';         // 大型机器人 Boss

export interface Bug {
  id: string;
  type: BugType;
  name: string;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number; // 击杀奖励
  position: { x: number; y: number };
  pathIndex: number; // 当前路径点索引
  isBoss: boolean;
  armor: number; // 护甲值
}

// 任务类型
export type TaskType = 'habit' | 'video';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  reward: number;
  isCompleted: boolean;
  videoUrl?: string;
  videoDuration?: number; // 视频时长（秒）
  createdAt: Date;
  completedAt?: Date;
}

// 游戏状态
export type GameStatus = 'idle' | 'playing' | 'paused' | 'victory' | 'defeat';

export interface GameState {
  gold: number;
  lives: number;
  currentLevel: number;
  currentWave: number;
  status: GameStatus;
  score: number;
}

// 关卡配置
export interface LevelConfig {
  id: number;
  name: string;
  waves: WaveConfig[];
  initialGold: number;
  initialLives: number;
}

export interface WaveConfig {
  waveNumber: number;
  bugs: {
    type: BugType;
    count: number;
    spawnInterval: number; // 生成间隔 (毫秒)
  }[];
  delayBeforeWave: number; // 波次开始前延迟
}

// 用户数据
export interface UserProfile {
  id: string;
  username: string;
  totalGold: number;
  totalTasksCompleted: number;
  highestLevel: number;
  createdAt: Date;
}

// 路径点
export interface PathPoint {
  x: number;
  y: number;
}

// 放置点 - 可以放置塔的位置
export interface PlacementSpot {
  x: number;
  y: number;
  isOccupied: boolean;
  developerId?: string;
}

// 开发者配置预设 - 赛博朋克风格
export const DEVELOPER_CONFIGS: Record<DeveloperType, Omit<Developer, 'id' | 'position'>> = {
  JuniorDev: {
    type: 'JuniorDev',
    name: 'Junior Developer',
    description: '戴VR眼镜的初级开发者，快速修复小Bug',
    cost: 100,
    damage: 15,
    attackSpeed: 800,
    range: 120,
    targetBugType: ['Typo'],
    level: 1,
    isAOE: false,
    specialAbility: 'Debug Scan',
  },
  SeniorArchitect: {
    type: 'SeniorArchitect',
    name: 'Senior Architect',
    description: '多屏监控的资深架构师，可处理复杂异常',
    cost: 250,
    damage: 35,
    attackSpeed: 1000,
    range: 180,
    targetBugType: ['Typo', 'NullPointerException', 'MemoryLeak'],
    level: 1,
    isAOE: false,
    specialAbility: 'Code Review',
  },
  UIDesigner: {
    type: 'UIDesigner',
    name: 'UI Designer',
    description: '用美学力量减速敌人',
    cost: 150,
    damage: 10,
    attackSpeed: 1200,
    range: 150,
    targetBugType: ['Typo', 'NullPointerException'],
    level: 1,
    isAOE: true,
    specialAbility: 'Pixel Perfect (减速)',
  },
  DataEngineer: {
    type: 'DataEngineer',
    name: 'Data Engineer',
    description: '数据流攻击，持续伤害',
    cost: 300,
    damage: 25,
    attackSpeed: 500,
    range: 140,
    targetBugType: ['Typo', 'NullPointerException', 'MemoryLeak'],
    level: 1,
    isAOE: false,
    specialAbility: 'Data Stream (持续伤害)',
  },
  SecurityExpert: {
    type: 'SecurityExpert',
    name: 'Security Expert',
    description: '防火墙专家，对Boss造成额外伤害',
    cost: 500,
    damage: 80,
    attackSpeed: 1500,
    range: 200,
    targetBugType: ['Typo', 'NullPointerException', 'MemoryLeak', 'SystemCrash'],
    level: 1,
    isAOE: false,
    specialAbility: 'Firewall (Boss克制)',
  },
};

// Bug 配置预设 - 赛博朋克风格
export const BUG_CONFIGS: Record<BugType, Omit<Bug, 'id' | 'position' | 'pathIndex'>> = {
  Typo: {
    type: 'Typo',
    name: '小虫子',
    hp: 50,
    maxHp: 50,
    speed: 2.5,
    reward: 15,
    isBoss: false,
    armor: 0,
  },
  NullPointerException: {
    type: 'NullPointerException',
    name: '空指针幽灵',
    hp: 120,
    maxHp: 120,
    speed: 2,
    reward: 30,
    isBoss: false,
    armor: 5,
  },
  MemoryLeak: {
    type: 'MemoryLeak',
    name: '内存泄漏怪',
    hp: 300,
    maxHp: 300,
    speed: 1.2,
    reward: 60,
    isBoss: false,
    armor: 10,
  },
  SystemCrash: {
    type: 'SystemCrash',
    name: '系统崩溃机器人',
    hp: 1000,
    maxHp: 1000,
    speed: 0.8,
    reward: 200,
    isBoss: true,
    armor: 25,
  },
};

// 赛博朋克配色方案
export const CYBER_COLORS = {
  // 霓虹色
  neonPink: '#ff00ff',
  neonBlue: '#00ffff',
  neonGreen: '#00ff00',
  neonYellow: '#ffff00',
  neonOrange: '#ff8800',
  neonPurple: '#8800ff',
  
  // 背景色
  darkBg: '#0a0a1a',
  gridColor: '#1a1a3a',
  
  // 路径渐变色
  pathGradient: ['#ff00ff', '#ff0088', '#ff8800', '#ffff00', '#00ffff'],
  
  // UI 颜色
  uiPrimary: '#00ffff',
  uiSecondary: '#ff00ff',
  uiWarning: '#ffff00',
  uiDanger: '#ff0000',
  uiSuccess: '#00ff00',
  
  // 塔颜色
  towerColors: {
    JuniorDev: '#00ffff',
    SeniorArchitect: '#ff8800',
    UIDesigner: '#ff00ff',
    DataEngineer: '#00ff00',
    SecurityExpert: '#ff0000',
  },
  
  // Bug 颜色
  bugColors: {
    Typo: '#ff6600',
    NullPointerException: '#ffffff',
    MemoryLeak: '#00ff00',
    SystemCrash: '#ff0000',
  },
};
