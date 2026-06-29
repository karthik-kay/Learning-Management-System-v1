import { useEffect, useRef } from "react";
import { djangoService } from "@/services/djangoService";

export const useLearningTimer = (active: boolean) => {
  const lastSendRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) {
      // When timer stops → flush remaining time
      if (lastSendRef.current) {
        const now = Date.now();
        const diff = Math.floor((now - lastSendRef.current) / 1000);
        if (diff > 0) djangoService.logActivity(diff);
      }
      lastSendRef.current = null;
      return;
    }

    lastSendRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - lastSendRef.current!) / 1000);

      if (diff > 0) {
        djangoService.logActivity(diff).catch(() => {});
        lastSendRef.current = now;
      }
    }, 15000); // send every 15 sec safely

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      // flush remaining time
      if (lastSendRef.current) {
        const now = Date.now();
        const diff = Math.floor((now - lastSendRef.current!) / 1000);
        if (diff > 0) djangoService.logActivity(diff);
      }
    };
  }, [active]);
};
