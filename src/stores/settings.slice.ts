import { CaretKind } from "@typings/caret.types";
import { type IRunCharsSettings, RunType } from "@typings/run.types";
import type { IRootStore, TStoreSlice } from "./root.store";

interface ISettingsSliceState {
  selectedCaret: CaretKind;

  runType: RunType;
  runLength: number;

  charsSettings: IRunCharsSettings;

  openModals: Set<string>;
}

interface ISettingsSliceActions {
  setSelectedCaret: (kind: CaretKind) => void;

  setRunType: (type: RunType) => void;
  setRunLength: (length: number) => void;

  updateCharsSettings: (
    callback: (set: IRunCharsSettings) => Partial<IRunCharsSettings>,
  ) => void;
  setModalOpen: (id: string, value: boolean) => void;
}

export type ISettingsSlice = {
  settings: ISettingsSliceState & ISettingsSliceActions;
};

const settingsInitState: ISettingsSliceState = {
  selectedCaret: CaretKind.BLOCK,
  runType: RunType.INFINITE_CHARS,
  runLength: 10,
  openModals: new Set(),
  charsSettings: {
    lowerCaseLetters: true,
    upperCaseLetters: false,
    numbers: false,
    symbols: false,
    spaces: false,
  },
};

export const createSettingsSlice: TStoreSlice<ISettingsSlice> = (set, get) => ({
  settings: {
    ...settingsInitState,

    setSelectedCaret: (kind) => {
      set((s) => {
        s.settings.selectedCaret = kind;
      });
    },

    setRunType: (type) => {
      set((s) => {
        s.settings.runType = type;
      });
    },

    setRunLength: (length) => {
      set((s) => {
        s.settings.runLength = length;
      });
    },

    updateCharsSettings: (callback) => {
      set((s) => {
        s.settings.charsSettings = {
          ...s.settings.charsSettings,
          ...callback(get().settings.charsSettings),
        };
      });
    },

    setModalOpen: (id, value) => {
      set((s) => {
        if (value) {
          s.settings.openModals.add(id);
        } else {
          s.settings.openModals.delete(id);
        }
      });
    },
  },
});

export const selectIsModalOpen = (id: string) => {
  return (store: IRootStore) => store.settings.openModals.has(id);
};

export const selectIsAnyModalOpen = (store: IRootStore) => {
  return store.settings.openModals.size > 0;
};
