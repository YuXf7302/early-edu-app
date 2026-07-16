import type {
  DimensionId,
  EnergyMode,
  InteractionType,
  InterestTag,
  DifficultyLevel,
} from '../constants';

// ====== 孩子档案 ======
export interface ChildProfile {
  id: number;
  name: string;
  birthDate: string; // ISO "2023-05-XX"
  dimensions: Record<DimensionId, DimensionLevel>;
  interestTags: InterestTag[];
  constraints: ChildConstraints;
  bazi?: BaziInfo;
  createdAt: string;
  updatedAt: string;
}

export interface DimensionLevel {
  current: number; // 1-5
  target: number;  // 1-5
}

export interface ChildConstraints {
  weekdayStartTime: string;   // "19:30"
  weekdayEndTime: string;     // "20:30"
  screenQuotaPerWeek: number; // 3
  screenMaxMinutes: number;   // 20
  enrollmentDate: string;     // "2026-09-01"
}

export interface BaziInfo {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
}

// ====== 活动 ======
export interface Activity {
  id?: number;
  title: string;
  description: string;
  dimensionId: DimensionId;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  materials: string[];
  interactionType: InteractionType;
  tags: InterestTag[];
  isScreen: boolean;
  isOutdoor: boolean;
  isPreset: boolean;
  variantOf?: number;
  createdAt: string;
}

// ====== 周计划 ======
export interface WeeklyPlan {
  id?: number;
  weekStart: string;
  energyMode: EnergyMode;
  days: DayPlan[];
  selfCareGoal: string;
  selfCareSkill: string;
  createdAt: string;
}

export interface DayPlan {
  date: string;
  activities: DayActivity[];
  mode: DayMode;
  energyOverride?: EnergyMode;
}

export type DayMode = 'weekday' | 'weekend';

export interface DayActivity {
  activityId: number;
  type: 'required' | 'optional';
  completed: boolean;
  order: number;
}

// ====== 每日记录 ======
export interface DailyRecord {
  id?: number;
  date: string;
  activityId?: number;
  note?: string;
  milestone?: string;
  createdAt: string;
}

// ====== 里程碑 ======
export interface Milestone {
  id?: number;
  date: string;
  dimensionId: DimensionId;
  description: string;
  autoDetected: boolean;
}
