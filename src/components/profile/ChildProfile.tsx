import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildStore } from '../../stores/useChildStore';
import { DimensionForm } from './DimensionForm';
import {
  DIMENSION_LABELS,
  INTEREST_TAG_LABELS,
  type DimensionId,
  type InterestTag,
} from '../../constants';
import type { ChildProfile, DimensionLevel } from '../../types';

const DEFAULT_DIMENSION: DimensionLevel = { current: 2, target: 3 };

export function ChildProfile() {
  const navigate = useNavigate();
  const { profile, isFirstLaunch, loadProfile, saveProfile } = useChildStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('2023-05-19');
  const [dimensions, setDimensions] = useState<Record<DimensionId, DimensionLevel>>(
    Object.keys(DIMENSION_LABELS).reduce((acc, k) => ({ ...acc, [k]: { ...DEFAULT_DIMENSION } }), {} as Record<DimensionId, DimensionLevel>),
  );
  const [interests, setInterests] = useState<InterestTag[]>(['car', 'boardGame', 'steam', 'pictureBook']);

  useEffect(() => { loadProfile(); }, []);
  useEffect(() => {
    if (profile) { setName(profile.name); setBirthDate(profile.birthDate); setDimensions(profile.dimensions); setInterests(profile.interestTags); }
  }, [profile]);

  const handleSave = async () => {
    const p: ChildProfile = {
      id: 1, name: name || '宝宝', birthDate, dimensions, interestTags: interests,
      constraints: { weekdayStartTime: '19:30', weekdayEndTime: '20:30', screenQuotaPerWeek: 3, screenMaxMinutes: 20, enrollmentDate: '2026-09-01' },
      ...(birthDate === '2023-05-19' ? { bazi: { yearPillar: '癸卯', monthPillar: '丁巳', dayPillar: '丁丑', hourPillar: '丁未' } } : {}),
      createdAt: profile?.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await saveProfile(p);
    navigate('/');
  };

  const toggleInterest = (tag: InterestTag) => setInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  if (!isFirstLaunch && !profile) return <div className="p-8 text-center"><p className="text-warm-500">加载中...</p></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-warm-800 mb-1">{isFirstLaunch ? '👋 欢迎！' : '🧒 孩子档案'}</h1>
      <p className="text-sm text-warm-500 mb-6">{isFirstLaunch ? '先来设置孩子的基本信息吧' : '随时可以更新以下信息'}</p>

      <div className="flex gap-2 mb-6">
        {['基本信息', '能力评估', '兴趣爱好'].map((label, i) => (
          <button key={i} onClick={() => setStep(i)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${step === i ? 'bg-primary-500 text-white' : 'bg-warm-100 text-warm-500'}`}>{label}</button>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">孩子昵称</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="输入小名" className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">出生日期</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-warm-300 bg-white text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="card bg-primary-50 border-primary-200">
            <p className="text-sm text-primary-700">💡 孩子将于 <strong>2026年9月</strong> 入园，系统会自动加强自理能力的训练频率。</p>
          </div>
          {birthDate === '2023-05-19' && (
            <div className="card bg-purple-50 border-purple-200">
              <p className="text-xs text-purple-700 font-mono mb-1">🪷 八字：癸卯 丁巳 丁丑 丁未</p>
              <p className="text-xs text-purple-600">日主丁火 · 从旺格 · 顺势引导不硬压 · 系统已自动调优活动推荐</p>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-warm-500 mb-2">为每个维度打分（1=刚起步, 3=同龄水平, 5=超前），帮助推荐合适难度的活动</p>
          {(Object.keys(DIMENSION_LABELS) as DimensionId[]).map(dim => (
            <DimensionForm key={dim} dimId={dim} value={dimensions[dim]} onChange={level => setDimensions(prev => ({ ...prev, [dim]: level }))} />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-warm-500 mb-2">选择孩子喜欢的活动类型，系统会更多推荐这些主题</p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(INTEREST_TAG_LABELS) as [InterestTag, string][]).map(([tag, label]) => (
              <button key={tag} onClick={() => toggleInterest(tag)} className={`chip text-base py-2 px-4 ${interests.includes(tag) ? 'chip-active' : ''}`}>{label}</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8 mb-4">
        {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1">上一步</button>}
        {step < 2 ? <button onClick={() => setStep(step + 1)} className="btn-primary flex-1">下一步</button> : <button onClick={handleSave} className="btn-primary flex-1">💾 保存档案</button>}
      </div>
    </div>
  );
}
