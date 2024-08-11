import { useAppCtx } from "@modules/AppCtx";
import { useAppStore } from "@stores/root.store";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/shallow";

export const DebugInfo = () => {
  const { overflowContainerRef, textMeasurerRef } = useAppCtx();
  const {
    totalExpectedChars,
    totalCurrentChars,
    amtOfSegments,
    amtOfVisibleSegments,
    currentSegmentIdx,
    currentSegment,
    currentCharWidth,
    runSeed,
    runStatus,
  } = useAppStore(
    useShallow((s) => ({
      runTypeSettings: s.settings.runType,
      runStatus: s.run.status,
      runSeed: s.run.seed,
      totalExpectedChars: s.run.segments.reduce(
        (total, cur) => total + cur.expected.length,
        0,
      ),
      totalCurrentChars: s.run.segments.reduce(
        (total, cur) => total + cur.value.length,
        0,
      ),
      currentCharWidth: s.run.currentCharWidth,
      amtOfSegments: s.run.segments.length,
      amtOfVisibleSegments: s.run.segments.filter((s) => s.isVisible).length,
      currentSegmentIdx: s.run.currentSegmentIdx,
      currentSegment: s.run.segments[s.run.currentSegmentIdx],
    })),
  );
  const isOpen = useAppStore((s) => s.debug.isOpen);

  const [domSegments, setDomSegments] = useState<number>(0);
  const [firstDomSeg, setFirstDomSeg] = useState<null | string>(null);
  const [lastDomSeg, setLastDomSeg] = useState<null | string>(null);
  const [textInMessurer, setTextInMessurer] = useState<string | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (overflowContainerRef.current) {
        const segments =
          overflowContainerRef.current.querySelectorAll(".segment");
        setDomSegments(segments.length);

        if (segments[0]) setFirstDomSeg(segments[0].id);
        else setFirstDomSeg(null);

        if (segments[segments.length - 1]) {
          setLastDomSeg(segments[segments.length - 1].id);
        } else setLastDomSeg(null);
      }

      setTextInMessurer(
        textMeasurerRef.current ? textMeasurerRef.current.textContent : null,
      );
    });

    if (overflowContainerRef.current) {
      observer.observe(overflowContainerRef.current, {
        childList: true,
      });
    }

    if (textMeasurerRef.current) {
      observer.observe(textMeasurerRef.current, {
        childList: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <aside className="fixed top-0 left-0 p-2 bg-black/30 backdrop-blur rounded-br-lg text-sm flex flex-col">
      <div className="grid grid-flow-col gap-4">
        <div>Run seed: {runSeed}</div>
        <div>status: {runStatus}</div>
      </div>

      <div className="grid grid-flow-col gap-4">
        <div>Total segments: {amtOfSegments}</div>
        <div>expected chars: {totalExpectedChars}</div>
        <div>current chars: {totalCurrentChars}</div>
      </div>
      <div className="mt-2">Visible segments: {amtOfVisibleSegments}</div>
      <div className="grid grid-flow-col gap-4">
        <div>DOM segments: {domSegments}</div>
        <div>first: {firstDomSeg}</div>
        <div>last: {lastDomSeg}</div>
      </div>

      <div className="mt-2">currentSegmentIdx: {currentSegmentIdx}</div>
      <div>currentCharWidth: {currentCharWidth}</div>
      {currentSegment && (
        <div className="grid mt-2">
          <span className="font-medium">Current segment:</span>
          <div>idx: {currentSegment.idx}</div>
          <div>key: {currentSegment.key}</div>
          <div className="text-xs">
            <div>isVisible: {currentSegment.isVisible.toString()}</div>
            <div className="grid">
              <span className="font-medium">
                Expected ({currentSegment.expected.length}):
              </span>
              <span>{currentSegment.expected}</span>
            </div>
            <div className="grid">
              <span className="font-medium">
                Value ({currentSegment.value.length}):
              </span>
              <span>{currentSegment.value || "-"}</span>
            </div>
          </div>
        </div>
      )}

      {textInMessurer != null && (
        <div className="grid mt-2">
          <span className="font-medium">Text in messurer:</span>
          <span className="text-xs">{textInMessurer}</span>
        </div>
      )}
    </aside>,
    document.body,
  );
};
