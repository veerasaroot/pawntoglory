import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * for more efficient className handling with Tailwind CSS
 * 
 * @param inputs - Class names to be combined
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a localized date format
 * 
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'th-TH')
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined, locale = 'th-TH'): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date string to a localized date and time format
 * 
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'th-TH')
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | null | undefined, locale = 'th-TH'): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * 
 * @param str - String to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Converts a result string to a readable format
 * 
 * @param result - Result string ('1-0', '0-1', '1/2-1/2', '0-0')
 * @returns Human-readable result
 */
export function formatChessResult(result: string | null): string {
  if (!result) return '-';
  
  switch (result) {
    case '1-0': return 'ขาวชนะ';
    case '0-1': return 'ดำชนะ';
    case '1/2-1/2': return 'เสมอ';
    case '0-0': return 'ยกเลิก';
    default: return result;
  }
}

/**
 * Debounce function for limiting how often a function can be called
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a random color based on a string input (useful for user avatars, etc.)
 * 
 * @param str - Input string to generate color from
 * @returns HEX color string
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }
  
  return color;
}