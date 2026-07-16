import { DIMENSION_LABELS, DIMENSION_ICONS, DIMENSION_COLORS, type DimensionId } from '../../constants';
import type { DimensionLevel } from '../../types';

interface Props {
  dimId: DimensionId;
  value: DimensionLevel;
  onChange: (level: DimensionLevel) => void;
}

export function DimensionForm({ dimId, value, onChange }: Props) {
  const label = DIMENSION_LABELS[dimId];
  const icon = DIMENSION_ICONS[dimId];
  const color = DIMENSION_COLORS[dimId];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-medium text-warm-700 text-sm">{label}</span>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + '20', color }}
        >
          当前: {value.current} / 目标: {value.target}
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs text-warm-500 mb-1">
            <span>当前水平</span>
            <span>{value.current} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={value.current}
            onChange={(e) =>
              onChange({ ...value, current: Number(e.target.value) })
            }
            className="w-full h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: color }}
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-warm-500 mb-1">
            <span>近期目标</span>
            <span>{value.target} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={value.target}
            onChange={(e) =>
              onChange({ ...value, target: Number(e.target.value) })
            }
            className="w-full h-2 bg-warm-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: color }}
          />
        </div>
      </div>
    </div>
  );
}
