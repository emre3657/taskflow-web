import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ConfirmEmailVerificationInput,
} from './schemas';

export interface User {
  id: string;
  username: string;
  emailVerifiedAt: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthMessageResponse {
  message: string;
}

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;
export type RefreshResponse = AuthResponse;
export type LogoutResponse = void;
export type LogoutAllResponse = void;
export type ForgotPasswordResponse = AuthMessageResponse;
export type ResetPasswordResponse = AuthMessageResponse;
export type ResendVerificationEmailResponse = AuthMessageResponse;
export type ConfirmEmailVerificationResponse = AuthMessageResponse;

export type AuthRegisterInput = RegisterInput;
export type AuthLoginInput = LoginInput;
export type AuthForgotPasswordInput = ForgotPasswordInput;
export type AuthResetPasswordInput = ResetPasswordInput;
export type AuthConfirmEmailVerificationInput = ConfirmEmailVerificationInput;