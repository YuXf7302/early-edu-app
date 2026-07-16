import { create } from 'zustand';
import type { EnergyMode } from '../constants';

export type FontSizeMode = 'normal' | 'large' | 'xl';

interface AppState {
  currentDate: string;
  energyMode: EnergyMode;
  activeTab: string;
  fontSize: FontSizeMode;
  setEnergyMode: (mode: EnergyMode) => void;
  setCurrentDate: (date: string) => void;
  setActiveTab: (tab: string) => void;
  setFontSize: (size: FontSizeMode) => void;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export const useAppStore = create<AppState>((set) => ({
  currentDate: getToday(),
  energyMode: 'standard',
  activeTab: '/',
  fontSize: 'large',  // 默认大字模式，照顾老人视力
  setEnergyMode: (mode) => set({ energyMode: mode }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFontSize: (fontSize) => set({ fontSize }),
}));
