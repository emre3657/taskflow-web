import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api-client';
import type { LoginInput } from '@/features/auth/schemas';
import { useAuth } from '@/features/auth/auth-context';
import { StatusBanner } from '@/components/ui/StatusBanner';

export function LoginPage() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const login = useLogin();
  const location = useLocation();
  const { bootstrapStatus, isBootstrapping, hasBootstrapError } = useAuth();

  const isServerUnavailable = isBootstrapping || hasBootstrapError;

  const routeReason =
    location.state &&
    typeof location.state === 'object' &&
    'reason' in location.state &&
    (location.state.reason === 'session-expired' ||
      location.state.reason === 'auth-required' ||
      location.state.reason === 'logged-out' ||
      location.state.reason === 'logged-out-all' ||
      location.state.reason === 'password-reset-success' ||
      location.state.reason === 'email-verified-success')
      ? location.state.reason
      : null;

  const authFeedback =
    routeReason === 'session-expired'
      ? {
          message: 'Your session has expired. Please log in again.',
          tone: 'warning' as const,
        }
      : routeReason === 'auth-required'
      ? {
          message: 'Please log in to continue.',
          tone: 'warning' as const,
        }
      : routeReason === 'logged-out'
      ? {
          message: 'You have been logged out successfully.',
          tone: 'success' as const,
        }
      : routeReason === 'logged-out-all'
      ? {
          message: 'You have been logged out from all sessions.',
          tone: 'success' as const,
        }
      : routeReason === 'password-reset-success'
      ? {
          message: 'Your password has been reset successfully. Please log in.',
          tone: 'success' as const,
        }
      : routeReason === 'email-verified-success'
      ? {
          message: 'Your email has been verified successfully. You can log in now.',
          tone: 'success' as const,
        }
      : null;

  const bootstrapFeedback = isBootstrapping
    ? {
        message: 'Server is starting...',
        tone: 'warning' as const,
        showSpinner: true,
      }
    : hasBootstrapError
    ? {
        message: 'Server is unavailable.',
        tone: 'error' as const,
        showSpinner: false,
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
      const status = error.response.status;

      if (
        responseData?.code === 'VALIDATION_ERROR' &&
        Array.isArray(responseData.errors)
      ) {
        responseData.errors.forEach(
          (fieldError: { field: string; message: string }) => {
            if (fieldError.field) {
              setError(fieldError.field as 'username' | 'password', {
                type: 'server',
                message: fieldError.message,
              });
            }
          },
        );
        return;
      }

      if (responseData?.code === 'UNAUTHENTICATED') {
        setGlobalError('Invalid username or password.');
        return;
      }

      if (status === 429) {
        setGlobalError('Too many login attempts. Please try again later.');
        return;
      } 

      setGlobalError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex h-full min-h-full items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-semibold">Welcome Back</h1>

        {bootstrapFeedback ? (
          <StatusBanner
            message={bootstrapFeedback.message}
            tone={bootstrapFeedback.tone}
            showSpinner={bootstrapFeedback.showSpinner}
          />
        ) : null}

        {authFeedback && !globalError && bootstrapStatus === 'ready' ? (
          <StatusBanner
            message={authFeedback.message}
            tone={authFeedback.tone}
          />
        ) : null}

        {globalError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {globalError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              autoComplete="username"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {errors.username ? (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <PasswordInput
              id="password"
              {...register('password')}
              autoComplete="current-password"
              className="mt-1 rounded-xl border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-100"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            ) : null}

            <div className="mt-2 flex justify-end">
              {bootstrapStatus === 'ready' ? (
                <Link
                  to="/forgot-password"
                  className="cursor-pointer rounded-xl px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Forgot password?
                </Link>
              ) : (
                <span className="rounded-xl px-2 py-1 text-sm text-slate-400">
                  Forgot password?
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={login.isPending || isServerUnavailable}
            className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBootstrapping
              ? 'Server is starting...'
              : hasBootstrapError
              ? 'Server unavailable'
              : login.isPending
              ? 'Submitting...'
              : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}