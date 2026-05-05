import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/features/auth/auth-context';

export function PublicOnlyRoute() {
  const { isAuthenticated, isAuthInitialized } = useAuth();

  if (isAuthInitialized && isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  return <Outlet />;
}