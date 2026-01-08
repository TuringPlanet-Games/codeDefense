// ==========================================
// Rough.js 渲染工具 - 赛博朋克风格
// ==========================================

import rough from 'roughjs';
import { CYBER_COLORS, type DeveloperType, type BugType } from '../types';
import { ROUGH_OPTIONS } from '../config/gameConfig';

// 创建 Rough.js 实例
export const createRoughCanvas = (canvas: HTMLCanvasElement) => {
  return rough.canvas(canvas);
};

// 绘制霓虹发光效果
export const drawNeonGlow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
};

// 绘制赛博朋克网格背景
export const drawCyberGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number = 40
) => {
  ctx.save();
  
  // 深色背景
  ctx.fillStyle = CYBER_COLORS.darkBg;
  ctx.fillRect(0, 0, width, height);
  
  // 网格线
  ctx.strokeStyle = CYBER_COLORS.gridColor;
  ctx.lineWidth = 0.5;
  
  // 垂直线
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // 水平线
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.restore();
};

// 绘制霓虹路径
export const drawNeonPath = (
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  colors: string[] = CYBER_COLORS.pathGradient
) => {
  if (points.length < 2) return;
  
  ctx.save();
  
  // 创建渐变
  const gradient = ctx.createLinearGradient(
    points[0].x,
    points[0].y,
    points[points.length - 1].x,
    points[points.length - 1].y
  );
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  // 外发光层
  ctx.shadowBlur = 30;
  ctx.shadowColor = colors[0];
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 35;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  
  // 内层亮线
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  ctx.restore();
};

// 绘制开发者塔 - 使用 Rough.js
export const drawDeveloper = (
  rc: ReturnType<typeof rough.canvas>,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: DeveloperType,
  isSelected: boolean = false
) => {
  const color = CYBER_COLORS.towerColors[type];
  const size = 50;
  
  ctx.save();
  
  // 选中状态发光
  if (isSelected) {
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;
  }
  
  // 使用 Rough.js 绘制基座
  rc.rectangle(x - size / 2, y - size / 2, size, size, {
    ...ROUGH_OPTIONS.neon,
    stroke: color,
    fill: 'rgba(0, 0, 0, 0.7)',
    fillStyle: 'solid',
  });
  
  // 绘制塔的图标
  ctx.fillStyle = color;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const icons: Record<DeveloperType, string> = {
    JuniorDev: '👨‍💻',
    SeniorArchitect: '🖥️',
    UIDesigner: '🎨',
    DataEngineer: '📊',
    SecurityExpert: '🛡️',
  };
  
  ctx.fillText(icons[type], x, y);
  
  // 攻击范围圈 (选中时显示)
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(x, y, 100, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
  }
  
  ctx.restore();
};

// 绘制 Bug 敌人
export const drawBug = (
  rc: ReturnType<typeof rough.canvas>,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: BugType,
  hp: number,
  maxHp: number
) => {
  const color = CYBER_COLORS.bugColors[type];
  const size = type === 'SystemCrash' ? 60 : 30;
  
  ctx.save();
  
  // 发光效果
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  
  // 根据类型绘制不同形状
  switch (type) {
    case 'Typo':
      // 小虫子 - 椭圆形
      rc.ellipse(x, y, size, size * 0.6, {
        ...ROUGH_OPTIONS.sketchy,
        stroke: color,
        fill: color,
        fillStyle: 'hachure',
      });
      break;
      
    case 'NullPointerException':
      // 幽灵 - 不规则形状
      rc.path(`M ${x - 15} ${y + 15} Q ${x - 20} ${y - 10} ${x} ${y - 20} Q ${x + 20} ${y - 10} ${x + 15} ${y + 15} Z`, {
        ...ROUGH_OPTIONS.sketchy,
        stroke: '#ffffff',
        fill: 'rgba(255, 255, 255, 0.3)',
        fillStyle: 'solid',
      });
      break;
      
    case 'MemoryLeak':
      // 粘液怪 - 不规则圆形
      rc.circle(x, y, size, {
        ...ROUGH_OPTIONS.sketchy,
        stroke: color,
        fill: color,
        fillStyle: 'cross-hatch',
      });
      // 滴落效果
      rc.circle(x - 10, y + 20, 8, {
        stroke: color,
        fill: color,
        fillStyle: 'solid',
      });
      break;
      
    case 'SystemCrash':
      // 机器人 Boss - 矩形身体
      rc.rectangle(x - 25, y - 30, 50, 60, {
        ...ROUGH_OPTIONS.neon,
        stroke: '#ff0000',
        fill: 'rgba(100, 100, 100, 0.8)',
        fillStyle: 'solid',
      });
      // 眼睛
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(x - 10, y - 10, 5, 0, Math.PI * 2);
      ctx.arc(x + 10, y - 10, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  
  // 血条
  const hpBarWidth = size + 10;
  const hpBarHeight = 4;
  const hpBarY = y - size / 2 - 10;
  const hpPercent = hp / maxHp;
  
  // 血条背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(x - hpBarWidth / 2, hpBarY, hpBarWidth, hpBarHeight);
  
  // 血条填充
  const hpColor = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
  ctx.fillStyle = hpColor;
  ctx.fillRect(x - hpBarWidth / 2, hpBarY, hpBarWidth * hpPercent, hpBarHeight);
  
  ctx.restore();
};

// 绘制放置点
export const drawPlacementSpot = (
  rc: ReturnType<typeof rough.canvas>,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isOccupied: boolean,
  isHovered: boolean = false
) => {
  const size = 50;
  
  ctx.save();
  
  if (!isOccupied) {
    if (isHovered) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = CYBER_COLORS.neonGreen;
    }
    
    rc.rectangle(x - size / 2, y - size / 2, size, size, {
      ...ROUGH_OPTIONS.circuit,
      stroke: isHovered ? CYBER_COLORS.neonGreen : CYBER_COLORS.neonBlue,
      fill: 'rgba(0, 255, 255, 0.1)',
      fillStyle: 'solid',
      strokeLineDash: [5, 5],
    });
    
    // 加号图标
    ctx.strokeStyle = isHovered ? CYBER_COLORS.neonGreen : CYBER_COLORS.neonBlue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.stroke();
  }
  
  ctx.restore();
};

// 绘制攻击特效
export const drawAttackEffect = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string
) => {
  ctx.save();
  
  // 激光效果
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  
  // 命中点闪光
  ctx.beginPath();
  ctx.arc(toX, toY, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  
  ctx.restore();
};

// 绘制 Data Core (起点)
export const drawDataCore = (
  rc: ReturnType<typeof rough.canvas>,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  ctx.save();
  
  ctx.shadowBlur = 20;
  ctx.shadowColor = CYBER_COLORS.neonBlue;
  
  // 六边形基座
  const size = 40;
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push({
      x: x + size * Math.cos(angle),
      y: y + size * Math.sin(angle),
    });
  }
  
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  rc.path(path, {
    ...ROUGH_OPTIONS.neon,
    stroke: CYBER_COLORS.neonBlue,
    fill: 'rgba(0, 255, 255, 0.2)',
    fillStyle: 'solid',
  });
  
  // 中心图标
  ctx.fillStyle = CYBER_COLORS.neonBlue;
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📦', x, y);
  
  // 标签
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px monospace';
  ctx.fillText('Data Core', x, y + 55);
  
  ctx.restore();
};

// 绘制 Data Port (终点)
export const drawDataPort = (
  rc: ReturnType<typeof rough.canvas>,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  ctx.save();
  
  ctx.shadowBlur = 20;
  ctx.shadowColor = CYBER_COLORS.neonPink;
  
  // 矩形端口
  rc.rectangle(x - 30, y - 25, 60, 50, {
    ...ROUGH_OPTIONS.neon,
    stroke: CYBER_COLORS.neonPink,
    fill: 'rgba(255, 0, 255, 0.2)',
    fillStyle: 'solid',
  });
  
  // 连接线
  ctx.strokeStyle = CYBER_COLORS.neonPink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 30, y);
  ctx.lineTo(x + 60, y);
  ctx.stroke();
  
  // 中心图标
  ctx.fillStyle = CYBER_COLORS.neonPink;
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔌', x, y);
  
  // 标签
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px monospace';
  ctx.fillText('Data Port', x, y + 45);
  
  ctx.restore();
};

// 绘制电路装饰线
export const drawCircuitLines = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  
  // 随机电路线
  const drawCircuit = (startX: number, startY: number) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    let x = startX;
    let y = startY;
    
    for (let i = 0; i < 5; i++) {
      const dir = Math.random() > 0.5;
      const len = 20 + Math.random() * 40;
      
      if (dir) {
        x += len;
      } else {
        y += len;
      }
      
      ctx.lineTo(x, y);
      
      // 节点
      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.stroke();
  };
  
  // 在边缘绘制电路
  for (let i = 0; i < 10; i++) {
    drawCircuit(Math.random() * 100, Math.random() * height);
    drawCircuit(width - 100 + Math.random() * 100, Math.random() * height);
  }
  
  ctx.restore();
};
