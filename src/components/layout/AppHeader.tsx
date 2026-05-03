import { Link } from 'react-router';
import { UserMenu } from '@/components/layout/UserMenu';
import logo from '@/assets/taskflow-logo.png';

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/todos"
          className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-slate-700"
        >
          <img src={logo} alt="TaskFlow Logo" className="h-14 w-auto" />
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}