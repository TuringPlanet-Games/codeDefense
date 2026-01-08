# 🎮 CodeDefense

> 通过学习编程知识来赚取金币，在塔防游戏中击败 Bug！

## 📖 项目简介

CodeDefense 是一款将学习与游戏相结合的 Web 应用。玩家通过完成现实中的学习任务（观看 freeCodeCamp 视频、完成每日习惯）赚取 **CodeCoin**，然后在内置的塔防游戏中使用金币购买不同等级的 **Developer（防御塔）** 来抵御 **Bug（敌人）**。

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 状态管理 | Zustand |
| 路由 | React Router v7 |
| 游戏引擎 | Phaser.js |
| 手绘风格 | Rough.js |
| 图标 | Lucide React |
| 数据库 | Supabase |
| 构建工具 | Vite |

## 📁 项目结构

```
code-defense/
├── src/
│   ├── components/         # UI 组件
│   │   ├── common/         # 通用组件 (Layout, Button 等)
│   │   ├── game/           # 游戏相关组件
│   │   ├── tasks/          # 任务相关组件
│   │   └── learning/       # 学习相关组件
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx    # 首页
│   │   ├── TasksPage.tsx   # 任务页面
│   │   ├── LearningPage.tsx # 学习页面
│   │   └── GamePage.tsx    # 游戏页面
│   ├── stores/             # Zustand 状态管理
│   │   └── index.ts        # 游戏、任务、用户 Store
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # Developer, Bug, Task 等类型
│   ├── config/             # 配置文件
│   │   └── gameConfig.ts   # 游戏配置常量
│   ├── game/               # Phaser 游戏相关
│   │   ├── scenes/         # 游戏场景
│   │   └── entities/       # 游戏实体 (塔、敌人)
│   ├── hooks/              # 自定义 React Hooks
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 主应用入口
│   └── main.tsx            # React 入口
├── public/                 # 静态资源
└── package.json
```

## 🎯 核心功能模块

### 模块 A：任务与学习（赚取金币）
- **TaskScreen**: 显示每日习惯列表，完成任务获得 CodeCoin
- **LearningScreen**: 嵌入 YouTube 播放器，观看视频获得奖励
- 监听视频播放状态，视频结束时自动发放奖励

### 模块 B：经济系统
- 使用 Zustand 创建 `useGameStore` 管理状态
- 状态：`gold`, `ownedDevelopers`, `currentLevel`
- 动作：`buyDeveloper(type)` - 检查金币并购买开发者

### 模块 C：塔防战斗
- **Bug 等级**：Typo (低血量), NullPointer (中等), MemoryLeak (高血量/Boss)
- **对抗逻辑**：
  - Junior Dev → 只能攻击 Typo
  - Senior Dev → 攻击 Typo + NullPointer
  - Staff Engineer → AOE 伤害，攻击所有 Bug
  - CTO → 最强单体攻击

## 🚀 快速开始

```bash
# 安装依赖 (中国大陆使用镜像)
npm install --registry=https://registry.npmmirror.com

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📊 数据模型

### Developer（开发者/塔）
```typescript
interface Developer {
  id: string;
  type: 'Junior' | 'Senior' | 'Staff' | 'CTO';
  cost: number;
  damage: number;
  attackSpeed: number;
  range: number;
  targetBugType: BugType[];
}
```

### Bug（敌人）
```typescript
interface Bug {
  id: string;
  type: 'Typo' | 'NullPointer' | 'MemoryLeak';
  hp: number;
  speed: number;
  reward: number;
}
```

### Task（任务）
```typescript
interface Task {
  id: string;
  title: string;
  type: 'habit' | 'video';
  reward: number;
  isCompleted: boolean;
  videoUrl?: string;
}
```

## 🎨 视觉风格

采用 **手绘风格 (Rough.js)** 渲染游戏元素，给玩家带来独特的视觉体验。

## 📝 开发计划

- [x] 项目初始化与基础结构
- [x] 类型定义与状态管理
- [x] 基础 UI 组件与页面
- [ ] Phaser.js 游戏引擎集成
- [ ] Rough.js 手绘风格渲染
- [ ] Supabase 数据持久化
- [ ] YouTube 视频播放与奖励逻辑
- [ ] 完整的塔防战斗系统

## 📄 License

MIT
