import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ApiError } from '@/lib/api-client';
import { useAuth } from '@/features/auth/auth-context';
import { useConfirmEmailVerification } from '@/features/auth/hooks';

type VerifyStatus = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const confirmEmailVerification = useConfirmEmailVerification();

  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const { user, setAuthUser } = useAuth();

  const token = searchParams.get('token') ?? '';

  useEffect(() => {
    let cancelled = false;

    const verifyEmail = async () => {
      if (!token) {
        if (!cancelled) {
          setStatus('error');
          setMessage('This verification link is invalid or missing a token.');
        }
        return;
      }

      try {
        const result = await confirmEmailVerification.mutateAsync({ token });

        if (user) {
          setAuthUser({
            ...user,
            emailVerifiedAt: new Date().toISOString(),
          });
        }

        if (!cancelled) {
          setStatus('success');
          setMessage(result.message || 'Your email has been verified successfully.');
        }
      } catch (error: unknown) {
        if (cancelled) return;

        if (error instanceof ApiError) {
          setStatus('error');
          setMessage(
            error.response.data?.message?.trim() ||
              'This verification link is invalid or has expired.',
          );
          return;
        }

        setStatus('error');
        setMessage('Unable to verify your email right now. Please try again later.');
      }
    };

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {status === 'loading' ? (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            <h1 className="text-2xl font-semibold text-slate-900">Verifying Email</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
              ✓
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Email Verified</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

            <div className="mt-6">
              <Link
                to="/login"
                state={{ reason: 'email-verified-success' }}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Continue to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-700">
              !
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Verification Failed</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Login
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Go to Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}