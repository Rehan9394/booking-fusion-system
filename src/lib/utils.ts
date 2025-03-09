
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, isValid, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy")
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return format(dateObj, "MMM d, yyyy 'at' h:mm a")
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Helper function to generate a random ID
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
