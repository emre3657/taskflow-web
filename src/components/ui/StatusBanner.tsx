export function StatusBanner({
  message,
  tone,
  showSpinner = false,
}: {
  message: string;
  tone: 'warning' | 'error' | 'success';
  showSpinner?: boolean;
}) {
  const className =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-800';

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${className}`}>
      <div className="flex justify-center items-center gap-2">
        {showSpinner ? (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        <span>{message}</span>
      </div>
    </div>
  );
}