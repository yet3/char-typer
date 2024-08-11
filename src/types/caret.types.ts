import type { SVGProps } from "react";

export enum CaretKind {
  LINE = "LINE",
  UNDERLINE = "UNDERLINE",
  BLOCK = "BLOCK",
}

export interface ICaretPickerOptIconProps extends SVGProps<SVGSVGElement> {
  isActive: boolean;
}
