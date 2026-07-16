import { useState, useEffect } from 'react';
import { useRecordStore } from '../../stores/useRecordStore';
import { usePlanStore } from '../../stores/usePlanStore';
import { db } from '../../db';
import { DIMENSION_ICONS, type DimensionId } from '../../constants';
import { Send, Star } from 'lucide-react';

export function NoteEditor() {
  const { addNote } = useRecordStore();
  const { getTodayPlan } = usePlanStore();
  const [note, setNote] = useState('');
  const [selectedActId, setSelectedActId] = useState<number | undefined>();
  const [isMilestone, setIsMilestone] = useState(false);
  const [saved, setSaved] = useState(false);

  const todayPlan = getTodayPlan();
  const todayActivities = todayPlan?.activities ?? [];
  const [activities, setActivities] = useState<{ id: number; title: string; dimId: DimensionId }[]>([]);

  useEffect(() => {
    Promise.all(
      todayActivities.map((a) => db.activities.get(a.activityId)),
    ).then((results) => {
      setActivities(
        results.filter(Boolean).map((a) => ({
          id: a!.id!,
          title: a!.title,
          dimId: a!.dimensionId,
        })),
      );
    });
  }, [todayActivities]);

  const handleSave = async () => {
    if (!note.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    await addNote({
      date: today,
      activityId: selectedActId,
      note: note.trim(),
      milestone: isMilestone ? note.trim() : undefined,
      createdAt: new Date().toISOString(),
    });
    setNote('');
    setIsMilestone(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-warm-700 mb-3">✍️ 记录观察</h3>

      {/* 关联活动选择 */}
      {activities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            onClick={() => setSelectedActId(undefined)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              !selectedActId ? 'bg-primary-100 text-primary-600' : 'bg-warm-100 text-warm-500'
            }`}
          >
            通用笔记
          </button>
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedActId(a.id)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                selectedActId === a.id ? 'bg-primary-100 text-primary-600' : 'bg-warm-100 text-warm-500'
              }`}
            >
              {DIMENSION_ICONS[a.dimId]} {a.title}
            </button>
          ))}
        </div>
      )}

      {/* 笔记输入 */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="今天宝宝有什么有趣的表现？有什么新的进步？"
        rows={3}
        className="w-full px-3 py-2 rounded-xl border border-warm-300 bg-warm-50 text-sm text-warm-800
                   focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none
                   placeholder:text-warm-400"
      />

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setIsMilestone(!isMilestone)}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            isMilestone ? 'bg-amber-100 text-amber-700' : 'bg-warm-100 text-warm-500'
          }`}
        >
          <Star size={14} fill={isMilestone ? '#d97706' : 'none'} />
          里程碑
        </button>

        <button
          onClick={handleSave}
          disabled={!note.trim()}
          className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4 disabled:opacity-40"
        >
          <Send size={14} />
          {saved ? '已保存 ✓' : '保存'}
        </button>
      </div>
    </div>
  );
}
