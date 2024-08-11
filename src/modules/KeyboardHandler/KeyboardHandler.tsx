import { useAppStore } from "@stores/root.store";
import { RunStatus } from "@typings/run.types";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useKeyboardHandlerFacade } from "./useKeyboardHandlerFacade";

export const KeyboardHandler = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const keysPressed = useRef<number>(0);
  const {
    runStatus,
    startedAt,
    createNewRun,
    startRun,
    endRun,
    currentSegment,
    toggleDebugInfo,
    updateRunStats,
    currentSegmentIdx,
    updateCps,
    canType,
    isAnyModalOpen,
    updateCurrentSegmentIdx,
    setSegmentValue,
  } = useKeyboardHandlerFacade();

  useEffect(() => {
    let lastTimestamp = (startedAt || 0) / 1000;

    if (runStatus !== RunStatus.IN_PROGRESS) {
      if (lastTimestamp > 0) {
        const elapsed = new Date().getTime() / 1000 - lastTimestamp;
        const cps = keysPressed.current * (1 / elapsed);
        updateCps(cps);
      }
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime() / 1000;

      if (lastTimestamp === 0) {
        lastTimestamp = now;
        return;
      }

      const elapsed = now - lastTimestamp;
      if (elapsed >= 1) {
        const cps = keysPressed.current * (1 / elapsed);
        updateCps(cps);
        keysPressed.current = 0;
        lastTimestamp = now;
      }
    }, 275);

    return () => {
      clearInterval(interval);
    };
  }, [runStatus]);

  useEffect(() => {
    if (isFocused || isAnyModalOpen) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (!inputRef.current) return;
      e.preventDefault();
      inputRef.current.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, isAnyModalOpen]);

  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  const handleMouseDown = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      createNewRun();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      if (runStatus === RunStatus.IN_PROGRESS) {
        endRun();
      }
      return;
    }

    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      if (e.key === "d") {
        toggleDebugInfo();
        return;
      }
      if (e.key === "r") {
        window.location.reload();
        return;
      }
    }

    if (!canType) {
      e.preventDefault();
      return;
    }

    let isRunInProgress = false;
    if (runStatus === RunStatus.IDLE) {
      startRun();
      isRunInProgress = true;
    } else isRunInProgress = runStatus === RunStatus.IN_PROGRESS;

    if (e.ctrlKey || e.metaKey || e.altKey || !isRunInProgress) {
      e.preventDefault();
      return;
    }

    keysPressed.current++;
  };

  const handleRunStats = (value: string, segIdx: number) => {
    const seg = useAppStore.getState().run.segments[segIdx];
    if (!seg) return;

    const isError =
      value[value.length - 1] !==
      seg.expected[segIdx > currentSegmentIdx ? 0 : value.length - 1];
    const hasTypedNewChar = value.length > seg.value.length;

    updateRunStats((prev) => ({
      errorsCount: prev.errorsCount + (isError ? 1 : 0),
      typedCharsCount: prev.typedCharsCount + (hasTypedNewChar ? 1 : 0),
    }));
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!currentSegment) return;

    if (val.length > currentSegment.expected.length) {
      const newIdx = currentSegmentIdx + 1;
      setSegmentValue(newIdx, val[val.length - 1]);
      updateCurrentSegmentIdx(() => newIdx);
      handleRunStats(val, newIdx);
      return;
    }

    if (val.length === 0) {
      setSegmentValue(currentSegmentIdx, "");
      updateCurrentSegmentIdx(() => currentSegmentIdx - 1);
      handleRunStats(val, currentSegmentIdx - 1);
      return;
    }

    handleRunStats(val, currentSegmentIdx);
    setSegmentValue(currentSegmentIdx, val);
  };

  return (
    <div className="absolute w-full h-ful" onMouseDown={handleMouseDown}>
      <input
        ref={inputRef}
        className="w-full h-full outline-none border-none rounded-none opacity-0 pointer-events-none"
        value={currentSegment?.value ?? ""}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        autoFocus
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
      />
    </div>
  );
};
