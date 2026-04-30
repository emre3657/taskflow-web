import type { UseFormHandleSubmit, UseFormRegister, FieldErrors } from 'react-hook-form';
import { PasswordInput } from '../ui/PasswordInput';
import type { UpdatePasswordInput } from '@/features/profile/schemas';
import { FeedbackBanner, type FormFeedback } from '@/components/ui/FeedbackBanner';

interface PasswordSectionProps {
  username: string;
  register: UseFormRegister<UpdatePasswordInput>;
  handleSubmit: UseFormHandleSubmit<UpdatePasswordInput>;
  onSubmit: (values: UpdatePasswordInput) => void | Promise<void>;
  errors: FieldErrors<UpdatePasswordInput>;
  feedback: FormFeedback;
  isSaving: boolean;
}

export function PasswordSection({
  username,
  register,
  handleSubmit,
  onSubmit,
  errors,
  feedback,
  isSaving,
}: PasswordSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Security</h2>
        <p className="mt-1 text-sm text-slate-500">
          Change your password to keep your account secure.
        </p>
      </div>

      <FeedbackBanner feedback={feedback} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          value={username}
          readOnly
          autoComplete="username"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-slate-700"
          >
            Current Password
          </label>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            {...register('currentPassword')}
          />
          {errors.currentPassword ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.currentPassword.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-slate-700"
          >
            New Password
          </label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            {...register('newPassword')}
          />
          {errors.newPassword ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.newPassword.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="repassword"
            className="block text-sm font-medium text-slate-700"
          >
            Confirm New Password
          </label>
          <PasswordInput
            id="repassword"
            autoComplete="new-password"
            {...register('repassword')}
          />
          {errors.repassword ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.repassword.message}
            </p>
          ) : null}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </section>
  );
}