import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from './api';
import type { ProfileUser } from './types';
import type {
  UpdatePasswordInput,
  UpdateProfileInput,
} from './schemas';
import { useAuth } from '@/features/auth/auth-context';
import { apiClient } from '@/lib/api-client';

export const useMe = () => {
  return useQuery<ProfileUser, Error>({
    queryKey: ['me'],
    queryFn: profileApi.getMe,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const { setAuthUser } = useAuth();

  return useMutation<ProfileUser, Error, UpdateProfileInput>({
    mutationFn: profileApi.updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user);
      setAuthUser({
        id: user.id,
        username: user.username,
        emailVerifiedAt: user.emailVerifiedAt,
      });
    },
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileUser, Error, UpdatePasswordInput>({
    mutationFn: profileApi.updatePassword,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user);
    },
  });
};

export const useDeleteMe = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuth();

  return useMutation<void, Error, void>({
    mutationFn: profileApi.deleteMe,
    onSuccess: () => {
      apiClient.setAccessToken(null);
      clearAuth("deleted-account");
      queryClient.clear();
    },
  });
};