import { Check } from 'lucide-react';

interface Props {
  completed: boolean;
  onClick: () => void;
}

export function CheckInButton({ completed, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
        completed
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-warm-300 hover:border-primary-400'
      }`}
    >
      {completed && <Check size={18} strokeWidth={3} />}
    </button>
  );
}
