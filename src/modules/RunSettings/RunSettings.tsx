import { useAppStore } from "@stores/root.store";
import { RunType } from "@typings/run.types";
import clsx from "clsx";
import { CharsOption } from "./CharsOption";
import { LengthSettings } from "./LengthSettings/LengthSettings";
import { RunTypeOption } from "./RunTypeOption";

export const RunSettings = () => {
  const hasLengthSetting = useAppStore((s) =>
    [RunType.LENGTH_CHARS, RunType.TIMED_CHARS].includes(s.settings.runType),
  );

  return (
    <header className="flex flex-col absolute top-4 lg:text-sm text-xs">
      <div
        className={clsx({
          "flex border border-primary p-4 rounded-xl w-fit": true,
          "rounded-bl-none": hasLengthSetting,
        })}
      >
        <ul className="flex space-x-4">
          <RunTypeOption type={RunType.LENGTH_CHARS} />
          <RunTypeOption type={RunType.TIMED_CHARS} />
          <RunTypeOption type={RunType.INFINITE_CHARS} />
        </ul>

        <div className="w-1 h-10/12 bg-content-secondary rounded mx-4" />

        <ul className="grid grid-cols-[repeat(3,auto)] md:grid-cols-[repeat(5,auto)] gap-4">
          <CharsOption setting="lowerCaseLetters" />
          <CharsOption setting="upperCaseLetters" />
          <CharsOption setting="numbers" />
          <CharsOption setting="symbols" />
          <CharsOption setting="spaces" />
        </ul>
      </div>

      {hasLengthSetting && <LengthSettings />}
    </header>
  );
};
