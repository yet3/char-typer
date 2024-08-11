import { forwardRef } from "react";
import { createPortal } from "react-dom";

export const TextMeasurer = forwardRef<HTMLDivElement>((_, ref) => {
  return createPortal(
    <div
      ref={ref}
      className="typer-text pointer-events-none opacity-0 fixed inset-0 -z-50 w-min whitespace-pre"
    />,
    document.body,
  );
});
