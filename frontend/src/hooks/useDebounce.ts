import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values.
 * Delays updating the debounced value until after the delay period has passed
 * without the value changing. This prevents excessive API calls.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 * 
 * Example:
 * const searchTerm = "Rahul"
 * const debouncedSearch = useDebounce(searchTerm, 300)
 * // debouncedSearch will only update 300ms after user stops typing
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    // This prevents the debounced value from updating
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
