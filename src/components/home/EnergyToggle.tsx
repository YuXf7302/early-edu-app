import { useAppStore } from '../../stores/useAppStore';
import { ENERGY_LABELS, type EnergyMode } from '../../constants';
import { Zap, Battery, Flame } from 'lucide-react';

const ICONS: Record<EnergyMode, typeof Zap> = {
  light: Battery,
  standard: Zap,
  deep: Flame,
};

const modes: EnergyMode[] = ['light', 'standard', 'deep'];

export function EnergyToggle() {
  const { energyMode, setEnergyMode } = useAppStore();

  return (
    <div className="flex bg-warm-100 rounded-xl p-1 gap-1">
      {modes.map((mode) => {
        const isActive = energyMode === mode;
        const Icon = ICONS[mode];
        return (
          <button
            key={mode}
            onClick={() => setEnergyMode(mode)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-warm-800 shadow-sm'
                : 'text-warm-400'
            }`}
          >
            <Icon size={16} />
            {ENERGY_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
}
