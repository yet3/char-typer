import type { ICaretPickerOptIconProps } from "@typings/caret.types";
import clsx from "clsx";

export const CaretUnderlineIcon = ({
  isActive,
  ...props
}: ICaretPickerOptIconProps) => (
  <svg
    width={43}
    height={51}
    viewBox="0 0 43 51"
    xmlns="http://www.w3.org/2000/svg"
    className={clsx({
      "fill-content-accent": isActive,
      "fill-content-primary hover:fill-content-accent": !isActive,
    })}
    {...props}
  >
    <title>Underline caret</title>
    <path d="M10.9115 44H5L18.2829 7H24.7171L38 44H32.0885L21.6532 13.7207H21.3648L10.9115 44ZM15.9136 29.5107H27.095L28.7138 34.208H14.292L15.9136 29.5107Z" />
    <path d="M0 46H43V49H0V46Z" />
  </svg>
);
