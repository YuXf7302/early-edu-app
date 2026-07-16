import { create } from 'zustand';
import { db } from '../db';
import type { DailyRecord, Milestone } from '../types';

interface RecordState {
  records: DailyRecord[];
  milestones: Milestone[];
  isLoading: boolean;

  addNote: (record: Omit<DailyRecord, 'id'>) => Promise<void>;
  loadByDateRange: (from: string, to: string) => Promise<void>;
  loadAllRecords: () => Promise<void>;
  loadAllMilestones: () => Promise<void>;
}

export const useRecordStore = create<RecordState>((set) => ({
  records: [],
  milestones: [],
  isLoading: false,

  addNote: async (record) => {
    const id = await db.dailyRecords.add(record as DailyRecord);
    set((s) => ({
      records: [{ ...record, id } as DailyRecord, ...s.records],
    }));
  },

  loadByDateRange: async (from, to) => {
    set({ isLoading: true });
    const records = await db.dailyRecords
      .where('date')
      .between(from, to, true, true)
      .toArray();
    set({ records, isLoading: false });
  },

  loadAllRecords: async () => {
    set({ isLoading: true });
    const records = await db.dailyRecords.toArray();
    set({ records, isLoading: false });
  },

  loadAllMilestones: async () => {
    const milestones = await db.milestones.toArray();
    set({ milestones });
  },
}));
