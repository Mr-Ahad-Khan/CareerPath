export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center animate-fade-in">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <div className="max-w-sm space-y-1.5">
        <h3 className="font-display text-xl text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted text-pretty">{description}</p>}
      </div>
      {action}
    </div>
  );
}
