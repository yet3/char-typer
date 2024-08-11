import { useAppCtx } from "@modules/AppCtx";
import { useAppStore } from "@stores/root.store";
import { selectSumOfVisibleOffsets } from "@stores/run.slice";
import type { ISegment } from "@typings/run.types";
import { useEffect, useRef, useState } from "react";
import { Segment } from "./Segment";
import { getMissingSegments, getSegmentsVisibilityChanges } from "./lib";

const ANIM_FPS = 10;

export const Segmenter = () => {
  const { overflowContainerRef, textMeasurerRef } = useAppCtx();

  const runSeed = useAppStore((s) => s.run.seed);
  const [visibleSegments, setVisibleSegments] = useState<ISegment[]>([]);

  const containerRef = useRef<HTMLUListElement | null>(null);

  const offset = useRef<number>(0);
  const offsetAnimationId = useRef<number | null>(null);

  const setOffset = (newOffset: number) => {
    const container = containerRef.current;
    if (!container) return;
    offset.current = newOffset;
    container.style.transform = `translate(-${newOffset}px, -50%)`;
  };

  const animateOffset = (goalOffset: number) => {
    const id = Math.random();
    offsetAnimationId.current = id;

    let animStartOffset = offset.current;
    const animationFrame = () => {
      if (id !== offsetAnimationId.current) {
        return;
      }

      if (Math.abs(goalOffset - animStartOffset) <= 0.1) {
        setOffset(goalOffset);
        return;
      }

      const diff = (goalOffset - animStartOffset) / ANIM_FPS;
      animStartOffset += diff;
      setOffset(offset.current + diff);

      requestAnimationFrame(animationFrame);
    };

    requestAnimationFrame(animationFrame);
  };

  useEffect(() => {
    const overflowContainer = overflowContainerRef.current;
    const textMeasurer = textMeasurerRef.current;
    if (!textMeasurer || !overflowContainer) return;

    setOffset(0);

    const overflowRect = overflowContainer.getBoundingClientRect();
    const store = useAppStore.getState();

    if (store.run.segments.length > 0) {
      store.run.setManySegmentsVisibility(
        getMissingSegments({
          segments: store.run.segments,
          textMeasurer,
          overflowRect,
        }),
      );

      // Calculate the width of the caret
      textMeasurer.innerText = store.run.segments[0].expected[0];
      store.run.setCurrentCharWidth(textMeasurer.getBoundingClientRect().width);
    }

    const visibleSegmentsUnsub = useAppStore.subscribe(
      (s) => s.run.segments.filter((seg) => seg.isVisible),
      (segments) => {
        setVisibleSegments(segments);
      },
      { fireImmediately: true, equalityFn: (a, b) => a.length === b.length },
    );

    const typerUnsub = useAppStore.subscribe(
      (s) => s.run.segments[s.run.currentSegmentIdx]?.value,
      () => {
        const store = useAppStore.getState();
        const segments = store.run.segments;
        const seg = store.run.segments[store.run.currentSegmentIdx];

        const container = containerRef.current;
        if (!seg || !container) return;

        const headEl = container.firstElementChild;
        const tailEl = container.lastElementChild;
        if (
          !(headEl instanceof HTMLElement) ||
          !(tailEl instanceof HTMLElement)
        ) {
          return;
        }

        // Calculate the width of the caret
        textMeasurer.innerText = seg.expected[seg.value.length] ?? " ";
        const caretWidth = textMeasurer.getBoundingClientRect().width;

        // Calculate offset
        textMeasurer.innerText = seg.expected.substring(0, seg.value.length);
        const segmentOffsetX = textMeasurer.getBoundingClientRect().width;

        const { changesMap, offsetAdjustment } = getSegmentsVisibilityChanges({
          container,
          overflowRect,
          offset: offset.current,
          segments,
        });

        // Update offset to compensate for segments that will get hidden
        // do this before start of offset animation
        setOffset(offset.current + offsetAdjustment);

        store.run.setCurrentCharWidth(caretWidth);
        store.run.setManySegmentsVisibility(changesMap);
        store.run.updateSegmentOffset(seg.idx, () => segmentOffsetX);
        animateOffset(selectSumOfVisibleOffsets(useAppStore.getState()));

        if (store.run.currentSegmentIdx >= store.run.segments.length - 3) {
          store.run.extend();
        }

        // This should never happen since every run is endless,
        // but just in case
        if (store.run.currentSegmentIdx >= store.run.segments.length - 1) {
          const lastSeg = store.run.segments[store.run.segments.length - 1];
          if (lastSeg.value.length === lastSeg.expected.length) {
            store.run.end();
          }
        }
      },
    );

    return () => {
      typerUnsub();
      visibleSegmentsUnsub();
      setVisibleSegments([]);
      offsetAnimationId.current = null;
    };
  }, [runSeed]);

  return (
    <ul
      ref={containerRef}
      className="absolute top-1/2 left-1/2 flex will-change-transform"
      style={{
        transform: `translate(-${offset.current}px, -50%)`,
      }}
    >
      {visibleSegments.length === 0 ? (
        <span className="text-xl font-medium text-content-accent text">
          NO SEGMENTS
        </span>
      ) : (
        visibleSegments.map((segment) => (
          <Segment key={segment.key} idx={segment.idx} />
        ))
      )}
    </ul>
  );
};
