import { Link } from 'react-router';
import { useAuth } from '@/features/auth/auth-context';

export function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 text-center">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-10 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Page Not Found
        </p>

        <h1 className="mt-4 text-6xl font-bold tracking-tight text-slate-900">
          404
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          The page you are looking for does not exist, may have been moved, or the
          URL may be incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {!isAuthenticated 
            ? 
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Go to Home
              </Link>
            :
              null
          }
          <Link
            to={isAuthenticated ? '/todos' : '/login'}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {isAuthenticated ? 'Go to Todos' : 'Go to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}