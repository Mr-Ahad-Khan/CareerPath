export function Logo({ className = '', showText = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-8 w-8 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
          <path
            d="M7 23 L7 9 L16 15 L25 9 L25 23"
            stroke="rgb(var(--accent))"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="15" r="2.5" fill="rgb(var(--accent))" />
        </svg>
      </div>
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Career<span className="text-accent">Path</span>
        </span>
      )}
    </div>
  );
}
