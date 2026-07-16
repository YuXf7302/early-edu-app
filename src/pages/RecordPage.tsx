import { NoteEditor } from '../components/record/NoteEditor';
import { Timeline } from '../components/record/Timeline';

export function RecordPage() {
  return (
    <div className="page-container">
      <h1 className="text-xl font-bold text-warm-800 mb-4">✍️ 观察记录</h1>
      <NoteEditor />
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-warm-600 mb-3">成长时间线</h2>
        <Timeline />
      </div>
    </div>
  );
}
