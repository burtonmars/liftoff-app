'use client';

interface Props {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  color?: string;
}

export default function SliderInput({ label, hint, value, onChange, min = 1, max = 10, color = '#3D8B8B' }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className="ml-2 text-xs text-gray-400">{hint}</span>
        </div>
        <span className="text-sm font-semibold text-gray-700 tabular-nums w-4 text-right">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-300">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
