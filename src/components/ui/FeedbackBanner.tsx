export type FormFeedback = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

interface FeedbackBannerProps {
  feedback: FormFeedback;
  borderRadius?: 'xl' | '2xl';
}

export function FeedbackBanner({
  feedback,
  borderRadius = '2xl'
}: FeedbackBannerProps) {
  if (!feedback) return null;

  const tone =
  feedback.type === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : feedback.type === 'error'
    ? 'border-rose-200 bg-rose-50 text-rose-700'
    : 'border-amber-200 bg-amber-50 text-amber-800';

  return (
    <div className={`mb-4 rounded-${borderRadius} border px-4 py-3 text-sm ${tone}`}>
      {feedback.message}
    </div>
  );
}