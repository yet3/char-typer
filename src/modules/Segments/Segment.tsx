import { useAppStore } from "@stores/root.store";
import { type ReactNode, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { CharsWithSpaces } from "./CharsWithSpaces";
import { ErrorChar } from "./ErrorChar";

interface IProps {
  idx: number;
}

export const Segment = ({ idx }: IProps) => {
  const seg = useAppStore(
    useShallow((s) => ({
      expected: s.run.segments[idx].expected,
      value: s.run.segments[idx].value,
    })),
  );

  const parsedChars = useMemo(() => {
    const comps: ReactNode[] = [];

    const addUntyped = (key: number | string, chars: string) => {
      if (chars.length > 0) {
        comps.push(
          <span key={`untyped-${key}`} className="text-typer-untyped">
            <CharsWithSpaces chars={chars} />
          </span>,
        );
      }
    };

    const addTyped = (key: number | string, chars: string) => {
      if (chars.length > 0) {
        comps.push(
          <span key={`typed-${key}`} className="text-typer-typed">
            <CharsWithSpaces chars={chars} />
          </span>,
        );
      }
    };

    let typedAccStr = "";
    for (let i = 0; i < seg.value.length; i++) {
      const char = seg.value[i];
      const expectedChar = seg.expected[i];

      if (char !== expectedChar) {
        addTyped(i, typedAccStr);
        typedAccStr = "";

        comps.push(
          <ErrorChar
            key={`error-${i}`}
            char={char}
            expectedChar={expectedChar}
          />,
        );
      } else {
        typedAccStr += expectedChar;
      }
    }
    addTyped("rest", typedAccStr);

    if (seg.value.length < seg.expected.length) {
      addUntyped(
        "rest",
        seg.expected.substring(seg.value.length, seg.expected.length),
      );
    }

    return comps;
  }, [seg.value, seg.expected]);

  return (
    <li id={`segment-${idx}`} className="segment typer-text flex">
      {parsedChars}
    </li>
  );
};
