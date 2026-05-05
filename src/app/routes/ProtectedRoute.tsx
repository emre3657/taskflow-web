import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute() {
  const { isAuthenticated, isAuthInitialized, authReason } = useAuth();
  const location = useLocation();

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-slate-50">
        <span className="text-slate-600">Waiting for authentication...</span>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authReason === 'deleted-account') {
      return (
        <Navigate
          to="/"
          replace
          state={{
            from: location,
            reason: authReason,
          }}
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          reason: authReason ?? 'auth-required',
        }}
      />
    );
  }

  return <Outlet />;
}