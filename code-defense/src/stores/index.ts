// ==========================================
// CodeDefense - 游戏状态管理 (Zustand)
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Developer,
  DeveloperType,
  Task,
  GameStatus,
} from '../types';
import { DEVELOPER_CONFIGS } from '../types';

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// ==========================================
// 游戏核心状态 Store
// ==========================================
interface GameStore {
  // 状态
  gold: number;
  lives: number;
  currentLevel: number;
  currentWave: number;
  status: GameStatus;
  score: number;
  ownedDevelopers: Developer[];

  // 动作
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  buyDeveloper: (type: DeveloperType, position: { x: number; y: number }) => boolean;
  sellDeveloper: (developerId: string) => void;
  takeDamage: (amount: number) => void;
  addScore: (points: number) => void;
  setStatus: (status: GameStatus) => void;
  nextWave: () => void;
  nextLevel: () => void;
  resetGame: () => void;
}

const INITIAL_GAME_STATE = {
  gold: 100,
  lives: 20,
  currentLevel: 1,
  currentWave: 0,
  status: 'idle' as GameStatus,
  score: 0,
  ownedDevelopers: [] as Developer[],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_GAME_STATE,

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      spendGold: (amount) => {
        const { gold } = get();
        if (gold >= amount) {
          set({ gold: gold - amount });
          return true;
        }
        return false;
      },

      buyDeveloper: (type, position) => {
        const config = DEVELOPER_CONFIGS[type];
        const { gold, ownedDevelopers } = get();

        if (gold >= config.cost) {
          const newDeveloper: Developer = {
            id: generateId(),
            ...config,
            position,
          };
          set({
            gold: gold - config.cost,
            ownedDevelopers: [...ownedDevelopers, newDeveloper],
          });
          return true;
        }
        return false;
      },

      sellDeveloper: (developerId) => {
        const { ownedDevelopers } = get();
        const developer = ownedDevelopers.find((d) => d.id === developerId);
        if (developer) {
          const sellPrice = Math.floor(developer.cost * 0.7); // 70% 回收价
          set({
            gold: get().gold + sellPrice,
            ownedDevelopers: ownedDevelopers.filter((d) => d.id !== developerId),
          });
        }
      },

      takeDamage: (amount) => {
        set((state) => {
          const newLives = state.lives - amount;
          return {
            lives: newLives,
            status: newLives <= 0 ? 'defeat' : state.status,
          };
        });
      },

      addScore: (points) => set((state) => ({ score: state.score + points })),

      setStatus: (status) => set({ status }),

      nextWave: () => set((state) => ({ currentWave: state.currentWave + 1 })),

      nextLevel: () =>
        set((state) => ({
          currentLevel: state.currentLevel + 1,
          currentWave: 0,
        })),

      resetGame: () => set(INITIAL_GAME_STATE),
    }),
    {
      name: 'code-defense-game',
      partialize: (state) => ({
        gold: state.gold,
        currentLevel: state.currentLevel,
        score: state.score,
      }),
    }
  )
);

// ==========================================
// 任务状态 Store
// ==========================================
interface TaskStore {
  tasks: Task[];
  totalEarned: number;

  // 动作
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>) => void;
  completeTask: (taskId: string) => void;
  resetDailyTasks: () => void;
  removeTask: (taskId: string) => void;
}

// 默认每日习惯任务
const DEFAULT_HABITS: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>[] = [
  { title: '完成晨间冥想', type: 'habit', reward: 20 },
  { title: '阅读技术文章 30 分钟', type: 'habit', reward: 30 },
  { title: '完成 LeetCode 一题', type: 'habit', reward: 50 },
  { title: '写代码 1 小时', type: 'habit', reward: 40 },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: DEFAULT_HABITS.map((habit) => ({
        ...habit,
        id: generateId(),
        isCompleted: false,
        createdAt: new Date(),
      })),
      totalEarned: 0,

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: generateId(),
              isCompleted: false,
              createdAt: new Date(),
            },
          ],
        })),

      completeTask: (taskId) => {
        const { tasks } = get();
        const task = tasks.find((t) => t.id === taskId);
        if (task && !task.isCompleted) {
          // 完成任务，获得奖励
          useGameStore.getState().addGold(task.reward);
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId
                ? { ...t, isCompleted: true, completedAt: new Date() }
                : t
            ),
            totalEarned: state.totalEarned + task.reward,
          }));
        }
      },

      resetDailyTasks: () =>
        set({
          tasks: DEFAULT_HABITS.map((habit) => ({
            ...habit,
            id: generateId(),
            isCompleted: false,
            createdAt: new Date(),
          })),
        }),

      removeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),
    }),
    {
      name: 'code-defense-tasks',
    }
  )
);

// ==========================================
// 用户状态 Store
// ==========================================
interface UserStore {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;

  // 动作
  login: (userId: string, username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      username: null,

      login: (userId, username) =>
        set({ isAuthenticated: true, userId, username }),

      logout: () =>
        set({ isAuthenticated: false, userId: null, username: null }),
    }),
    {
      name: 'code-defense-user',
    }
  )
);
