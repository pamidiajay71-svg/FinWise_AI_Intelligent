import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Low Risk':
    case 'Eligible':
      return 'text-emerald-400';
    case 'Medium Risk':
      return 'text-amber-400';
    case 'High Risk':
    case 'Rejected':
      return 'text-rose-400';
    default:
      return 'text-slate-400';
  }
}

export function getRiskBg(risk: string): string {
  switch (risk) {
    case 'Low Risk':
    case 'Eligible':
      return 'bg-emerald-500/10 border-emerald-500/30';
    case 'Medium Risk':
      return 'bg-amber-500/10 border-amber-500/30';
    case 'High Risk':
    case 'Rejected':
      return 'bg-rose-500/10 border-rose-500/30';
    default:
      return 'bg-slate-500/10 border-slate-500/30';
  }
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
