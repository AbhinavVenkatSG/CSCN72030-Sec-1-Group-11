// src/features/health/useHealthEngine.ts
import { useCallback, useRef, useState } from "react";

export function useHealthEngine(initial = 100) {
  const [health, setHealth] = useState<number>(initial);
  const lastSeq = useRef<number | null>(null); // to avoid re-applying same delta

  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const applyDelta = useCallback((delta: number, seq?: number | null) => {
    if (typeof seq === "number") {
      if (lastSeq.current !== null && seq <= lastSeq.current) return; // already seen
      lastSeq.current = seq;
    }
    setHealth((h) => clamp(h + delta));
  }, []);

  const setAbsolute = useCallback((abs: number) => setHealth(clamp(abs)), []);

  return { health, applyDelta, setAbsolute };
}