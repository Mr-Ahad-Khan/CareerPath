export function Spinner({ size = 24, className = '' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <svg viewBox="0 0 50 50" className="h-full w-full animate-spin" style={{ animationDuration: '1.2s' }}>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="rgb(var(--border))"
          strokeWidth="4"
        />
        <path
          d="M25 5 a20 20 0 0 1 0 40"
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function LoadingOverlay({ label = 'Crunching the numbers...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in-flat">
      <Spinner size={40} />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return <div className={`skeleton rounded-2xl ${className}`} />;
}
