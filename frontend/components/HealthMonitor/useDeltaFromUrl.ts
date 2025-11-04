// src/features/health/useDeltaFromUrl.ts
import { useEffect, useRef } from "react";

type Mode = "last-line" | "json-seq";

export function useDeltaFromUrl(
  url: string,
  {
    intervalMs = 500,
    mode = "json-seq",
    onDelta,
  }: {
    intervalMs?: number;
    mode?: Mode;
    onDelta: (delta: number, seq?: number) => void;
  }
) {
  const lastSeen = useRef<string | number | null>(null);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const u = url + (url.includes("?") ? "&" : "?") + "t=" + Date.now();
        const res = await fetch(u, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        if (mode === "last-line") {
          const lines = text.trim().split(/\r?\n/);
          const last = lines[lines.length - 1]?.trim();
          if (last && last !== lastSeen.current) {
            lastSeen.current = last;
            const delta = parseInt(last, 10);
            if (!Number.isNaN(delta)) onDelta(delta, undefined);
          }
        } else {
          const obj = JSON.parse(text) as { seq: number; delta: number };
          if (typeof obj.seq === "number" && obj.seq !== lastSeen.current) {
            lastSeen.current = obj.seq;
            onDelta(Number(obj.delta), obj.seq);
          }
        }
      } catch (_e) {
        // ignore errors; you can surface them in UI if desired
      }
    };

    const id = setInterval(tick, intervalMs);
    tick();
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [url, intervalMs, mode, onDelta]);
}