export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            CareerPath — a 5-year career simulation engine.
          </p>
          <p className="text-xs text-muted">
            Built as an MCA capstone project. Projections are estimates, not guarantees.
          </p>
        </div>
      </div>
    </footer>
  );
}
