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
  currentPlan: null, plans: [], isLoading: false,

  loadWeek: async (startDate) => {
    set({ isLoading: true });
    const plan = await db.weeklyPlans.where('weekStart').equals(startDate).reverse().sortBy('id').then(r => r[0] ?? null);
    set({ currentPlan: plan, isLoading: false });
  },

  setPlan: (plan) => set({ currentPlan: plan }),

  savePlan: async (plan) => {
    const existing = await db.weeklyPlans.where('weekStart').equals(plan.weekStart).reverse().sortBy('id').then(r => r[0] ?? null);
    const toSave: WeeklyPlan = existing?.id != null ? { ...plan, id: existing.id } : plan;
    const savedId = await db.weeklyPlans.put(toSave);
    const saved: WeeklyPlan = { ...toSave, id: savedId };
    set({ currentPlan: saved });
    syncPush({ plans: { [saved.weekStart]: saved } });
    return saved;
  },

  toggleComplete: async (dayDate, actIdx) => {
    const cp = get().currentPlan; if (!cp) return;
    const days = cp.days.map(d => d.date !== dayDate ? d : { ...d, activities: d.activities.map((a, i) => i === actIdx ? { ...a, completed: !a.completed } : a) });
    const updated = { ...cp, days };
    await db.weeklyPlans.put(updated);
    set({ currentPlan: updated });
    syncPush({ plans: { [updated.weekStart]: updated } });
  },

  replaceActivity: async (dayDate, actIdx, newId) => {
    const cp = get().currentPlan; if (!cp) return;
    const days = cp.days.map(d => d.date !== dayDate ? d : { ...d, activities: d.activities.map((a, i) => i === actIdx ? { ...a, activityId: newId, completed: false } : a) });
    const updated = { ...cp, days };
    await db.weeklyPlans.put(updated);
    set({ currentPlan: updated });
    syncPush({ plans: { [updated.weekStart]: updated } });
  },

  regenerateDay: async (dayIndex) => {
    const plan = get().currentPlan; if (!plan || !plan.days[dayIndex]) return;
    const acts = await db.activities.toArray();
    const day = plan.days[dayIndex];
    const shuffled = [...acts].sort(() => Math.random() - 0.5);
    const nas: DayActivity[] = shuffled.slice(0, day.activities.length).map((a, i) => ({ activityId: a.id!, type: i === 0 ? 'required' : 'optional', completed: false, order: i }));
    const nd = [...plan.days]; nd[dayIndex] = { ...day, activities: nas };
    const updated = { ...plan, days: nd };
    await db.weeklyPlans.put(updated);
    set({ currentPlan: updated });
    syncPush({ plans: { [updated.weekStart]: updated } });
  },

  getTodayActivities: () => { const t = todayString(); return get().currentPlan?.days.find(d => d.date === t)?.activities ?? []; },
  getTodayPlan: () => { const t = todayString(); return get().currentPlan?.days.find(d => d.date === t); },
}));
