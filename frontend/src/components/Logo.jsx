export function Logo({ className = "", showText = true }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <img
        src="/careerpath-logo.svg"
        alt=""
        className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
        aria-hidden="true"
      />
      {showText && (
        <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Career<span className="text-accent">Path</span>
        </span>
      )}
    </div>
  );
}

