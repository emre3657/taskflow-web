import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/features/auth/auth-context';
import { useLogout, useLogoutAll } from '@/features/auth/hooks';
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { getFriendlyErrorMessage } from '@/utils/error';

export function UserMenu() {
  const { user } = useAuth();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const [open, setOpen] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async (allSessions: boolean) => {
    setMenuError(null);
    setOpen(false);

    try {
      if (allSessions) {
        await logoutAll.mutateAsync();
        return;
      }

      await logout.mutateAsync();
    } catch (error) {
      setMenuError(
        getFriendlyErrorMessage(
          error,
          'Unable to log out right now. Please try again later.',
        ),
      );
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          setMenuError(null);
          setOpen((prev) => !prev);
        }}
        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {user?.username?.slice(0, 1).toUpperCase() ?? 'U'}
        </span>
        <span className="hidden sm:block">
          {user && user.username.length > 15
            ? `${user.username.slice(0, 15)}...`
            : user?.username ?? 'User'}
        </span>
        <ChevronDownIcon
          className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {menuError ? (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
          {menuError}
        </div>
      ) : null}

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <UserCircleIcon className="h-4 w-4 text-slate-500" />
            <span>Profile</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              void handleLogout(false);
            }}
            disabled={logout.isPending || logoutAll.isPending}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4 text-rose-600" />
            <span>{logout.isPending ? 'Logging out...' : 'Log out'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              void handleLogout(true);
            }}
            disabled={logout.isPending || logoutAll.isPending}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4 text-rose-600" />
            <span>{logoutAll.isPending ? 'Logging out...' : 'Log out all sessions'}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}