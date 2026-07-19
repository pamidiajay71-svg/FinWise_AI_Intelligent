import { useState, type ImgHTMLAttributes } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackType?: 'avatar' | 'generic';
}

/**
 * Image component with graceful fallback — prevents broken image icons.
 * Shows a placeholder if the image fails to load.
 */
export function SafeImage({ src, alt, className, fallbackType = 'generic', ...rest }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          fallbackType === 'avatar' ? 'rounded-full' : 'rounded-lg',
          className,
        )}
        aria-label={alt}
        role="img"
      >
        {fallbackType === 'avatar' ? (
          <User className="h-1/2 w-1/2 text-muted-foreground" />
        ) : (
          <span className="text-xs text-muted-foreground">Image unavailable</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
      {...rest}
    />
  );
}
