import { useCallback, useRef } from "react";

function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay = 2500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [delay, callback]
  );

  return debouncedCallback;
}

export default useDebounce;
