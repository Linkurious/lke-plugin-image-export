import { SwatchRectRenderProps } from "@uiw/react-color-swatch";

export const colorIcon = ({
  onClick,
  color,
  key,
  checked,
}: SwatchRectRenderProps) => {
  const className = checked
    ? "color-picker--item checked"
    : "color-picker--item";
  console.log({ color });
  return (
    <div
      key={key}
      onClick={onClick}
      className={className}
      style={{ backgroundColor: color }}
    />
  );
};
