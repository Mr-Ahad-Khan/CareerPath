export function Logo({ className = "", showText = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/careerpath-logo.svg"
        alt=""
        className="h-8 w-8 object-contain"
        aria-hidden="true"
      />
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Career<span className="text-accent">Path</span>
        </span>
      )}
    </div>
  );
}
