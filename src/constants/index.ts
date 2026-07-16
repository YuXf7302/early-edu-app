// ====== 能力维度 ======
export type DimensionId =
  | 'selfCare'       // 生活习惯/自理
  | 'mathLogic'      // 数理逻辑
  | 'financialLit'   // 财商启蒙
  | 'socialEmotion'  // 社交情感
  | 'grossMotor'     // 大运动
  | 'language'       // 语言表达
  | 'art'            // 艺术创意
  | 'music'          // 音乐律动
  | 'nature';        // 自然探索

export const DIMENSION_LABELS: Record<DimensionId, string> = {
  selfCare: '生活习惯',
  mathLogic: '数理逻辑',
  financialLit: '财商启蒙',
  socialEmotion: '社交情感',
  grossMotor: '大运动',
  language: '语言表达',
  art: '艺术创意',
  music: '音乐律动',
  nature: '自然探索',
};

export const DIMENSION_ICONS: Record<DimensionId, string> = {
  selfCare: '🧴',
  mathLogic: '🔢',
  financialLit: '💰',
  socialEmotion: '💝',
  grossMotor: '🏃',
  language: '💬',
  art: '🎨',
  music: '🎵',
  nature: '🌿',
};

export const DIMENSION_COLORS: Record<DimensionId, string> = {
  selfCare: '#f97316',
  mathLogic: '#3b82f6',
  financialLit: '#22c55e',
  socialEmotion: '#ec4899',
  grossMotor: '#ef4444',
  language: '#8b5cf6',
  art: '#f59e0b',
  music: '#06b6d4',
  nature: '#84cc16',
};

// ====== 维度权重 ======
export interface DimensionWeight {
  base: number;     // 每周基础频次
  priority: 1 | 2 | 3;  // 1=一般 2=重要 3=核心
}

export const DIMENSION_WEIGHTS: Record<DimensionId, DimensionWeight> = {
  selfCare:      { base: 7, priority: 3 },
  mathLogic:     { base: 4, priority: 3 },
  financialLit:  { base: 2, priority: 3 },
  socialEmotion: { base: 3, priority: 3 },
  grossMotor:    { base: 3, priority: 2 },
  language:      { base: 3, priority: 1 },
  art:           { base: 1, priority: 1 },
  music:         { base: 1, priority: 1 },
  nature:        { base: 1, priority: 1 },
};

// ====== 兴趣标签 ======
export type InterestTag =
  | 'car'        // 车迷
  | 'boardGame'  // 桌游
  | 'steam'      // STEAM实验
  | 'pictureBook' // 绘本
  | 'activeScreen' // 活力街/体感
  | 'outdoor'    // 户外
  | 'building'   // 建构/积木
  | 'rolePlay'   // 角色扮演
  | 'musicDance'; // 音乐舞蹈

export const INTEREST_TAG_LABELS: Record<InterestTag, string> = {
  car: '🚗 车',
  boardGame: '🎲 桌游',
  steam: '🔬 STEAM',
  pictureBook: '📚 绘本',
  activeScreen: '📺 体感游戏',
  outdoor: '🌳 户外',
  building: '🧱 建构',
  rolePlay: '🎭 角色扮演',
  musicDance: '💃 音乐舞蹈',
};

// ====== 互动类型 ======
export type InteractionType = 'collaborative' | 'guided' | 'companion' | 'independent';

export const INTERACTION_LABELS: Record<InteractionType, string> = {
  collaborative: '协作型',
  guided: '引导型',
  companion: '陪伴型',
  independent: '独立型',
};

// ====== 精力档 ======
export type EnergyMode = 'light' | 'standard' | 'deep';

export const ENERGY_LABELS: Record<EnergyMode, string> = {
  light: '轻量',
  standard: '标准',
  deep: '深度',
};

export const ENERGY_SLOTS: Record<EnergyMode, { weekday: number; weekend: number }> = {
  light:    { weekday: 1, weekend: 2 },
  standard: { weekday: 2, weekend: 4 },
  deep:     { weekday: 3, weekend: 5 },
};

// ====== 难度等级 ======
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: '入门',
  2: '基础',
  3: '进阶',
  4: '挑战',
  5: '高手',
};
