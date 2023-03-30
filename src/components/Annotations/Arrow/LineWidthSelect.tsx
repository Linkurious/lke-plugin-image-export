import { FC } from "react";

interface Item {
  value: number;
  title: string;
}

interface LineWidthSelectProps {
  options: Item[];
  selected?: number;
  onChange: (value: Item) => void;
}

export const LineWidthSelect: FC<LineWidthSelectProps> = ({
  options,
  selected = 0,
  onChange,
}) => {
  // select list with each line representing a line width with a preview
  // of the line width, using ul and li
  return (
    <div className="line-width-select">
      <ul>
        {options.map((option, i) => {
          const className = `line-width-select--item${
            option.value === selected ? " line-width-select--item-selected" : ""
          }`;
          return (
            <li key={i} onClick={() => onChange(option)}>
              <div
                className={className}
                style={{ borderWidth: `${option.value / 2}px` }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
