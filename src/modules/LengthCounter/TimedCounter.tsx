import { useAppStore } from "@stores/root.store";
import { RunStatus } from "@typings/run.types";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - mins * 60;
  return `${mins.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
};

export const TimedCounter = () => {
  const { runDuration, runStatus, startedAt, endRun } = useAppStore(
    useShallow((s) => ({
      runDuration: s.settings.runLength,
      runStatus: s.run.status,
      startedAt: s.run.startedAt,
      endRun: s.run.end,
    })),
  );
  const [, setRerenderTrigger] = useState({});

  const elapsedSeconds = Math.floor(
    (new Date().getTime() - (startedAt || 0)) / 1000,
  );
  const diff = Math.max(0, runDuration - elapsedSeconds);

  useEffect(() => {
    if (runStatus !== RunStatus.IN_PROGRESS) return;

    const interval = setInterval(() => {
      if (diff <= 0) {
        endRun();
      } else {
        setRerenderTrigger({});
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [runStatus, diff]);

  if (!startedAt) {
    return formatTime(runDuration);
  }

  return formatTime(diff);
};
