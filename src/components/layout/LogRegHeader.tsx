import { Link } from 'react-router';
import { HomeIcon } from '@heroicons/react/24/outline';
import logo from '@/assets/taskflow-logo.png';

export function LogRegHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <img src={logo} alt="TaskFlow Logo" className="h-14 w-auto" />

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-3xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
      </div>
    </header>
  );
}