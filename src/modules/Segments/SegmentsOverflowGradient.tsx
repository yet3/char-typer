import clsx from "clsx";

interface IProps {
  side: "left" | "right";
}

export const SegmentsOverflowGradient = ({ side }: IProps) => (
  <div
    className={clsx({
      "absolute top-0 w-12 h-full from-page to-transparent z-10": true,
      "left-0 bg-gradient-to-r": side === "left",
      "right-0 bg-gradient-to-l": side === "right",
    })}
  />
);
