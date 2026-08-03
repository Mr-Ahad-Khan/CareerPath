import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth.jsx';
import { LoadingOverlay } from './Spinner.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingOverlay label="Checking your session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingOverlay label="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
