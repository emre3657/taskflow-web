import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import { apiClient, ApiError } from '@/lib/api-client';
import type { User } from './types';

type AuthBootstrapStatus = 'checking' | 'ready' | 'error';

interface AuthContextValue {
  isAuthInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  bootstrapStatus: AuthBootstrapStatus;
  isBootstrapping: boolean;
  hasBootstrapError: boolean;
  authReason:
    | 'auth-required'
    | 'session-expired'
    | 'logged-out'
    | 'logged-out-all'
    | 'deleted-account'
    | null;
  setAuthUser: (user: User | null) => void;
  clearAuth: (
    reason?:
      | 'auth-required'
      | 'session-expired'
      | 'logged-out'
      | 'logged-out-all'
      | 'deleted-account'
      | null
  ) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [bootstrapStatus, setBootstrapStatus] =
    useState<AuthBootstrapStatus>('checking');
  const [user, setUser] = useState<User | null>(null);
  const [authReason, setAuthReason] = useState<
    | 'auth-required'
    | 'session-expired'
    | 'logged-out'
    | 'logged-out-all'
    | 'deleted-account'
    | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const data = await authApi.refresh();

        apiClient.setAccessToken(data.accessToken);
        queryClient.setQueryData(['auth-user'], data.user);

        if (isMounted) {
          setUser(data.user);
          setBootstrapStatus('ready');
        }
      } catch (error: unknown) {
        apiClient.setAccessToken(null);
        queryClient.removeQueries({ queryKey: ['auth-user'] });

        if (!isMounted) return;

        setUser(null);
        setAuthReason(null);

        if (error instanceof ApiError && error.response.status === 401) {
          setBootstrapStatus('ready');
        } else {
          setBootstrapStatus('error');
        }
      } finally {
        if (isMounted) {
          setIsAuthInitialized(true);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [queryClient]);

  useEffect(() => {
    apiClient.setUnauthorizedHandler(() => {
      apiClient.setAccessToken(null);
      queryClient.removeQueries({ queryKey: ['auth-user'] });
      setUser(null);
      setAuthReason('session-expired');
    });

    return () => {
      apiClient.setUnauthorizedHandler(null);
    };
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthInitialized,
      isAuthenticated: Boolean(user),
      user,
      bootstrapStatus,
      isBootstrapping: bootstrapStatus === 'checking',
      hasBootstrapError: bootstrapStatus === 'error',
      authReason,
      setAuthUser: (nextUser) => {
        setUser(nextUser);
        setAuthReason(null);

        if (nextUser) {
          queryClient.setQueryData(['auth-user'], nextUser);
        } else {
          queryClient.removeQueries({ queryKey: ['auth-user'] });
        }
      },
      clearAuth: (reason = null) => {
        apiClient.setAccessToken(null);
        setUser(null);
        setAuthReason(reason);
        queryClient.clear();
      },
    }),
    [authReason, bootstrapStatus, isAuthInitialized, queryClient, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}