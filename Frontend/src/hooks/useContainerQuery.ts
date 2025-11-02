import { useEffect, useMemo, useRef, useState } from "react";

type Breakpoints = {
  [key: string]: number;
};

export default function useContainerQuery(breakpoints: Breakpoints) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("");

  const sortedBreakpoints = useMemo(() => {
    return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
  }, [breakpoints]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const measure = (width: number) => {
      let matched: string = "";

      for (const [key, minWidth] of sortedBreakpoints) {
        if (width >= minWidth) {
          matched = key;
          break;
        }
      }

      setCurrentBreakpoint(matched);
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      measure(width);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [sortedBreakpoints]);

  return { containerRef, currentBreakpoint };
}
