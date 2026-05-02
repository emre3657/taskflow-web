import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfoSection } from '@/components/profile/ProfileInfoSection';
import { PasswordSection } from '@/components/profile/PasswordSection';
import { DangerZoneSection } from '@/components/profile/DangerZoneSection';
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiError } from '@/lib/api-client';
import { getFriendlyErrorMessage } from '@/utils/error';
import { useResendVerificationEmail } from '@/features/auth/hooks';
import {
  useDeleteMe,
  useMe,
  useUpdateMe,
  useUpdatePassword,
} from '@/features/profile/hooks';
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileInput,
  type UpdatePasswordInput,
} from '@/features/profile/schemas';

type FormFeedback = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

export function ProfilePage() {
  const [profileFeedback, setProfileFeedback] = useState<FormFeedback>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<FormFeedback>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const { data: me, isLoading, isError, error } = useMe();
  const updateMe = useUpdateMe();
  const updatePassword = useUpdatePassword();
  const deleteMe = useDeleteMe();
  const resendVerificationEmail = useResendVerificationEmail();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    setError: setProfileFieldError,
    clearErrors: clearProfileErrors,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: undefined,
      email: undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    setError: setPasswordFieldError,
    formState: { errors: passwordErrors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repassword: '',
    },
  });

  useEffect(() => {
    if (!me) return;

    resetProfile({
      username: me.username,
      email: me.email,
    });
  }, [me, resetProfile]);

  const handleProfileSubmit = async (values: UpdateProfileInput) => {
    if (!me) return;

    clearProfileErrors();
    setProfileFeedback(null);

    const normalizedCurrentUsername = me.username.trim();
    const normalizedCurrentEmail = me.email.trim();

    const normalizedUsername = values.username?.trim() || undefined;
    const normalizedEmail = values.email?.trim() || undefined;

    if (!normalizedUsername && !normalizedEmail) {
      setProfileFeedback({
        type: 'error',
        message: 'At least one of username or email must be provided.',
      });
      return;
    }

    const payload: UpdateProfileInput = {
      ...(normalizedUsername !== undefined &&
        normalizedUsername !== normalizedCurrentUsername && {
          username: normalizedUsername,
        }),
      ...(normalizedEmail !== undefined &&
        normalizedEmail !== normalizedCurrentEmail && {
          email: normalizedEmail,
        }),
    };

    if (!payload.username && !payload.email) {
      setProfileFeedback({
        type: 'info',
        message: 'No changes were made.',
      });
      return;
    }

    try {
      await updateMe.mutateAsync(payload);
      setProfileFeedback({
        type: 'success',
        message: 'Profile updated successfully.',
      });
    } catch (error: unknown) {
      if (!(error instanceof ApiError)) {
        setProfileFeedback({
          type: 'error',
          message: 'An unexpected error occurred. Please try again later.',
        });
        return;
      }

      const responseData = error.response.data;

      if (
        (responseData?.code === 'VALIDATION_ERROR' ||
          responseData?.code === 'CONFLICT' ||
          responseData?.code === 'UNIQUE_CONSTRAINT') &&
        Array.isArray(responseData.errors)
      ) {
        responseData.errors.forEach((fieldError) => {
          if (fieldError.field === 'username' || fieldError.field === 'email') {
            setProfileFieldError(fieldError.field, {
              type: 'server',
              message: fieldError.message,
            });
          }
        });

        return;
      }

      setProfileFeedback({
        type: 'error',
        message: getFriendlyErrorMessage(
          error,
          'Unable to update profile right now. Please try again later.',
        ),
      });
    }
  };

  const handleResendVerification = async () => {
    setProfileFeedback(null);

    try {
      const result = await resendVerificationEmail.mutateAsync();

      setProfileFeedback({
        type: 'success',
        message: result.message,
      });
    } catch (error) {
      setProfileFeedback({
        type: 'error',
        message: 'Unable to send verification email right now. Please try again later.',
      });
    }
  };

  const handlePasswordSubmit = async (values: UpdatePasswordInput) => {
    setPasswordFeedback(null);

    try {
      await updatePassword.mutateAsync(values);
      setPasswordFeedback({
        type: 'success',
        message: 'Password updated successfully.',
      });

      resetPassword({
        currentPassword: '',
        newPassword: '',
        repassword: '',
      });
    } catch (error: unknown) {
      if (!(error instanceof ApiError)) {
        setPasswordFeedback({
          type: 'error',
          message: 'An unexpected error occurred. Please try again later.',
        });
        return;
      }

      const responseData = error.response.data;

      if (
        responseData?.code === 'VALIDATION_ERROR' &&
        Array.isArray(responseData.errors)
      ) {
        responseData.errors.forEach((fieldError) => {
          if (
            fieldError.field === 'currentPassword' ||
            fieldError.field === 'newPassword' ||
            fieldError.field === 'repassword'
          ) {
            setPasswordFieldError(fieldError.field, {
              type: 'server',
              message: fieldError.message,
            });
          }
        });

        return;
      }

      if (
        responseData?.code === 'UNAUTHORIZED' ||
        responseData?.code === 'UNAUTHENTICATED'
      ) {
        setPasswordFieldError('currentPassword', {
          type: 'server',
          message: responseData.message || 'Current password is incorrect.',
        });
        return;
      }

      setPasswordFeedback({
        type: 'error',
        message: getFriendlyErrorMessage(
          error,
          'Unable to update password right now. Please try again later.',
        ),
      });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);

    try {
      await deleteMe.mutateAsync();
    } catch (error) {
      setDeleteError(
        getFriendlyErrorMessage(
          error,
          'Unable to delete account right now. Please try again later.',
        ),
      );
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  if (isError || !me) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          {getFriendlyErrorMessage(
            error,
            'Unable to load profile right now. Please try again later.',
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileHeader />

        <div className="space-y-6">
         <ProfileInfoSection
          register={registerProfile}
          handleSubmit={handleSubmitProfile}
          onSubmit={handleProfileSubmit}
          errors={profileErrors}
          feedback={profileFeedback}
          isSaving={updateMe.isPending}
          emailVerifiedAt={me.emailVerifiedAt}
          isResendingVerification={resendVerificationEmail.isPending}
          onResendVerification={handleResendVerification}
        />

          <PasswordSection
            username={me.username}  
            register={registerPassword}
            handleSubmit={handleSubmitPassword}
            onSubmit={handlePasswordSubmit}
            errors={passwordErrors}
            feedback={passwordFeedback}
            isSaving={updatePassword.isPending}
          />

          <DangerZoneSection
            deleteError={deleteError}
            onDeleteClick={() => {
              setDeleteError(null);
              setDeleteConfirmation('');
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      </div>

      <DeleteAccountModal
        open={isDeleteModalOpen}
        confirmation={deleteConfirmation}
        onConfirmationChange={setDeleteConfirmation}
        onCancel={() => {
          setDeleteConfirmation('');
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteAccount}
        isDeleting={deleteMe.isPending}
      />
    </>
  );
}