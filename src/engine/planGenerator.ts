import type { Activity, WeeklyPlan, DayPlan, DayActivity, ChildProfile } from '../types';
import { ENERGY_SLOTS, DIMENSION_WEIGHTS, type DimensionId, type EnergyMode } from '../constants';
import { PATTERN } from './bazi';
import { getMonday as getMondayDate, formatLocalDate, addDays } from '../utils/date';

// ====== 活动分类 ======
const STATIC_DIMS: Set<DimensionId> = new Set(['language', 'art', 'mathLogic', 'financialLit']);
const DYNAMIC_DIMS: Set<DimensionId> = new Set(['grossMotor', 'music', 'nature']);

function isDynamic(a: Activity): boolean {
  if (a.isOutdoor) return true;
  if (a.tags.includes('activeScreen')) return true;
  if (a.tags.includes('musicDance')) return true;
  return DYNAMIC_DIMS.has(a.dimensionId);
}

function isStatic(a: Activity): boolean {
  if (STATIC_DIMS.has(a.dimensionId)) return true;
  if (a.tags.includes('pictureBook')) return true;
  if (a.tags.includes('boardGame')) return true;
  return false;
}

// ====== 周节奏：每天的能量档和情绪 ======
interface DayConfig {
  energy: EnergyMode;
  vibe: 'calm' | 'push' | 'easy' | 'deep';
  label: string;
}

function getDayConfig(dayIndex: number, isWeekend: boolean): DayConfig {
  if (isWeekend) {
    // 周六深度、周日深度但偏轻松
    return dayIndex === 5
      ? { energy: 'deep', vibe: 'deep', label: '周六探索日' }
      : { energy: 'deep', vibe: 'calm', label: '周日放松日' };
  }
  // 工作日节奏：周一轻量启动 → 周二三四发力 → 周五轻松收尾
  switch (dayIndex) {
    case 0: return { energy: 'light', vibe: 'calm', label: '周一启动日' };
    case 1: return { energy: 'standard', vibe: 'push', label: '周二发力日' };
    case 2: return { energy: 'standard', vibe: 'push', label: '周三专注日' };
    case 3: return { energy: 'standard', vibe: 'push', label: '周四巩固日' };
    case 4: return { energy: 'light', vibe: 'easy', label: '周五轻松日' };
    default: return { energy: 'standard', vibe: 'calm', label: '' };
  }
}

// ====== 主题周检测 ======
interface WeekTheme {
  id: DimensionId;
  name: string;
  reason: string;
}

function detectTheme(profile: ChildProfile): WeekTheme | null {
  // 找当前水平最低且优先级>=2的维度作为本周主题
  const candidates: { dim: DimensionId; score: number }[] = [];
  for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    if (weight.priority < 2) continue;
    const level = profile.dimensions[dim as DimensionId];
    if (!level) continue;
    // 差距越大分数越高
    const gap = (level.target || 3) - (level.current || 2);
    if (gap > 0) {
      candidates.push({ dim: dim as DimensionId, score: gap * weight.priority });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  if (candidates.length === 0) return null;

  const pick = candidates[0];
  const labels: Record<string, string> = {
    selfCare: '自理强化周', mathLogic: '数感探索周', financialLit: '财商启蒙周',
    socialEmotion: '社交达人周', grossMotor: '运动挑战周', language: '语言表达周',
    art: '艺术创想周', music: '音乐律动周', nature: '自然发现周',
  };
  const reasons: Record<string, string> = {
    selfCare: '距入园还有不到两个月，自理能力最需要突破！',
    mathLogic: '数理逻辑是未来学习的基础，趁兴趣浓多玩数学游戏。',
    financialLit: '财商从小培养，建立交换和储蓄的概念。',
    socialEmotion: '社交天赋突出，趁热打铁强化规则和情绪表达。',
    grossMotor: '单脚跳还不太会，多练练平衡和协调。',
    language: '语言表达不错，可以挑战更复杂的故事和表达。',
    art: '让创意自由流淌，艺术是表达自我的好方式。',
    music: '喜欢音乐就该多玩，节奏感和自信一起涨。',
    nature: '大自然是最好的教室，多户外多探索。',
  };

  return {
    id: pick.dim,
    name: labels[pick.dim] || '综合发展周',
    reason: reasons[pick.dim] || '',
  };
}

// ====== 八字调整（丁火从旺格） ======
interface BaziAdjustment {
  boostDims: DimensionId[];        // 需要增加频次的维度（木火土）
  boostTags: string[];             // 需要增加频次的标签
  preferShortActivities: boolean;  // 偏好短活动(5-8分钟)
  strategyNote: string;            // 策略说明
}

function getBaziAdjustment(profile: ChildProfile): BaziAdjustment | null {
  if (!profile.bazi) return null;

  // 丁火从旺格：喜木火土，忌金水
  // 木(偏印)→大量输入: language, nature
  // 火(比劫)→顺势助燃: grossMotor, socialEmotion
  // 土(食神)→创意泄秀: art, music
  // 金→极弱: 不自责不硬教规则，环境创设替代
  // 水(七杀)→忌: 不压制不吼不罚，共情引导替代
  return {
    boostDims: ['grossMotor', 'socialEmotion', 'language', 'art'],
    boostTags: ['car', 'rolePlay', 'pictureBook', 'musicDance'],
    preferShortActivities: true,
    strategyNote: `${PATTERN.name} — 用游戏化替代命令，用仪式替代规则，用比赛替代要求`,
  };
}

// ====== 工具函数 ======
// 本地日期工具已抽到 utils/date.ts：getMondayDate / formatLocalDate / addDays

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ====== 主函数 ======
export function generateWeeklyPlan(
  profile: ChildProfile,
  activities: Activity[],
  weekStart?: string,
): WeeklyPlan {
  const monday = weekStart ? getMondayDate(weekStart) : getMondayDate();
  const weekStartStr = formatLocalDate(monday);
  const theme = detectTheme(profile);
  const baziAdj = getBaziAdjustment(profile);

  // 合并主题周和八字调整的维度增强
  const boostDims = new Set<DimensionId>();
  if (theme) boostDims.add(theme.id);
  if (baziAdj) baziAdj.boostDims.forEach((d) => boostDims.add(d));

  const days: DayPlan[] = [];
  const dimensionCounts: Record<DimensionId, number> = {
    selfCare: 0, mathLogic: 0, financialLit: 0, socialEmotion: 0,
    grossMotor: 0, language: 0, art: 0, music: 0, nature: 0,
  };

  // 按维度分组
  const byDim = {} as Record<DimensionId, Activity[]>;
  for (const dim of Object.keys(dimensionCounts) as DimensionId[]) {
    byDim[dim] = activities.filter((a) => a.dimensionId === dim);
  }

  // 特殊标签池
  const carActs = activities.filter((a) => a.tags.includes('car'));
  const boardGameActs = activities.filter((a) => a.tags.includes('boardGame'));
  const steamActs = activities.filter((a) => a.tags.includes('steam'));
  const outdoorActs = activities.filter((a) => a.isOutdoor);
  const pictureBookActs = activities.filter((a) => a.tags.includes('pictureBook'));

  let screenUsed = 0;
  const screenQuota = profile.constraints.screenQuotaPerWeek;
  const carTarget = 2 + Math.round(Math.random()); // 每周 2-3 次车主题

  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    const dateStr = formatLocalDate(date);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const config = getDayConfig(i, isWeekend);
    const slots = isWeekend
      ? ENERGY_SLOTS[config.energy].weekend
      : ENERGY_SLOTS[config.energy].weekday;

    const dayActivities: DayActivity[] = [];
    const usedDims = new Set<DimensionId>();
    const usedIds = new Set<number>();
    let order = 0;

    // 记录上一个活动的动静类型
    let lastWasDynamic: boolean | null = null;

    const addActivity = (act: Activity, type: 'required' | 'optional') => {
      if (usedIds.has(act.id!)) return false;
      if (act.isScreen && screenUsed >= screenQuota) return false;
      dayActivities.push({
        activityId: act.id!,
        type,
        completed: false,
        order: order++,
      });
      usedDims.add(act.dimensionId);
      usedIds.add(act.id!);
      dimensionCounts[act.dimensionId]++;
      if (act.isScreen) screenUsed++;
      lastWasDynamic = isDynamic(act);
      return true;
    };

    // --- 槽位1: 必做（自理 or 主题维度） ---
    if (config.vibe !== 'calm' || dimensionCounts.selfCare < 5) {
      const selfCarePool = byDim.selfCare.filter(
        (a) => !usedIds.has(a.id!) && a.difficulty <= (profile.dimensions.selfCare?.target ?? 3),
      );
      const sc = pickRandom(selfCarePool);
      if (sc) addActivity(sc, 'required');
    }

    // --- 剩余槽位: 按精力曲线和动静交替填充 ---
    const pool: Activity[] = [];

    // 工作日晚上策略：先低能耗再互动
    if (!isWeekend) {
      // 先找安静活动（绘本、精细）
      if (config.vibe === 'calm' || config.vibe === 'easy') {
        const quietActs = [
          ...(pictureBookActs.filter((a) => !usedIds.has(a.id!))),
          ...(byDim.language?.filter((a) => !usedIds.has(a.id!)) ?? []),
          ...(byDim.art?.filter((a) => !usedIds.has(a.id!)) ?? []),
        ];
        pool.push(...quietActs.slice(0, 2));
      }

      // 再找互动/动态活动
      const interactiveActs = [
        ...(boardGameActs.filter((a) => !usedIds.has(a.id!))),
        ...(byDim.socialEmotion?.filter((a) => !usedIds.has(a.id!)) ?? []),
        ...(byDim.mathLogic?.filter((a) => !usedIds.has(a.id!)) ?? []),
        ...(byDim.financialLit?.filter((a) => !usedIds.has(a.id!)) ?? []),
      ];
      pool.push(...interactiveActs.slice(0, 3));
    }

    // 周末：户外 + 运动 + STEAM + 车主题
    if (isWeekend) {
      pool.push(...outdoorActs.filter((a) => !usedIds.has(a.id!)).slice(0, 2));
      pool.push(...steamActs.filter((a) => !usedIds.has(a.id!)).slice(0, 1));
    }

    // 车迷主题线（每周 2-3 次）
    if (dimensionCounts.nature < 3) {
      pool.push(...carActs.filter((a) => !usedIds.has(a.id!)).slice(0, 1));
    }

    // 主题周 & 八字调整加持
    if (boostDims.size > 0) {
      for (const dim of boostDims) {
        const themeActs = byDim[dim]?.filter((a) => !usedIds.has(a.id!)) ?? [];
        pool.push(...themeActs.slice(0, 2));
      }
    }

    // 兜底：从所有维度取
    const allOtherDims = shuffle(
      (Object.keys(byDim) as DimensionId[]).filter((d) => !usedDims.has(d)),
    );
    for (const dim of allOtherDims) {
      if (pool.length >= 10) break;
      const acts = byDim[dim]?.filter((a) => !usedIds.has(a.id!)) ?? [];
      pool.push(...acts.slice(0, 1));
    }

    // 去重、动静交替
    const uniquePool = pool.filter(
      (c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx && !usedIds.has(c.id!),
    );

    // 动静交替排序：确保相邻活动不全是静态或全是动态
    const sorted: Activity[] = [];
    const dynamics = uniquePool.filter((a) => isDynamic(a));
    const statics = uniquePool.filter((a) => isStatic(a));
    const neutrals = uniquePool.filter((a) => !isDynamic(a) && !isStatic(a));

    let pickFromDynamic = lastWasDynamic === null || lastWasDynamic === true ? false : true;
    while (sorted.length < slots && (dynamics.length || statics.length || neutrals.length)) {
      if (pickFromDynamic && dynamics.length) {
        sorted.push(dynamics.shift()!);
        pickFromDynamic = false;
      } else if (!pickFromDynamic && statics.length) {
        sorted.push(statics.shift()!);
        pickFromDynamic = true;
      } else if (neutrals.length) {
        sorted.push(neutrals.shift()!);
      } else if (dynamics.length) {
        sorted.push(dynamics.shift()!);
      } else if (statics.length) {
        sorted.push(statics.shift()!);
      } else {
        break;
      }
    }

    // 填充 dayActivities
    for (const act of sorted) {
      if (dayActivities.length >= slots + 2) break; // 多留2个候选
      const type: 'required' | 'optional' = dayActivities.length === 0 ? 'required' : 'optional';
      if (!usedIds.has(act.id!)) {
        addActivity(act, type);
      }
    }

    // 确保至少有 slots 个活动
    const remaining = uniquePool.filter((a) => !usedIds.has(a.id!));
    for (const act of remaining) {
      if (dayActivities.length >= Math.max(slots, 2)) break;
      addActivity(act, 'optional');
    }

    days.push({
      date: dateStr,
      activities: dayActivities,
      mode: isWeekend ? 'weekend' : 'weekday',
      energyOverride: config.energy,
    });
  }

  // 每周目标（融入八字策略）
  let selfCareGoal: string;
  let selfCareSkill: string;
  if (theme) {
    selfCareGoal = `🎯 ${theme.name} | ${theme.reason}`;
    selfCareSkill = theme.name;
  } else {
    selfCareGoal = '本周自理目标：学会自己穿袜子/扣扣子';
    selfCareSkill = '穿袜子/扣扣子';
  }
  // 八字策略提示
  if (baziAdj) {
    selfCareGoal += ` | 🪷 ${baziAdj.strategyNote}`;
  }

  return {
    weekStart: weekStartStr,
    energyMode: 'standard',
    days,
    selfCareGoal,
    selfCareSkill,
    createdAt: new Date().toISOString(),
  };
}
