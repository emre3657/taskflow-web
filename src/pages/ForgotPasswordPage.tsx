import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiError } from '@/lib/api-client';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas';
import { useForgotPassword } from '@/features/auth/hooks';
import { FeedbackBanner, type FormFeedback } from '@/components/ui/FeedbackBanner';

export function ForgotPasswordPage() {
  const [feedback, setFeedback] = useState<FormFeedback>(null);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setFeedback(null);

    try {
      const result = await forgotPassword.mutateAsync(data);

      setFeedback({
        type: 'success',
        message:
          result.message ||
          'If an account with that email exists, a reset link has been sent.',
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
          if (fieldError.field === 'email') {
            setError('email', {
              type: 'server',
              message: fieldError.message,
            });
          }
        });
        return;
      }

      setFeedback({
        type: 'error',
        message: responseData?.message?.trim() || 'Unable to send reset email right now.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Forgot Password
        </h1>
        <p className="mb-6 text-sm leading-6 text-slate-600">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <FeedbackBanner feedback={feedback} borderRadius="xl" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="cursor-pointer w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {forgotPassword.isPending ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}