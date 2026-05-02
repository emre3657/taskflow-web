import { createBrowserRouter } from 'react-router';
import { LandingRoute } from '@/app/routes/LandingRoute';
import { PublicOnlyRoute } from '@/app/routes/PublicOnlyRoute';
import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { AppLayout } from '@/app/layouts/AppLayout';
import { LogRegLayout } from '@/app/layouts/LogRegLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { TodosPage } from '@/pages/TodosPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingRoute />,
  },

  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <LogRegLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: '/reset-password',
            element: <ResetPasswordPage />,
          },
        ]
      }
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/todos',
            element: <TodosPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
]);