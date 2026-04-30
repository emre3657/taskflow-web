import type { UseFormHandleSubmit, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { UpdateProfileInput } from '@/features/profile/schemas';
import { FeedbackBanner, type FormFeedback } from '@/components/ui/FeedbackBanner';

interface ProfileInfoSectionProps {
  register: UseFormRegister<UpdateProfileInput>;
  handleSubmit: UseFormHandleSubmit<UpdateProfileInput>;
  onSubmit: (values: UpdateProfileInput) => void | Promise<void>;
  errors: FieldErrors<UpdateProfileInput>;
  feedback: FormFeedback;
  isSaving: boolean;
}

export function ProfileInfoSection({
  register,
  handleSubmit,
  onSubmit,
  errors,
  feedback,
  isSaving,
}: ProfileInfoSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your username and email address.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Email verification
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Verification flow will be added in the next step.
            </p>
          </div>

          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Not verified yet
          </span>
        </div>
      </div>

      <FeedbackBanner feedback={feedback} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username', {
              setValueAs: (value) =>
                typeof value === 'string' ? value.trim() || undefined : undefined,
            })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {errors.username ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.username.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              setValueAs: (value) =>
                typeof value === 'string' ? value.trim() || undefined : undefined,
            })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </section>
  );
}