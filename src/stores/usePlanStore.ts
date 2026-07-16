import { create } from 'zustand';
import { db } from '../db';
import type { WeeklyPlan, DayPlan, DayActivity } from '../types';
import { todayString } from '../utils/date';
import { syncPush } from '../utils/sync';

interface PlanState {
  currentPlan: WeeklyPlan | null;
  plans: WeeklyPlan[];
  isLoading: boolean;

  loadWeek: (startDate: string) => Promise<void>;
  setPlan: (plan: WeeklyPlan) => void;
  savePlan: (plan: WeeklyPlan) => Promise<WeeklyPlan>;
  toggleComplete: (dayDate: string, actIdx: number) => Promise<void>;
  replaceActivity: (dayDate: string, actIdx: number, newActivityId: number) => Promise<void>;
  regenerateDay: (dayIndex: number) => Promise<void>;
  getTodayActivities: () => DayActivity[];
  getTodayPlan: () => DayPlan | undefined;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  currentPlan: null,
  plans: [],
  isLoading: false,

  loadWeek: async (startDate) => {
    set({ isLoading: true });
    const plan = await db.weeklyPlans
      .where('weekStart')
      .equals(startDate)
      .reverse()
      .sortBy('id')
      .then((rows) => rows[0] ?? null);
    set({ currentPlan: plan, isLoading: false });
  },

  setPlan: (plan) => {
    set({ currentPlan: plan });
  },

  savePlan: async (plan) => {
    const existing = await db.weeklyPlans
      .where('weekStart')
      .equals(plan.weekStart)
      .reverse()
      .sortBy('id')
      .then((rows) => rows[0] ?? null);

    let toSave: WeeklyPlan = plan;
    if (existing?.id != null) toSave = { ...plan, id: existing.id };

    const savedId = await db.weeklyPlans.put(toSave);
    const saved: WeeklyPlan = { ...toSave, id: savedId };
    set({ currentPlan: saved });

    // 同步推送到服务器（家人共享）
    const wk = toSave.weekStart;
    syncPush({ plans: { [wk]: saved } });

    return saved;
  },

  toggleComplete: async (dayDate, actIdx) => {
    const { currentPlan } = get();
    if (!currentPlan) return;
    const days = currentPlan.days.map((day) =>
      day.date !== dayDate ? day : { ...day, activities: day.activities.map((a, i) => i === actIdx ? { ...a, completed: !a.completed } : a) }
    );
    const updated = { ...currentPlan, days };
    await db.weeklyPlans.put(updated);
    set({ currentPlan: updated });
  },

  replaceActivity: async (dayDate, actIdx, newActivityId) => {
    const { currentPlan } = get();
    if (!currentPlan) return;
    const days = currentPlan.days.map((day) =>
      day.date !== dayDate ? day : { ...day, activities: day.activities.map((a, i) => i === actIdx ? { ...a, activityId: newActivityId, completed: false } : a) }
    );
    const updated = { ...currentPlan, days };
    await db.weeklyPlans.put(updated);
    set({ currentPlan: updated });
  },

  regenerateDay: async (dayIndex) => {
    const plan = get().currentPlan;
    if (!plan || !plan.days[dayIndex]) return;
    const activities = await db.activities.toArray();
    const day = plan.days[dayIndex];
    const count = day.activities.length;
    const shuffled = [...activities].sort(() => Math.random() - 0.5);
    const newActivities: DayActivity[] = shuffled.slice(0, count).map((act, i) => ({
      activityId: act.id!, type: i === 0 ? 'required' : 'optional', completed: false, order: i,
    }));
    const newDays = [...plan.days];
    newDays[dayIndex] = { ...day, activities: newActivities };
    const updated = { ...plan, days: newDays };
    await db.weeklyPlans.put(updated);
    set({ currentPlan: updated });
  },

  getTodayActivities: () => {
    const today = todayString();
    return get().currentPlan?.days.find((d) => d.date === today)?.activities ?? [];
  },

  getTodayPlan: () => {
    const today = todayString();
    return get().currentPlan?.days.find((d) => d.date === today);
  },
}));
