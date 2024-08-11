import clsx from "clsx";
import type { DetailedHTMLProps } from "react";

type ISpaceIconProps = DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const SpaceIcon = (props: ISpaceIconProps) => (
  <div {...props} className={clsx(props.className, "space-icon")} />
);
