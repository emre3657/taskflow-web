import { useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FocusTrap } from '@/components/ui/FocusTrap';
import type { Todo } from '@/features/todos/types';
import { formatFullDateTime } from '@/features/todos/date-utils';
import { badgeColor } from '@/features/todos/priority-utils';

interface TodoDetailModalProps {
  open: boolean;
  todo: Todo | null;
  onClose: () => void;
}

export function TodoDetailModal({ open, todo, onClose }: TodoDetailModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !todo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      }}
    >
      <FocusTrap>
        <div
          className="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 flex flex-col max-h-[90vh]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between p-6 flex-shrink-0">
            <h2 id="detail-modal-title" className="text-2xl font-semibold text-slate-900">
              Todo Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close detail modal"
              className="cursor-pointer px-2 py-2 rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6">
            <div className="space-y-6 pb-6">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-slate-600">Title</label>
                <p className={`mt-2 text-base font-medium ${
                  todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                }`}>
                  {todo.title}
                </p>
              </div>

              {/* Description */}
              {todo.description && (
                <div>
                  <label className="text-sm font-semibold text-slate-600">Description</label>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {todo.description}
                  </p>
                </div>
              )}

              {/* Status & Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Status</label>
                  <div className="mt-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      todo.completed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {todo.completed ? 'Completed' : 'Open'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Priority</label>
                  <div className="mt-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                      badgeColor(todo.priority)
                    }`}>
                      {todo.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-semibold text-slate-600">Due Date</label>
                <p className="mt-2 text-sm text-slate-700">
                  {formatFullDateTime(todo.dueDate)}
                </p>
              </div>

              {/* Completed At */}
              {todo.completedAt && (
                <div>
                  <label className="text-sm font-semibold text-slate-600">Completed At</label>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatFullDateTime(todo.completedAt)}
                  </p>
                </div>
              )}

              {/* Created & Updated */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Created</label>
                  <p className="mt-1 text-xs text-slate-600">
                    {formatFullDateTime(todo.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Last Updated</label>
                  <p className="mt-1 text-xs text-slate-600">
                    {formatFullDateTime(todo.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="border-t border-slate-200 p-6 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer w-full rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
