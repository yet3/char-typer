import type { ICaretPickerOptIconProps } from "@typings/caret.types";
import clsx from "clsx";

export const CaretBlockIcon = ({
  isActive,
  ...props
}: ICaretPickerOptIconProps) => (
  <svg
    width={43}
    height={51}
    viewBox="0 0 43 51"
    xmlns="http://www.w3.org/2000/svg"
    className="group"
    {...props}
  >
    <title>Block caret</title>
    <path
      d="M4 2C4 0.89543 4.89543 0 6 0H37C38.1046 0 39 0.895431 39 2V49C39 50.1046 38.1046 51 37 51H6C4.89543 51 4 50.1046 4 49V2Z"
      className={clsx({
        "fill-content-accent": isActive,
        "fill-content-primary group-hover:fill-content-accent": !isActive,
      })}
    />
    <path
      d="M10.7795 44.0909H4.83913L18.1868 7H24.6523L38 44.0909H32.0597L21.5735 13.7372H21.2837L10.7795 44.0909ZM15.806 29.566H27.0418L28.6686 34.2749H14.1764L15.806 29.566Z"
      className="fill-page"
    />
  </svg>
);
