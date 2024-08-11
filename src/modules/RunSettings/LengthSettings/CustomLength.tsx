import { useAppStore } from "@stores/root.store";
import { selectIsModalOpen } from "@stores/settings.slice";
import { RunType } from "@typings/run.types";
import clsx from "clsx";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { LiaToolsSolid } from "react-icons/lia";
import { useShallow } from "zustand/shallow";
import { LENGTH_OPTS, TIMED_OPTS } from "./LengthSettings";

const MODAL_ID = "custom-run-length-modal";

export const CustomLength = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isModalOpen, setModalOpen, runLength, setRunLength, runType } =
    useAppStore(
      useShallow((s) => ({
        isModalOpen: selectIsModalOpen(MODAL_ID)(s),
        setModalOpen: s.settings.setModalOpen,
        runLength: s.settings.runLength,
        setRunLength: s.settings.setRunLength,
        runType: s.settings.runType,
      })),
    );

  const handleOpenModal = () => {
    setError(null);
    setModalOpen(MODAL_ID, true);
  };
  const handleCloseModal = () => {
    setModalOpen(MODAL_ID, false);
  };

  useEffect(() => {
    const handleMouseDown = (e: globalThis.MouseEvent) => {
      const container = containerRef.current;
      if (!container || !(e.target instanceof Node)) return;

      if (!container.contains(e.target)) {
        handleCloseModal();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      handleCloseModal();
    };
  }, []);

  const handleSave = () => {
    const input = inputRef.current;
    if (!input) return;
    const value = input.value;
    const parsed = Number.parseInt(value);

    if (Number.isNaN(parsed)) {
      setError("Length must be a valid number");
      return;
    }

    if (parsed <= 0) {
      setError("Length must be bigger than 0");
      return;
    }

    setError(null);
    setRunLength(parsed);
    handleCloseModal();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleCloseModal();
    }
  };

  let isCustom = false;
  if (runType === RunType.LENGTH_CHARS) {
    isCustom = !TIMED_OPTS.includes(runLength);
  } else if (runType === RunType.TIMED_CHARS) {
    isCustom = !LENGTH_OPTS.includes(runLength);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleOpenModal}
        className={clsx({
          flex: true,
          "text-content-primary": !isCustom,
          "text-content-accent": isCustom,
        })}
      >
        <LiaToolsSolid size={18} className="mr-2 fill-current" />
        {isCustom &&
          `${runLength}${runType === RunType.TIMED_CHARS ? "s" : ""}`}
      </button>

      {isModalOpen && (
        <aside className="w-48 flex flex-col absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white p-3 rounded border border-primary bg-page shadow shadow-black/30">
          <label>
            Custom length
            <input
              defaultValue={runLength}
              ref={inputRef}
              autoFocus
              className="mt-1 p-1 w-full bg-transparent border border-primary rounded outline-none active:border-content-accent focus:border-content-accent"
              type="number"
              onKeyDown={handleKeyDown}
              min={0}
              step={1}
            />
          </label>

          {runType === RunType.TIMED_CHARS && (
            <span className="ml-1 text-xs text-content-secondary">
              in seconds
            </span>
          )}

          {error && (
            <span className="ml-1 mt-1 text-typer-error text-xs">{error}</span>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            className="mt-2 mx-auto border border-primary rounded py-1 px-2"
          >
            Save
          </button>
        </aside>
      )}
    </div>
  );
};
