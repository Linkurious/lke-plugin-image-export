import { SwatchRectRenderProps } from "@uiw/react-color-swatch";
import { NoBackground } from "./NoBackground";
import { TRANSPARENT } from "../constants";

export const colorIcon = ({
  onClick,
  color,
  key,
  checked,
}: SwatchRectRenderProps) => {
  const className = checked
    ? "color-picker--item checked"
    : "color-picker--item";
  const icon = color === TRANSPARENT ? <NoBackground /> : null;
  return (
    <div
      key={key}
      onClick={onClick}
      className={className}
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
  );
};
