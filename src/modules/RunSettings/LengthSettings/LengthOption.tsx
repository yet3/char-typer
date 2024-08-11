import { useAppStore } from "@stores/root.store";
import { RunType } from "@typings/run.types";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";

interface IProps {
  value: number;
}

export const LengthOption = ({ value }: IProps) => {
  const { suffix, setRunLength, isSelected } = useAppStore(
    useShallow((s) => ({
      suffix: s.settings.runType === RunType.TIMED_CHARS ? "s" : "",
      setRunLength: s.settings.setRunLength,
      isSelected: s.settings.runLength === value,
    })),
  );

  return (
    <li>
      <button
        type="button"
        onClick={() => setRunLength(value)}
        className={clsx({
          "text-content-accent": isSelected,
        })}
      >
        {value}
        {suffix}
      </button>
    </li>
  );
};
