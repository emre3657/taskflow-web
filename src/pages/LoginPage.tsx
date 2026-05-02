import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api-client';
import type { LoginInput } from '@/features/auth/schemas';

export function LoginPage() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const login = useLogin();
  const location = useLocation();

  const routeReason =
    location.state &&
    typeof location.state === 'object' &&
    'reason' in location.state &&
    (
      location.state.reason === 'session-expired' ||
      location.state.reason === 'auth-required' ||
      location.state.reason === 'logged-out' ||
      location.state.reason === 'logged-out-all' ||
      location.state.reason === 'password-reset-success' ||
      location.state.reason === 'email-verified-success'
    )
      ? location.state.reason
      : null;

  const authFeedback =
    routeReason === 'session-expired'
      ? {
          message: 'Your session has expired. Please log in again.',
          className: 'border-amber-200 bg-amber-50 text-amber-800',
        }
      : routeReason === 'auth-required'
      ? {
          message: 'Please log in to continue.',
          className: 'border-amber-200 bg-amber-50 text-amber-800',
        }
      : routeReason === 'logged-out'
      ? {
          message: 'You have been logged out successfully.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        }
      : routeReason === 'logged-out-all'
      ? {
          message: 'You have been logged out from all sessions.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        }
      : routeReason === 'password-reset-success'
      ? {
          message: 'Your password has been reset successfully. Please log in.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        }
      : routeReason === 'email-verified-success'
      ? {
          message: 'Your email has been verified successfully. You can log in now.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        }
      : null;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setGlobalError(null);

    try {
      await login.mutateAsync(data);
    } catch (error: unknown) {
      if (!(error instanceof ApiError)) {
        setGlobalError('An unexpected error occurred. Please try again later.');
        return;
      }

      const responseData = error.response.data;

      if (responseData?.code === 'VALIDATION_ERROR' && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((fieldError: { field: string; message: string }) => {
          if (fieldError.field) {
            setError(fieldError.field as 'username' | 'password', {
              type: 'server',
              message: fieldError.message,
            });
          }
        });
        return;
      }

      if (responseData?.code === 'UNAUTHENTICATED') {
        setGlobalError('Invalid username or password.');
        return;
      }

      setGlobalError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="h-full min-h-full flex items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6">Welcome Back</h1>

        {authFeedback && !globalError && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${authFeedback.className}`}>
            {authFeedback.message}
          </div>
        )}

        {globalError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              autoComplete='username'
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <PasswordInput
              id="password"
              {...register('password')}
              autoComplete="current-password"
              className="mt-1 rounded-xl border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-100"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}

            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="rounded-xl px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="cursor-pointer w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {login.isPending ? 'Submitting...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}