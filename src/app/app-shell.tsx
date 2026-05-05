import { RouterProvider } from 'react-router';
import { router } from '@/app/router';

export function AppShell() {
  return <RouterProvider router={router} />;
}