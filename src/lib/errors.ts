import { toast } from 'sonner';

/**
 * Centralized error handling — translates raw API errors into user-friendly messages.
 * Never exposes raw internal errors to the user.
 */

export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred.';

  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes('weak_password') || lower.includes('compromised')) {
    return 'This password has been found in known data breaches. Please choose a stronger, unique password.';
  }
  if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (lower.includes('email rate limit') || lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (lower.includes('password should be') || lower.includes('password must be')) {
    return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (lower.includes('over_request_rate_limit')) {
    return 'Too many requests. Please slow down and try again shortly.';
  }
  if (lower.includes('session_not_found') || lower.includes('session missing')) {
    return 'Your session has expired. Please sign in again.';
  }

  return 'Something went wrong. Please try again.';
}

export function getAIErrorMessage(error: unknown): string {
  if (!error) return 'AI analysis failed. Please try again.';
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Unable to reach the AI service. Please check your connection.';
  }
  if (lower.includes('timeout')) {
    return 'The AI request timed out. Please try again.';
  }
  if (lower.includes('401') || lower.includes('unauthorized')) {
    return 'Authentication expired. Please sign in again.';
  }
  if (lower.includes('500') || lower.includes('502') || lower.includes('503')) {
    return 'The AI service is temporarily unavailable. Please try again shortly.';
  }

  return 'AI analysis could not be completed. Please try again.';
}

export function getDatabaseErrorMessage(error: unknown): string {
  if (!error) return 'Database operation failed.';
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes('rls') || lower.includes('policy')) {
    return 'You do not have permission to perform this action.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Unable to connect to the database. Please check your connection.';
  }
  if (lower.includes('duplicate') || lower.includes('unique')) {
    return 'This record already exists.';
  }

  return 'Unable to save your data. Please try again.';
}

export function handleError(error: unknown, context: 'auth' | 'ai' | 'database' = 'auth') {
  const getMessage =
    context === 'ai' ? getAIErrorMessage : context === 'database' ? getDatabaseErrorMessage : getAuthErrorMessage;
  toast.error(getMessage(error));
}

export function handleSuccess(message: string) {
  toast.success(message);
}
