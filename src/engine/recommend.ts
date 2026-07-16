import type { Activity, ChildProfile } from '../types';
import type { DimensionId } from '../constants';
import { db } from '../db';

/**
 * 为某个维度推荐替代活动（1-2 个）
 */
export async function getAlternatives(
  activityId: number,
  dimensionId: DimensionId,
  excludeIds: number[] = [],
): Promise<Activity[]> {
  return db.activities
    .where('dimensionId')
    .equals(dimensionId)
    .filter((a) => a.id !== activityId && !excludeIds.includes(a.id!))
    .limit(3)
    .toArray();
}

/**
 * 为某一天生成更多候选活动（预览模式用）
 */
export async function getDayCandidates(
  profile: ChildProfile,
  dimensionId: DimensionId,
  _energyLevel: string,
  count: number = 4,
  excludeIds: number[] = [],
): Promise<Activity[]> {
  const all = await db.activities
    .where('dimensionId')
    .equals(dimensionId)
    .filter((a) => !excludeIds.includes(a.id!))
    .toArray();

  // 按适用性排序：难度匹配 > 兴趣标签匹配
  const level = profile.dimensions[dimensionId];
  const targetLevel = level?.target ?? 3;

  return all
    .sort((a, b) => {
      const aMatch = Math.abs(a.difficulty - targetLevel);
      const bMatch = Math.abs(b.difficulty - targetLevel);
      const aInterest = a.tags.filter((t) => profile.interestTags.includes(t)).length;
      const bInterest = b.tags.filter((t) => profile.interestTags.includes(t)).length;
      return aMatch - bMatch || bInterest - aInterest;
    })
    .slice(0, count);
}

/**
 * 计算一周的简单总结文本
 */
export function summarizeWeek(
  plan: { days: { activities: { completed: boolean }[] }[] },
): string {
  let total = 0;
  let completed = 0;

  for (const day of plan.days) {
    for (const act of day.activities) {
      total++;
      if (act.completed) completed++;
    }
  }

  if (total === 0) return '本周还没有活动记录。';
  const rate = Math.round((completed / total) * 100);

  if (rate >= 80) return `太棒了！本周完成了 ${completed}/${total} 个活动（${rate}%），孩子进步明显 🌟`;
  if (rate >= 50) return `不错哦！本周完成了 ${completed}/${total} 个活动（${rate}%），保持节奏 📝`;
  return `本周完成了 ${completed}/${total} 个活动（${rate}%），新的一周加油 💪`;
}
