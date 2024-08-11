import { useAppStore } from "@stores/root.store";
import { RunType } from "@typings/run.types";
import clsx from "clsx";
import { useMemo } from "react";
import { PiHashBold, PiInfinityBold, PiTimerBold } from "react-icons/pi";
import { useShallow } from "zustand/shallow";

interface IProps {
  type: RunType;
}

export const RunTypeOption = ({ type }: IProps) => {
  const { isSelected, setRunType } = useAppStore(
    useShallow((s) => ({
      isSelected: s.settings.runType === type,
      setRunType: s.settings.setRunType,
    })),
  );

  const content = useMemo(() => {
    let icon = null;
    let name = "";

    const className = clsx({
      "transition-colors": true,
      "fill-content-accent": isSelected,
      "fill-content-primary": !isSelected,
    });
    switch (type) {
      case RunType.LENGTH_CHARS:
        icon = <PiHashBold className={className} />;
        name = "length";
        break;
      case RunType.TIMED_CHARS:
        icon = <PiTimerBold className={className} />;
        name = "timed";
        break;
      case RunType.INFINITE_CHARS:
        icon = <PiInfinityBold className={className} />;
        name = "infinite";
        break;
    }

    return (
      <>
        {icon}
        {name}
      </>
    );
  }, [type, isSelected]);

  return (
    <li>
      <button
        type="button"
        className="grid grid-flow-col items-center gap-1 select-none"
        onClick={() => setRunType(type)}
      >
        {content}
      </button>
    </li>
  );
};
