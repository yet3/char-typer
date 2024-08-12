import { deepEqual } from "@lib/deepEqual";
import { Caret, CaretPicker } from "@modules/Caret";
import { DebugInfo } from "@modules/DebugInfo";
import { GithubBtn } from "@modules/GithubBtn";
import { KeyboardHandler } from "@modules/KeyboardHandler/KeyboardHandler";
import { LengthCounter } from "@modules/LengthCounter/LengthCounter";
import { LiveStats } from "@modules/LiveStats";
import { MobileBlocker } from "@modules/MobileBlocker";
import { NoCharsSettingsSelected } from "@modules/NoCharsSettingsSelected";
import { OverDashboard } from "@modules/OverDashboard";
import { RunSettings } from "@modules/RunSettings";
import { Segmenter } from "@modules/Segments";
import { SegmentsOverflowGradient } from "@modules/Segments/SegmentsOverflowGradient";
import { ShortcutsInfo } from "@modules/ShortcutsInfo";
import { TextMeasurer } from "@modules/TextMesurrer";
import { useAppStore } from "@stores/root.store";
import { RunStatus } from "@typings/run.types";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { AppCtxProvider } from "./modules/AppCtx";

const App = () => {
  const overflowContainerRef = useRef<HTMLElement>(null);
  const textMeasurerRef = useRef<HTMLDivElement>(null);

  const { noCharsSettings, runStatus, createNewRun } = useAppStore(
    useShallow((s) => ({
      noCharsSettings: !Object.values(s.settings.charsSettings).find((v) => v),
      runStatus: s.run.status,
      createNewRun: s.run.createNew,
    })),
  );

  useEffect(() => {
    console.log(
      "%cPress `ctrl+d` to toggle debug info",
      "font-size: 16px; color: black; background-color: #FFF59D;",
    );

    const regenerateUnsub = useAppStore.subscribe(
      (s) => [
        s.settings.charsSettings,
        s.settings.runType,
        s.settings.runLength,
      ],
      (charsSettings) => {
        const hasAnyOptSelected = Object.values(charsSettings).find((v) => v);
        const store = useAppStore.getState();
        if (hasAnyOptSelected) {
          createNewRun({
            type: store.settings.runType,
            charsSettings: store.settings.charsSettings,
          });
        }
      },
      { fireImmediately: true, equalityFn: deepEqual },
    );

    const reclculateCharWidth = () => {
      const textMeasurer = textMeasurerRef.current;
      if (!textMeasurer) return;

      const store = useAppStore.getState();

      if (store.run.segments.length > 0) {
        textMeasurer.innerText = store.run.segments[0].expected[0];
        store.run.setCurrentCharWidth(
          textMeasurer.getBoundingClientRect().width,
        );
      }
    };

    document.fonts.addEventListener("loadingdone", reclculateCharWidth);
    document.fonts.addEventListener("loadingerror", reclculateCharWidth);
    return () => {
      regenerateUnsub();
      document.fonts.removeEventListener("loadingdone", reclculateCharWidth);
      document.fonts.removeEventListener("loadingerror", reclculateCharWidth);
    };
  }, [createNewRun]);

  return (
    <AppCtxProvider
      overflowContainerRef={overflowContainerRef}
      textMeasurerRef={textMeasurerRef}
    >
      <DebugInfo />
      <TextMeasurer ref={textMeasurerRef} />
      <MobileBlocker />

      <div className="flex flex-col justify-center items-center w-screen h-screen">
        <GithubBtn />
        <RunSettings />

        <div className="lg:w-8/12 md:w-10/12 w-[95%] flex flex-col items-center">
          <main
            ref={overflowContainerRef}
            className="h-64 w-full rounded-6xl border border-primary flex flex-col overflow-hidden relative"
          >
            {runStatus === RunStatus.OVER ? (
              <OverDashboard />
            ) : (
              noCharsSettings && <NoCharsSettingsSelected />
            )}

            <div className="flex items-center justify-between px-8 py-3">
              <LengthCounter />
              <LiveStats />
            </div>

            <div className="flex-1 relative">
              <SegmentsOverflowGradient side="left" />
              {!noCharsSettings && <Caret />}
              <Segmenter />
              <KeyboardHandler />
              <SegmentsOverflowGradient side="right" />
            </div>
            <CaretPicker />
          </main>
        </div>
        <ShortcutsInfo />
      </div>
    </AppCtxProvider>
  );
};

export default App;
