import { useAppStore } from "@stores/root.store";
import { CaretKind } from "@typings/caret.types";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { CaretBlockIcon, CaretLineIcon, CaretUnderlineIcon } from "./Icons";

export const CaretPicker = () => {
  return (
    <ul className="flex space-x-3 items-center px-8 py-3">
      <CaretOption kind={CaretKind.BLOCK} />
      <CaretOption kind={CaretKind.UNDERLINE} />
      <CaretOption kind={CaretKind.LINE} />
    </ul>
  );
};

interface ICaretOptionProps {
  kind: CaretKind;
}

const CaretOption = ({ kind }: ICaretOptionProps) => {
  const { selectedCaret, setSelectedCaret } = useAppStore(
    useShallow((s) => ({
      selectedCaret: s.settings.selectedCaret,
      setSelectedCaret: s.settings.setSelectedCaret,
    })),
  );

  const Icon = useMemo(() => {
    switch (kind) {
      case CaretKind.LINE:
        return CaretLineIcon;
      case CaretKind.UNDERLINE:
        return CaretUnderlineIcon;
      default:
        return CaretBlockIcon;
    }
  }, []);

  return (
    <li>
      <button
        type="button"
        onClick={() => setSelectedCaret(kind)}
        className="cursor-pointer"
      >
        <Icon height={26} width="auto" isActive={kind === selectedCaret} />
      </button>
    </li>
  );
};
