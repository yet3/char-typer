import { useAppStore } from "@stores/root.store";
import { selectCurrentExpectedChar } from "@stores/run.slice";
import { CaretKind } from "@typings/caret.types";
import { RunStatus } from "@typings/run.types";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";

export const Caret = () => {
  const { kind, currentCharWidth, currentChar, runStatus } = useAppStore(
    useShallow((s) => ({
      kind: s.settings.selectedCaret,
      currentCharWidth: s.run.currentCharWidth,
      currentChar: selectCurrentExpectedChar(s),
      runStatus: s.run.status,
    })),
  );

  if (!currentCharWidth) return null;
  return (
    <div
      data-pulse-active={runStatus === RunStatus.IDLE}
      className={clsx({
        "caret typer-text !text-transparent": true,
        "absolute top-1/2 left-1/2 -translate-y-1/2 text-transparent": true,
        "w-min select-none whitespace-pre": true,
        // common
        "before:left-0 before:absolute before:bg-typer-caret before:-z-1": true,
        "before:w-full before:rounded-sm":
          kind === CaretKind.BLOCK || kind === CaretKind.UNDERLINE,
        "before:top-0 before:h-full":
          kind === CaretKind.BLOCK || kind === CaretKind.LINE,
        // underline
        "before:top-full before:-translate-y-0.5 before:h-0.5":
          kind === CaretKind.UNDERLINE,
        // line
        "before:w-[1px]": kind === CaretKind.LINE,
      })}
      style={{
        width: `calc(${currentCharWidth}px - var(--typer-letter-spacing))`,
      }}
    >
      {currentChar ?? " "}
    </div>
  );
};
