// ==========================================
// Bug 敌人实体类
// ==========================================

import type { Bug, BugType, PathPoint } from '../../types';
import { BUG_CONFIGS } from '../../types';

export class BugEntity {
  public id: string;
  public type: BugType;
  public name: string;
  public hp: number;
  public maxHp: number;
  public speed: number;
  public reward: number;
  public x: number;
  public y: number;
  public pathIndex: number;
  public isBoss: boolean;
  public armor: number;
  public isAlive: boolean;
  public slowFactor: number; // 减速因子
  public slowDuration: number; // 减速持续时间
  
  private path: PathPoint[];
  private targetX: number;
  private targetY: number;

  constructor(type: BugType, path: PathPoint[]) {
    const config = BUG_CONFIGS[type];
    
    this.id = `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.name = config.name;
    this.hp = config.hp;
    this.maxHp = config.maxHp;
    this.speed = config.speed;
    this.reward = config.reward;
    this.isBoss = config.isBoss;
    this.armor = config.armor;
    this.isAlive = true;
    this.slowFactor = 1;
    this.slowDuration = 0;
    
    this.path = path;
    this.pathIndex = 0;
    
    // 起始位置
    this.x = path[0].x;
    this.y = path[0].y;
    this.targetX = path[1]?.x ?? this.x;
    this.targetY = path[1]?.y ?? this.y;
  }

  // 受到伤害
  public takeDamage(damage: number): boolean {
    const actualDamage = Math.max(1, damage - this.armor);
    this.hp -= actualDamage;
    
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
      return true; // 已死亡
    }
    return false;
  }

  // 应用减速效果
  public applySlow(factor: number, duration: number): void {
    this.slowFactor = Math.min(this.slowFactor, factor);
    this.slowDuration = Math.max(this.slowDuration, duration);
  }

  // 更新位置
  public update(deltaTime: number): boolean {
    if (!this.isAlive) return false;
    
    // 更新减速状态
    if (this.slowDuration > 0) {
      this.slowDuration -= deltaTime;
      if (this.slowDuration <= 0) {
        this.slowFactor = 1;
      }
    }
    
    // 计算实际速度
    const actualSpeed = this.speed * this.slowFactor;
    
    // 移动向目标点
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < actualSpeed * deltaTime) {
      // 到达当前目标点
      this.x = this.targetX;
      this.y = this.targetY;
      this.pathIndex++;
      
      // 检查是否到达终点
      if (this.pathIndex >= this.path.length - 1) {
        return true; // 到达终点
      }
      
      // 设置下一个目标点
      this.targetX = this.path[this.pathIndex + 1].x;
      this.targetY = this.path[this.pathIndex + 1].y;
    } else {
      // 继续移动
      const moveX = (dx / distance) * actualSpeed * deltaTime;
      const moveY = (dy / distance) * actualSpeed * deltaTime;
      this.x += moveX;
      this.y += moveY;
    }
    
    return false;
  }

  // 获取当前状态
  public getState(): Bug {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      hp: this.hp,
      maxHp: this.maxHp,
      speed: this.speed,
      reward: this.reward,
      position: { x: this.x, y: this.y },
      pathIndex: this.pathIndex,
      isBoss: this.isBoss,
      armor: this.armor,
    };
  }
}
