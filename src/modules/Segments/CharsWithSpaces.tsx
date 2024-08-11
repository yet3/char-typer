import { SpaceIcon } from "@common/Icons/SpceIcon";
import { type ReactNode, useMemo } from "react";

interface IProps {
  chars: string;
}

export const CharsWithSpaces = ({ chars }: IProps) => {
  const parsed = useMemo(() => {
    const els: ReactNode[] = [];
    let accStr = "";
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (char === " ") {
        els.push(accStr);
        els.push(
          <SpaceIcon
            key={`space-${i}`}
            style={{
              marginRight: "var(--typer-letter-spacing)",
            }}
          />,
        );
        accStr = "";
      } else accStr += char;
    }
    if (accStr.length > 0) els.push(accStr);

    return els;
  }, [chars]);

  return parsed;
};
