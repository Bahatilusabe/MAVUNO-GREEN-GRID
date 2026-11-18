import { useEffect, useRef, useState } from "react";
import { cn } from "../../src/lib/utils";

/**
 * Counts a number up when it mounts or changes. Used for KPI values so the
 * analytics panel animates instead of snapping.
 */
export function useCountUp(target, { duration = 900, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const numeric = Number(target);
    if (!Number.isFinite(numeric)) {
      setValue(target);
      return undefined;
    }

    const from = fromRef.current;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced || duration <= 0) {
      fromRef.current = numeric;
      setValue(numeric);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (numeric - from) * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = numeric;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return typeof value === "number" ? Number(value.toFixed(decimals)) : value;
}

/**
 * Wraps children in the shared entrance animation. `index` staggers siblings
 * inside a grid so a list of cards cascades in.
 */
export function Reveal({ index = 0, className, children, ...props }) {
  const delay = Math.min(index, 6);
  return (
    <div className={cn("reveal", delay > 0 && `reveal-d${delay}`, className)} {...props}>
      {children}
    </div>
  );
}
