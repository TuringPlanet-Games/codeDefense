// ==========================================
// Developer 塔实体类
// ==========================================

import { DEVELOPER_CONFIGS } from '../../types';
import type {Developer,  BugType, DeveloperType } from '../../types';
import { BugEntity } from './BugEntity';

export class DeveloperEntity {
  public id: string;
  public type: DeveloperType;
  public name: string;
  public description: string;
  public cost: number;
  public damage: number;
  public attackSpeed: number;
  public range: number;
  public targetBugType: BugType[];
  public x: number;
  public y: number;
  public level: number;
  public isAOE: boolean;
  public specialAbility?: string;
  
  private lastAttackTime: number;
  private currentTarget: BugEntity | null;

  constructor(type: DeveloperType, x: number, y: number) {
    const config = DEVELOPER_CONFIGS[type];
    
    this.id = `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.name = config.name;
    this.description = config.description;
    this.cost = config.cost;
    this.damage = config.damage;
    this.attackSpeed = config.attackSpeed;
    this.range = config.range;
    this.targetBugType = config.targetBugType;
    this.level = config.level;
    this.isAOE = config.isAOE;
    this.specialAbility = config.specialAbility;
    
    this.x = x;
    this.y = y;
    this.lastAttackTime = 0;
    this.currentTarget = null;
  }

  // 检查是否可以攻击目标
  public canAttack(bug: BugEntity): boolean {
    // 检查 Bug 类型是否在攻击范围内
    if (!this.targetBugType.includes(bug.type)) {
      return false;
    }
    
    // 检查距离
    const distance = this.getDistanceTo(bug);
    return distance <= this.range;
  }

  // 获取到目标的距离
  public getDistanceTo(bug: BugEntity): number {
    const dx = bug.x - this.x;
    const dy = bug.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 寻找最佳目标 (优先攻击最靠近终点的)
  public findTarget(bugs: BugEntity[]): BugEntity | null {
    let bestTarget: BugEntity | null = null;
    let highestPathIndex = -1;
    
    for (const bug of bugs) {
      if (!bug.isAlive) continue;
      if (!this.canAttack(bug)) continue;
      
      if (bug.pathIndex > highestPathIndex) {
        highestPathIndex = bug.pathIndex;
        bestTarget = bug;
      }
    }
    
    return bestTarget;
  }

  // 执行攻击
  public attack(currentTime: number, bugs: BugEntity[]): { 
    target: BugEntity | null; 
    killed: BugEntity[];
    damage: number;
  } {
    const result = { target: null as BugEntity | null, killed: [] as BugEntity[], damage: 0 };
    
    // 检查攻击冷却
    if (currentTime - this.lastAttackTime < this.attackSpeed) {
      return result;
    }
    
    // 寻找目标
    const target = this.findTarget(bugs);
    if (!target) {
      this.currentTarget = null;
      return result;
    }
    
    this.currentTarget = target;
    this.lastAttackTime = currentTime;
    
    // AOE 攻击
    if (this.isAOE) {
      const aoeRadius = 80;
      for (const bug of bugs) {
        if (!bug.isAlive) continue;
        
        const distance = Math.sqrt(
          Math.pow(bug.x - target.x, 2) + Math.pow(bug.y - target.y, 2)
        );
        
        if (distance <= aoeRadius) {
          const killed = bug.takeDamage(this.damage);
          result.damage += this.damage;
          if (killed) {
            result.killed.push(bug);
          }
          
          // UI Designer 特殊能力：减速
          if (this.type === 'UIDesigner') {
            bug.applySlow(0.5, 2000);
          }
        }
      }
    } else {
      // 单体攻击
      let actualDamage = this.damage;
      
      // Security Expert 特殊能力：对 Boss 额外伤害
      if (this.type === 'SecurityExpert' && target.isBoss) {
        actualDamage *= 2;
      }
      
      const killed = target.takeDamage(actualDamage);
      result.target = target;
      result.damage = actualDamage;
      
      if (killed) {
        result.killed.push(target);
      }
      
      // Data Engineer 特殊能力：持续伤害 (DOT)
      if (this.type === 'DataEngineer' && !killed) {
        // 这里简化处理，实际应该用状态效果系统
        setTimeout(() => {
          if (target.isAlive) {
            target.takeDamage(10);
          }
        }, 500);
      }
    }
    
    return result;
  }

  // 升级
  public upgrade(): boolean {
    if (this.level >= 3) return false;
    
    this.level++;
    this.damage = Math.floor(this.damage * 1.5);
    this.range = Math.floor(this.range * 1.1);
    this.attackSpeed = Math.floor(this.attackSpeed * 0.9);
    
    return true;
  }

  // 获取升级费用
  public getUpgradeCost(): number {
    return Math.floor(this.cost * 0.5 * this.level);
  }

  // 获取出售价格
  public getSellPrice(): number {
    const basePrice = this.cost * 0.7;
    const levelBonus = (this.level - 1) * this.cost * 0.25;
    return Math.floor(basePrice + levelBonus);
  }

  // 获取当前状态
  public getState(): Developer {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      description: this.description,
      cost: this.cost,
      damage: this.damage,
      attackSpeed: this.attackSpeed,
      range: this.range,
      targetBugType: this.targetBugType,
      position: { x: this.x, y: this.y },
      level: this.level,
      isAOE: this.isAOE,
      specialAbility: this.specialAbility,
    };
  }
}
