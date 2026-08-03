import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-8xl font-semibold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">This path does not exist yet.</h1>
      <p className="mt-2 text-muted">The page you are looking for is not part of your career simulation. Let us get you back on track.</p>
      <Link to="/" className="btn-primary mt-6">Back to CareerPath</Link>
    </div>
  );
}

export default NotFoundPage;
