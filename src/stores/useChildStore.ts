import { create } from 'zustand';
import { db } from '../db';
import type { ChildProfile, DimensionLevel } from '../types';
import type { DimensionId } from '../constants';
import { seedActivities } from '../db/seed';
import { syncPush } from '../utils/sync';

interface ChildState {
  profile: ChildProfile | null;
  isLoading: boolean;
  isFirstLaunch: boolean;

  loadProfile: () => Promise<void>;
  saveProfile: (p: ChildProfile) => Promise<void>;
  updateDimension: (dim: DimensionId, level: DimensionLevel) => Promise<void>;
  initializeWithSeed: () => Promise<void>;
  /** 从同步远端更新，不触发推送回环 */
  applyRemoteProfile: (p: ChildProfile) => void;
}

export const useChildStore = create<ChildState>((set, get) => ({
  profile: null,
  isLoading: true,
  isFirstLaunch: false,

  loadProfile: async () => {
    set({ isLoading: true });
    const profile = await db.childProfile.get(1);
    if (profile) {
      set({ profile, isLoading: false, isFirstLaunch: false });
    } else {
      set({ profile: null, isLoading: false, isFirstLaunch: true });
    }
  },

  saveProfile: async (p) => {
    const profile = { ...p, id: 1, updatedAt: new Date().toISOString() };
    await db.childProfile.put(profile);
    set({ profile, isFirstLaunch: false });

    // 同步推送到服务器（家人共享）
    syncPush({ profiles: { default: profile } });

    const count = await db.activities.count();
    if (count === 0) {
      await get().initializeWithSeed();
    }
  },

  applyRemoteProfile: (p) => {
    set({ profile: { ...p, id: 1 }, isLoading: false });
  },

  updateDimension: async (dim, level) => {
    const { profile } = get();
    if (!profile) return;
    const updated = { ...profile, dimensions: { ...profile.dimensions, [dim]: level }, updatedAt: new Date().toISOString() };
    await db.childProfile.put(updated);
    set({ profile: updated });
  },

  initializeWithSeed: async () => {
    const count = await db.activities.count();
    if (count === 0) {
      await db.activities.bulkAdd(seedActivities);
    }
  },
}));
