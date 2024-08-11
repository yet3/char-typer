import { SpaceIcon } from "@common/Icons/SpceIcon";
import { useAppStore } from "@stores/root.store";
import type { IRunCharsSettings } from "@typings/run.types";
import clsx from "clsx";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";

interface IProps {
  setting: keyof IRunCharsSettings;
}

export const CharsOption = ({ setting }: IProps) => {
  const { isSelected, updateSetting } = useAppStore(
    useShallow((s) => ({
      isSelected: s.settings.charsSettings[setting],
      updateSetting: s.settings.updateCharsSettings,
    })),
  );

  const content = useMemo(() => {
    let icon = null;
    let name = "";

    switch (setting) {
      case "upperCaseLetters":
        icon = "ABC";
        name = "upper-case";
        break;
      case "lowerCaseLetters":
        icon = "abc";
        name = "lower-case";
        break;
      case "numbers":
        icon = "123";
        name = "numbers";
        break;
      case "symbols":
        icon = "!?&";
        name = "symbols";
        break;
      case "spaces":
        icon = <SpaceIcon className="w-3" />;
        name = "spaces";
        break;
    }

    return (
      <>
        <span
          className={clsx({
            "mr-1 font-medium transition-colors": true,
            "text-content-accent": isSelected,
            "text-content-primary": !isSelected,
          })}
        >
          {icon}
        </span>
        {name}
      </>
    );
  }, [setting, isSelected]);

  return (
    <li>
      <button
        type="button"
        className="flex select-none"
        onClick={() => {
          updateSetting((prev) => ({
            [setting]: !prev[setting],
          }));
        }}
      >
        {content}
      </button>
    </li>
  );
};
