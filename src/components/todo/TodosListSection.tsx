import type { Todo } from '@/features/todos/types';
import { TodoItem } from '@/components/todo/TodoItem';
import { TodosPagination } from '@/components/todo/TodosPagination';
import { TodosSortSummary } from '@/components/todo/TodosSortSummary';

interface TodosListSectionProps {
  todos: Todo[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  queryErrorMessage?: string;
  syncWarningMessage?: string;
  mutationError?: string | null;
  sorts: string[];
  sortLabel: Record<string, string>;
  onRemoveSort: (value: string) => void;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onViewDetails: (todo: Todo) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLimitChange: (value: number) => void;
}

export function TodosListSection({
  todos,
  total,
  currentPage,
  totalPages,
  pageLimit,
  isLoading,
  isFetching,
  queryErrorMessage,
  syncWarningMessage,
  mutationError,
  sorts,
  sortLabel,
  onRemoveSort,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  onPreviousPage,
  onNextPage,
  onLimitChange,
}: TodosListSectionProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Todos</h2>

            {mutationError ? (
              <div className="mt-3 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {mutationError}
              </div>
            ) : null}

            <p className="mt-3 text-sm text-slate-500">
              {isLoading
                ? 'Loading...'
                : total > 0
                ? `Showing ${Math.min(total, (currentPage - 1) * pageLimit + 1)}-${Math.min(total, currentPage * pageLimit)} of ${total}`
                : 'No todos found.'}
            </p>
          </div>

          <TodosSortSummary
            sorts={sorts}
            sortLabel={sortLabel}
            onRemoveSort={onRemoveSort}
          />
        </div>

        {queryErrorMessage ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {queryErrorMessage}
          </div>
        ) : isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
            Loading...
          </div>
        ): isFetching && !isLoading ? (
            <div className="flex justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
            </div>
        ) : todos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-500">
            No todos match your filters. Add a new todo or adjust your filters.
          </div>
        ) : (
          <>
            {syncWarningMessage ? (
              <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                {syncWarningMessage}
              </div>
            ) : null}

            <ul className="grid gap-4">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewDetails={onViewDetails}
                />
              ))}
            </ul>

            <TodosPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageLimit={pageLimit}
              isFetching={isFetching}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
              onLimitChange={onLimitChange}
            />
          </>
        )}
      </div>
    </section>
  );
}