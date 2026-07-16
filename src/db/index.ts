import Dexie, { type EntityTable } from 'dexie';
import type {
  ChildProfile,
  Activity,
  WeeklyPlan,
  DailyRecord,
  Milestone,
} from '../types';

export class EduPlanDB extends Dexie {
  childProfile!: EntityTable<ChildProfile, 'id'>;
  activities!: EntityTable<Activity, 'id'>;
  weeklyPlans!: EntityTable<WeeklyPlan, 'id'>;
  dailyRecords!: EntityTable<DailyRecord, 'id'>;
  milestones!: EntityTable<Milestone, 'id'>;

  constructor() {
    // 改了数据库名（EduPlanDB → EduPlanDB2），因为 Dexie 不支持从 'id' 升级到 '++id'
    // 旧数据没有有价值的内容（之前全部保存失败），所以直接换库名重新开始
    super('EduPlanDB2');

    this.version(1).stores({
      childProfile: '++id',
      activities: '++id, dimensionId, difficulty, isPreset',
      weeklyPlans: '++id, weekStart',
      dailyRecords: '++id, date, activityId',
      milestones: '++id, date, dimensionId',
    });
  }
}

export const db = new EduPlanDB();
