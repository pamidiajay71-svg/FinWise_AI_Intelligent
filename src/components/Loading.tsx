import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        className ?? 'h-4 w-4',
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'glass rounded-xl border border-border/50 p-6',
        className,
      )}
    >
      <div className="space-y-3">
        <div className="h-6 w-1/3 shimmer rounded-lg" />
        <div className="h-32 shimmer rounded-xl" />
        <div className="h-4 w-full shimmer rounded-lg" />
        <div className="h-4 w-3/4 shimmer rounded-lg" />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 shimmer rounded-lg" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass rounded-xl border border-border/50 p-6">
      <div className="h-6 w-1/4 shimmer rounded-lg mb-4" />
      <div className="h-64 shimmer rounded-xl" />
    </div>
  );
}
