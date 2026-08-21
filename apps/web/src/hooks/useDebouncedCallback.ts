"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a `trigger` function that calls `callback` after `delay` ms of
 * inactivity (restarting the timer on every call), and a `flush` function
 * that runs it immediately — e.g. trigger on every keystroke for
 * auto-search, flush on Enter/submit for an instant result.
 */
export function useDebouncedCallback(callback: (value: string) => void, delay: number) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function trigger(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(value), delay);
  }

  function flush(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    callbackRef.current(value);
  }

  return { trigger, flush };
}
