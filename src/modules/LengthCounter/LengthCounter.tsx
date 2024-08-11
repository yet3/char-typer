import { useAppStore } from "@stores/root.store";
import { RunType } from "@typings/run.types";
import { CharsCounter } from "./CharsCounter";
import { TimedCounter } from "./TimedCounter";

export const LengthCounter = () => {
  const runType = useAppStore((s) => s.settings.runType);

  if (runType === RunType.LENGTH_CHARS) {
    return <CharsCounter />;
  }

  if (runType === RunType.TIMED_CHARS) {
    return <TimedCounter />;
  }

  return <div />;
};
