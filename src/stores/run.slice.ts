import { makeSegments } from "@modules/Segments/lib";
import {
  type IRunOptions,
  type IRunStats,
  type ISegment,
  RunStatus,
} from "@typings/run.types";
import type { IRootStore, TStoreSlice } from "./root.store";

interface IRunSliceState {
  seed: number;
  status: RunStatus;

  startedAt: null | number;
  finishedAt: null | number;

  currentSegmentIdx: number;
  segments: ISegment[];

  stats: IRunStats;

  currentCharWidth: number | null;
}

interface IRunSliceActions {
  resetState: () => void;

  createNew: (opts?: IRunOptions) => void;
  extend: () => void;
  start: () => void;
  restart: () => void;
  end: () => void;

  updateStats: (callback: (stats: IRunStats) => Partial<IRunStats>) => void;

  setCurrentCharWidth: (width: number) => void;
  updateCurrentSegmentIdx: (callback: (idx: number) => number) => void;
  updateSegmentOffset: (
    idx: number,
    callback: (offset: number) => number,
  ) => void;

  setOneSegmentVisibility: (idx: number, value: boolean) => void;
  setManySegmentsVisibility: (changeMap: Map<number, boolean>) => void;

  setSegmentValue: (idx: number, value: string) => void;
}

export type IRunSlice = { run: IRunSliceState & IRunSliceActions };

const runInitState: IRunSliceState = {
  seed: new Date().getTime(),
  status: RunStatus.IDLE,

  startedAt: null,
  finishedAt: null,
  currentCharWidth: null,

  currentSegmentIdx: 0,
  segments: [],

  stats: {
    cpsList: [],
    typedCharsCount: 0,
    errorsCount: 0,
  },
};

export const createRunSlice: TStoreSlice<IRunSlice> = (set, get) => ({
  run: {
    ...runInitState,
    resetState: () => {
      set((s) => {
        s.run = { ...s.run, ...runInitState };
      });
    },

    createNew: (opts) => {
      set((s) => {
        const seed = new Date().getTime();
        s.liveStats.setCps(0);

        const charsSettings = {
          ...s.settings.charsSettings,
          ...opts?.charsSettings,
        };

        Object.assign(s.settings.charsSettings, charsSettings);

        Object.assign(s.run, {
          ...runInitState,
          seed,
          segments: makeSegments({
            amount: 10,
            charsSettings,
            baseIdx: 0,
            seed,
          }),
        });
      });
    },

    extend: () => {
      set((s) => {
        s.run.segments.push(
          ...makeSegments({
            amount: 10,
            charsSettings: s.settings.charsSettings,
            baseIdx: s.run.segments.length,
            seed: s.run.seed,
          }),
        );
      });
    },

    start: () => {
      set((s) => {
        s.liveStats.resetState();
        s.run.status = RunStatus.IN_PROGRESS;
        s.run.startedAt = new Date().getTime();
        s.run.finishedAt = null;
      });
    },
    restart: () => {
      set((s) => {
        s.liveStats.resetState();
        s.run.status = RunStatus.IDLE;
        s.run.startedAt = null;
        s.run.finishedAt = null;
      });
    },
    end: () => {
      set((s) => {
        s.run.status = RunStatus.OVER;
        s.run.finishedAt = new Date().getTime();
      });
    },

    updateStats: (callback) => {
      set((s) => {
        s.run.stats = {
          ...s.run.stats,
          ...callback(get().run.stats),
        };
      });
    },

    setCurrentCharWidth: (width) => {
      set((s) => {
        s.run.currentCharWidth = width;
      });
    },

    updateCurrentSegmentIdx: (callback) => {
      set((s) => {
        s.run.currentSegmentIdx = Math.max(
          0,
          Math.min(
            callback(s.run.currentSegmentIdx),
            s.run.segments.length - 1,
          ),
        );
      });
    },

    updateSegmentOffset: (idx, callback) => {
      set((s) => {
        const segment = s.run.segments[idx];
        if (!segment) {
          console.error(
            `updateSegmentOffsetX: there is not segment with idx of: ${idx}`,
          );
          return;
        }
        segment.offset = callback(segment.offset);
      });
    },

    setOneSegmentVisibility: (idx, value) => {
      set((s) => {
        const segment = s.run.segments[idx];
        if (!segment) {
          console.error(
            `setOneSegmentVisibility: there is not segment with idx of: ${idx}`,
          );
          return;
        }
        segment.isVisible = value;
      });
    },

    setManySegmentsVisibility: (changeMap) => {
      set((s) => {
        const segments = s.run.segments;
        for (const [idx, value] of changeMap.entries())
          if (segments[idx]) {
            segments[idx].isVisible = value;
          }
      });
    },

    setSegmentValue: (idx, value) => {
      set((s) => {
        const segment = s.run.segments[idx];
        if (!segment) {
          console.error(
            `setSegmentValue: there is not segment with idx of: ${idx}`,
          );
          return;
        }
        segment.value = value;
      });
    },
  },
});

export const selectCurrentSegment = (
  store: IRootStore,
): ISegment | undefined => {
  return store.run.segments[store.run.currentSegmentIdx];
};

export const selectCurrentExpectedChar = (store: IRootStore): string => {
  if (store.run.segments.length === 0) return " ";

  const seg = store.run.segments[store.run.currentSegmentIdx];
  if (!seg) return " ";

  return seg.expected[seg.value.length] ?? " ";
};

export const selectSumOfTypedChars = (store: IRootStore): number => {
  return store.run.segments.reduce((acc, cur) => acc + cur.value.length, 0);
};

export const selectSumOfVisibleOffsets = (store: IRootStore): number => {
  return store.run.segments
    .filter((seg) => seg.isVisible)
    .reduce((acc, cur) => acc + cur.offset, 0);
};
