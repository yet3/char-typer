import { selectCanType, useAppStore } from "@stores/root.store";
import { selectCurrentSegment } from "@stores/run.slice";
import { selectIsAnyModalOpen } from "@stores/settings.slice";
import { useShallow } from "zustand/shallow";

export const useKeyboardHandlerFacade = () => {
  const state = useAppStore(
    useShallow((s) => ({
      startedAt: s.run.startedAt,
      createNewRun: s.run.createNew,
      startRun: s.run.start,
      endRun: s.run.end,
      runStatus: s.run.status,
      currentSegment: selectCurrentSegment(s),
      currentSegmentIdx: s.run.currentSegmentIdx,
      updateCurrentSegmentIdx: s.run.updateCurrentSegmentIdx,
      setSegmentValue: s.run.setSegmentValue,
      updateRunStats: s.run.updateStats,
      setLiveCps: s.liveStats.setCps,
      toggleDebugInfo: s.debug.toggleOpen,
      canType: selectCanType(s),
      isAnyModalOpen: selectIsAnyModalOpen(s),
    })),
  );

  const updateCps = (cps: number) => {
    state.updateRunStats((s) => ({
      cpsList: [...s.cpsList, cps],
    }));
    state.setLiveCps(cps);
  };

  return { ...state, updateCps };
};
