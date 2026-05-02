import { useState, useEffect } from 'react';
import type { TodoFormValues } from '@/features/todos/schemas';
import type { Todo, TodoFormInput } from '@/features/todos/types';
import { useAuth } from '@/features/auth/auth-context';
import { TodoFilters } from '@/components/todo/TodoFilters';
import { TodosHeader } from '@/components/todo/TodosHeader';
import { TodosListSection } from '@/components/todo/TodosListSection';
import { TodoModal } from '@/components/todo/TodoModal';
import { DeleteConfirmModal } from '@/components/todo/DeleteConfirmModal';
import { TodoDetailModal } from '@/components/todo/TodoDetailModal';
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from '@/features/todos/hooks';
import { useTodosPageQuery } from '@/features/todos/use-todos-page-query';
import { formatLocalDatetimeInput } from '@/features/todos/utils';
import { TODO_SORT_LABEL as sortLabel} from '@/features/todos/constants';
import { getFriendlyErrorMessage } from '@/utils/error';

export function TodosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [viewingTodo, setViewingTodo] = useState<Todo | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [postRegisterReason, setPostRegisterReason] = useState<string | null>(null);

  useEffect(() => {
    const reason = sessionStorage.getItem('post-register-message');

    if (reason) {
      setPostRegisterReason(reason);
      sessionStorage.removeItem('post-register-message');
    }
  }, []);

  const { user } = useAuth();

  const {
    search,
    priority,
    status,
    sorts,
    dueAfter,
    dueBefore,
    dateError,
    todos,
    total,
    currentPage,
    pageLimit,
    totalPages,
    isLoading,
    isError,
    isFetching,
    refetch,
    queryErrorMessage,
    syncWarningMessage,
    handleSearchChange,
    handlePriorityChange,
    handleStatusChange,
    handleDueAfterChange,
    handleDueBeforeChange,
    handleAddSort,
    handleRemoveSort,
    handleUpdateSort,
    handleLimitChange,
    goToPreviousPage,
    goToNextPage,
  } = useTodosPageQuery();

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const isSaving = createTodo.status === 'pending' || updateTodo.status === 'pending';
  const isDeleting = deleteTodo.status === 'pending';

  const registerVerificationFeedback =
  postRegisterReason === 'verify-email-sent'
    ? {
        message: 'We sent a verification link to your email address.',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      }
    : null;

  const emailVerificationBanner =
    !registerVerificationFeedback && user && !user.emailVerifiedAt
      ? {
          message: 'Please verify your email to secure your account.',
          className: 'border-amber-200 bg-amber-50 text-amber-800',
        }
      : null;

  const openCreateModal = () => {
    setMutationError(null);
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setMutationError(null);
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = async (values: TodoFormValues) => {
    setMutationError(null);

    const payload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
      priority: values.priority ?? 'MEDIUM',
    };

    closeModal();

    try {
      if (editingTodo) {
        await updateTodo.mutateAsync({
          id: editingTodo.id,
          data: {
            title: payload.title,
            description: payload.description,
            priority: payload.priority,
            dueDate: values.dueDate ? new Date(values.dueDate) : null,
          },
        });
      } else {
        await createTodo.mutateAsync(payload);
      }
    } catch (error) {
      setMutationError(
        getFriendlyErrorMessage(
          error,
          'Unable to save todo. Please try again later.',
        ),
      );
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    setMutationError(null);

    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        data: {
          title: todo.title,
          description: todo.description ?? undefined,
          completed: !todo.completed,
        },
      });
    } catch (error) {
      setMutationError(
        getFriendlyErrorMessage(
          error,
          'Unable to update todo. Please try again later.',
        ),
      );
    }
  };

  const handleDelete = (todo: Todo) => {
    setMutationError(null);
    setTodoToDelete(todo);
  };

  const handleViewDetails = (todo: Todo) => {
    setViewingTodo(todo);
  };

  const closeDetailModal = () => {
    setViewingTodo(null);
  };

  const modalInitialValues: TodoFormInput | undefined = editingTodo
    ? {
        title: editingTodo.title,
        description: editingTodo.description ?? '',
        dueDate: formatLocalDatetimeInput(editingTodo.dueDate),
        priority: editingTodo.priority,
      }
    : undefined;

  const handleDeleteCancel = () => {
    setTodoToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!todoToDelete) return;

    setMutationError(null);
    const deletingTodo = todoToDelete;
    setTodoToDelete(null);

    try {
      await deleteTodo.mutateAsync(deletingTodo.id);
    } catch (error) {
      setMutationError(
        getFriendlyErrorMessage(
          error,
          'Unable to delete todo. Please try again later.',
        ),
      );
    }
  };

  return (
    <div className="text-center mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <TodosHeader
        visibleCount={todos.length}
        isRefreshing={isFetching}
        onRefresh={() => {
          setMutationError(null);
          refetch().catch((error) => {
            setMutationError(
              getFriendlyErrorMessage(
                error,
                'Unable to refresh todos right now. Please try again later.',
              ),
            );
          });
        }}
        onCreateTodo={openCreateModal}
      />

      {registerVerificationFeedback ? (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${registerVerificationFeedback.className}`}
        >
          {registerVerificationFeedback.message}
        </div>
      ) : null}

      {emailVerificationBanner ? (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${emailVerificationBanner.className}`}
        >
          {emailVerificationBanner.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-[90px] xl:self-start">
          <TodoFilters
            search={search}
            priority={priority}
            status={status}
            dueAfter={dueAfter}
            dueBefore={dueBefore}
            sorts={sorts}
            dateError={dateError}
            onSearchChange={handleSearchChange}
            onPriorityChange={handlePriorityChange}
            onStatusChange={handleStatusChange}
            onDueAfterChange={handleDueAfterChange}
            onDueBeforeChange={handleDueBeforeChange}
            onAddSort={handleAddSort}
            onRemoveSort={handleRemoveSort}
            onUpdateSort={handleUpdateSort}
          />
        </div>

        <TodosListSection
          todos={todos}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          pageLimit={pageLimit}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
          queryErrorMessage={queryErrorMessage}
          syncWarningMessage={syncWarningMessage}
          mutationError={mutationError}
          sorts={sorts}
          sortLabel={sortLabel}
          onRemoveSort={handleRemoveSort}
          onToggleComplete={handleToggleComplete}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onLimitChange={handleLimitChange}
        />
      </div>

      <TodoModal
        open={isModalOpen}
        initialValues={modalInitialValues}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        open={Boolean(todoToDelete)}
        title="Delete Todo"
        message={
          todoToDelete
            ? `Are you sure you want to delete “${todoToDelete.title}”? This action cannot be undone.`
            : 'Are you sure you want to delete this todo?'
        }
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      <TodoDetailModal
        open={Boolean(viewingTodo)}
        todo={viewingTodo}
        onClose={closeDetailModal}
      />    
    </div>
  );
}
