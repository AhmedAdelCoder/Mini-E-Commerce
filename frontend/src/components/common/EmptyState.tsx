import { type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">Something went wrong</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {message || 'Unable to load content. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
