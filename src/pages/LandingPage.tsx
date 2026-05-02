import { Link } from 'react-router';
import { CheckCircleIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/features/auth/auth-context';

const features = [
  {
    title: 'Stay Organized',
    description:
      'Create, filter, and manage your tasks with a clean workflow that helps you stay focused.',
    icon: CheckCircleIcon,
  },
  {
    title: 'Track Priorities',
    description:
      'Set priorities and due dates so you always know what needs attention next.',
    icon: ClockIcon,
  },
  {
    title: 'Secure Access',
    description:
      'Use account verification, password reset, and session controls to keep your account protected.',
    icon: ShieldCheckIcon,
  },
];

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            TaskFlow
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Organize your tasks with clarity and focus
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            Manage your todos, keep track of priorities, and stay on top of deadlines
            with a simple and reliable workflow.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link
                to="/todos"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Go to Todos
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-white">
        <div className="text-center px-4 py-3 text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} TaskFlow - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}