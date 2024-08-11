import { useAppStore } from "@stores/root.store";
import { RunType } from "@typings/run.types";
import { CustomLength } from "./CustomLength";
import { LengthOption } from "./LengthOption";

export const TIMED_OPTS = [25, 50, 75, 100, 150, 200, 250];
export const LENGTH_OPTS = [10, 15, 30, 60, 120, 3 * 60, 4 * 60, 5 * 60];

export const LengthSettings = () => {
  const runType = useAppStore((s) => s.settings.runType);

  let values = LENGTH_OPTS;
  if (runType === RunType.LENGTH_CHARS) {
    values = TIMED_OPTS;
  }

  return (
    <ul className="flex space-x-4 p-4 border border-t-0 border-primary rounded-bl-xl rounded-br-xl w-fit">
      {values.map((val) => (
        <LengthOption value={val} key={`${runType}-${val}`} />
      ))}

      <CustomLength />
    </ul>
  );
};
