import type { ICaretPickerOptIconProps } from "@typings/caret.types";
import clsx from "clsx";

export const CaretLineIcon = ({
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
    <title>Line caret</title>
    <path d="M8.91152 44H3L16.2829 7H22.7171L36 44H30.0885L19.6532 13.7207H19.3648L8.91152 44ZM13.9136 29.5107H25.095L26.7138 34.208H12.292L13.9136 29.5107Z" />
    <path d="M39 1H41V50H39V1Z" />
  </svg>
);
