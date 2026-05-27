import { useEffect, useRef, useState } from 'react';

const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'] as const;

export function useIdle(delayMs = 3500): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const reset = () => {
      setIsIdle(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsIdle(true), delayMs);
    };

    reset();
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    return () => {
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(timer.current);
    };
  }, [delayMs]);

  return isIdle;
}
