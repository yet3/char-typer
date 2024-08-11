import { useAppStore } from "@stores/root.store";
import { selectSumOfTypedChars } from "@stores/run.slice";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export const CharsCounter = () => {
  const { runLength, typedChars, endRun } = useAppStore(
    useShallow((s) => ({
      runLength: s.settings.runLength,
      typedChars: selectSumOfTypedChars(s),
      endRun: s.run.end,
    })),
  );

  const count = Math.max(0, runLength - typedChars);

  useEffect(() => {
    if (count <= 0) {
      endRun();
    }
  }, [count, endRun]);

  return count;
};
