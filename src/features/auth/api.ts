import { apiClient } from '@/lib/api-client';
import type {
  AuthLoginInput,
  AuthRegisterInput,
  AuthForgotPasswordInput,
  AuthResetPasswordInput,
  AuthConfirmEmailVerificationInput,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
  LogoutAllResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResendVerificationEmailResponse,
  ConfirmEmailVerificationResponse,
} from './types';

export const authApi = {
  login: (data: AuthLoginInput): Promise<LoginResponse> =>
    apiClient.post('/auth/login', data),

  register: (data: AuthRegisterInput): Promise<RegisterResponse> =>
    apiClient.post('/auth/register', data),

  refresh: (): Promise<RefreshResponse> =>
    apiClient.post('/auth/refresh', {}),

  logout: (): Promise<LogoutResponse> =>
    apiClient.post('/auth/logout', {}),

  logoutAll: (): Promise<LogoutAllResponse> =>
    apiClient.post('/auth/logout-all', {}),

  forgotPassword: (data: AuthForgotPasswordInput): Promise<ForgotPasswordResponse> =>
    apiClient.post('/auth/forgot-password', data),

  resetPassword: (data: AuthResetPasswordInput): Promise<ResetPasswordResponse> =>
    apiClient.post('/auth/reset-password', data),

  resendVerificationEmail: (): Promise<ResendVerificationEmailResponse> =>
    apiClient.post('/auth/verify-email/resend', {}),

  confirmEmailVerification: (
    data: AuthConfirmEmailVerificationInput,
  ): Promise<ConfirmEmailVerificationResponse> =>
    apiClient.post('/auth/verify-email/confirm', data),
};