import { initials } from '@/lib/format.js';

const palette = [
  '#ffb340', '#3ddc97', '#5dade2', '#e74c8b',
  '#9b7ed4', '#f4845f', '#5ab1bb', '#d4a017',
];

export function Avatar({ name, color, size = 40, className = '' }) {
  const bg = color || palette[(name?.charCodeAt(0) || 0) % palette.length];
  return (
    <div
      className={`flex items-center justify-center rounded-full font-display font-semibold text-background shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.36,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
