import { randomInt } from "@lib/random.lib";
import type { IRunCharsSettings, ISegment } from "@typings/run.types";

const CHARS_PER_SEGMENT = 20;
const LOWER_CASE_LETTERS_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS_CHARS = "1234567890";
const SYMBOLS_CHARS = `!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`;

export const makeChars = (
  seed: number,
  length: number,
  settings: IRunCharsSettings,
): string => {
  let charsToUse = "";

  if (settings.lowerCaseLetters) charsToUse += LOWER_CASE_LETTERS_CHARS;
  if (settings.upperCaseLetters) {
    charsToUse += LOWER_CASE_LETTERS_CHARS.toUpperCase();
  }
  if (settings.numbers) charsToUse += NUMBERS_CHARS;
  if (settings.symbols) charsToUse += SYMBOLS_CHARS;
  if (settings.spaces) charsToUse += "   ";

  let result = "";
  const amtOfChars = charsToUse.length;
  let isLastSpace = false;
  for (let i = 0; i < length; i++) {
    const _seed = seed + seed * (i * 0.2);
    let char = charsToUse.charAt(
      randomInt({ min: 0, max: amtOfChars, seed: _seed }),
    );

    // avoid double space
    if (char === " ") {
      if (isLastSpace) {
        char = charsToUse.charAt(
          randomInt({
            min: 0,
            max: amtOfChars - 3, // -3 coz' spaces are always the last 3 chars
            seed: _seed,
          }),
        );
        isLastSpace = false;
      } else isLastSpace = true;
    }

    result += char;
  }

  return result;
};

interface IMakeSegmentsProps {
  baseIdx: number;
  amount: number;
  charsSettings: IRunCharsSettings;
  seed: number;
}

export const makeSegments = ({
  amount,
  baseIdx,
  charsSettings,
  seed,
}: IMakeSegmentsProps) => {
  const segments: ISegment[] = [];
  for (let i = 0; i < amount; i++) {
    const idx = i + baseIdx;
    segments.push({
      key: Math.random().toString(),
      idx,
      expected: makeChars(
        seed + seed * (idx * 0.5),
        CHARS_PER_SEGMENT,
        charsSettings,
      ),
      value: "",
      isVisible: idx < 5,
      offset: 0,
    });
  }

  return segments;
};

const segmentIdToIdx = (id: string): number => {
  return Number(id.replace("segment-", ""));
};

export const getMissingSegments = ({
  segments,
  textMeasurer,
  overflowRect,
}: {
  segments: ISegment[];
  textMeasurer: HTMLDivElement;
  overflowRect: DOMRect;
}) => {
  const visibleSegments = segments.filter((seg) => seg.isVisible);

  textMeasurer.innerText = visibleSegments.reduce(
    (prev, cur) => prev + cur.expected,
    "",
  );

  const changesMap = new Map<number, boolean>();
  let idx = visibleSegments.length;
  while (
    overflowRect.width / 2 > textMeasurer.getBoundingClientRect().width &&
    idx < segments.length
  ) {
    const seg = segments[idx];
    if (seg) {
      textMeasurer.innerText += seg.expected;
      changesMap.set(seg.idx, true);
      idx++;
    }
  }
  return changesMap;
};

export const getSegmentElementDetails = ({
  segmentEl,
  overflowRect,
  offset,
}: {
  segmentEl: HTMLElement;
  offset: number;
  overflowRect: DOMRect;
}) => {
  const rect = segmentEl.getBoundingClientRect();

  // using offsetLeft instead of rect.x 'cause there is a transition and we need the final x and not the current
  const relativeX = segmentEl.offsetLeft + overflowRect.width / 2 - offset;

  return {
    relativeX,
    width: rect.width,
    side: relativeX + rect.width > overflowRect.width / 2 ? "right" : "left",
    isFullyShown:
      relativeX >= 0 && relativeX + rect.width <= overflowRect.width,
    isFullyHidden:
      relativeX >= overflowRect.width || relativeX + rect.width <= 0,
  };
};

interface IVsibilityChangesProps {
  overflowRect: DOMRect;
  container: HTMLElement;
  segments: ISegment[];
  offset: number;
}

export const getSegmentsVisibilityChanges = ({
  container,
  segments,
  overflowRect,
  offset,
}: IVsibilityChangesProps) => {
  let currentEl: Element | null = container.firstElementChild;
  const changesMap = new Map<number, boolean>();
  let offsetAdjustment = 0;

  while (currentEl instanceof HTMLElement) {
    const info = getSegmentElementDetails({
      segmentEl: currentEl,
      overflowRect,
      offset: offset,
    });

    const isPartiallyShown = !info.isFullyHidden && !info.isFullyShown;
    const segment: ISegment = segments[segmentIdToIdx(currentEl.id)];
    if (!segment) break;

    if (info.side === "left") {
      if (
        info.isFullyHidden &&
        currentEl.nextElementSibling instanceof HTMLElement
      ) {
        const nextSegmentInfo = getSegmentElementDetails({
          segmentEl: currentEl.nextElementSibling,
          overflowRect,
          offset,
        });
        if (nextSegmentInfo.isFullyHidden) {
          offsetAdjustment -= segment.offset;
          changesMap.set(segment.idx, false);
        }
      } else if (
        isPartiallyShown ||
        (info.isFullyShown && currentEl === container.firstElementChild)
      ) {
        const idx = segment.idx - 1;
        if (idx >= 0 && !segments[idx]?.isVisible) {
          offsetAdjustment += segment.offset;
          changesMap.set(idx, true);
        }
      }
    } else {
      if (
        (isPartiallyShown || info.isFullyShown) &&
        currentEl === container.lastElementChild
      ) {
        changesMap.set(segment.idx + 1, true);
      } else if (
        info.isFullyHidden &&
        currentEl.previousElementSibling instanceof HTMLElement
      ) {
        const prevSegmentInfo = getSegmentElementDetails({
          segmentEl: currentEl.previousElementSibling,
          overflowRect,
          offset,
        });

        if (prevSegmentInfo.isFullyHidden) {
          changesMap.set(segment.idx, false);
        }
      }
    }

    if (currentEl.nextElementSibling instanceof HTMLElement) {
      currentEl = currentEl.nextElementSibling;
    } else currentEl = null;
  }
  return { changesMap, offsetAdjustment };
};
