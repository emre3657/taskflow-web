import type { Todo } from '@/features/todos/types';
import { formatLocalDateTime } from '@/features/todos/date-utils';
import { badgeColor } from '@/features/todos/priority-utils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onViewDetails: (todo: Todo) => void;
}

function getDueStatus(todo: Todo) {
  if (!todo.dueDate) {
    return null;
  }

  const now = new Date();
  const due = new Date(todo.dueDate);
  const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;

  if (todo.completed) {
    if (completedAt && due.getTime() > completedAt.getTime()) {
      return { label: 'Completed on time', tone: 'bg-emerald-100 text-emerald-700' };
    }

    if (completedAt && due.getTime() <= completedAt.getTime()) {
      return { label: 'Completed late', tone: 'bg-rose-100 text-rose-700' };
    }

    return { label: 'Completed', tone: 'bg-slate-100 text-slate-700' };
  }

  if (due.getTime() <= now.getTime()) {
    return { label: 'Overdue', tone: 'bg-rose-100 text-rose-700' };
  }

  const diffHours = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60));
  const days = Math.floor(diffHours / 24);
  const remaining = days > 0 ? `${days} day${days === 1 ? '' : 's'} left` : `${diffHours} hour${diffHours === 1 ? '' : 's'} left`;

  return { label: remaining, tone: 'bg-amber-100 text-amber-700' };
}

export function TodoItem({ todo, onToggleComplete, onEdit, onDelete, onViewDetails }: TodoItemProps) {
  const dueStatus = getDueStatus(todo);

  return (
    <li className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="grid gap-4 sm:grid-cols-[44px_minmax(0,1fr)] sm:items-start">
        <button
          type="button"
          onClick={() => onToggleComplete(todo)}
          aria-label={todo.completed ? 'Unmark completed' : 'Mark todo as completed'}
          title={todo.completed ? 'Unmark completed' : 'Mark todo as completed'}
          className={`cursor-pointer flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border text-lg transition ${
            todo.completed
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
              : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50'
          }`}
        >
          {todo.completed ? '✓' : '○'}
        </button>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0 flex flex-col gap-1 text-left pl-2">
              <h3 className={`text-sm font-semibold tracking-tight text-left ${
                todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className="line-clamp-1 text-xs text-slate-600 max-w-sm text-left">
                  {todo.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                badgeColor(todo.priority)
              }`}>
                {todo.priority}
              </span>
              {dueStatus && (
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  dueStatus.tone
                }`}>
                  {dueStatus.label}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-0 text-xs text-slate-500 pl-2 text-left">
            {todo.dueDate ? (
              <span>Due {formatLocalDateTime(todo.dueDate)}</span>
            ) : (
              <span>No due date</span>
            )}
            {todo.completedAt ? (
              <span>Completed {formatLocalDateTime(todo.completedAt)}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onViewDetails(todo)}
          className="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
        >
          Details
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo)}
            className="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
