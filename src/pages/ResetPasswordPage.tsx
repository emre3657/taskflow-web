import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiError } from '@/lib/api-client';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas';
import { useResetPassword } from '@/features/auth/hooks';
import { FeedbackBanner, type FormFeedback } from '@/components/ui/FeedbackBanner';

export function ResetPasswordPage() {
  const [feedback, setFeedback] = useState<FormFeedback>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();

  const token = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      repassword: '',
    },
  });

  useEffect(() => {
    setValue('token', token);
  }, [setValue, token]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setFeedback(null);

    if (!token) {
      setFeedback({
        type: 'error',
        message: 'This password reset link is invalid or missing a token.',
      });
      return;
    }

    try {
      await resetPassword.mutateAsync({
        ...data,
        token,
      });

      navigate('/login', {
        replace: true,
        state: {
          reason: 'password-reset-success',
        },
      });
    } catch (error: unknown) {
      if (!(error instanceof ApiError)) {
        setFeedback({
          type: 'error',
          message: 'An unexpected error occurred. Please try again later.',
        });
        return;
      }

      const responseData = error.response.data;

      if (responseData?.code === 'VALIDATION_ERROR' && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((fieldError) => {
          if (
            fieldError.field === 'token' ||
            fieldError.field === 'newPassword' ||
            fieldError.field === 'repassword'
          ) {
            setError(fieldError.field, {
              type: 'server',
              message: fieldError.message,
            });
          }
        });
        return;
      }

      setFeedback({
        type: 'error',
        message:
          responseData?.message?.trim() ||
          'Unable to reset password right now. Please try again later.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Reset Password
        </h1>
        <p className="mb-6 text-sm leading-6 text-slate-600">
          Choose a new password for your account.
        </p>

        <FeedbackBanner feedback={feedback} borderRadius="xl" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <input type="hidden" {...register('token')} />

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
              New Password
            </label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              {...register('newPassword')}
              className="mt-2 rounded-xl border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-100"
            />
            {errors.newPassword ? (
              <p className="mt-1 text-xs text-rose-600">{errors.newPassword.message}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="repassword" className="block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <PasswordInput
              id="repassword"
              autoComplete="new-password"
              {...register('repassword')}
              className="mt-2 rounded-xl border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-100"
            />
            {errors.repassword ? (
              <p className="mt-1 text-xs text-rose-600">{errors.repassword.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className="cursor-pointer w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Back to{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}